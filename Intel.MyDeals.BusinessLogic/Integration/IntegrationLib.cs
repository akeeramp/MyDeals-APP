extern alias opaqueTools;
using System;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Intel.MyDeals.BusinessRules;

namespace Intel.MyDeals.BusinessLogic
{
    public class IntegrationLib: IIntegrationLib
    {
        private readonly IJmsDataLib _jmsDataLib; // change out later to IntegrationDataLib
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly IPrimeCustomersDataLib _primeCustomerLib;     

        public IntegrationLib(IJmsDataLib jmsDataLib, IOpDataCollectorLib dataCollectorLib, IPrimeCustomersDataLib primeCustomerLib)
        {
            _jmsDataLib = jmsDataLib;
            _dataCollectorLib = dataCollectorLib;
            _primeCustomerLib = primeCustomerLib;
        }

        public void TestAsyncProcess(Guid myGuid)
        {
            var task = new Task(() =>
            {
                Thread.Sleep(1000);
                string blah = ExecuteSalesForceTenderData(myGuid);
                int j = 1;
            });

            task.Start();
        }

        public Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket)
        {
            Guid myGuid = Guid.Empty;

            List<int> deadIdList = new List<int>() { -100 };

            string jsonData = JsonConvert.SerializeObject(jsonDataPacket, Formatting.Indented);

            // Insert into the stage table here - one deal item (-100 id as new item), one deal data object
            myGuid = _jmsDataLib.SaveTendersDataToStage("TENDER_DEALS", deadIdList, jsonData);

            TestAsyncProcess(myGuid);

            return myGuid;
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

        private int ProcessSalesForceContractInformation(int contractId, string contractSfId, int custId, TenderTransferRootObject workRecordDataFields)
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

                workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(713, "Folio Validation Error : Folio had validation errors: " + validErrors, "Folio had validation errors"));
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
                workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, ProcessSalesForceContractInformation"));
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

        private ProdMappings TranslateIQRProducts(ProductEpmObject epmProduct, int epmId, int custId, string geoCombined, DateTime strtDt, DateTime endDt, 
            ref List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrorResponse)          
        {
            ProdMappings returnedProducts = new ProdMappings();
            PRD_LOOKUP_RESULTS prd = new PRD_LOOKUP_RESULTS();
            prd.PRD_MBR_SID = epmProduct.PcsrNbrSid; 
            List<PRD_LOOKUP_RESULTS> temp_products = new List<PRD_LOOKUP_RESULTS>();
            temp_products.Add(prd);
            
            ProductsLib pl = new ProductsLib();

            var result = pl.GetProductAttributes(temp_products);
            if (result != null && result.Count == 1)
            {
                var opt = pl.GetCAPForProduct(epmProduct.PcsrNbrSid, custId, geoCombined, strtDt, endDt);
                
                if(opt.Count == 1)
                {
                    if (opt[0].CAP == "No CAP")
                    {
                        // Decide if we toss this back as error or allow create
                    }

                    result[0].USR_INPUT = result[0].HIER_NM_HASH;
                    result[0].DERIVED_USR_INPUT = result[0].HIER_NM_HASH;
                    result[0].CAP = opt[0].CAP;
                    result[0].CAP_START = opt[0].CAP_START;
                    result[0].CAP_END = opt[0].CAP_END;
                    result[0].YCS2 = opt[0].YCS2;
                    result[0].YCS2_START = opt[0].YCS2_START;
                    result[0].YCS2_END = opt[0].YCS2_END;
                    
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
                        MM_MEDIA_CD = row.MM_MEDIA_CD == null? "All": row.MM_MEDIA_CD,
                        PRD_CAT_NM = row.PRD_CAT_NM,
                        PRD_END_DTM = row.PRD_END_DTM.ToString("MM/dd/yyyy"),
                        PRD_MBR_SID = row.PRD_MBR_SID.ToString(),
                        PRD_STRT_DTM = row.PRD_STRT_DTM.ToString("MM/dd/yyyy"),
                        YCS2 = row.YCS2,
                        YCS2_END = row.YCS2_END.ToString("MM/dd/yyyy"),
                        YCS2_START = row.YCS2_START.ToString("MM/dd/yyyy"),
                        EXCLUDE = false
                    }))
                    {
                        returnedProducts.Add(result[0].HIER_VAL_NM, new[] { newItem }); //result[0].HIER_NM_HASH
                    }
                }
                else
                {
                    //Error Handling CODE for CAP Missing
                    productErrorResponse.Add(AppendError(703, "Product error: CAP not Available error for EPM Id [" + epmId + "]. Please contact L2 Support", "CAP not found"));
                }
            }
            else
            {
                //Error Handling CODE Product Not FOUND
                productErrorResponse.Add(AppendError(702, "Product error: No valid products matched, for EPM Id [" + epmId + "]. Please contact L2 Support", "No valid products found"));
            }

            return returnedProducts;
        }

        private void EnterMeetCompData(int strategyId, int dealId, int prdId, string usrInputProd, string myPrdCat, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
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
                DEAL_PRD_TYPE = "CPU",
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
                DEAL_PRD_TYPE = "CPU",
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
                meetCompResult = _meetCompLib.UpdateMeetCompProductDetails(strategyId, OpDataElementType.PRC_ST.ToId(), mcu);

                if (meetCompResult == null || meetCompResult.Count == 0) // 0 records returned for product dimension not being set correctly causing mismatch meet comp save result
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "Unable to push to next stage. Work with your DA to review PCT/MCT", "Saving Meet Comp data failed"));
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
            string primedCustomerL1Id = null;
            string primedCustomerL2Id = null;
            string primedCustName = null;
            string customer = null;
            string gaWwid = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Wwid;
            string endCustomer = workRecordDataFields.recordDetails.quote.EndCustomer;
            string unifiedEndCustomer = workRecordDataFields.recordDetails.quote.UnifiedEndCustomer;
            string endCustomerCountry = workRecordDataFields.recordDetails.quote.EndCustomerCountry;
            string projectName = workRecordDataFields.recordDetails.quote.ProjectName;
            string serverDealType = workRecordDataFields.recordDetails.quote.ServerDealType;
            string geoCombined = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Region != "APJ"? workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Region: "APAC,IJKK";
            string qltrBidGeo = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].EndCustomerRegion != "APJ" ? workRecordDataFields.recordDetails.quote.quoteLine[currentRec].EndCustomerRegion : "APAC,IJKK";
            string dealType = workRecordDataFields.recordDetails.quote.DealType;
            // Embedded Array Items
            DateTime dealStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime dealEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BillingStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BillingEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            string terms = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].AdditionalTandC;
            string excludeAutomationFlag = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ExcludeAutomation? "Yes": "No";
            string quoteLineId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Name;
            string quoteLineNumber = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].QuoteLineNumber;
            string groupType = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].GroupType;
            string marketSegment = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].MarketSegment;
            marketSegment = marketSegment.Replace(";", ", ");
            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedECAPPrice;
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedQuantity;
            string userEnteredProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Name;
            string productEpmId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductNameEPMID; // For lookup
            string dealDescription = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealDescription == null ? "": workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealDescription;
            // Safety setting back date reason in case we need it and they don't send it...
            string backdateReason = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason != "" ?
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason :
                "Contract Negotiation Delay";

            #region Product Check and translation
            // Use the MyTranslatedProduct function and expect null if no product is matched
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;

            ProductEpmObject productLookupObj = _jmsDataLib.FetchProdFromProcessorEpmMap(epmId);

            if (productLookupObj?.MydlPcsrNbr == String.Empty || productLookupObj?.PcsrNbrSid == 0)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product error: No valid products matched, for EPM Id [" + epmId + "]. Please contact L2 Support", "Product EMP ID not found"));
                return initWipId; // Bail out - no products matched
            }
            
            List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrors = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
            //GET Product JSON by PRD_MBR_SID
            ProdMappings myTranslatedProduct = TranslateIQRProducts(productLookupObj, epmId, custId, geoCombined, dealStartDate, dealEndDate, ref productErrors);
            if (productErrors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.AddRange(productErrors);
                return initWipId;  // Bail out of this deal creation since it is missing critical field and errors have already been appended
            }

            string translatedValidProductJson = JsonConvert.SerializeObject(myTranslatedProduct);
            ProdMapping singleProduct = myTranslatedProduct[productLookupObj.MydlPcsrNbr].FirstOrDefault();

            int myPrdMbrSid = singleProduct != null ? ToInt32(singleProduct.PRD_MBR_SID) : 0;
            string myPrdCat = singleProduct != null ? singleProduct.PRD_CAT_NM : "";
            // Future MM_MEDIA_CD add from IQR here.  First check what they pass and apply it, but if empty, apply the below.  If they pass one, ensure that a chile below contains what they pass.
            string singleMedia = singleProduct != null ? singleProduct.MM_MEDIA_CD.Contains(",") ? "All" : singleProduct.MM_MEDIA_CD: ""; //singleProduct?.MM_MEDIA_CD
            #endregion Product Check

            #region Deal Stability Check
            if (geoCombined == null || geoCombined == "" || ecapPrice == "" || dealStartDate == null || dealEndDate == null || billingStartDate == null || billingEndDate == null ||
                dealType == "" || groupType == "" || marketSegment == "")
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(714, "Deal Error: failed to create the Tender Deal due to missing expected fields {Fields}", "Missing expected fields"));
                return initWipId;
            }
            #endregion Deal Stability Check

            //Prime Customer Information 
            if (endCustomer != null && endCustomer != "") customer = endCustomer;
            else customer = unifiedEndCustomer;
            if (customer.ToUpper() != "ANY")
            {
                EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(customer, endCustomerCountry);
                isPrimedCustomer = endCustObj.IsUnifiedEndCustomer.ToString();
                primedCustomerL1Id = endCustObj.UnifiedEndCustomerId.ToString();
                primedCustomerL2Id = endCustObj.UnifiedCountryEndCustomerId.ToString();
                if ((endCustomer == null || endCustomer == "") && (unifiedEndCustomer != null && unifiedEndCustomer != ""))
                    primedCustName = unifiedEndCustomer;
                else
                    primedCustName = endCustObj.UnifiedEndCustomer;
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(723, "End Customer Error: Any is not a valid End Customer selection for IQR Tenders", "End Customer is not allowed"));
            }

            MyCustomersInformation requestedCustomerInfo = LookupCustomerInformation(custId);
            MyCustomersInformation singleCustomer = new CustomerLib().GetMyCustomerNames().FirstOrDefault(c => c.CUST_SID == custId);

            if (requestedCustomerInfo == null)
            {
                string idsid = OpUserStack.MyOpUserToken != null?  OpUserStack.MyOpUserToken.Usr.Idsid : "";
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
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(707, "Cash Settlement Level requires Settlement Partner to be defined for " + requestedCustomerInfo.CUST_NM + ".  Contact Mydeals Support", "Invalid Customer Setup"));
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
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PTR_USER_PRD), productLookupObj.MydlPcsrNbr);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PTR_SYS_PRD), translatedValidProductJson); // Json representation of Product
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.SERVER_DEAL_TYPE), serverDealType);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.QLTR_BID_GEO), qltrBidGeo);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[initPtrId].GetDataElement(AttributeCodes.PERIOD_PROFILE), "Bi-Weekly (2 weeks)");
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
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.TITLE), productLookupObj.MydlPcsrNbr); // Echo out user product name
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.REBATE_TYPE), "TENDER");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.SALESFORCE_ID), dealSfId);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PAYOUT_BASED_ON), "Consumption");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.MRKT_SEG), marketSegment);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PROGRAM_PAYMENT), "Backend");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.GEO_COMBINED), geoCombined);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PROD_INCLDS), singleMedia); // From PTR_SYS_PRD single Product
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.CUST_MBR_SID), custId.ToString());
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.START_DT), dealStartDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.END_DT), dealEndDate.ToString("MM/dd/yyyy"));
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), customer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.IS_PRIMED_CUST), isPrimedCustomer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_ID), primedCustomerL1Id);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_NM), primedCustName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY), endCustomerCountry);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PTR_USER_PRD), productLookupObj.MydlPcsrNbr);
            UpdateProductDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PRODUCT_FILTER), myPrdMbrSid.ToString(), myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId]);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.SERVER_DEAL_TYPE), serverDealType);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.QLTR_PROJECT), projectName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.QLTR_BID_GEO), qltrBidGeo);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[initWipId].GetDataElement(AttributeCodes.PERIOD_PROFILE), "Bi-Weekly (2 weeks)");
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
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, ProcessSalesForceDealInformation"));
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

            workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer = isPrimedCustomer == "1" ? "True" : "False"; ;
            workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId = primedCustomerL1Id;
            workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId = primedCustomerL2Id;
            workRecordDataFields.recordDetails.quote.UnifiedEndCustomer = primedCustName;

            // Update the Meet Comp data now.
            EnterMeetCompData(contPsId, wipDealId, myPrdMbrSid, productLookupObj.MydlPcsrNbr, myPrdCat, custId,
                workRecordDataFields, currentRec);

            // TODO: POTENTIALLY PLACE APRV_AUDIT CALL HERE

            return wipDealId;
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

        private string ProcessCreationRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, string idsid, ref int dealId)
        {
            string executionResponse = "";

            // Walk through deal records now
            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
                string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;
                string custCimId = workRecordDataFields.recordDetails.quote.account.CIMId; // empty string still returns Dell ID

                // TODO: Do a record stability check first and if no error messages, continue, catch things like ECAP/GEO/ETC

                executionResponse += "Processing [" + batchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
                int custId = _jmsDataLib.FetchCustFromCimId(custCimId); // set the customer ID based on Customer CIM ID

                if (custId == 0) // Need to have a working customer for this request and failed, skip!
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(701, "Customer error: Unable to find the customer with CIMId {" + custCimId + "}. Contact Mydeals Support Invalid Customer", "Invalid Customer"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, 0, dealId);
                    continue;
                }

                List<TendersSFIDCheck> sfToMydlIds = _jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal, custId);
                if (sfToMydlIds == null)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, SF ID lookup Error"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, -1, dealId);
                    continue; // we had error on lookup, skip to next to process
                }
                while (sfToMydlIds[0].Cntrct_SID <= 0) // Add in SF_ID blocked loop to fire this event until we get a proper item back, only bail on DB errors
                {
                    System.Threading.Thread.Sleep(5000);
                    sfToMydlIds = _jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal, custId);

                    if (sfToMydlIds == null)
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, SF ID lookup Error"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, -1, dealId);
                        continue; // we had error on lookup, skip to next to process
                    }
                }

                int folioId = sfToMydlIds[0].Cntrct_SID;
                dealId = sfToMydlIds[0].Wip_SID;

                // Step 2 - Update the contract header if needed
                folioId = ProcessSalesForceContractInformation(folioId, salesForceIdCntrct, custId, workRecordDataFields);
                workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();

                if (folioId <= 0)  // Needed to create a new Folio for this request and failed, skip!
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed to create the Tender Folio"));
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
            } // End of quote lines loop

            return executionResponse;
        }

        private string ProcessDeleteRequestShell(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            // This was shelled out to support updating single lines from a create path as per Mahesh request.
            string executionResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                executionResponse += ProcessDeleteRequest(workRecordDataFields, batchId, i, ref dealId);
            }

            return executionResponse;
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
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, ProcessDeleteRequest"));
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
                    myDealsData[objKey].AddSaveActions();
                    if (objKey == OpDataElementType.PRC_ST)
                    {
                        List<int> auditIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        if (auditIds.Any()) myDealsData[objKey].AddAuditActions(auditIds);
                    }
                    if (objKey == OpDataElementType.WIP_DEAL)
                    {
                        List<int> possibleIds = myDealsData[objKey].AllDataCollectors.Where(d => d.DcID > 0).Select(d => d.DcID).ToList();
                        myDealsData[objKey].AddSyncActions(null, possibleIds, DataCollections.GetAttributeData());
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
            string unifiedEndCustomer = workRecordDataFields.recordDetails.quote.UnifiedEndCustomer;
            string customer = null;
            if (endCustomer != null && endCustomer != "") customer = endCustomer;
            else customer = unifiedEndCustomer;
   
            if (customer.ToUpper() != "ANY")
            {
                
                EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(customer, endCustomerCountry);
                 isPrimedCustomer = endCustObj.IsUnifiedEndCustomer.ToString();
                 primedCustomerL1Id = endCustObj.UnifiedEndCustomerId.ToString();
                 primedCustomerL2Id = endCustObj.UnifiedCountryEndCustomerId.ToString();
                if ((endCustomer == null || endCustomer == "") && (unifiedEndCustomer!=null && unifiedEndCustomer!=""))
                    primedCustName = unifiedEndCustomer;
                else
                    primedCustName = endCustObj.UnifiedEndCustomer;
            }
            else
            {
                workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(723, "End Customer Error: Any is not a valid End Customer selection for IQR Tenders", "End Customer is not allowed"));
            }
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), customer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.IS_PRIMED_CUST), isPrimedCustomer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_ID), primedCustomerL1Id);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_NM), primedCustName);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.PRIMED_CUST_CNTRY), endCustomerCountry);
            // We have a record back, so let's update IQR with priming data
            workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer = isPrimedCustomer == "1" ? "True" : "False";
            workRecordDataFields.recordDetails.quote.UnifiedEndCustomerId= primedCustomerL1Id;
            workRecordDataFields.recordDetails.quote.UnifiedCountryEndCustomerId = primedCustomerL2Id;
            workRecordDataFields.recordDetails.quote.UnifiedEndCustomer = primedCustName;

            string projectName = workRecordDataFields.recordDetails.quote.ProjectName;
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

            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedECAPPrice;
            // Will need to add dimensions down the road
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.ECAP_PRICE), ecapPrice);

            // Volume Updates
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[i].ApprovedQuantity;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.VOLUME), quantity);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.VOLUME), quantity);

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
            SavePacket savePacket = new SavePacket() { 
                MyContractToken = new ContractToken("ContractToken Created - SaveFullContract")
                {
                    CustId = custId,
                    ContractId = folioId
                }, 
                ValidateIds = new List<int> { dealId } };

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
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, ProcessUpdateRequest"));
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
                string mydlPcsrNbr = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.TITLE);

                EnterMeetCompData(psId, dealId, prdMbrSid, mydlPcsrNbr, prdCat, custId, workRecordDataFields, recordId);
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
            // This was shelled out to support updating single lines from a create path as per Mahesh request.
            string executionResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                executionResponse += ProcessUpdateRequest(workRecordDataFields, batchId, i, false, ref dealId);
            }

            return executionResponse;
        }

        private string ProcessStageUpdateRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string executionResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
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
                bool isPrimedCust = workRecordDataFields.recordDetails.quote.IsUnifiedEndCustomer.ToUpper() == "TRUE" ? true : false;
                switch (destinationStage)
                {
                    case "Submitted": // Tenders Create New Deals request
                        if (currentPsWfStg == WorkFlowStages.Requested)
                        {
                            myDealsData[OpDataElementType.PRC_ST].Data[strategyId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Submitted);
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
                        }
                        else if (currentWipWfStg == WorkFlowStages.Won && destinationStage == WorkFlowStages.Won)
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
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Failed DB Call, ProcessStageUpdateRequest"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }
                }

                // If we want to reflect data to object, walk through return sets and save to workRecordDataFields.recordDetails.quote.quoteLine[i] fields - if (saveResponse.ContainsKey(OpDataElementType.WIP_DEAL))
                // In this case, I am just blindly setting the response stage since the save completed

                workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQStatus = destinationStage;

                executionResponse += "Deal " + dealId + " - Stage Update completed<br>";
            }

            return executionResponse;
        }

        public string ExecuteSalesForceTenderData(Guid workId)
        {
            List<string> goodRequestTypes = new List<string> { "Create", "Update", "UpdateStatus", "Delete"};
            string executionResponse = "";

            List<TenderTransferObject> tenderStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS", workId);

            if (tenderStagedWorkRecords.Count == 0) executionResponse += "There are no records to process<br>";

            foreach (TenderTransferObject workRecord in tenderStagedWorkRecords.OrderBy(a => a.RqstSid))  // Grab all of the items that need to be processed
            {
                bool goodOperationFlag = true;
                TenderTransferRootObject workRecordDataFields = JsonConvert.DeserializeObject<TenderTransferRootObject>(workRecord.RqstJsonData);

                // Read Headers and tag in error blocks where needed
                string requestType = workRecordDataFields.header.action;
                for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
                }

                // Generate Security Token for this set of records
                // TO DO: This will shift to the quotes block since only one user is sending the records...
                string idsid = workRecordDataFields.recordDetails.quote.quoteLine[0].Wwid; //11911244
                OpUserToken opUserToken = new OpUserToken { Usr = { Idsid = idsid } };
                UserSetting tempLookupSetting = new EmployeeDataLib().GetUserSettings(opUserToken);

                if (opUserToken.Usr.Idsid != null && ((opUserToken.Usr.WWID == 0 || opUserToken.Usr.Idsid == "") && requestType == "UpdateStatus")) // User not in system, try generic
                {
                    opUserToken = new OpUserToken { Usr = { Idsid = "90000054" } }; // Use the Dummy GA role in this case for approvals only
                    tempLookupSetting = new EmployeeDataLib().GetUserSettings(opUserToken);
                    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(800, "Warning: Using IQR Faceless Account for Approval because User [" + idsid + "] is not presently a user in My Deals", "Using IQR Faceless Account"));
                }

                if (opUserToken.Usr.Idsid != null) // Bad user lookup
                {
                    if (opUserToken.Usr.WWID == 0 || opUserToken.Usr.Idsid == "") // Bad user lookup
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(704, "User ID [" + idsid + "] is not presently a user in My Deals", "User account doesn't exist"));
                        goodOperationFlag = false;
                    }
                    if (opUserToken.Role.RoleTypeCd != "GA") // Wrong role for create/update, but allow normal roles to approvals
                    {
                        if (requestType == "UpdateStatus" && (opUserToken.Role.RoleTypeCd == "FSE" || opUserToken.Role.RoleTypeCd == "GA" || opUserToken.Role.RoleTypeCd == "DA"))
                        {
                            // Skip since this is an update
                        }
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(705, "User ID [" + idsid + "] is not a GA user role in My Deals", "User has wrong role"));
                            goodOperationFlag = false;
                        }
                    }
                    if (!goodRequestTypes.Contains(requestType))
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(700, "Mydeals applicaton error. Contact Mydeals L2 Support", "Passed action code [" + requestType + "] is not valid"));
                        goodOperationFlag = false;
                    }
                }
                else
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(704, "No User ID passed from IQR for this request", "IQR passed WWID was left empty"));
                    goodOperationFlag = false;
                }

                Guid batchId = workRecord.BtchId;
                int dealId = -1;

                if (goodOperationFlag)
                {
                    OpUserStack.TendersAutomatedUserToken(opUserToken);

                    switch (requestType)
                    {
                        case "Create": // Tenders Create New Deals request
                            executionResponse += ProcessCreationRequest(workRecordDataFields, batchId, idsid, ref dealId);
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

            string eventTriggered = _jmsDataLib.ReTriggerMulePacket(xid) ? "SUCCESSFUL": "FAILED";
            executionResponse += "MuleSoft re-trigger for [" + xid + "] results: " + eventTriggered;

            return executionResponse;
        }

        public string IqrFetchCapData(TenderCapRequestObject jsonDataPacket) // Fetch CAP data for Customer/Product/Dates for IQR
        {
            string custCimId = jsonDataPacket.CustomerCIMId; // empty string still returns Dell ID
            int custId = _jmsDataLib.FetchCustFromCimId(custCimId); // set the customer ID based on Customer CIM ID

            if (custId == 0) // Need to have a working customer for this request and failed, skip!
            {
                return "ERROR: Failed on CIM ID Lookup"; // Bail out - no customers matched
            }


            string productEpmId = jsonDataPacket.ProductNameEPMID; // For lookup
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;

            ProductEpmObject productLookupObj = _jmsDataLib.FetchProdFromProcessorEpmMap(epmId);

            if (productLookupObj?.MydlPcsrNbr == String.Empty || productLookupObj?.PcsrNbrSid == 0)
            {
                return "ERROR: Failed on EPM ID Lookup"; // Bail out - no products matched
            }
            int pcsrNbrSid = productLookupObj.PcsrNbrSid;

            DateTime dealStartDate = DateTime.ParseExact(jsonDataPacket.RangeStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime dealEndDate = DateTime.ParseExact(jsonDataPacket.RangeEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format

            ProductsLib pl = new ProductsLib();
            string geoCombined = jsonDataPacket.Region != "APJ" ? jsonDataPacket.Region : "APAC,IJKK";

            ProductCAPYCS2Calc pCap = new ProductCAPYCS2Calc();
            pCap.PRD_MBR_SID = pcsrNbrSid;
            pCap.CUST_MBR_SID = custId;
            pCap.GEO_MBR_SID = geoCombined;
            pCap.DEAL_STRT_DT = dealStartDate;
            pCap.DEAL_END_DT = dealEndDate;

            List<ProductCAPYCS2Calc> lpCap = new List<ProductCAPYCS2Calc>();
            lpCap.Add(pCap);

            //var opt = pl.GetCAPForProduct(pcsrNbrSid, custId, geoCombined, dealStartDate, dealEndDate);
            List<ProductCAPYCS2> opt = pl.GetProductCAPYCS2Data(lpCap, "N", "CAP");

            string returnData = JsonConvert.SerializeObject(opt, Formatting.None);
            if (opt.Count < 1) return "ERROR: No Records Returned";

            // Might have to remove /" and replace with "
            return returnData;
        }


        public void UpdateUnifiedEndCustomer(int CntrctId,string saleForceId,string primeCustomerName,string primeCustomerCountry)
        {
            EndCustomerObject endCustObj = _primeCustomerLib.FetchEndCustomerMap(primeCustomerName, primeCustomerCountry);

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
            sendToIqr.header.action = "UpdateUnifiedEndCustomer";
            sendToIqr.recordDetails.quote.Id = saleForceId;
            sendToIqr.recordDetails.quote.FolioID = CntrctId.ToString();           
            sendToIqr.recordDetails.quote.EndCustomer = primeCustomerName;
            sendToIqr.recordDetails.quote.EndCustomerCountry = primeCustomerCountry;
            sendToIqr.recordDetails.quote.UnifiedEndCustomer = endCustObj.UnifiedEndCustomer;
            sendToIqr.recordDetails.quote.UnifiedEndCustomerId = endCustObj.UnifiedEndCustomerId.ToString();
            sendToIqr.recordDetails.quote.UnifiedCountryEndCustomerId = endCustObj.UnifiedCountryEndCustomerId.ToString();
            sendToIqr.recordDetails.quote.IsUnifiedEndCustomer = endCustObj.IsUnifiedEndCustomer == 1 ? "True" : "False";

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