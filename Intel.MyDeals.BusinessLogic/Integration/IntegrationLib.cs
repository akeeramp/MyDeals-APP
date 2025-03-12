extern alias opaqueTools;
using System;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Intel.MyDeals.BusinessRules;
using System.Data;
using Force.DeepCloner;

namespace Intel.MyDeals.BusinessLogic
{
    public class IntegrationLib : IIntegrationLib
    {
        private readonly IJmsDataLib _jmsDataLib; // change out later to IntegrationDataLib
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly IDropdownDataLib _dropdownDataLib;
        private readonly IPrimeCustomersDataLib _primeCustomerLib;
        private readonly IConstantsLookupsLib _constantsLookupsLib;
        private readonly IDataFixDataLib _dataFixDataLib;        
        private List<int> UserTokenErrorCodes = new List<int> { 704, 705 }; // Known abort messages for User Token Security

        public IntegrationLib(IJmsDataLib jmsDataLib, IOpDataCollectorLib dataCollectorLib, IPrimeCustomersDataLib primeCustomerLib,
            IConstantsLookupsLib constantsLookupsLib, IDataFixDataLib dataFixDataLib)
        {
            _jmsDataLib = jmsDataLib;
            _dataCollectorLib = dataCollectorLib;
            _primeCustomerLib = primeCustomerLib;
            _constantsLookupsLib = constantsLookupsLib;
            _dataFixDataLib = dataFixDataLib;            
        }

        public void TestAsyncProcess(Guid myGuid)
        {
            var task = new Task(() =>
            {
                Task.Delay(1000);
                string dummyVal = ExecuteSalesForceTenderData(myGuid);
                _jmsDataLib.CheckProcessedIQRDeals(myGuid, false);
                CheckPendingBatches();
            });
            task.Start();
        }

        public string CheckPendingBatches()
        {
            string executionResponse = string.Empty;
            Guid workId = Guid.Empty;
            List<TenderTransferObject> tenderStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS", workId);
            if (tenderStagedWorkRecords.Count > 0)
            {
                foreach (TenderTransferObject workRecord in tenderStagedWorkRecords.OrderBy(a => a.RqstSid))
                {
                    var result = _jmsDataLib.CheckProcessedIQRDeals(workRecord.BtchId, true);
                    if (result)
                    {
                        string dummyVal = ExecuteSalesForceTenderData(workRecord.BtchId);
                        _jmsDataLib.CheckProcessedIQRDeals(workRecord.BtchId, false);
                        executionResponse += dummyVal;
                    }
                }
            }
            return executionResponse;
        }

        public Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket)
        {
            Guid myGuid = Guid.Empty;
            List<int> deadIdList = new List<int>() { -100 };
            AdminConstant QLLimit = _constantsLookupsLib.GetConstantsByName("IQR_Maximum_Process_Objects_Limit", false);
            int qLLimtval = int.TryParse(QLLimit.CNST_VAL_TXT, out qLLimtval) ? qLLimtval : 0;
            if (qLLimtval <= 0)
            {
                qLLimtval = 1;
            }
            var payloadQLCount = jsonDataPacket.recordDetails.quote.quoteLine.Count;
            Guid firstInListGuid = Guid.Empty;

            if (payloadQLCount <= qLLimtval)
            {
                string jsonSinglePayload = JsonConvert.SerializeObject(jsonDataPacket, Formatting.Indented);
                myGuid = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS", deadIdList, jsonSinglePayload);
                firstInListGuid = myGuid;
            }
            else
            {
                // Copy passed object into a save packet, clear out Quotelines and replace with a quoteline Limit mentioned in the Constants from loop (item)
                var singleItemSavePacket = jsonDataPacket.DeepClone();
                List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine> newQL = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine>();
                foreach (var item in jsonDataPacket.recordDetails.quote.quoteLine)
                {
                    newQL.Add(item);
                    if (newQL.Count == qLLimtval)
                    {
                        singleItemSavePacket.recordDetails.quote.quoteLine = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine>(newQL);
                        string jsonData = JsonConvert.SerializeObject(singleItemSavePacket, Formatting.Indented);
                        // Insert into the stage table here - one deal item (-100 id as new item), one deal data object
                        myGuid = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS", deadIdList, jsonData);
                        newQL.Clear();
                        if (firstInListGuid == Guid.Empty) firstInListGuid = myGuid; // Keep the bottom most entry to trigger processing start
                    }
                }
                //Save left over Qutolines in last save 
                if (newQL.Count > 0)
                {
                    singleItemSavePacket.recordDetails.quote.quoteLine = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine>(newQL);
                    string jsonData = JsonConvert.SerializeObject(singleItemSavePacket, Formatting.Indented);
                    myGuid = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS", deadIdList, jsonData);
                    newQL.Clear();
                }
            }

            var result = _jmsDataLib.CheckProcessedIQRDeals(firstInListGuid, true);
            if (result)
            {
                TestAsyncProcess(firstInListGuid);
            }

            return firstInListGuid;
        }


        #region IQR CREATE TENDERS DEAL
        private void PullUnusedAttributes(MyDealsData myDealsData)
        {
            List<string> removeElemets = new List<string> { AttributeCodes.ACTIVE, AttributeCodes.DC_ID, AttributeCodes.DC_PARENT_ID };
            foreach (var key in myDealsData.Keys)
            {
                foreach (OpDataCollector dc in myDealsData[key].AllDataCollectors)
                {
                    foreach (OpDataElement de in dc.DataElements)
                    {
                        if (removeElemets.Contains(de.AtrbCd))
                        {
                            de.OrigAtrbValue = de.AtrbValue;
                            de.PrevAtrbValue = de.AtrbValue;
                            de.State = OpDataElementState.Unchanged;
                        }
                    }
                }
            }
        }

        private int ProcessSalesForceContractInformation(int contractId, string contractSfId, int custId, TenderTransferRootObject workRecordDataFields, int currQuote)
        {
            int initId = -101;

            if (contractId <= 0)
            {
                return initId;
            }

            // Assume now that the contract folio exists, at least 1 element of it as supplied by PR_MYDL_CHECK_SF_ID
            List<int> passedFolioIds = new List<int>() { contractId };
            MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT }).FillInHolesFromAtrbTemplate(OpDataElementType.CNTRCT, OpDataElementSetType.ALL_TYPES); // Make the save object .FillInHolesFromAtrbTemplate()

            // Pull needed data out of JSON
            DateTime contractStartDt = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.ShipmentStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime contractEndDt = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.ShipmentEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            string quoteLineId = workRecordDataFields.recordDetails.quote.Name;
            string contractTitle = "SF: " + workRecordDataFields.recordDetails.quote.FolioName;

            // Update attributes that need to be updated
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.dc_type), OpDataElementType.CNTRCT.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.DC_ID), contractId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.DC_PARENT_ID), "0");
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), OpDataElementSetType.ALL_TYPES.ToString()); // 3002
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.SALESFORCE_ID), contractSfId);
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.QUOTE_LN_ID), quoteLineId);
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.CUST_MBR_SID), custId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.START_DT), contractStartDt.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.END_DT), contractEndDt.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.TENDER_PUBLISHED), "1");
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.IS_TENDER), "1");
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.TITLE), contractTitle);
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[contractId].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());

            // Object Validation Checks - this is a contract level, and can skip OnFinalize
            SavePacket savePacket = new SavePacket()
            {
                MyContractToken = new ContractToken("IRQ ContractToken Created - SaveFullContract")
                {
                    CustId = custId,
                    ContractId = contractId,
                    DeleteAllPTR = false
                }
            };

            bool hasValidationErrors = myDealsData.ValidationApplyRules(savePacket);

            if (myDealsData.ValidationApplyRules(savePacket))
            {
                string validErrors = "";
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.CNTRCT].AllDataCollectors)
                {
                    foreach (OpMsg opMsg in dc.Message.Messages)
                    {
                        validErrors += validErrors.Length == 0 ? opMsg.Message : "; " + opMsg.Message;
                    }
                }

                workRecordDataFields.recordDetails.quote.quoteLine[currQuote].errorMessages.Add(AppendError(713, "Folio Validation Error : Folio had validation errors: " + validErrors, "Folio had validation errors"));
                return initId; //Pre-emptive fail due to validation errors
            }

            // Start the save process - No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used from UI client.
            ContractToken saveContractToken = new ContractToken("IRQ ContractToken Created - Save Folio Header")
            {
                CustId = custId,
                ContractId = contractId
            };

            PullUnusedAttributes(myDealsData);
            TagSaveActionsAndBatches(myDealsData); // Add needed save actions and batch IDs for the save
            MyDealsData saveResponse = myDealsData.Save(saveContractToken);

            if (myDealsData[OpDataElementType.CNTRCT].Actions.Any() && !saveResponse.Keys.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currQuote].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessSalesForceContractInformation"));
            }

            foreach (var objKey in saveResponse.Keys)
            {
                var actnx = saveResponse[objKey].Actions.FirstOrDefault(x => x.Action == "ID_CHANGE");
                if (actnx != null)
                {
                    if (objKey == OpDataElementType.CNTRCT)
                    {
                        contractId = Int32.Parse(actnx.AltID.ToString());
                    }
                }
            }

            return contractId > 0 ? contractId : initId; // Return a positive contract ID or initId (-101) for failure
        }

        // Used to pull out customer level default values for certain fields
        private MyCustomersInformation LookupCustomerInformation(int custId)
        {
            MyCustomersInformation singleCustomer = new CustomerLib().GetMyCustomerNames().FirstOrDefault(c => c.CUST_SID == custId);
            return singleCustomer;
        }

        private ProdMappings TranslateIQRProducts(ProductEpmObject epmProduct, int epmId, int custId, string geoCombined, DateTime strtDt, DateTime endDt, string productType,
            ref List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrorResponse)
        {
            ProdMappings returnedProducts = new ProdMappings();
            PRD_LOOKUP_RESULTS prd = new PRD_LOOKUP_RESULTS();
            prd.PRD_MBR_SID = epmProduct.PdctNbrSid;
            List<PRD_LOOKUP_RESULTS> temp_products = new List<PRD_LOOKUP_RESULTS>();
            temp_products.Add(prd);

            ProductsLib pl = new ProductsLib();

            var result = pl.GetProductAttributes(temp_products);
            if (result != null && result.Count == 1)
            {
                var opt = pl.GetCAPForProduct(epmProduct.PdctNbrSid, custId, geoCombined, strtDt, endDt);

                //Additional 'OR' check added to allow deals to get created even if there is Missing CAP for the PMem,SSD,Ethernet product types 
                //In my deals (Tenders)deals are allowed to move upto submitted stage even selected product has missing CAP data .
                if ((opt.Count == 1) || (productType.ToLower() != "server" && opt.Count == 0))
                {
                    if (opt.Count == 1)
                    {
                        if (opt[0].CAP == "No CAP")
                        {
                            //Decide if we toss this back as error or allow create
                        }

                    }

                    result[0].USR_INPUT = result[0].HIER_NM_HASH;
                    result[0].DERIVED_USR_INPUT = result[0].HIER_NM_HASH;
                    result[0].CAP = opt.Count == 1 ? opt[0].CAP : "No CAP";
                    result[0].CAP_START = opt.Count == 1 ? opt[0].CAP_START : result[0].CAP_START;
                    result[0].CAP_END = opt.Count == 1 ? opt[0].CAP_END : result[0].CAP_END;
                    result[0].YCS2 = opt.Count == 1 ? opt[0].YCS2 : "No YCS2";
                    result[0].YCS2_START = opt.Count == 1 ? opt[0].YCS2_START : result[0].YCS2_START;
                    result[0].YCS2_END = opt.Count == 1 ? opt[0].YCS2_END : result[0].YCS2_END;

                    foreach (var newItem in result.Select(row => new ProdMapping()
                    {
                        CAP = row.CAP,
                        CAP_END = row.CAP_END.ToString("MM/dd/yyyy"),
                        CAP_START = row.CAP_START.ToString("MM/dd/yyyy"),
                        DEAL_PRD_TYPE = row.DEAL_PRD_TYPE,
                        DERIVED_USR_INPUT = row.DERIVED_USR_INPUT,
                        HAS_L1 = row.HAS_L1,
                        HAS_L2 = row.HAS_L2,
                        HIER_NM_HASH = row.HIER_NM_HASH,
                        HIER_VAL_NM = row.HIER_VAL_NM,
                        MM_MEDIA_CD = row.DEAL_PRD_TYPE == "CPU" ? "Tray" : row.MM_MEDIA_CD == null ? "All" : row.MM_MEDIA_CD,
                        PRD_CAT_NM = row.PRD_CAT_NM,
                        PRD_END_DTM = row.PRD_END_DTM.ToString("MM/dd/yyyy"),
                        PRD_MBR_SID = row.PRD_MBR_SID.ToString(),
                        PRD_STRT_DTM = row.PRD_STRT_DTM.ToString("MM/dd/yyyy"),
                        YCS2 = row.YCS2,
                        YCS2_END = row.YCS2_END.ToString("MM/dd/yyyy"),
                        YCS2_START = row.YCS2_START.ToString("MM/dd/yyyy"),
                        EXCLUDE = false,
                        BRND_NM = row.BRND_NM,
                        FMLY_NM = row.FMLY_NM
                    }))
                    {
                        returnedProducts.Add(result[0].HIER_VAL_NM, new[] { newItem }); //result[0].HIER_NM_HASH
                    }
                }
                else
                {
                    //Error Handling CODE for CAP Missing
                    productErrorResponse.Add(AppendError(703, "Product error: CAP not Available error for EPM Id [" + epmId + "].  Please contact My Deals Support", "CAP not found"));
                }
            }
            else
            {
                //Error Handling CODE Product Not FOUND
                if (result == null || result.Count == 0)
                {
                    productErrorResponse.Add(AppendError(702, "Product error: No products found for EPM Id [" + epmId + "].  Please contact My Deals Support", "No valid products found"));
                }
                else
                {
                    string products_List = String.Join(",", result.Select(c => c.PRD_MBR_SID));
                    productErrorResponse.Add(AppendError(702, "Product error: EPM Id [" + epmId + "] matched multiple product Id's [" + products_List + "].  Please contact My Deals Support", "Multiple product Id's matched"));
                }
            }

            return returnedProducts;
        }

        private void EnterMeetCompData(int strategyId, int dealId, int prdId, string usrInputProd, string myPrdCat, string myDealPrdType, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
        {
            // We only take the first instance of values as per Mahesh ([0] below)
            string competitorProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].competitorProduct.Name;
            string perfMetric = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].performanceMetric[0].performanceMetric; // SpecInt - NOT USED YET
            string meetCompPrcStr = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].MeetCompPrice;
            string iaBenchStr = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].performanceMetric[0].IntelSKUPerformance;
            string compBenchStr = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].performanceMetric[0].CompSKUPerformance;

            decimal myCompBench = Convert.ToDecimal(compBenchStr, CultureInfo.InvariantCulture) + 0.00M;
            decimal myIaBench = Convert.ToDecimal(iaBenchStr, CultureInfo.InvariantCulture) + 0.00M;
            decimal myCompPrice = Convert.ToDecimal(meetCompPrcStr, CultureInfo.InvariantCulture) + 0.00M;

            MeetCompUpdate mcUpdatePrdGrp = new MeetCompUpdate()
            {
                COMP_BNCH = myCompBench,
                COMP_OVRRD_FLG = false,
                COMP_OVRRD_RSN = "",
                COMP_PRC = myCompPrice,
                COMP_SKU = competitorProductName,
                CUST_NM_SID = custId,
                DEAL_OBJ_SID = dealId,
                DEAL_PRD_TYPE = myDealPrdType,
                GRP = "PRD",
                GRP_PRD_NM = usrInputProd,
                GRP_PRD_SID = prdId.ToString(),
                IA_BNCH = myIaBench,
                MEET_COMP_UPD_FLG = 'Y',
                PRD_CAT_NM = myPrdCat
            };
            MeetCompUpdate mcUpdateDealGrp = new MeetCompUpdate()
            {
                COMP_BNCH = myCompBench,
                COMP_OVRRD_FLG = false,
                COMP_OVRRD_RSN = "",
                COMP_PRC = myCompPrice,
                COMP_SKU = competitorProductName,
                CUST_NM_SID = custId,
                DEAL_OBJ_SID = dealId,
                DEAL_PRD_TYPE = myDealPrdType,
                GRP = "DEAL",
                GRP_PRD_NM = usrInputProd,
                GRP_PRD_SID = prdId.ToString(),
                IA_BNCH = myIaBench,
                MEET_COMP_UPD_FLG = 'Y',
                PRD_CAT_NM = myPrdCat
            };

            List<MeetCompUpdate> mcu = new List<MeetCompUpdate>();
            mcu.Add(mcUpdatePrdGrp);
            mcu.Add(mcUpdateDealGrp);

            MeetCompLib _meetCompLib = new MeetCompLib();
            List<MeetCompResult> meetCompResult = new List<MeetCompResult>();
            try
            {
                //mode (MC_MODE) should be passed as "A" while we intially create a deal or when there is need to run PCT. ;
                var meetCompDetails = _meetCompLib.GetMeetCompProductDetails(strategyId, "A", OpDataElementType.PRC_ST.ToId());
                // Added this condition to skip updating meet comp data for exempt products(ex:SSD Products) and products for which Meet comp is not applicable. 
                //FYI, if meetCompDetails length is 0 and try to UpdateMeetCompProductDetails then it throws an exception 
                if (meetCompDetails.Count > 0)
                {
                    meetCompResult = _meetCompLib.UpdateMeetCompProductDetails(strategyId, OpDataElementType.PRC_ST.ToId(), mcu, false);

                    if (meetCompResult == null || meetCompResult.Count == 0) // 0 records returned for product dimension not being set correctly causing mismatch meet comp save result
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "Saving Meet Comp data failed"));
                    }
                }
            }
            catch (Exception e)
            {
                string errMsg = "PR_MYDL_UI_SAVE_MEET_COMP threw an error on save.  Call data: <br>";
                errMsg += strategyId + ", " + OpDataElementType.PRC_ST.ToId() + ", " + JsonConvert.SerializeObject(mcu) + "<br>";
                errMsg += e.Message + "<br>";
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "Meet Comp Error: " + errMsg));
            }

            // Get formal results
            CostTestDataLib _costTestDataLib = new CostTestDataLib();
            List<int> deadIdList = new List<int>() { strategyId };
            List<PctMctResult> pctResults = _costTestDataLib.RunPct(OpDataElementType.PRC_ST.ToId(), deadIdList);
            if (pctResults == null) // 0 records appears to be not run yet
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "PR_MYDL_GET_MEET_COMP returned no data, Assume PCT/MCT failed"));
            }
            else if (pctResults.Count == 0) // 0 records returned for product dimension not being set correctly causing mismatch meet comp save result
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "PCT/MCT Not Run Yet"));
            }
            else
            {
                if (pctResults.Any(m => m.MEETCOMP_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "Meet Comp Test FAILED"));
                }

                if (pctResults.Any(m => m.COST_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "Price Cost Test FAILED"));
                }
            }
        }

        private TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages AppendError(int code, string errorType, string errorDesc)
        {
            var newErrorMessage = new TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages
            {
                Code = code,
                Message = errorType,
                MessageDetails = errorDesc
            };

            return newErrorMessage;
        }

        private string GatherConsumptionContries(string regions, string countries)
        {
            string returnVal = "";
            DropdownLib ddValues = new DropdownLib();
            DropdownHierarchy[] consumptionCountryHierarchy = ddValues.GetConsumptionCountryHierarchy("2");

            // Convert Regions to Countries
            string[] selectedRegions = new string[] { };

            if (regions != null)
            {
                selectedRegions = regions.Split(',')
                    .Select(x => x.Trim())
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .ToArray();
            }

            var regionCountriesArry = consumptionCountryHierarchy
                .Where(a => a.ATRB_LKUP_DESC == "GEO" && selectedRegions.Contains(a.DROP_DOWN))
                .SelectMany(a => a.items).ToList();

            string[] selectedCountries = new string[] { };
            if (countries != null)
            {
                selectedCountries = countries.Split(',')
                    .Select(x => x.Trim())
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .ToArray();
            }

            string[] finalArry = selectedCountries.Union(regionCountriesArry.Select(a => a.DROP_DOWN).ToArray()).ToArray();
            returnVal = string.Join("|", finalArry);

            if (returnVal == string.Empty)
            {
                return null;
            }

            return returnVal;
        }        
        private static int ToInt32(string value)
        {
            return value == null ? 0 : int.Parse(value, (IFormatProvider)CultureInfo.CurrentCulture);
        }

        private int ProcessSalesForceDealInformation(int contractId, string dealSfId, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
        {
            int initPsId = -201 - currentRec;
            int initPtId = -301 - currentRec;
            int initPtrId = -401 - currentRec;
            int initWipId = -1000 - currentRec;

            string isPrimedCustomer = null;
            string isRPLedCustomer = null;
            string RPLStatusCode = null;
            string endCustomerObject = null;
            string primedCustomerL1Id = null;
            string primedCustomerL2Id = null;
            string primedCustName = null;
            string customer = null;
            string gaWwid = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Wwid;
            string endCustomer = workRecordDataFields.recordDetails.quote.EndCustomer;
            string unifiedEndCustomer = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName == null ? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName;
            string endCustomerCountry = workRecordDataFields.recordDetails.quote.EndCustomerCountry;
            bool isUnifiedEndCustomer = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer;
            string projectName = workRecordDataFields.recordDetails.quote.ProjectName.ToUpper();
            string serverDealType = workRecordDataFields.recordDetails.quote.ServerDealType;
            string geoCombined = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Region != "APJ" ? workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Region : "APAC,IJKK";
            string qltrBidGeo = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].EndCustomerRegion != "APJ" ? workRecordDataFields.recordDetails.quote.quoteLine[currentRec].EndCustomerRegion : "APAC,IJKK";
            string dealType = workRecordDataFields.recordDetails.quote.DealType;
            // Embedded Array Items
            DateTime dealStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime dealEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BillingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BillingEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            string consumptionCustomerPlatform = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ConsumptionCustomerPlatform;
            string consumptionCustomerSegment = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ConsumptionCustomerSegment;
            string consumptionRegion = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ConsumptionRegion;
            string consumptionCountry = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ConsumptionCountry;
            string consumptionReportedSalesGeo = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ConsumptionReportedSalesGeo;
            string terms = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].AdditionalTandC;
            string excludeAutomationFlag = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ExcludeAutomation ? "Yes" : "No";
            string quoteLineId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Name;
            string quoteLineNumber = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].QuoteLineNumber;
            string groupType = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].GroupType;
            string marketSegment = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].MarketSegment;
            marketSegment = marketSegment.Replace(";", ", ");
            string customerDivision = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].CustomerDivision == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].CustomerDivision; // SF will have to handle if this is needed or not for any given customer as a drop down
            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedECAPPrice;
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedQuantity;  // CEILING_VOLUME
            string payableQuantity = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].PayableQuantity;
            string userEnteredProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Name;
            string productEpmId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductNameEPMID; // For lookup
            string dealDescription = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealDescription == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealDescription;
            // Safety setting back date reason in case we need it and they don't send it...
            string backdateReason = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason != "" ?
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason :
                "Contract Negotiation Delay";
            string productType = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ProductType == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ProductType;
            string productLevel = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductLevel == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductLevel;
            string productFamilyName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Family == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Family;
            string processorNumber = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProcessorNumber == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProcessorNumber;
            string dealPdctName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.DealProductName == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.DealProductName;
            string dealMtrlIdName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.MaterialID == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.MaterialID;

            //variable to hold the Selected product name
            string productData = "";
            #region Product Check and translation

            if (productType == "" || productLevel == "")
            {
                if (productType == "" && productLevel == "")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: 'Product Type' and 'Product Level' are missing from Product Details Section in IQR JSON package, please correct", "Missing 'Product Type' and 'Product Level'"));
                }
                else if (productType == "")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: 'Product Type' is missing from Product Details Section in IQR JSON package, please correct", "Missing 'Product Type'"));
                }
                else
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: 'Product Level' are missing from Product Details Section in IQR JSON package, please correct", "Missing 'Product Level'"));
                }
                return initWipId; // Bail out - Required product data is not provided to proceed further
            }

            //if IQR deals created other than processor,SSD-family level,[PMem,Ethernet] products at Deal product name level and Server products at Processor level throw error.
            if (!((productType.ToLower() == "ssd" && productLevel.ToLower() == "family")
                || ((productType.ToLower() == "ethernet" || productType.ToLower() == "pmem") && productLevel.ToLower() == "dealproductname")
                || ((productType.ToLower() == "server" || productType.ToLower() == "client") && productLevel.ToLower() == "processor")
                || productLevel.ToLower() == "materialid"))
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Deal cannot be created for Product Type [" + productType + "] and Product Level [" + productLevel + "].  Acceptable Product [Type]/[Level] patterns are: [SSD]/[Family] or [Ethernet|Pmem]/[dealproductname] or [Server|Client]/[processor].", "Deal cannot be created for the selected Product type/level combination"));
                return initWipId; // Bail out - Invalid Product level/ Product Type selected
            }
            else
            {
                if (productType.ToLower() == "ssd" && productLevel.ToLower() == "family")
                {
                    productData = productFamilyName;
                }
                else if ((productType.ToLower() == "ethernet" || productType.ToLower() == "pmem") && productLevel.ToLower() == "dealproductname")
                {
                    productData = dealPdctName;
                }
                else if ((productType.ToLower() == "server" || productType.ToLower() == "client") && productLevel.ToLower() == "processor")
                {
                    productData = processorNumber;
                }
                else if (productEpmId == null && productLevel.ToLower() == "materialid")
                {
                    productData = dealMtrlIdName;
                }
            }
            // Use the MyTranslatedProduct function and expect null if no product is matched
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;

            if (productData == "")
            {
                if (productLevel.ToLower() == "family")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Needed 'Family' is missing from Product Details Section in IQR JSON package, please correct", "Please Provide Family in Required Product details"));
                }
                else if (productLevel.ToLower() == "dealproductname")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Needed 'DealProductName' is missing from Product Details Section in IQR JSON package, please correct", "Please Provide DealProductName in Required Product details"));
                }
                else if (productLevel.ToLower() == "processor")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Needed 'ProcessorNumber' is missing from Product Details Section in IQR JSON package, please correct", "Please Provide ProcessorNumber in Required Product details"));
                }
                else if (productLevel.ToLower() == "materialid")
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Needed 'MaterialID' is missing from Product Details Section in IQR JSON package, please correct", "Please Provide MaterialID in Required Product details"));
                }
                else
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: 'Product Level' doesn't match and of the following [family|dealproductname|processor|materialid], please correct", "Please Provide an approved 'Product Level' value in Product details"));
                }
                return initWipId; // Bail out - Required product data is not provided to proceed further
            }

            ProductEpmObject productLookupObj = _jmsDataLib.FetchProdFromProcessorEpmMap(epmId, productType, productLevel, productData);

            if (productLookupObj?.MydlPdctName == String.Empty || productLookupObj?.PdctNbrSid == 0)
            {
                if (productLevel.ToLower() == "materialid") // MTRL not found path
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: Material ID lookup in My Deals found No valid product matches for Material Id [" + productData + "].  Please contact My Deals Support", "My Deals Product Material ID found no matching products"));
                }
                else // Normal products path
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: EPM ID lookup in My Deals found No valid product matches for EPM Id [" + epmId + "].  Please contact My Deals Support", "My Deals Product EMP ID found no matching products"));
                }
                return initWipId; // Bail out - no products matched
            }

            List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrors = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
            //GET Product JSON by PRD_MBR_SID
            ProdMappings myTranslatedProduct = TranslateIQRProducts(productLookupObj, epmId, custId, geoCombined, dealStartDate, dealEndDate, productType, ref productErrors);
            if (productErrors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.AddRange(productErrors);
                return initWipId;  // Bail out of this deal creation since it is missing critical field and errors have already been appended
            }
            string translatedValidProductJson = JsonConvert.SerializeObject(myTranslatedProduct);
            ProdMapping singleProduct = myTranslatedProduct[productLookupObj.MydlPdctName].FirstOrDefault();

            int myPrdMbrSid = singleProduct != null ? ToInt32(singleProduct.PRD_MBR_SID) : 0;
            string myPrdCat = singleProduct != null ? singleProduct.PRD_CAT_NM : "";
            string myDealPrdType = singleProduct != null ? singleProduct.DEAL_PRD_TYPE : "";
            // Future MM_MEDIA_CD add from IQR here.  First check what they pass and apply it, but if empty, apply the below.  If they pass one, ensure that a chile below contains what they pass.
            string singleMedia = singleProduct != null ? singleProduct.MM_MEDIA_CD.Contains(",") ? "All" : singleProduct.MM_MEDIA_CD : ""; //singleProduct?.MM_MEDIA_CD
            string myDealProduct = productLookupObj.MydlPdctName;//used to set the attribute TITLE(My deals product). In case of Family level selected products(i.e SSD products), In the WIP deal MY deals product field should be saved whatever received in the IQR Json Packet. To do that this variable is used
            //if product is selected at a family level then full product name should be saved ex: if SSD selected at family level- D4800X015T then product name should be saved as DCG DC SSD NA DCG DC SSD D4800X015T. To do that below check is added
            productLookupObj.MydlPdctName = (productLevel.ToLower() == "family") ? (singleProduct.PRD_CAT_NM + " " + (singleProduct.BRND_NM == "NA" ? "" : singleProduct.BRND_NM) + " " + (singleProduct.FMLY_NM == "NA" ? "" : singleProduct.FMLY_NM)).Trim() : productLookupObj.MydlPdctName;

            #endregion Product Check

            #region Deal Stability and Overlapping Check
            // Payable Quantity - Overwrite w/ Ceiling Volume if (PQ > CV) or (PQ == NULL)
            // WIP (TWC5971-411) - CONFIRM IF NEED TO ACTUALLY CHECK FOR 'VALID' ACCOUNT (i.e. enforced)?
            if (int.TryParse(payableQuantity, out _))
            {
                int payableQuantityValue = int.Parse(payableQuantity);

                int ceilingVolumeValue = 0;
                if (int.TryParse(quantity, out _))
                {
                    ceilingVolumeValue = int.Parse(quantity); ;
                }
                if (payableQuantityValue > ceilingVolumeValue)
                {
                    payableQuantity = quantity; // Updated later in this function to quote line object

                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(726, "Deal Warning: Payable Quantity has been reduced to quantity value (Ceiling Volume) as it is not allowed to be a larger value.", "Value replaced"));
                }
            } else if (payableQuantity == null)
            {
                payableQuantity = "0";  // Updated later in this function to quote line object

                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(727, "Deal Warning: Payable Quantity has been reduced to zero as it is not allowed to be null or a negative value.", "Value replaced"));
            }

            // Select IQR End Customer or Primed End Customer as End Customer for My Deals (Moved up prior to deal stability checks end)
            if (endCustomer != null && endCustomer != "") customer = endCustomer;
            else customer = unifiedEndCustomer;

            if (geoCombined == null || geoCombined == "" || ecapPrice == "" || dealStartDate == null || dealEndDate == null || billingStartDate == null || billingEndDate == null ||
                dealType == "" || groupType == "" || marketSegment == "")
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(714, "Deal Error: failed to create the Tender Deal due to missing expected fields {Fields}", "Missing expected fields"));
                return initWipId;
            }

            // Calculate ConsumptionCountryRegion Values from consumptionRegion and consumptionCountry
            string consumptionCountryRegion = GatherConsumptionContries(consumptionRegion, consumptionCountry);
            // Can only have 1, UI controlled rule preventing both from being entered, abort if both are filled out on Create
            if (consumptionCountryRegion != null && consumptionReportedSalesGeo != null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(715, "Deal Error: failed to create the Tender Deal due to Consumption Country/Region and Consumption Reported Sales Geo both being filled out.  You are allowed one or the other, not both.", "Consumption Region and Sales both filled out"));
                return initWipId;
            }

            // Overlaps check, no other tender deal with same Customer/Product/Dates/End Customer/Project can exist, block creeation if they do.
            OverlapChecksDataLib ochkDataLib = new OverlapChecksDataLib();
            List<OverlappingTenders> overlapsCheckDeals = ochkDataLib.CheckForOverlappingTenders(initWipId, dealStartDate, dealEndDate, projectName, customer, endCustomerCountry, custId, myPrdMbrSid, consumptionCustomerPlatform, consumptionCustomerSegment, consumptionReportedSalesGeo, consumptionCountryRegion); // endCustomer = customer

            if (overlapsCheckDeals.Count > 0)
            {
                string overlaps = string.Join(",", overlapsCheckDeals.Select(x => x.DealId));
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(708, "Deal Error: failed to create the Tender Deal due to Overlapping Deal(s) [" + overlaps + "] already existing.", "Deal Overlaps Detected"));
                return initWipId;
            }
            #endregion Deal Stability and Overlapping Check

            //Prime Customer Information 
            if (customer.ToUpper() != "ANY")
            {
                if (isUnifiedEndCustomer == true)
                {
                    EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(customer, endCustomerCountry, workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId.ToString());
                    if (endCustObj.UnifiedEndCustomerId.ToString() == "0")
                    {
                        DataTable primedCustomerData = new DataTable();
                        try
                        {
                            string UnifiedEndCustomerLvl2Name = (workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != null && workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != "") ? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName.ToString();
                            primedCustomerData = _primeCustomerLib.InsertPrimedCustomerData(customer, workRecordDataFields.recordDetails.quote.EndCustomerCountry, unifiedEndCustomer, Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId), Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId), workRecordDataFields.recordDetails.quote.ComplianceWatchList, UnifiedEndCustomerLvl2Name, 99999999);
                        }
                        catch
                        {
                            //continue the flow;
                        }
                        if (primedCustomerData != null && primedCustomerData.Rows.Count != 0)
                        {
                            //Use Mydeals data after Master data insert into MyDeals
                            isPrimedCustomer = primedCustomerData.Rows[0][3].ToString();
                            isRPLedCustomer = primedCustomerData.Rows[0][4].ToString() == "False" ? "0" : "1";
                            RPLStatusCode = workRecordDataFields.recordDetails.quote.ComplianceWatchList;
                            primedCustomerL1Id = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId;
                            primedCustomerL2Id = workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId;
                            primedCustName = primedCustomerData.Rows[0][0].ToString();
                        }
                        else
                        {
                            isPrimedCustomer = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer == true ? "1" : "0";
                            isRPLedCustomer = (workRecordDataFields.recordDetails.quote.ComplianceWatchList == null || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("NOSNCTN") || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("REVIEWWIP")) ? "0" : "1";
                            RPLStatusCode = workRecordDataFields.recordDetails.quote.ComplianceWatchList == null ? "" : workRecordDataFields.recordDetails.quote.ComplianceWatchList;
                            primedCustomerL1Id = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId == null ? "" : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId;
                            primedCustomerL2Id = workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId == null ? "" : workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId;
                            primedCustName = unifiedEndCustomer;

                        }
                    }
                    else
                    {
                        //Use Mydeals data as the data exists in Mydeals
                        isPrimedCustomer = endCustObj.IsUnifiedEndCustomer.ToString();
                        isRPLedCustomer = endCustObj.IsRPLedEndCustomer.ToString();
                        RPLStatusCode = endCustObj.RPLStatusCode.ToString();
                        primedCustomerL1Id = endCustObj.UnifiedEndCustomerId.ToString() == "0" ? "" : endCustObj.UnifiedEndCustomerId.ToString();
                        primedCustomerL2Id = endCustObj.UnifiedCountryEndCustomerId.ToString() == "0" ? null : endCustObj.UnifiedCountryEndCustomerId.ToString();
                        primedCustName = endCustObj.UnifiedEndCustomer;

                    }
                }
                else
                {
                    isPrimedCustomer = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer == true ? "1" : "0";
                    isRPLedCustomer = (workRecordDataFields.recordDetails.quote.ComplianceWatchList == null || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("NOSNCTN") || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("REVIEWWIP")) ? "0" : "1";
                    RPLStatusCode = "";
                    primedCustomerL1Id = "";
                    primedCustomerL2Id = "";
                    primedCustName = "";
                }
                //As END_CUST_OBJ is the one which is used to load data in the End customer pop up(both in deal editor and deal reconcilaition screen), Creating End customer obj to update deal level END_CUST_OBJ attribute
                if ((customer != "" || customer != null) && (endCustomerCountry != "" || endCustomerCountry != null))
                {
                    List<EndCustomer> endCustData = new List<EndCustomer>();
                    endCustData.Add(new EndCustomer
                    {
                        END_CUSTOMER_RETAIL = customer,
                        PRIMED_CUST_CNTRY = endCustomerCountry,
                        IS_EXCLUDE = "0",
                        IS_PRIMED_CUST = isPrimedCustomer,
                        PRIMED_CUST_ID = primedCustomerL1Id,
                        RPL_STS_CD = RPLStatusCode,
                        IS_RPL = isRPLedCustomer,
                        PRIMED_CUST_NM = primedCustName
                    });
                    endCustomerObject = JsonConvert.SerializeObject(endCustData);
                }
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(723, "End Customer Error: Any is not a valid End Customer selection for IQR Tenders", "End Customer is not allowed"));
            }

            MyCustomersInformation requestedCustomerInfo = LookupCustomerInformation(custId);
            MyCustomersInformation singleCustomer = new CustomerLib().GetMyCustomerNames().FirstOrDefault(c => c.CUST_SID == custId);

            if (requestedCustomerInfo == null)
            {
                string idsid = OpUserStack.MyOpUserToken != null ? OpUserStack.MyOpUserToken.Usr.Idsid : "";
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(706, "User ID [" + idsid + "] Does not have access to Customer Account [" + workRecordDataFields.recordDetails.quote.account.CIMId + "] to Create/Update Deal", "User missing customer access"));
                return initWipId;
            }

            // Consumption Lookback Period from Customer Data, Set to 0 if non defined
            int lookbackDefaultVal = singleCustomer != null ? Int32.Parse(singleCustomer.DFLT_LOOKBACK_PERD.ToString()) : -1;
            if (lookbackDefaultVal < 0) lookbackDefaultVal = 0;  // Normally set to -1 in no customer default, but for IQR, needs valid value.
            string defArSettlementLvl =
                requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL == "User Select on Deal Creation" || requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL == ""
                    ? "Issue Credit to Billing Sold To"
                    : requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL;

            // Add in pull from customer settings for SETTLEMENT_PARTNER if above is Cash
            string defSettlementPartner = (defArSettlementLvl == "Cash") ? requestedCustomerInfo.DFLT_SETTLEMENT_PARTNER : "";
            if (defArSettlementLvl == "Cash" && defSettlementPartner == "") // No Settlement Partner is set, exit gracefully...
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(707, "Cash Settlement Level requires Settlement Partner to be defined for " + requestedCustomerInfo.CUST_NM + ".  Please contact My Deals Support", "Invalid Customer Setup"));
                return initWipId;
            }

            // BEGIN REWRITE
            // Create and load the return objects now
            MyDealsData myDealsData = new MyDealsData();
            myDealsData[OpDataElementType.PRC_ST] = new OpDataPacket<OpDataElementType>
            {
                PacketType = OpDataElementType.PRC_ST,
                Data = new OpDataCollectorDict
                {
                    [initPsId] = new OpDataCollector
                    {
                        DcID = initPsId,
                        DcParentID = contractId,
                        DcParentType = OpDataElementType.CNTRCT.ToString(),
                        DcType = OpDataElementType.PRC_ST.ToString(),
                        DataElements = new List<OpDataElement>()
                    }
                }
            };
            myDealsData.FillInHolesFromAtrbTemplate(OpDataElementType.PRC_ST, OpDataElementSetType.ALL_TYPES);

            // Add PS Data
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.dc_type), OpDataElementType.PRC_ST.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.DC_ID), initPsId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.dc_parent_type), OpDataElementType.CNTRCT.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.DC_PARENT_ID), contractId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), OpDataElementSetType.ALL_TYPES.ToString()); // 3002
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.TITLE), "PS - " + dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.WF_STG_CD), WorkFlowStages.Requested);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.SALESFORCE_ID), dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[initPsId].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());

            myDealsData[OpDataElementType.PRC_TBL] = new OpDataPacket<OpDataElementType>
            {
                PacketType = OpDataElementType.PRC_TBL,
                Data = new OpDataCollectorDict
                {
                    [initPtId] = new OpDataCollector
                    {
                        DcID = initPtId,
                        DcParentID = initPsId,
                        DcParentType = OpDataElementType.PRC_ST.ToString(),
                        DcType = OpDataElementType.PRC_TBL.ToString(),
                        DataElements = new List<OpDataElement>()
                    }
                }
            };
            myDealsData.FillInHolesFromAtrbTemplate(OpDataElementType.PRC_TBL, OpDataElementSetType.ECAP);

            // Add PT Data
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.dc_type), OpDataElementType.PRC_TBL.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.DC_ID), initPtId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.dc_parent_type), OpDataElementType.PRC_ST.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.DC_PARENT_ID), initPsId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), OpDataElementSetType.ECAP.ToString()); // 3002
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.TITLE), "PT - " + dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.REBATE_TYPE), "TENDER");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.SALESFORCE_ID), dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.PAYOUT_BASED_ON), "Consumption");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.MRKT_SEG), marketSegment);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.PROGRAM_PAYMENT), "Backend");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.GEO_COMBINED), "Worldwide"); // This doesn't matter since it is autofill value and not used
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.PROD_INCLDS), singleMedia); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[initPtId].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());

            myDealsData[OpDataElementType.PRC_TBL_ROW] = new OpDataPacket<OpDataElementType>
            {
                PacketType = OpDataElementType.PRC_TBL_ROW,
                Data = new OpDataCollectorDict
                {
                    [initPtrId] = new OpDataCollector
                    {
                        DcID = initPtrId,
                        DcParentID = initPtId,
                        DcParentType = OpDataElementType.PRC_TBL.ToString(),
                        DcType = OpDataElementType.PRC_TBL_ROW.ToString(),
                        DataElements = new List<OpDataElement>()
                    }
                }
            };
            myDealsData.FillInHolesFromAtrbTemplate(OpDataElementType.PRC_TBL_ROW, OpDataElementSetType.ECAP);

            // Add PTR Data
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.dc_type), OpDataElementType.PRC_TBL_ROW.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.DC_ID), initPtrId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.dc_parent_type), OpDataElementType.PRC_TBL.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.DC_PARENT_ID), initPtId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), dealType); // 3002
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.TITLE), "Salesforce line for " + userEnteredProductName);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.REBATE_TYPE), "TENDER");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.SALESFORCE_ID), dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PAYOUT_BASED_ON), "Consumption");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.MRKT_SEG), marketSegment);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PROGRAM_PAYMENT), "Backend");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.GEO_COMBINED), geoCombined.Contains(",") ? "[" + geoCombined + "]" : geoCombined);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PROD_INCLDS), singleMedia); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.CUST_MBR_SID), custId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.CUST_ACCNT_DIV), customerDivision.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PTR_USER_PRD), productLookupObj.MydlPdctName);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PTR_SYS_PRD), translatedValidProductJson); // Json representation of Product
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.SERVER_DEAL_TYPE), serverDealType);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.QLTR_BID_GEO), qltrBidGeo);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PERIOD_PROFILE), "Yearly");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.AR_SETTLEMENT_LVL), defArSettlementLvl);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.SYS_COMMENTS), "SalesForce Created Pricing Table Row: " + userEnteredProductName);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.RESET_VOLS_ON_PERIOD), "No");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.DEAL_DESC), dealDescription);

            myDealsData[OpDataElementType.WIP_DEAL] = new OpDataPacket<OpDataElementType>
            {
                PacketType = OpDataElementType.WIP_DEAL,
                Data = new OpDataCollectorDict
                {
                    [initWipId] = new OpDataCollector
                    {
                        DcID = initWipId,
                        DcParentID = initPtrId,
                        DcParentType = OpDataElementType.PRC_TBL_ROW.ToString(),
                        DcType = OpDataElementType.WIP_DEAL.ToString(),
                        DataElements = new List<OpDataElement>()
                    }
                }
            };
            myDealsData.FillInHolesFromAtrbTemplate(OpDataElementType.WIP_DEAL, OpDataElementSetType.ECAP);

            // Add WIP Data
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.dc_type), OpDataElementType.WIP_DEAL.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.DC_ID), initWipId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.dc_parent_type), OpDataElementType.PRC_TBL_ROW.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.DC_PARENT_ID), initPtrId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), dealType); // 3002
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.TITLE), myDealProduct); // Echo out user product name
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.REBATE_TYPE), "TENDER");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.SALESFORCE_ID), dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PAYOUT_BASED_ON), "Consumption");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.MRKT_SEG), marketSegment);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PROGRAM_PAYMENT), "Backend");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.GEO_COMBINED), geoCombined);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PROD_INCLDS), singleMedia); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CUST_MBR_SID), custId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CUST_ACCNT_DIV), customerDivision.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PAYABLE_QUANTITY), payableQuantity);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), customer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.IS_PRIMED_CUST), isPrimedCustomer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_ID), primedCustomerL1Id);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_NM), primedCustName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY), endCustomerCountry);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.IS_RPL), isRPLedCustomer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.END_CUST_OBJ), endCustomerObject);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PTR_USER_PRD), productLookupObj.MydlPdctName);
            UpdateProductDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRODUCT_FILTER), myPrdMbrSid.ToString(), myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId]);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.SERVER_DEAL_TYPE), serverDealType);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.QLTR_BID_GEO), qltrBidGeo);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PERIOD_PROFILE), "Yearly");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.AR_SETTLEMENT_LVL), defArSettlementLvl);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.SYS_COMMENTS), "SalesForce Created Deals: " + userEnteredProductName + "; Deal moved from Requested to Submitted after creation.");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.WF_STG_CD), "Draft"); // Because this is a new deal
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CAP), singleProduct?.CAP ?? ""); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.YCS2_PRC_IRBT), singleProduct?.YCS2 ?? "No YCS2"); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.ON_ADD_DT), dealStartDate.ToString("MM/dd/yyyy")); // defaulting to start date
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_REASON), "End Customer");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PROGRAM_PAYMENT), "Backend");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.REBATE_BILLING_START), billingStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.REBATE_BILLING_END), billingEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_PLATFORM), consumptionCustomerPlatform);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_SEGMENT), consumptionCustomerSegment);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_COUNTRY_REGION), consumptionCountryRegion);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_RPT_GEO), consumptionReportedSalesGeo);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.DEAL_COMB_TYPE), groupType);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD), lookbackDefaultVal.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CAP_STRT_DT), singleProduct?.CAP_START ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CAP_END_DT), singleProduct?.CAP_END ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.HAS_L1), singleProduct?.HAS_L1.ToString() ?? "0"); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.HAS_L2), singleProduct?.HAS_L2.ToString() ?? "0"); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRODUCT_CATEGORIES), singleProduct?.PRD_CAT_NM ?? ""); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.QUOTE_LN_ID), quoteLineNumber);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.IN_REDEAL), "0");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.TERMS), terms);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.EXCLUDE_AUTOMATION), excludeAutomationFlag);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.GEO_APPROVED_BY), gaWwid);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.GEO_APPROVED_DT), DateTime.Now.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.RESET_VOLS_ON_PERIOD), "No");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.DEAL_DESC), dealDescription);
            if (dealStartDate < DateTime.Now) UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.BACK_DATE_RSN), backdateReason);

            // Object Validation Checks - This is a new item creation, so just save validation needed
            SavePacket savePacket = new SavePacket(new ContractToken("IRQ ContractToken Created - SaveFullContract")
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = false
            });

            if (myDealsData.ValidationApplyRules(savePacket))
            {
                string validErrors = "";
                foreach (OpDataElementType dpKey in myDealsData.Keys) // dpKey is like OpDataElementType.WIP_DEAL
                {
                    foreach (OpDataCollector dc in myDealsData[dpKey].AllDataCollectors)
                    {
                        dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, myDealsData);
                        foreach (OpMsg opMsg in dc.Message.Messages)
                        {
                            if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0 ? "[" + dpKey + "] " + opMsg.Message : "; " + "[" + dpKey + "] " + opMsg.Message;
                        }
                    }
                }

                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(713, "Deal Validation Error : New Deal had validation errors: " + validErrors, "Deal had validation errors"));
                return initWipId; //Preemptive fail due to validation errors
            }

            // Start the save process - No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used from UI client.
            ContractToken saveContractToken = new ContractToken("IRQ DealsToken Created - Save Deals Data")
            {
                CustId = custId,
                ContractId = initWipId
            };

            PullUnusedAttributes(myDealsData);
            TagSaveActionsAndBatches(myDealsData); // Add needed save actions and batch IDs for the save
            MyDealsData saveResponse = myDealsData.Save(saveContractToken);

            if (myDealsData[OpDataElementType.WIP_DEAL].Actions.Any() && !saveResponse.Keys.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessSalesForceDealInformation"));
            }

            int contPsId = initPsId;
            int wipDealId = initWipId;

            foreach (var objKey in saveResponse.Keys)
            {
                var actnx = saveResponse[objKey].Actions.FirstOrDefault(x => x.Action == "ID_CHANGE");
                if (actnx != null)
                {
                    if (objKey == OpDataElementType.WIP_DEAL)
                    {
                        wipDealId = Int32.Parse(actnx.AltID.ToString());
                    }
                    else if (objKey == OpDataElementType.PRC_ST)
                    {
                        contPsId = Int32.Parse(actnx.AltID.ToString());
                    }
                }
            }

            if (wipDealId <= 0) return initWipId; // If creation failed, bail out, else PCT/MCT

            workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealRFQStatus = WorkFlowStages.Submitted; // Set by init setting rule

            workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer = isPrimedCustomer == "1" ? true : false;
            workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId = primedCustomerL1Id == "" ? null : primedCustomerL1Id;
            workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId = primedCustomerL2Id;
            if (isPrimedCustomer == "1" && primedCustName != "")
            {
                workRecordDataFields.recordDetails.quote.UnifiedEndCustomer = primedCustName;
            }

            // Update the Meet Comp data now.
            EnterMeetCompData(contPsId, wipDealId, myPrdMbrSid, productLookupObj.MydlPdctName, myPrdCat, myDealPrdType, custId,
                workRecordDataFields, currentRec);

            // TODO: POTENTIALLY PLACE APRV_AUDIT CALL HERE

            return wipDealId;
        }

        private OpUserToken setUserToken(TenderTransferRootObject workRecordDataFields, int currentRecordId, string requestType)
        {
            // Generate Security Token for this set of records
            string idsid = workRecordDataFields.recordDetails.quote.quoteLine[currentRecordId].Wwid; //11911244
            OpUserToken opUserToken = null;

            if (requestType != "UpdateStatus")
            {
                opUserToken = new OpUserToken { Usr = { Idsid = idsid } };
            }
            else // requestType == "UpdateStatus" - TWC3119-679 - Use generic user for status updates always
            {
                opUserToken = new OpUserToken { Usr = { Idsid = "90000054" } }; // Use the Dummy GA (dmyGA) role in this case for approvals only
                //workRecordDataFields.recordDetails.quote.quoteLine[currentRecordId].errorMessages.Add(AppendError(800, "Warning: Using IQR Faceless Account for Approval because User [" + idsid + "] is not presently a user in My Deals", "Using IQR Faceless Account"));
            }
            UserSetting tempLookupSetting = new EmployeeDataLib().GetUserSettings(opUserToken);

            if (opUserToken.Usr.Idsid != null) // Bad user lookup
            {
                if (opUserToken.Usr.WWID == 0 || opUserToken.Usr.Idsid == "") // Bad user lookup
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRecordId].errorMessages.Add(AppendError(704, "User ID [" + idsid + "] is not presently a user in My Deals", "User account doesn't exist"));
                }
                if (opUserToken.Role.RoleTypeCd != "GA") // Wrong role for create/update, but allow normal roles to approvals
                {
                    if (requestType == "UpdateStatus" && (opUserToken.Role.RoleTypeCd == "FSE" || opUserToken.Role.RoleTypeCd == "GA" || opUserToken.Role.RoleTypeCd == "DA"))
                    {
                        // Skip since this is an update
                    }
                    else
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[currentRecordId].errorMessages.Add(AppendError(705, "User ID [" + idsid + "] is not a GA user role in My Deals", "User has wrong role"));
                    }
                }
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRecordId].errorMessages.Add(AppendError(704, "No User ID passed from IQR for this request", "IQR passed WWID was left empty"));
            }

            return opUserToken;
        }

        private bool containsError(IEnumerable<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> errList, List<int> checkForValues)
        {
            bool hasPassedErrorId = false;
            foreach (var errMsg in errList)
            {
                if (checkForValues.Contains(errMsg.Code)) hasPassedErrorId = true;
            }
            return hasPassedErrorId;
        }

        private string dumpErrorMessages(IEnumerable<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> errList, int folioId, int dealId)
        {
            string response = "";
            foreach (var errMsg in errList)
            {
                response += errMsg.Code + " - " + errMsg.Message + ": " + errMsg.MessageDetails + "<br>";
            }
            response += "Folio ID: " + folioId + ", Deal ID: " + dealId + "<br>";

            return response;
        }

        private string ProcessCreationRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string fullPackageResponse = "";

            // Walk through deal/quoteline records now
            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                string executionResponse = "";
                // Get OpUserToken
                OpUserToken opUserToken = setUserToken(workRecordDataFields, i, "Create");
                if (!containsError(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, UserTokenErrorCodes))
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken); // Set the user token for this record
                }
                else
                {
                    continue; // Fail and skip this record due to User Token issues
                }

                // Start Create Request Action for the current quoteline item
                string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
                string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;
                string custCimId = workRecordDataFields.recordDetails.quote.account.CIMId; // empty string still returns Dell ID

                // TODO: Do a record stability check first and if no error messages, continue, catch things like ECAP/GEO/ETC

                executionResponse += "Processing [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
                int custId = _jmsDataLib.FetchCustFromCimId(custCimId); // set the customer ID based on Customer CIM ID

                if ((custCimId == null || custCimId == "") || custId == 0) // Need to have a working customer for this request and failed, skip!
                {
                    if (custCimId == null) custCimId = "null";
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(701, "Customer error: Unable to find the customer with CIMId {" + custCimId + "}.  Please contact My Deals Support for Invalid Customer", "Invalid Customer"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, 0, dealId);
                    continue;
                }

                List<TendersSFIDCheck> sfToMydlIds = _jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal, custId);
                if (sfToMydlIds == null)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, SF ID lookup Error"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, -1, dealId);
                    continue; // we had error on lookup, skip to next to process
                }
                while (sfToMydlIds[0].Cntrct_SID <= 0) // Add in SF_ID blocked loop to fire this event until we get a proper item back, only bail on DB errors
                {
                    System.Threading.Thread.Sleep(5000);
                    sfToMydlIds = _jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal, custId);

                    if (sfToMydlIds == null)
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, SF ID lookup Error"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, -1, dealId);
                        continue; // we had error on lookup, skip to next to process
                    }
                }

                int folioId = sfToMydlIds[0].Cntrct_SID;
                dealId = sfToMydlIds[0].Wip_SID;

                // Step 2 - Update the contract header if needed
                folioId = ProcessSalesForceContractInformation(folioId, salesForceIdCntrct, custId, workRecordDataFields, i);
                workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();

                if (folioId <= 0)  // Needed to create a new Folio for this request and failed, skip!
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed to create the Tender Folio"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                    continue;
                }

                // Step 2a - Deal with a deal structure now
                if (dealId == 0) // This is a new deal entry
                {
                    dealId = ProcessSalesForceDealInformation(folioId, salesForceIdDeal, custId, workRecordDataFields, i);
                    workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                    if (dealId < 0)  // Needed to create a new PS to WIP Deal for this request and failed, error..
                    {
                        //// Real error passed back in ProcessSalesForceDealInformation, so catch-all condition below removed
                        //workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(711, "Deal Error: Failed to create the Tender Deal, user {" + idsid + "} doesn’t have GA access in Mydeals", "Failed to create the Tender Deal"));
                        //executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }
                }
                else // Post back known Deal ID to SF, append error that it exists already
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                    executionResponse += ProcessUpdateRequest(workRecordDataFields, batchId, i, false, ref dealId);
                }

                // Should have no bail outs, so post final messages here
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                fullPackageResponse += executionResponse + "<br><br>";
            } // End of quote lines loop

            return fullPackageResponse;
        }
        private string ProcessRollbackRequestShell(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string fullPackageResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                string executionResponse = "";
                // Get OpUserToken
                OpUserToken opUserToken = setUserToken(workRecordDataFields, i, "Rollback");
                if (!containsError(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, UserTokenErrorCodes))
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken); // Set the user token for this record
                }
                else
                {
                    continue; // Fail and skip this record due to User Token issues
                }

                // Start Rollback Request Action for the current quoteline item
                executionResponse += ProcessRollbackRequest(workRecordDataFields, batchId, i, ref dealId);
                fullPackageResponse += executionResponse + "<br><br>";
            }

            return fullPackageResponse;
        }

        private string ProcessRollbackRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, int recordId, ref int dealId)
        {
            string executionResponse = "";
            string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
            string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[recordId].Id;

            executionResponse += "Processing rollback for [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
            int folioId = Int32.Parse(workRecordDataFields.recordDetails.quote.FolioID);
            dealId = Int32.Parse(workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQId);

            List<int> passedFolioIds = new List<int>() { dealId };
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()

            if (!myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(712, "Deal Error: Couldn't find deal for this request, contact L2 suport", "Couldn't find deal " + dealId + " to delete"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..  We had error on lookup, skip to next to process
            }            

            int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));
            //var currentWipWfStg = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            var currentWippsWfStg = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PS_WF_STG_CD);            
            
            if(!(currentWippsWfStg == WorkFlowStages.Submitted || currentWippsWfStg == WorkFlowStages.Requested))
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(724, "Update Error: Deal is not at Submitted stage where rollback is not allowed", "Rollback is not allowed when Deal is at Submitted stage"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse;
            }
            bool hasTracker = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.HAS_TRACKER)) == 1 ? true : false;
            bool isRollbackToWon = hasTracker && (currentWippsWfStg == WorkFlowStages.Requested || currentWippsWfStg == WorkFlowStages.Submitted);
   
            DataFix data = new DataFix();                               
            DataFixAction dtac = new DataFixAction();
            dtac.OBJ_TYPE_SID = (int)OpDataElementType.WIP_DEAL;
            dtac.ACTN_VAL_LIST = dealId.ToString();
            dtac.ACTN_NM = isRollbackToWon ? "DEAL_ROLLBACK_TO_WON" : "DEAL_ROLLBACK_TO_OFFER";
            dtac.BTCH_ID = 0;
            List<DataFixAttribute> atrb_List = new List<DataFixAttribute>();                    
            if (!hasTracker)
            {
                DateTime dealStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[recordId].ApprovedStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                DateTime dealEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[recordId].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                DateTime billStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[recordId].BillingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                DateTime billEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[recordId].BillingEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                Dictionary<int, string> keyValuePairs = new Dictionary<int, string>()
                {
                    { Attributes.START_DT.ATRB_SID,dealStartDate.ToString("MM/dd/yyyy")},
                    { Attributes.END_DT.ATRB_SID,dealEndDate.ToString("MM/dd/yyyy")},
                    { Attributes.REBATE_BILLING_START.ATRB_SID,billStartDate.ToString("MM/dd/yyyy")},
                    { Attributes.REBATE_BILLING_END.ATRB_SID,billEndDate.ToString("MM/dd/yyyy")},
                    { Attributes.ECAP_PRICE.ATRB_SID,workRecordDataFields.recordDetails.quote.quoteLine[recordId].ApprovedECAPPrice},
                    { Attributes.VOLUME.ATRB_SID,workRecordDataFields.recordDetails.quote.quoteLine[recordId].ApprovedQuantity}                        
                };
                foreach (var item in keyValuePairs)
                    {
                        var dataFixAttribute = new DataFixAttribute
                        {
                            OBJ_TYPE_SID = (int)OpDataElementType.WIP_DEAL,
                            ATRB_SID = item.Key,
                            ATRB_RVS_NBR = 0,
                            OBJ_SID = dealId,
                            ATRB_VAL = item.Value,
                            CUST_MBR_SID = custId
                        };
                        atrb_List.Add(dataFixAttribute);
                    }                                       
            }
            data.DataFixAttributes = atrb_List;
            data.DataFixActions = new List<DataFixAction>() { dtac };
            int response= _dataFixDataLib.IQRRollback(data);
            if (response == 1)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQStatus = isRollbackToWon ? "Won" : "Offer";
                executionResponse += "Deal Rollbacked: [" + dealId + "] - [" + batchId + "]<br>";                
            }
            else if(response == 2)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(725, "Deal can not be rollback because of given values are not matched","Deal can not be rollback to Offer stage beacuse of data mismatch"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse;
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessRollbackRequest"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse;
            }                         
            return executionResponse;
        }

    
    private string ProcessDeleteRequestShell(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string fullPackageResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                string executionResponse = "";
                // Get OpUserToken
                OpUserToken opUserToken = setUserToken(workRecordDataFields, i, "Delete");
                if (!containsError(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, UserTokenErrorCodes))
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken); // Set the user token for this record
                }
                else
                {
                    continue; // Fail and skip this record due to User Token issues
                }

                // Start Delete Request Action for the current quoteline item
                executionResponse += ProcessDeleteRequest(workRecordDataFields, batchId, i, ref dealId);
                fullPackageResponse += executionResponse + "<br><br>";
            }

            return fullPackageResponse;
        }

        private string ProcessDeleteRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, int recordId, ref int dealId)
        {
            string executionResponse = "";

            string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
            string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[recordId].Id;

            executionResponse += "Processing update for [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
            int folioId = Int32.Parse(workRecordDataFields.recordDetails.quote.FolioID);
            dealId = Int32.Parse(workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQId);

            List<int> passedFolioIds = new List<int>() { dealId };
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()

            if (!myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(712, "Deal Error: Couldn't find deal for this request, contact L2 suport", "Couldn't find deal " + dealId + " to delete"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..  We had error on lookup, skip to next to process
            }

            // Break out update records block so that it can be updated easier apart from the save and PCT/MCT calls

            int psId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
            int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));

            MyCustomersInformation requestedCustomerInfo = LookupCustomerInformation(custId);

            // Does user have access to the customer?
            if (requestedCustomerInfo == null)
            {
                string idsid = OpUserStack.MyOpUserToken != null ? OpUserStack.MyOpUserToken.Usr.Idsid : "";
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(706, "User ID [" + idsid + "] Does not have access to Customer Account [" + workRecordDataFields.recordDetails.quote.account.CIMId + "] to Create/Update/Delete Deal", "User missing customer access"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            // Is there a tracker involved?
            bool hasTracker = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.HAS_TRACKER)) == 1 ? true : false;
            if (hasTracker)
            {
                // There is a tracker involved, cannot delete the deal
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(750, "Delete Error: Deal has a Tracker and cannot be deleted", "Deal dealete is not allowed"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            // Start the save process - No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used during create.
            ContractToken saveContractToken = new ContractToken("ContractToken Created - Save IRQ Deal Updates")
            {
                CustId = custId,
                ContractId = folioId
            };

            TagDeleteActionsAndBatches(myDealsData); // Add needed delete actions and batch IDs for the save
            MyDealsData saveResponse = myDealsData.Save(saveContractToken);

            if (myDealsData[OpDataElementType.WIP_DEAL].Actions.Any() && !saveResponse.Keys.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessDeleteRequest"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            var psActiojns = saveResponse.ContainsKey(OpDataElementType.PRC_ST) ? saveResponse[OpDataElementType.PRC_ST].Actions : null;

            // Only looking for PS level OBJ_DELETED call, assuming that only one branch existed and if the delete was successful, PS on down is gone.
            if (psActiojns.Any(a => a.Action == "OBJ_DELETED"))
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQStatus = "Deleted";
                executionResponse += "Deal deleted: [" + dealId + "] - [" + batchId + "]<br>";
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(751, "Delete Error: Deal not deleted", "Deal not deleted"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
            }

            return executionResponse;
        }

        private void TagSaveActionsAndBatches(MyDealsData myDealsData)
        {
            foreach (OpDataElementType objKey in myDealsData.Keys)
            {
                if (myDealsData[objKey].GetChanges().AllDataElements.Any())
                {
                    if (objKey != OpDataElementType.WIP_DEAL)// To Add save action for Non-WIP packets
                    {
                        myDealsData[objKey].AddSaveActions();
                    }
                    if (objKey == OpDataElementType.PRC_ST)// Append Audit Actions for Pricing Startegy
                    {
                        List<int> auditIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        if (auditIds.Any()) myDealsData[objKey].AddAuditActions(auditIds);
                    }
                    if (objKey == OpDataElementType.WIP_DEAL) // Execute normal save Actions with Attributes for additionl Sync
                    {
                        List<int> possibleIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        myDealsData[objKey].AddSaveActions(null, possibleIds, DataCollections.GetAttributeData());
                    }
                }
            }
            myDealsData.EnsureBatchIDs();
        }

        private void TagDeleteActionsAndBatches(MyDealsData myDealsData)
        {
            foreach (OpDataElementType objKey in myDealsData.Keys)
            {
                if (objKey == OpDataElementType.PRC_ST)
                {
                    List<int> deleteIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                    if (deleteIds.Any()) myDealsData[objKey].AddDeleteActions(deleteIds);
                }
            }
            myDealsData.EnsureBatchIDs();
        }

        private void UpdateDeValue(IOpDataElement myDe, string myValue)
        {
            if (myDe != null && myValue != null && myDe.AtrbValue.ToString() != myValue.ToString())
            {
                myDe.AtrbValue = myValue;
            }
        }

        private void UpdateProductDeValue(IOpDataElement myDe, string prdId, IOpDataCollector dc)
        {
            // If we ever go to kits, we will need to ramp this up to deal with product bucket dimentions (KPV) below.
            if (myDe != null && prdId != null && myDe.AtrbValue.ToString() != prdId.ToString())
            {
                OpDataElement deBaseProd = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER); // Removed dimensional portion of this lookup since I only got 1 for now
                if (deBaseProd != null)
                {
                    OpDataElement newDe = deBaseProd.Clone();

                    newDe.SetDimKey("7:" + prdId + "/20:0"); //20:" +  kvp.Key.Substring(kvp.Key.Length - 1)
                    newDe.AtrbKey = newDe.AtrbCd + "|" + newDe.DimKeyString;
                    newDe.AtrbValue = prdId;
                    newDe.State = OpDataElementState.Modified;

                    dc.DataElements.Add(newDe);
                }
                dc.DataElements.Remove(deBaseProd); // Clear out the template added base product holder.
            }
        }

        private bool UpdateRecordsFromSfPackets(MyDealsData myDealsData, TenderTransferRootObject workRecordDataFields, int i, int custId, int folioId, int psId, int dealId, bool reRunMode, ref string validErrors)
        {
            int ptrId = myDealsData[OpDataElementType.PRC_TBL_ROW].Data.Keys.FirstOrDefault();
            int ptId = myDealsData[OpDataElementType.PRC_TBL].Data.Keys.FirstOrDefault();
            string isPrimedCustomer = null;
            string isRPLedCustomer = null;
            string RPLStatusCode = null;
            string primedCustomerL1Id = null;
            string primedCustomerL2Id = null;
            string primedCustName = null;

            // TODO: Figure out what fields we will allow to change and place them here.  Let DEs drive the save and rules.  Bail on validation errors or empty required fields.
            // Update SalesForce IDs for new deal instance objects
            string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[ptId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);

            // Update End Customer
            string endCustomer = workRecordDataFields.recordDetails.quote.EndCustomer;
            string endCustomerCountry = workRecordDataFields.recordDetails.quote.EndCustomerCountry;
            string unifiedEndCustomer = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName == null ? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName;
            string isMyDealsUnified = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.IS_PRIMED_CUST);
            string primedCustID = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRIMED_CUST_ID);
            string primedCustNM = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRIMED_CUST_NM);
            string primedCustCountry = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRIMED_CUST_CNTRY);
            string payableQuantity = workRecordDataFields.recordDetails.quote.quoteLine[i].PayableQuantity;
            bool isIQRUnified = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer;
            string primedCtryId = workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId;
            string customer = null;
            string endCustomerObject = null;
            if (endCustomer != null && endCustomer != "") customer = endCustomer;
            else customer = unifiedEndCustomer;

            if (customer.ToUpper() != "ANY")
            {
                if (isIQRUnified == true && isMyDealsUnified != "1")
                {
                    EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(customer, endCustomerCountry, workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId.ToString());
                    if (endCustObj.UnifiedEndCustomerId.ToString() == "0")
                    {
                        DataTable primedCustomerData = new DataTable();
                        try
                        {
                            string UnifiedEndCustomerLvl2Name = (workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != null && workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != "") ? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName.ToString();

                            primedCustomerData = _primeCustomerLib.InsertPrimedCustomerData(customer, workRecordDataFields.recordDetails.quote.EndCustomerCountry, unifiedEndCustomer, Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId), Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId), workRecordDataFields.recordDetails.quote.ComplianceWatchList, UnifiedEndCustomerLvl2Name, 99999999);
                        }
                        catch
                        {
                            //continue the flow;
                        }

                        if (primedCustomerData != null && primedCustomerData.Rows.Count != 0)
                        {
                            //Use MyDeals data after the Master Data update in MyDeals
                            isPrimedCustomer = primedCustomerData.Rows[0][3].ToString();
                            isRPLedCustomer = primedCustomerData.Rows[0][4].ToString() == "False" ? "0" : "1";
                            RPLStatusCode = workRecordDataFields.recordDetails.quote.ComplianceWatchList;
                            primedCustomerL1Id = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId;
                            primedCustomerL2Id = workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId;
                            primedCustName = primedCustomerData.Rows[0][0].ToString();
                        }
                        else
                        {
                            isPrimedCustomer = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer == true ? "1" : "0";
                            isRPLedCustomer = (workRecordDataFields.recordDetails.quote.ComplianceWatchList == null || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("NOSNCTN") || workRecordDataFields.recordDetails.quote.ComplianceWatchList.ToString().Contains("REVIEWWIP")) ? "0" : "1";
                            RPLStatusCode = workRecordDataFields.recordDetails.quote.ComplianceWatchList == null ? "" : workRecordDataFields.recordDetails.quote.ComplianceWatchList;
                            primedCustomerL1Id = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId == null ? "" : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId;
                            primedCustomerL2Id = workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId == null ? "" : workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId;
                            primedCustName = unifiedEndCustomer;
                        }
                    }
                    else
                    {
                        //Use MyDeals data as the data exists in MyDeals
                        isPrimedCustomer = endCustObj.IsUnifiedEndCustomer.ToString();
                        isRPLedCustomer = endCustObj.IsRPLedEndCustomer.ToString();
                        RPLStatusCode = endCustObj.RPLStatusCode.ToString();
                        primedCustomerL1Id = endCustObj.UnifiedEndCustomerId.ToString() == "0" ? "" : endCustObj.UnifiedEndCustomerId.ToString();
                        primedCustomerL2Id = endCustObj.UnifiedCountryEndCustomerId.ToString() == "0" ? null : endCustObj.UnifiedCountryEndCustomerId.ToString();
                        primedCustName = endCustObj.UnifiedEndCustomer;
                    }

                    //As END_CUST_OBJ is the one which is used to load data in the End customer pop up, Creating End customer obj to update deal level END_CUST_OBJ attribute 
                    if ((customer != "" || customer != null) && (endCustomerCountry != "" || endCustomerCountry != null))
                    {
                        List<EndCustomer> endCustData = new List<EndCustomer>();
                        endCustData.Add(new EndCustomer
                        {
                            END_CUSTOMER_RETAIL = customer,
                            PRIMED_CUST_CNTRY = endCustomerCountry,
                            IS_EXCLUDE = "0",
                            IS_PRIMED_CUST = isPrimedCustomer,
                            PRIMED_CUST_ID = primedCustomerL1Id,
                            RPL_STS_CD = RPLStatusCode,
                            IS_RPL = isRPLedCustomer,
                            PRIMED_CUST_NM = primedCustName
                        });
                        endCustomerObject = JsonConvert.SerializeObject(endCustData);
                    }

                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), customer);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_PRIMED_CUST), isPrimedCustomer);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_ID), primedCustomerL1Id);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_NM), primedCustName);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY), endCustomerCountry);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_RPL), isRPLedCustomer);
                    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_CUST_OBJ), endCustomerObject);

                    workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer = isPrimedCustomer == "1" ? true : false;
                    workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId = primedCustomerL1Id == "" ? null : primedCustomerL1Id;
                    workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId = primedCustomerL2Id;
                    workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName = primedCustName;
                }
                else
                {
                    workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer = isIQRUnified;
                    workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId = primedCustID;
                    workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId = primedCtryId;
                    workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName = primedCustNM;
                }
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(723, "End Customer Error: Any is not a valid End Customer selection for IQR Tenders", "End Customer is not allowed"));
            }

            string projectName = workRecordDataFields.recordDetails.quote.ProjectName.ToUpper();
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);

            string quiteLineId = workRecordDataFields.recordDetails.quote.quoteLine[i].QuoteLineNumber;
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.QUOTE_LN_ID), quiteLineId);

            DateTime dealStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.ON_ADD_DT), dealStartDate.ToString("MM/dd/yyyy"));

            if (dealStartDate < DateTime.Now) // If start date is in past
            {
                string backdateReason = workRecordDataFields.recordDetails.quote.quoteLine[i].BackdateReason != "" ?
                    workRecordDataFields.recordDetails.quote.quoteLine[i].BackdateReason : "Contract Negotiation Delay";
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.BACK_DATE_RSN), backdateReason);
            }

            DateTime dealEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));

            DateTime billingStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].BillingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.REBATE_BILLING_START), billingStartDate.ToString("MM/dd/yyyy"));

            DateTime billingEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].BillingEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.REBATE_BILLING_END), billingEndDate.ToString("MM/dd/yyyy"));

            string consumptionCustomerPlatform = workRecordDataFields.recordDetails.quote.quoteLine[i].ConsumptionCustomerPlatform;
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_PLATFORM), consumptionCustomerPlatform == null ? "" : consumptionCustomerPlatform);

            string consumptionCustomerSegment = workRecordDataFields.recordDetails.quote.quoteLine[i].ConsumptionCustomerSegment;
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_SEGMENT), consumptionCustomerSegment == null ? "" : consumptionCustomerSegment);

            string consumptionRegion = workRecordDataFields.recordDetails.quote.quoteLine[i].ConsumptionRegion;
            string consumptionCountry = workRecordDataFields.recordDetails.quote.quoteLine[i].ConsumptionCountry;
            string consumptionCountryRegion = GatherConsumptionContries(consumptionRegion, consumptionCountry);
            string consumptionReportedSalesGeo = workRecordDataFields.recordDetails.quote.quoteLine[i].ConsumptionReportedSalesGeo;
            // Can only have 1, UI controlled rule preventing both from being entered, warn if both are filled out on update
            if (consumptionCountryRegion != null && consumptionReportedSalesGeo != null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(715, "Deal Error: failed to update the Tender Deal due to Consumption Country/Region and Consumption Reported Sales Geo both being filled out.  You are allowed one or the other, not both.", "Consumption Region and Sales both filled out"));
            }
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_COUNTRY_REGION), consumptionCountryRegion == null ? "" : consumptionCountryRegion);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_RPT_GEO), consumptionReportedSalesGeo == null ? "" : consumptionReportedSalesGeo);

            // Add this in if IQR decides that they need to update this field prior to it having a tracker only.
            //string HasTracker = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.HAS_TRACKER);
            //if (HasTracker == "1")
            //{
            //    string customerDivision = workRecordDataFields.recordDetails.quote.quoteLine[i].CustomerDivision; // SF will have to handle if this is needed or not for any given customer as a drop down
            //    UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.CUST_ACCNT_DIV), customerDivision);
            //    UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CUST_ACCNT_DIV), customerDivision);
            //}

            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedECAPPrice;
            // Will need to add dimensions down the road
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);

            // Volume Updates
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedQuantity;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.VOLUME), quantity);

            //Payable Qty Update.
            //Note: TWC5971-304 - Defect fixed - Payable Qty is not getting updated with IQR value for restricted customer
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PAYABLE_QUANTITY), payableQuantity);

            string terms = workRecordDataFields.recordDetails.quote.quoteLine[i].AdditionalTandC;
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.TERMS), terms);

            string excludeAutomationFlag = workRecordDataFields.recordDetails.quote.quoteLine[i].ExcludeAutomation ? "Yes" : "No";
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.EXCLUDE_AUTOMATION), excludeAutomationFlag);

            string dealDescription = workRecordDataFields.recordDetails.quote.quoteLine[i].DealDescription;
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.DEAL_DESC), dealDescription);

            // Clear out system comments to all objects so that updates don't stack comments incorrectly
            //UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[folioId].GetDataElement(AttributeCodes.SYS_COMMENTS), ""); // Removed since we actually don't need to do this at CNTRCT
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[ptId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            //Set any forced constant attributes brought in as part of R2/R3 to their defaults
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.RESET_VOLS_ON_PERIOD), "No");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.RESET_VOLS_ON_PERIOD), "No");

            #region Overlapping Check
            // Overlaps check, no other tender deal with same Customer/Product/Dates/End Customer/Project can exist, block creeation if they do.
            int myPrdMbrSid = int.TryParse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRODUCT_FILTER), out myPrdMbrSid) ? myPrdMbrSid : 0;
            OverlapChecksDataLib ochkDataLib = new OverlapChecksDataLib();
            List<OverlappingTenders> overlapsCheckDeals = ochkDataLib.CheckForOverlappingTenders(dealId, dealStartDate, dealEndDate, projectName, customer, endCustomerCountry, custId, myPrdMbrSid, consumptionCustomerPlatform, consumptionCustomerSegment, consumptionReportedSalesGeo, consumptionCountryRegion); // endCustomer = customer

            if (overlapsCheckDeals.Count > 0)
            {
                string overlaps = string.Join(",", overlapsCheckDeals.Select(x => x.DealId));
                workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(741, "Update Error: failed to update the deal due to changes Overlapping other Tender Deal(s) [" + overlaps + "].", "Deal Overlaps Detected"));
            }

            #endregion Overlapping Check

            // Conduct staging push if needed - support only requested to submitted at this point - re-deal cycles will be rougher.
            // Offer and Lost/Won deals would need to verify a right way major change prior to re-setting the WF Stage.  Best to let re-deal take care.
            List<string> changeMessages = new List<string>();
            string psStage = myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            string dealStage = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            if (dealStage == WorkFlowStages.Draft && psStage == WorkFlowStages.Requested)
            {
                UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.WF_STG_CD), WorkFlowStages.Submitted);
                myDealsData[OpDataElementType.PRC_ST].Data[psId].AddTimelineComment("Deal moved from Requested to Submitted after IQR Updating.");
                changeMessages.Add("Deal moved from Requested to Submitted after IQR Updating.");
            }

            // Tack on change messages - this loosely mimics rule AddHistoryMessagesForChanges for IQR
            //AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            //List<string> checkList = new List<string> { AttributeCodes.ECAP_PRICE, AttributeCodes.START_DT, AttributeCodes.END_DT, AttributeCodes.REBATE_BILLING_START, AttributeCodes.REBATE_BILLING_END, AttributeCodes.GEO_COMBINED, AttributeCodes.MRKT_SEG, AttributeCodes.QTY, AttributeCodes.VOLUME };
            //foreach (IOpDataElement de in myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementsWhere(d => d.HasOrigValueChanged && checkList.Contains(d.AtrbCd)).ToList())
            //{
            //    MyDealsAttribute atrb = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
            //    if (atrb == null) continue;
            //    string addItem = atrb.ATRB_LBL + " value changed from [" + de.OrigAtrbValue + "] to [" + de.AtrbValue + "]";
            //    if (!changeMessages.Contains(addItem, StringComparer.OrdinalIgnoreCase)) changeMessages.Add(addItem);
            //}
            if (changeMessages.Count > 0) // If there are items to add, add them
            {
                // "; " is a safe spacing for excel output, but it is also replaced by "<br>" on web popup for readability.
                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].AddTimelineComment(String.Join("; ", changeMessages.ToArray()));
            }

            // NEW FIELD TO BE ADDED AFTER REDEAL
            string OrigRedealBit = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.IN_REDEAL);
            if (reRunMode && OrigRedealBit == "1")
            {
                DateTime ReDealEffectiveDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].EffectivePricingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format                
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.LAST_REDEAL_DT), ReDealEffectiveDate.ToString("MM/dd/yyyy"));
            }
             
            // Using this to allow us to dive right into rules engines
            SavePacket savePacket = new SavePacket()
            {
                MyContractToken = new ContractToken("ContractToken Created - SaveFullContract")
                {
                    CustId = custId,
                    ContractId = folioId
                },
                ValidateIds = new List<int> { dealId }
            };

            bool hasValidationErrors = myDealsData.ValidationApplyRules(savePacket); //myDealsData.ApplyRules(MyRulesTrigger.OnValidate) - myDealsData.ValidationApplyRules(savePacket)
            foreach (OpDataElementType dpKey in myDealsData.Keys) // dpKey is like OpDataElementType.WIP_DEAL
            {
                foreach (OpDataCollector dc in myDealsData[dpKey].AllDataCollectors)
                {
                    foreach (OpMsg opMsg in dc.Message.Messages) // If validation errors, log and skip to next
                    {
                        if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0 ? "[" + dpKey + "] " + opMsg.Message : "; " + "[" + dpKey + "] " + opMsg.Message;
                    }
                }
            }

            return hasValidationErrors;
        }

        private string ProcessUpdateRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, int recordId, bool reRunMode, ref int dealId)
        {
            string executionResponse = "";

            string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
            string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[recordId].Id;

            executionResponse += "Processing update for [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
            int folioId = Int32.Parse(workRecordDataFields.recordDetails.quote.FolioID);
            dealId = Int32.Parse(workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQId);

            List<int> passedFolioIds = new List<int>() { dealId };
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()
            var oldmydealsData= myDealsData.DeepClone();
            if (!myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(712, "Deal Error: Couldn't find deal for this request, contact L2 suport", "Couldn't find deal " + dealId + " to update"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..  We had error on lookup, skip to next to process
            }

            // Break out update records block so that it can be updated easier apart from the save and PCT/MCT calls

            int psId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
            int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));

            string currentStage = myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD); // US799242
            if (currentStage == WorkFlowStages.Submitted)
            {
                // If you make it in here, they are attempting to do an update on a deal still at the Submitted stage, block them...
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(740, "Update Error: Deal is at Submitted stage where editing is not allowed", "Submitted stage edits not allowed"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            // Check is user has access to update his customer
            MyCustomersInformation requestedCustomerInfo = LookupCustomerInformation(custId);

            if (requestedCustomerInfo == null)
            {
                string idsid = OpUserStack.MyOpUserToken != null ? OpUserStack.MyOpUserToken.Usr.Idsid : "";
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(706, "User ID [" + idsid + "] Does not have access to Customer Account [" + workRecordDataFields.recordDetails.quote.account.CIMId + "] to Create/Update Deal", "User missing customer access"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            string iqrConsumptionCustomerPlatform = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionCustomerPlatform == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionCustomerPlatform;
            string iqrConsumptionCustomerSegment = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionCustomerSegment == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionCustomerSegment;
            string iqrConsumptionRegion = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionRegion;
            string iqrConsumptionCountry = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionCountry;
            string iqrConsumptionReportedSalesGeo = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionReportedSalesGeo == null ? "" : workRecordDataFields.recordDetails.quote.quoteLine[recordId].ConsumptionReportedSalesGeo;
            string consumptionCountryRegion = GatherConsumptionContries(iqrConsumptionRegion, iqrConsumptionCountry);
            consumptionCountryRegion = consumptionCountryRegion == null ? "" : consumptionCountryRegion;

            var isplatformchange = string.Compare(iqrConsumptionCustomerPlatform, oldmydealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_PLATFORM).AtrbValue.ToString(), StringComparison.OrdinalIgnoreCase);
            var isCustomerSegment = string.Compare(iqrConsumptionCustomerSegment, oldmydealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_SEGMENT).AtrbValue.ToString(), StringComparison.OrdinalIgnoreCase);
            var isConsumptionCountryRegion = string.Compare(consumptionCountryRegion, oldmydealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_COUNTRY_REGION).AtrbValue.ToString(), StringComparison.OrdinalIgnoreCase);
            var isConsumptionReportedSalesGeo = string.Compare(iqrConsumptionReportedSalesGeo, oldmydealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.CONSUMPTION_CUST_RPT_GEO).AtrbValue.ToString(), StringComparison.OrdinalIgnoreCase);

            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[recordId].ApprovedQuantity;  // CEILING_VOLUME
            string payableQuantity = workRecordDataFields.recordDetails.quote.quoteLine[recordId].PayableQuantity;

            // Payable Quantity - Overwrite w/ Ceiling Volume if (PQ > CV) or (PQ == NULL)
            // WIP (TWC5971-411) - CONFIRM IF NEED TO ACTUALLY CHECK FOR 'VALID' ACCOUNT (i.e. enforced)?
            if (int.TryParse(payableQuantity, out _))
            {
                int payableQuantityValue = int.Parse(payableQuantity);

                int ceilingVolumeValue = 0;
                if (int.TryParse(quantity, out _))
                {
                    ceilingVolumeValue = int.Parse(quantity);
                }
                if (payableQuantityValue > ceilingVolumeValue)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[recordId].PayableQuantity = quantity;

                    workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(726, "Deal Warning: Payable Quantity has been reduced to quantity value (Ceiling Volume) as it is not allowed to be a larger value.", "Value replaced"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                }
            }
            else if (payableQuantity == null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].PayableQuantity = "0";

                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(727, "Deal Warning: Payable Quantity has been reduced to zero as it is not allowed to be null or a negative value.", "Value replaced"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
            }

            if (workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQStatus=="Won" && (isplatformchange != 0 || isCustomerSegment != 0 || isConsumptionCountryRegion != 0 || isConsumptionReportedSalesGeo != 0))
            {
                DateTime ReDealEffectiveDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[recordId].EffectivePricingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.LAST_REDEAL_DT), ReDealEffectiveDate.ToString("MM/dd/yyyy"));
            }

            // Break out update and validate checks, then come back and do the needed saves if everything is good.
            string validErrors = "";
            if (UpdateRecordsFromSfPackets(myDealsData, workRecordDataFields, recordId, custId, folioId, psId, dealId, reRunMode, ref validErrors)) // If validation errors, log and skip to next
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(713, "Deal Validation Error : Deal " + dealId + "  had validation errors: " + validErrors, "Deal had validation errors"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }
            
            // Start the save process - No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used during create.
            ContractToken saveContractToken = new ContractToken("ContractToken Created - Save IRQ Deal Updates")
            {
                CustId = custId,
                ContractId = folioId
            };
           
            TagSaveActionsAndBatches(myDealsData); // Add needed save actions and batch IDs for the save
            MyDealsData saveResponse = myDealsData.Save(saveContractToken);

            if (myDealsData[OpDataElementType.WIP_DEAL].Actions.Any() && !saveResponse.Keys.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessUpdateRequest"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

            // Check post validation data to see if we triggered a hard or soft re-deal to set up for second save run.
            IOpDataElement OrigRedealBit = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IN_REDEAL);
            IOpDataElement OrigWfStg = myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.WF_STG_CD);
            if ((OrigRedealBit.AtrbValue.ToString() == "1" && OrigRedealBit.State == OpDataElementState.Modified)
                || (OrigWfStg.AtrbValue.ToString() == WorkFlowStages.Requested && OrigWfStg.State == OpDataElementState.Modified))
            {
                // Just did a re-deal of some form, DO A SECOND SAVE to set Submitted and update Tracker Start Date.
                // Pass mode = ReRun and dump these results into the DustBin since next run will complete them.
                string dustBin = ProcessUpdateRequest(workRecordDataFields, batchId, recordId, true, ref dealId);
            }
            else
            {
                // Update the Meet Comp data now.
                int prdMbrSid = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRODUCT_FILTER));
                string prdCat = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES);
                string MydlPdctName = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.TITLE);
                //To do meet comp DEAL_PRD_TYPE info is needed, As we dont have DEAL_PRD_TYPE data saved in mydeals data, To get the that value below line of code is used
                //for NIC,PMem,SSD >> PRD_CAT_NM(PRODUCT_CATEGORIES) and DEAL_PRD_TYPE are same and for server type products, deal prd type is  CPU
                string myDealPrdType = (prdCat.ToLower() == "dt" || prdCat.ToLower() == "mb" || prdCat.ToLower() == "svrws") ? "CPU" : prdCat;
                EnterMeetCompData(psId, dealId, prdMbrSid, MydlPdctName, prdCat, myDealPrdType, custId, workRecordDataFields, recordId);
                //gather return fields and post back to json record (things like stage and approved by fields)

                string psWfStage = saveResponse.ContainsKey(OpDataElementType.PRC_ST) ?
                    saveResponse[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD) :
                    myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD);
                string wipWfStage = saveResponse.ContainsKey(OpDataElementType.WIP_DEAL) ?
                    saveResponse[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD) :
                    myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);

                string stage = wipWfStage == WorkFlowStages.Draft ? psWfStage : wipWfStage;

                workRecordDataFields.recordDetails.quote.quoteLine[recordId].DealRFQStatus = stage;

                executionResponse += "Deal " + dealId + " - Save completed<br>";

                return executionResponse;
            }
            return null; // dustBin route, return no responses.
        }

        private string ProcessUpdateRequestShell(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string fullPackageResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                // Get OpUserToken
                OpUserToken opUserToken = setUserToken(workRecordDataFields, i, "Update");
                if (!containsError(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, UserTokenErrorCodes))
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken); // Set the user token for this record
                }
                else
                {
                    continue; // Fail and skip this record due to User Token issues
                }

                // Start Update Request Action for the current quoteline item
                fullPackageResponse += ProcessUpdateRequest(workRecordDataFields, batchId, i, false, ref dealId) + "<br><br>"; ;
            }

            return fullPackageResponse;
        }

        private string ProcessStageUpdateRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string fullPackageResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                string executionResponse = "";
                // Get OpUserToken
                OpUserToken opUserToken = setUserToken(workRecordDataFields, i, "UpdateStatus");
                if (!containsError(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, UserTokenErrorCodes))
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken); // Set the user token for this record
                }
                else
                {
                    continue; // Fail and skip this record due to User Token issues
                }

                // Start Update Stage Request Action for the current quoteline item
                bool runSaveStage = true;
                string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
                string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;

                executionResponse += "Processing stage change for [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
                int folioId = Int32.Parse(workRecordDataFields.recordDetails.quote.FolioID);
                dealId = Int32.Parse(workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId);

                // Grab the PS and Wip deal objects, this is a stage change and we need both of those levels to execute it
                List<int> passedDealIds = new List<int>() { dealId };
                MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(passedDealIds, new List<OpDataElementType> { OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()

                // Safety check for PS and WIP deal collectors, if none, then problem
                if (!myDealsData[OpDataElementType.PRC_ST].AllDataCollectors.Any() || !myDealsData[OpDataElementType.WIP_DEAL].Data.ContainsKey(dealId))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(712, "Deal Error: Couldn't find deal for this request, contact L2 suport", "Couldn't find deal " + dealId + " to update"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                    continue; // we had error on lookup, skip to next to process
                }

                //GetContract the packet data and place it on the right collector
                // Three stages to expect from TENDERS, Submitted, Won, and Lost, so check stage first and move accordingly. 
                string destinationStage = workRecordDataFields.recordDetails.quote.quoteLine[i].Status.ToLower();
                destinationStage = char.ToUpper(destinationStage[0]) + destinationStage.Substring(1); // Proper case what they send us to match out stage names
                int strategyId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
                var currentPsWfStg = myDealsData[OpDataElementType.PRC_ST].Data[strategyId].GetDataElementValue(AttributeCodes.WF_STG_CD);
                var currentWipWfStg = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);
                bool isPrimedCust = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer;
                string endCustomer = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.END_CUSTOMER_RETAIL);
                string endCustomerCountry = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.PRIMED_CUST_CNTRY);
                string isMyDealsUnified = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.IS_PRIMED_CUST);
                string unifiedEndCustomer = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName == null? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName;
                string IQRprimedCustomerL1Id = workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId;
                string IQRRPLStatusCode = workRecordDataFields.recordDetails.quote.ComplianceWatchList;
                string endCustomerObject = null;
                switch (destinationStage)
                {
                    case "Requested":
                        if (currentPsWfStg == WorkFlowStages.Draft || currentPsWfStg == WorkFlowStages.Submitted)
                        {
                            myDealsData[OpDataElementType.PRC_ST].Data[strategyId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Requested);
                            myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.PS_WF_STG_CD, WorkFlowStages.Requested);
                        }
                        break;
                    case "Submitted": // Tenders Create New Deals request
                        if (currentPsWfStg == WorkFlowStages.Requested)
                        {
                            myDealsData[OpDataElementType.PRC_ST].Data[strategyId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Submitted);
                            myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.PS_WF_STG_CD, WorkFlowStages.Submitted);
                        }
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(720, "Deal Stage Error: Stage change to " + destinationStage + " failed, current deal stage is " + currentPsWfStg, "Deal Stage Error"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                        break;
                    case "Won":
                    case "Lost":
                        if (currentWipWfStg == WorkFlowStages.Offer)
                        //if (currentWipWfStg == WorkFlowStages.Offer && isPrimedCust) //Bring it in when Mahesh comes back
                        {
                            myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.WF_STG_CD,
                                destinationStage == WorkFlowStages.Won ? WorkFlowStages.Won : WorkFlowStages.Lost);
                            if (destinationStage == WorkFlowStages.Won && isPrimedCust && isMyDealsUnified != "1")
                            {
                                DataTable primedCustomerData = new DataTable();
                                try
                                {
                                    string UnifiedEndCustomerLvl2Name = (workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != null && workRecordDataFields.recordDetails.quote.UnifiedEndCustomer != "") ? workRecordDataFields.recordDetails.quote.UnifiedEndCustomer : workRecordDataFields.recordDetails.quote.UnifiedEndCustomerGlobalName.ToString();

                                    primedCustomerData = _primeCustomerLib.InsertPrimedCustomerData(endCustomer, workRecordDataFields.recordDetails.quote.EndCustomerCountry, unifiedEndCustomer, Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId), Convert.ToInt32(workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId), workRecordDataFields.recordDetails.quote.ComplianceWatchList, UnifiedEndCustomerLvl2Name, 99999999);
                                }
                                catch
                                {
                                    //continue the flow;
                                }
                                List<EndCustomer> endCustData = new List<EndCustomer>();
                                if (primedCustomerData != null && primedCustomerData.Rows.Count != 0)
                                {

                                    endCustData.Add(new EndCustomer
                                    {
                                        END_CUSTOMER_RETAIL = endCustomer,
                                        PRIMED_CUST_CNTRY = workRecordDataFields.recordDetails.quote.EndCustomerCountry,
                                        IS_EXCLUDE = "0",
                                        IS_PRIMED_CUST = "1",
                                        PRIMED_CUST_ID = IQRprimedCustomerL1Id,
                                        RPL_STS_CD = workRecordDataFields.recordDetails.quote.ComplianceWatchList,
                                        IS_RPL = "0",
                                        PRIMED_CUST_NM = unifiedEndCustomer
                                    });


                                }
                                else
                                {
                                    endCustData.Add(new EndCustomer
                                    {
                                        END_CUSTOMER_RETAIL = endCustomer,
                                        PRIMED_CUST_CNTRY = endCustomerCountry,
                                        IS_EXCLUDE = "0",
                                        IS_PRIMED_CUST = "1",
                                        PRIMED_CUST_ID = IQRprimedCustomerL1Id,
                                        RPL_STS_CD = IQRRPLStatusCode,
                                        IS_RPL = "0",
                                        PRIMED_CUST_NM = unifiedEndCustomer
                                    });
                                }
                                endCustomerObject = JsonConvert.SerializeObject(endCustData);

                                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.IS_PRIMED_CUST, "1");
                                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.PRIMED_CUST_ID, IQRprimedCustomerL1Id);
                                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.PRIMED_CUST_NM, unifiedEndCustomer);
                                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.IS_RPL, "0");
                                myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.END_CUST_OBJ, endCustomerObject);
                            }
                        }
                        else if ((currentWipWfStg == WorkFlowStages.Won && destinationStage == WorkFlowStages.Won) ||
                           (currentWipWfStg == WorkFlowStages.Lost && destinationStage == WorkFlowStages.Lost))
                        {
                            // Case of re-deal from one stage autoapproving back to one, IQR doesn't do this and instead sends us a stage change to WON, 
                            // we are already there, so ignore, but don't toss an error.
                            runSaveStage = false;
                        }
                        else if (isPrimedCust == false)
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(722, "Deal Stage Error: End Customer is not Unified.", "Deal Stage Error"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;

                        }
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(720, "Deal Stage Error: Stage change to " + destinationStage + " failed, current deal stage is " + currentWipWfStg, "Deal Stage Error"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                        break;
                    case "Approved":
                        if (currentWipWfStg == WorkFlowStages.Lost)
                        {
                            myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Offer);
                            destinationStage = "Offer";
                        }
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(720, "Deal Stage Error: Stage change to Offer failed, current deal stage is " + currentWipWfStg, "Deal Stage Error"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                        break;
                    // Place lost to offer here as else if IRQ decides they want it
                    case "Cancelled":
                        // Send back both Strategy and Wip level cancels - the WIP one is the one that counts, but let's ensure it goes through.
                        // TODO: Put in data limits here if business decides to truncate the deals
                        myDealsData[OpDataElementType.PRC_ST].Data[strategyId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Cancelled);
                        myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Cancelled);
                        myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.PS_WF_STG_CD, WorkFlowStages.Cancelled);                        
                        DateTime approvedEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                        DateTime billingEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[i].BillingEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
                        myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementsValue(AttributeCodes.END_DT, approvedEndDate.ToString("MM/dd/yyyy"));
                        myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementsValue(AttributeCodes.REBATE_BILLING_END, billingEndDate.ToString("MM/dd/yyyy"));
                        break;
                }

                if (runSaveStage)
                {
                    int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));

                    // Using this to allow us to dive right into rules engines
                    SavePacket savePacket = new SavePacket()
                    {
                        MyContractToken = new ContractToken("ContractToken Created - SaveFullContract")
                        {
                            CustId = custId,
                            ContractId = folioId,
                            DeleteAllPTR = false
                        },
                        ValidateIds = new List<int> { dealId }
                    };


                    // Check for any validation errors, and if found, log and skip to next record
                    if (myDealsData.ValidationApplyRules(savePacket))
                    {
                        string validErrors = "";
                        foreach (OpDataElementType dpKey in myDealsData.Keys) // dpKey is like OpDataElementType.WIP_DEAL
                        {
                            foreach (OpDataCollector dc in myDealsData[dpKey].AllDataCollectors)
                            {
                                dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, myDealsData);
                                foreach (OpMsg opMsg in dc.Message.Messages)
                                {
                                    if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0 ? "[" + dpKey + "] " + opMsg.Message : "; " + "[" + dpKey + "] " + opMsg.Message;
                                }
                            }
                        }

                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(713, "Deal Validation Error : Deal " + dealId + "  had validation errors: " + validErrors, "Deal had validation errors"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }

                    // No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used during create.
                    ContractToken saveContractToken = new ContractToken("ContractToken Created - Save IRQ Deal Stage Change")
                    {
                        CustId = custId,
                        ContractId = folioId
                    };

                    TagSaveActionsAndBatches(myDealsData); // Add needed save actions and batch IDs for the save
                    MyDealsData saveResponse = myDealsData.Save(saveContractToken);

                    if (!saveResponse.Keys.Any())
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Failed DB Call, ProcessStageUpdateRequest"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }
                }

                // If we want to reflect data to object, walk through return sets and save to workRecordDataFields.recordDetails.quote.quoteLine[i] fields - if (saveResponse.ContainsKey(OpDataElementType.WIP_DEAL))
                // In this case, I am just blindly setting the response stage since the save completed

                workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQStatus = destinationStage;

                executionResponse += "Deal " + dealId + " - Stage Update completed<br>";
                fullPackageResponse += executionResponse + "<br><br>";
            }

            return fullPackageResponse;
        }

        public string ExecuteSalesForceTenderData(Guid workId)
        {
            List<string> goodRequestTypes = new List<string> { "Create", "Update", "UpdateStatus", "Delete","Rollback" };
            string executionResponse = "";

            List<TenderTransferObject> tenderStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS", workId);

            if (tenderStagedWorkRecords.Count == 0) executionResponse += "There are no records to process<br>";

            foreach (TenderTransferObject workRecord in tenderStagedWorkRecords.OrderBy(a => a.RqstSid))  // Grab all of the items that need to be processed
            {
                bool goodOperationFlag = true;
                TenderTransferRootObject workRecordDataFields = JsonConvert.DeserializeObject<TenderTransferRootObject>(workRecord.RqstJsonData);

                // Read Headers and create error blocks for each child
                string requestType = workRecordDataFields.header.action;
                for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
                }

                if (!goodRequestTypes.Contains(requestType)) // Tag all records below as having a bad header and quit...
                {
                    for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error.  Please contact My Deals Support", "Passed action code [" + requestType + "] is not valid"));
                    }
                    goodOperationFlag = false;
                }

                Guid batchId = workRecord.BtchId;
                int dealId = -1;

                if (goodOperationFlag)
                {
                    switch (requestType)
                    {
                        case "Create": // Tenders Create New Deals request
                            executionResponse += ProcessCreationRequest(workRecordDataFields, batchId, ref dealId);
                            break;
                        case "Update":
                            executionResponse += ProcessUpdateRequestShell(workRecordDataFields, batchId, ref dealId);
                            break;
                        case "UpdateStatus":
                            executionResponse += ProcessStageUpdateRequest(workRecordDataFields, batchId, ref dealId);
                            break;
                        case "Delete":
                            executionResponse += ProcessDeleteRequestShell(workRecordDataFields, batchId, ref dealId);
                            break;
                        case "Rollback":
                            executionResponse += ProcessRollbackRequestShell(workRecordDataFields, batchId, ref dealId);
                            break;
                        default:
                            break;
                    }
                }

                // Process the response message now
                workRecordDataFields.header.source_system = "MyDeals";
                workRecordDataFields.header.target_system = "Tender";
                workRecordDataFields.header.action = requestType;

                string jsonData = JsonConvert.SerializeObject(workRecordDataFields);
                List<int> deadIdList = new List<int>() { dealId };
                Guid saveSuccessful = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS_RESPONSE", deadIdList, jsonData);

                if (saveSuccessful != Guid.Empty
                ) // Then we can close out the processing record and go for an immediate send back
                {
                    _jmsDataLib.UpdateTendersStage(workRecord.BtchId, "PO_Processing_Complete", deadIdList);
                    executionResponse += "Successful, response object created (" + saveSuccessful + ")<br>";
                }
                // Attempt to close out response now

                bool saveSuccessfulReturnToTenders = _jmsDataLib.PublishBackToSfTenders(jsonData);

                if (saveSuccessfulReturnToTenders != true) continue; // Couldn't return data to tenders, skip close out of safety record.
                _jmsDataLib.UpdateTendersStage(saveSuccessful, "PO_Processing_Complete", deadIdList);
                executionResponse += "Response object successfully returned<br><br>";
                //executionResponse += jsonData + "<br>";
            }

            return executionResponse;
        }

        public string ReturnSalesForceTenderResults() // Bulk processing of Tenders Responses - Send back to MuleSoft
        {
            string executionResponse = "";

            List<TenderTransferObject> returnStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS_RESPONSE", Guid.Empty);

            if (returnStagedWorkRecords.Count == 0) executionResponse += "There are no records to process<br>";

            foreach (TenderTransferObject workRecord in returnStagedWorkRecords.OrderBy(a => a.RqstSid))
            {
                bool saveSuccessfulReturnToTenders = _jmsDataLib.PublishBackToSfTenders(workRecord.RqstJsonData);

                if (saveSuccessfulReturnToTenders == true) // The return data has been sent back to tenders, close out our safety record
                {
                    _jmsDataLib.UpdateTendersStage(workRecord.BtchId, "PO_Processing_Complete", new List<int>() { workRecord.DealId });
                    executionResponse += "Response object [" + workRecord.BtchId + "] successfully returned<br>";
                }
            }

            return executionResponse;
        }

        public string MuleSoftReturnTenderStatus(string xid, string retStatus) // This one is by XID from inside JSON
        {
            string executionResponse = "";

            if (retStatus == "SUCCESS")
            {
                // PO_Send_Completed - all paths should stop here unless we decide to only report errors from Mule, then we end at PO_Processing_Complete
                // and only do updates on errors to raise it to our attention..  If assumed pass/no change, this is an ignore step.
                executionResponse += "Response object xid [" + xid + "] successfully returned<br>";
            }
            else // assume all others are fails
            {
                // Fetch the data we need to update by XID
                TenderXidObject xidObj = _jmsDataLib.FetchTendersReturnByXid(xid);
                executionResponse = MuleSoftReturnTenderStatusByGuid(xidObj.btchGuid, retStatus, xidObj.dealId);
                // Place e-mail updates or Mule re-trigger calls here if needed
            }

            return executionResponse;
        }

        public string MuleSoftReturnTenderStatusByGuid(Guid btchId, string retStatus, int dealId) // This one is by GUID for Admin Direct calls against SQL lines
        {
            string executionResponse = "";

            if (retStatus == "SUCCESS")
            {
                _jmsDataLib.UpdateTendersStage(btchId, "PO_Processing_Complete", new List<int>() { dealId });
                executionResponse += "Response object batch id  [" + btchId + "] successfully returned<br>";
            }
            else // assume all others are fails
            {
                _jmsDataLib.UpdateTendersStage(btchId, "PO_Error_Resend", new List<int>() { dealId });
                executionResponse += "Response object batch id [" + btchId + "] successfully returned<br>";
            }

            return executionResponse;
        }

        //ReTriggerMuleSoftByXid(xid)
        public string ReTriggerMuleSoftByXid(string xid) // This is a request back to MuleSoft to re-try on an already send packet by XID
        {
            string executionResponse = "";

            string eventTriggered = _jmsDataLib.ReTriggerMulePacket(xid) ? "SUCCESSFUL" : "FAILED";
            executionResponse += "MuleSoft re-trigger for [" + xid + "] results: " + eventTriggered;

            return executionResponse;
        }

        public string IqrFetchCapData(TenderCapRequestObject jsonDataPacket) // Fetch CAP data for Customer/Product/Dates for IQR
        {
            string custCimId = jsonDataPacket.CustomerCIMId; // empty string still returns Dell ID
            int custId = _jmsDataLib.FetchCustFromCimId(custCimId); // set the customer ID based on Customer CIM ID

            if (custCimId == "" || custId == 0) // Need to have a working customer for this request and failed, skip!
            {
                return "ERROR: Failed on CIM ID Lookup"; // Bail out - no customers matched
            }


            string productEpmId = jsonDataPacket.ProductNameEPMID; // For lookup
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;
            //PR_MYDL_PRD_PCSR_EPM_MAP_DTL proc modified to give the product details for new product types.As part of that SP change, To make sure nothing breaks and work as expected,Added these additional parameters("Server", null,null). 
            ProductEpmObject productLookupObj = _jmsDataLib.FetchProdFromProcessorEpmMap(epmId, "Server", null, null);

            if (productLookupObj?.MydlPdctName == String.Empty || productLookupObj?.PdctNbrSid == 0)
            {
                return "ERROR: Failed on EPM ID Lookup"; // Bail out - no products matched
            }
            int PdctNbrSid = productLookupObj.PdctNbrSid;

            DateTime dealStartDate = DateTime.ParseExact(jsonDataPacket.RangeStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime dealEndDate = DateTime.ParseExact(jsonDataPacket.RangeEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format

            ProductsLib pl = new ProductsLib();
            string geoCombined = jsonDataPacket.Region != "APJ" ? jsonDataPacket.Region : "APAC,IJKK";

            ProductCAPYCS2Calc pCap = new ProductCAPYCS2Calc();
            pCap.PRD_MBR_SID = PdctNbrSid;
            pCap.CUST_MBR_SID = custId;
            pCap.GEO_MBR_SID = geoCombined;
            pCap.DEAL_STRT_DT = dealStartDate;
            pCap.DEAL_END_DT = dealEndDate;

            List<ProductCAPYCS2Calc> lpCap = new List<ProductCAPYCS2Calc>();
            lpCap.Add(pCap);

            //var opt = pl.GetCAPForProduct(PdctNbrSid, custId, geoCombined, dealStartDate, dealEndDate);
            List<ProductCAPYCS2> opt = pl.GetProductCAPYCS2Data(lpCap, "N", "CAP_PA");

            string returnData = JsonConvert.SerializeObject(opt, Formatting.None);
            if (opt.Count < 1) return "ERROR: No Records Returned";

            // Might have to remove /" and replace with "
            return returnData;
        }


        public void UpdateUnifiedEndCustomer(int CntrctId, string saleForceId, string primeCustomerName, string primeCustomerCountry)
        {
            EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(primeCustomerName, primeCustomerCountry, "");

            var sendToIqr = new TenderTransferRootObject
            {
                header = new TenderTransferRootObject.Header(),
                recordDetails = new TenderTransferRootObject.RecordDetails
                {
                    quote = new TenderTransferRootObject.RecordDetails.Quote { }

                }
            };
            sendToIqr.header.xid = Guid.NewGuid().ToString();
            sendToIqr.header.source_system = "MyDeals";
            sendToIqr.header.target_system = "Tender";
            sendToIqr.header.action = "UnifiedEndCustomerUpdate";
            sendToIqr.recordDetails.quote.Id = saleForceId;
            sendToIqr.recordDetails.quote.FolioID = CntrctId.ToString();
            sendToIqr.recordDetails.quote.EndCustomer = primeCustomerName;
            sendToIqr.recordDetails.quote.EndCustomerCountry = primeCustomerCountry;
            sendToIqr.recordDetails.quote.UnifiedEndCustomer = endCustObj.UnifiedEndCustomer;
            sendToIqr.recordDetails.quote.UnifiedEndCustomerId = endCustObj.UnifiedEndCustomerId.ToString();
            sendToIqr.recordDetails.quote.UnifiedCountryEndCustomerId = endCustObj.UnifiedCountryEndCustomerId.ToString();
            sendToIqr.recordDetails.quote.IsUnifiedEndCustomer = endCustObj.IsUnifiedEndCustomer == 1 ? true : false;

            string jsonData = JsonConvert.SerializeObject(sendToIqr);


            Guid saveSuccessful = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS_RESPONSE", new List<int>() { CntrctId }, jsonData);

            if (saveSuccessful != Guid.Empty)
            {
                if (_jmsDataLib.PublishBackToSfTenders(jsonData) == true)
                    _jmsDataLib.UpdateTendersStage(saveSuccessful, "PO_Processing_Complete", new List<int>() { CntrctId });
            }
        }

        #endregion IQR CREATE TENDERS DEAL

    }
}