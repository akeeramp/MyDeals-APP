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

        public IntegrationLib(IJmsDataLib jmsDataLib, IOpDataCollectorLib dataCollectorLib)
        {
            _jmsDataLib = jmsDataLib;
            _dataCollectorLib = dataCollectorLib;
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


        #region CREATE TENDERS DEAL (IQR) 

        private int ProcessSalesForceContractInformation(int contractId, string contractSfId, int custId, TenderTransferRootObject workRecordDataFields)
        {
            // Save a new Tender Folio Contract Header here.  Update the JSON data with whatever is needed and pass back the new Folio ID

            if (contractId > 0) return contractId; // only process new contract headers

            // Pull needed data out of JSON
            DateTime contractStartDt = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.ShipmentStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime contractEndDt = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.ShipmentEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            string quoteLineId = workRecordDataFields.recordDetails.quote.Name;
            string contractTitle = "SF: " + workRecordDataFields.recordDetails.quote.FolioName;

            // TESTING
            //MyDealsData newData = new MyDealsData();
            //newData[OpDataElementType.CNTRCT] = new OpDataPacket<OpDataElementType>() { PacketType = OpDataElementType.CNTRCT };
            //newData[OpDataElementType.CNTRCT].Data = new OpDataCollectorDict();
            //newData[OpDataElementType.CNTRCT].Data[-101] = new OpDataCollector
            //{
            //    DcID = -101,
            //    DcParentID = 0,
            //    DcParentType = "ALL_OBJ_TYPE",
            //    DcType = OpDataElementType.CNTRCT.ToString(),
            //    DataElements = new List<OpDataElement>()
            //};
            //newData.FillInHolesFromAtrbTemplate(OpDataElementType.CNTRCT, OpDataElementSetType.ALL_TYPES);

            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.dc_type), OpDataElementType.CNTRCT.ToString());

            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD), OpDataElementSetType.ALL_TYPES.ToString());
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.SALESFORCE_ID), contractSfId);
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.QUOTE_LN_ID), quoteLineId);
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.CUST_MBR_SID), custId.ToString());
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.START_DT), contractStartDt.ToString("MM/dd/yyyy"));
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.END_DT), contractEndDt.ToString("MM/dd/yyyy"));
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.TENDER_PUBLISHED), "1");
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.IS_TENDER), "1");
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.TITLE), contractTitle+"1");
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.PASSED_VALIDATION), PassedValidation.Complete.ToString());

            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.DC_ID), "-101");
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.DC_PARENT_ID), "0");
            //UpdateDeValue(newData[OpDataElementType.CNTRCT].Data[-101].GetDataElement(AttributeCodes.WF_STG_CD), WorkFlowStages.InComplete.ToString());

            //SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveFullContract")
            //{
            //    CustId = custId,
            //    ContractId = -101,
            //    DeleteAllPTR = false
            //});

            //bool hasValidationErrors = newData.ValidationApplyRules(savePacket); //myDealsData.ApplyRules(MyRulesTrigger.OnValidate) - myDealsData.ValidationApplyRules(savePacket)


            //string validErrors = "";
            //foreach (OpDataCollector dc in newData[OpDataElementType.CNTRCT].AllDataCollectors)
            //{
            //    dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, newData);
            //    foreach (OpMsg opMsg in dc.Message.Messages) // If validation errors, log and skip to next
            //    {
            //        if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0 ? opMsg.Message : "; " + opMsg.Message;
            //    }
            //}

            //if (validErrors != "") // If validation errors, log and skip to next
            //{
            //    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(999, "Deal Validation Error", "Folio -101 had validation errors: " + validErrors));
            //    return -101; //Pre-emptive continue, but since this is relocated outside of loop..
            //}

            //// Start the save process - No errors, use MyDealsData Packets saving methods here as opposed to the flattened dictionary method used during create.
            //ContractToken saveContractToken = new ContractToken("ContractToken Created - Save IRQ Deal Updates")
            //{
            //    CustId = custId,
            //    ContractId = -101
            //};

            //TagSaveActionsAndBatches(newData); // Add needed save actions and batch IDs for the save
            //MyDealsData saveResponse = newData.Save(saveContractToken);

            //if (newData[OpDataElementType.CNTRCT].Actions.Any() && !saveResponse.Keys.Any())
            //{
            //    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(998, "My Deals DB", "Folio Save call failed at DB"));
            //}

            //END TESTING

            // Create a new standard tender header packet
            ContractTransferPacket testData = new ContractTransferPacket();
            testData.Contract = new OpDataCollectorFlattenedList();

            OpDataCollectorFlattenedItem testContractData = new OpDataCollectorFlattenedItem();
            testContractData.Add("DC_ID", -100); // New contract - follow (-id) convention
            testContractData.Add("dc_type", "CNTRCT");
            testContractData.Add("SALESFORCE_ID", contractSfId);
            testContractData.Add("QUOTE_LN_ID", quoteLineId); // not sure if we need this
            testContractData.Add("DC_PARENT_ID", "0");
            testContractData.Add("dc_parent_type", "0");
            testContractData.Add("OBJ_SET_TYPE_CD", "ALL_TYPES");
            testContractData.Add("CUST_MBR_SID", custId);
            testContractData.Add("START_DT", contractStartDt.ToString("MM/dd/yyyy"));
            testContractData.Add("END_DT", contractEndDt.ToString("MM/dd/yyyy"));
            testContractData.Add("TENDER_PUBLISHED", 1);
            testContractData.Add("IS_TENDER", 1);
            testContractData.Add("TITLE", contractTitle);
            testContractData.Add("PASSED_VALIDATION", PassedValidation.Complete);
            testData.Contract.Add(testContractData);

            contractId = -100;

            ContractToken saveContractToken = new ContractToken("ContractToken Created - Save WIP Deal")
            {
                CustId = custId, // Add as lookup above
                ContractId = contractId
            };

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();
            data[OpDataElementType.CNTRCT] = testData.Contract;

            MyDealsData saveResponse = _dataCollectorLib.SavePackets(data, new SavePacket(saveContractToken));

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

            return contractId > 0 ? contractId : -100; // Return a positive contract ID or -100 for failure
        }

        // Used to pull out customer level default values for certain fields
        private MyCustomersInformation LookupCustomerInformation(int custId)
        {
            MyCustomersInformation singleCustomer = new CustomerLib().GetMyCustomerNames().FirstOrDefault(c => c.CUST_SID == custId);
            return singleCustomer;
        }

        private ProdMappings LookupProducts(string usrInputProd, string strtDt, string endDt, string geoCombined, int custId,
            int contractId, ref List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrorResponse)
        {
            ProdMappings returnedProducts = new ProdMappings();

            ContractToken contractToken = new ContractToken("ContractToken Created - TranslateProducts")
            {
                CustId = custId,
                ContractId = contractId
            };

            List<ProductEntryAttribute> usrData = new List<ProductEntryAttribute>();
            usrData.Add(new ProductEntryAttribute()
            {
                ROW_NUMBER = 1,
                USR_INPUT = usrInputProd,
                EXCLUDE = false,
                FILTER = "All", // Do we assume this?
                START_DATE = strtDt,
                END_DATE = endDt,
                GEO_COMBINED = geoCombined,
                PROGRAM_PAYMENT = "Backend",
                MOD_USR_INPUT = null,
                COLUMN_TYPE = false
            });
            ProductsLib productlib = new ProductsLib();
            ProductLookup resultsList = productlib.TranslateProducts(contractToken, usrData, custId, OpDataElementSetType.ECAP.ToString(), true);

            // Need to get resultsList down to a single product json string - if it fails, return the null empty object
            if (resultsList.ValidProducts.Count <= 0) // No valid products returned, clear return list and post error
            {
                productErrorResponse.Add(AppendError(703, "Product Error", "Product not found"));
            }
            else if (resultsList.ValidProducts.Count > 1) // Multiple matches returned -- Might be able to consolidate this and next and deal with it externally
            {
                productErrorResponse.Add(AppendError(704, "Product Error", "Product search returned multiple products"));
            }
            else
            {
                foreach (var newItem in resultsList.ValidProducts["1"][usrInputProd].Select(row => new ProdMapping()
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
                    MM_MEDIA_CD = row.MM_MEDIA_CD,
                    PRD_CAT_NM = row.PRD_CAT_NM,
                    PRD_END_DTM = row.PRD_END_DTM.ToString("MM/dd/yyyy"),
                    PRD_MBR_SID = row.PRD_MBR_SID.ToString(),
                    PRD_STRT_DTM = row.PRD_STRT_DTM.ToString("MM/dd/yyyy"),
                    YCS2 = row.YCS2,
                    YCS2_END = row.YCS2_END.ToString("MM/dd/yyyy"),
                    YCS2_START = row.YCS2_START.ToString("MM/dd/yyyy"),
                    EXCLUDE = row.EXCLUDE
                }))
                {
                    returnedProducts.Add(usrInputProd, new[] { newItem });
                }
                if (returnedProducts.Count == 0)
                {
                    productErrorResponse.Add(AppendError(705, "Product Error", "No valid products matched"));
                }
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

            string meetCompErrorResponse = "";
            Decimal myCompBench = Convert.ToDecimal(compBenchStr, CultureInfo.InvariantCulture) + 0.00M;
            Decimal myIaBench = Convert.ToDecimal(iaBenchStr, CultureInfo.InvariantCulture) + 0.00M;
            Decimal myCompPrice = Convert.ToDecimal(meetCompPrcStr, CultureInfo.InvariantCulture) + 0.00M;

            MeetCompUpdate mcUpdate = new MeetCompUpdate()
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
            MeetCompUpdate mcUpdate2 = new MeetCompUpdate()
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
            mcu.Add(mcUpdate);
            mcu.Add(mcUpdate2);

            MeetCompLib _meetCompLib = new MeetCompLib();
            List<MeetCompResult> meetCompResult = new List<MeetCompResult>();
            try
            {
                meetCompResult = _meetCompLib.UpdateMeetCompProductDetails(strategyId, OpDataElementType.PRC_ST.ToId(), mcu);

                if (meetCompResult == null)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(730, "PCT/MCT Error", "Saving Meet Comp data failed"));
                }
            }
            catch (Exception e)
            {
                string errMsg = "PR_MYDL_UI_SAVE_MEET_COMP threw an error on save.  Call data: <br>";
                errMsg += strategyId + ", " + OpDataElementType.PRC_ST.ToId() + ", " + JsonConvert.SerializeObject(mcu) + "<br>";
                errMsg += e.Message + "<br>";
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(731, "PCT/MCT Error", errMsg));
            }

            // Get formal results
            CostTestDataLib _costTestDataLib = new CostTestDataLib();
            List<int> deadIdList = new List<int>() { strategyId };
            List<PctMctResult> pctResults = _costTestDataLib.RunPct(OpDataElementType.PRC_ST.ToId(), deadIdList);
            if (pctResults == null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(732, "PCT/MCT Error", "PR_MYDL_GET_MEET_COMP failed to return data, Assume PCT/MCT failed"));
            }
            else
            {
                if (pctResults.Any(m => m.MEETCOMP_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(733, "PCT/MCT Error", "Meet Comp Test FAILED"));
                }

                if (pctResults.Any(m => m.COST_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(734, "PCT/MCT Error", "Price Cost Test FAILED"));
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

        private int ToInt32(string value)
        {
            if (value == null)
                return 0;
            return int.Parse(value, (IFormatProvider)CultureInfo.CurrentCulture);
        }

        private int ProcessSalesForceDealInformation(int contractId, string dealSfId, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
        {
            ContractTransferPacket testData = new ContractTransferPacket();
            testData.Contract = new OpDataCollectorFlattenedList();
            testData.PricingStrategy = new OpDataCollectorFlattenedList();
            testData.PricingTable = new OpDataCollectorFlattenedList();
            testData.PricingTableRow = new OpDataCollectorFlattenedList();
            testData.WipDeals = new OpDataCollectorFlattenedList();

            string endCustomer = workRecordDataFields.recordDetails.quote.EndCustomer;
            string projectName = workRecordDataFields.recordDetails.quote.ProjectName;
            string serverDealType = workRecordDataFields.recordDetails.quote.ServerDealType;
            string geoCombined = workRecordDataFields.recordDetails.quote.Region != "APJ"? workRecordDataFields.recordDetails.quote.Region: "ASMO,IJKK";
            string dealType = workRecordDataFields.recordDetails.quote.DealType;
            // Embedded Array Items
            DateTime dealStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedStartDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime dealEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingStartDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            DateTime billingEndDate = DateTime.ParseExact(workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate, "yyyy-MM-dd", null); // Assuming that SF always sends dates in this format
            string terms = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].AdditionalTandC;
            string excludeAutomationFlag = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ExcludeAutomation? "Yes": "No";
            string quoteLineId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Name;
            string quoteLineNumber = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].QuoteLineNumber;
            string groupType = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].GroupType;
            string marketSegment = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].MarketSegment;
            marketSegment.Replace(";", ", ");
            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedECAPPrice;
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedQuantity;
            string userEnteredProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Name;
            string productEpmId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductNameEPMID; // For lookup
            // Safety setting back date reason in case we need it and they don't send it...
            string backdateReason = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason != "" ?
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].BackdateReason :
                "Contract Negotiation Delay";

            #region Product Check and translation
            // Use the MyTranslatedProduct function and expect null if no product is matched
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;

            ProductEpmObject productLookupObj = _jmsDataLib.FetchProdFromProcessorEpmMap(epmId);

            if (productLookupObj?.MydlPcsrNbr == null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(702, "Product Error", "Product EMP ID not found"));
                return -100; // Bail out - no products matched
            }

            List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrors = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
            ProdMappings myTranslatedProduct = LookupProducts(productLookupObj.MydlPcsrNbr, dealStartDate.ToString("MM/dd/yyyy"), dealEndDate.ToString("MM/dd/yyyy"), geoCombined, custId, contractId, ref productErrors);
            if (productErrors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.AddRange(productErrors);
                return -100;  // Bail out of this deal creation since it is missing critical field and errors have already been appended
            }

            string translatedValidProductJson = JsonConvert.SerializeObject(myTranslatedProduct);
            ProdMapping singleProduct = myTranslatedProduct[productLookupObj.MydlPcsrNbr].FirstOrDefault();

            int myPrdMbrSid = singleProduct != null ? ToInt32(singleProduct.PRD_MBR_SID) : 0;
            string myPrdCat = singleProduct != null ? singleProduct.PRD_CAT_NM : "";
            #endregion Product Check

            #region Deal Stability Check
            if (geoCombined == "" || ecapPrice == "" || dealStartDate == null || dealEndDate == null || billingStartDate == null || billingEndDate == null || 
                dealType == "" || groupType == "" || marketSegment == "")
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(714, "Deal Error", "Failed to create the Tender Deal due to missing expected fields"));
                return -100;
            }
            #endregion Deal Stability Check

            MyCustomersInformation requestedCustomerInfo = LookupCustomerInformation(custId);
            string defArSettlementLvl =
                requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL == "User Select on Deal Creation" || requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL == ""
                    ? "Issue Credit to Billing Sold To"
                    : requestedCustomerInfo.DFLT_TNDR_AR_SETL_LVL;

            OpDataCollectorFlattenedItem testPsData = new OpDataCollectorFlattenedItem();
            testPsData.Add("DC_ID", -201 - currentRec); // first record save is -201, others should be -202...
            testPsData.Add("dc_type", "PRC_ST");
            testPsData.Add("DC_PARENT_ID", contractId); // Had to get parent of this level, so set it, other levels must be returned
            testPsData.Add("dc_parent_type", "CNTRCT");
            testPsData.Add("OBJ_SET_TYPE_CD", "ALL_TYPES");
            testPsData.Add("TITLE", "PS - " + dealSfId);
            testPsData.Add("WF_STG_CD", WorkFlowStages.Requested);
            testPsData.Add("SALESFORCE_ID", dealSfId);
            testPsData.Add("PASSED_VALIDATION", PassedValidation.Complete);
            testData.PricingStrategy.Add(testPsData);

            OpDataCollectorFlattenedItem testPtData = new OpDataCollectorFlattenedItem();
            testPtData.Add("DC_ID", -301 - currentRec); // first record save is -301, others should be -302...
            testPtData.Add("dc_type", "PRC_TBL");
            testPtData.Add("DC_PARENT_ID", -201 - currentRec); //Not passed - set it func due to single object saves
            testPtData.Add("dc_parent_type", "PRC_ST");
            testPtData.Add("OBJ_SET_TYPE_CD", dealType);
            testPtData.Add("REBATE_TYPE", "TENDER");
            testPtData.Add("PAYOUT_BASED_ON", "Consumption");
            testPtData.Add("MRKT_SEG", marketSegment);
            testPtData.Add("PROGRAM_PAYMENT", "Backend");
            testPtData.Add("GEO_COMBINED", "Worldwide"); // This doesn't matter since it is autofill value and not used
            testPtData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD single Product
            testPtData.Add("TITLE", "PT - " + dealSfId);
            testPtData.Add("SALESFORCE_ID", dealSfId);
            testPtData.Add("PASSED_VALIDATION", PassedValidation.Complete);
            testData.PricingTable.Add(testPtData);

            OpDataCollectorFlattenedItem testPtrData = new OpDataCollectorFlattenedItem();
            testPtrData.Add("DC_ID", -401 - currentRec); // first record save is -401, others should be -402...
            testPtrData.Add("dc_type", "PRC_TBL_ROW");
            testPtrData.Add("DC_PARENT_ID", -301 - currentRec); //Not passed - set it func due to single object saves
            testPtrData.Add("dc_parent_type", "PRC_TBL");
            testPtrData.Add("ECAP_PRICE", ecapPrice);
            testPtrData.Add("REBATE_TYPE", "TENDER");
            testPtrData.Add("TITLE", "Salesforce line for " + userEnteredProductName);
            testPtrData.Add("PAYOUT_BASED_ON", "Consumption");
            testPtrData.Add("OBJ_SET_TYPE_CD", dealType);
            testPtrData.Add("CUST_MBR_SID", custId);
            testPtrData.Add("START_DT", dealStartDate.ToString("MM/dd/yyyy"));
            testPtrData.Add("END_DT", dealEndDate.ToString("MM/dd/yyyy"));
            testPtrData.Add("VOLUME", quantity);
            testPtrData.Add("END_CUSTOMER_RETAIL", endCustomer);
            testPtrData.Add("MRKT_SEG", marketSegment);
            testPtrData.Add("PROGRAM_PAYMENT", "Backend");
            testPtrData.Add("GEO_COMBINED", geoCombined.Contains(",")? "[" + geoCombined + "]": geoCombined);
            testPtrData.Add("PTR_USER_PRD", productLookupObj.MydlPcsrNbr);
            testPtrData.Add("PTR_SYS_PRD", translatedValidProductJson); // "{\"i3-8300\":[{\"BRND_NM\":\"Ci3\",\"CAP\":\"129.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"12/7/2017\",\"DEAL_PRD_NM\":\"\",\"DEAL_PRD_TYPE\":\"CPU\",\"DERIVED_USR_INPUT\":\"i3-8300\",\"FMLY_NM\":\"Coffee Lake\",\"HAS_L1\":1,\"HAS_L2\":0,\"HIER_NM_HASH\":\"CPU DT Ci3 Coffee Lake i3-8300 \",\"HIER_VAL_NM\":\"i3-8300\",\"MM_MEDIA_CD\":\"Box, Tray\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"i3-8300\",\"PRD_ATRB_SID\":7006,\"PRD_CAT_NM\":\"DT\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":92189,\"PRD_STRT_DTM\":\"11/29/2017\",\"USR_INPUT\":\"i3-8300\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}");
            testPtrData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD single Product
            testPtrData.Add("SERVER_DEAL_TYPE", serverDealType);
            testPtrData.Add("QLTR_PROJECT", projectName);
            testPtrData.Add("SALESFORCE_ID", dealSfId);
            testPtrData.Add("PASSED_VALIDATION", PassedValidation.Complete);
            testPtrData.Add("PERIOD_PROFILE", "Bi-Weekly (2 weeks)");
            testPtrData.Add("AR_SETTLEMENT_LVL", defArSettlementLvl);
            testPtrData.Add("SYS_COMMENT", "SalesForce Created Pricing Table Row: " + userEnteredProductName);
            testData.PricingTableRow.Add(testPtrData);

            OpDataCollectorFlattenedItem testDealData = new OpDataCollectorFlattenedItem();
            testDealData.Add("DC_ID", -1000 - currentRec); // first record save is -1000, others should be -1001...
            testDealData.Add("dc_type", "WIP_DEAL");
            testDealData.Add("DC_PARENT_ID", -401 - currentRec);
            testDealData.Add("dc_parent_type", "PRC_TBL_ROW");
            testDealData.Add("ECAP_PRICE_____20___0", ecapPrice);
            testDealData.Add("PRODUCT_FILTER", myPrdMbrSid);
            testDealData.Add("REBATE_TYPE", "TENDER");
            testDealData.Add("WF_STG_CD", "Draft"); // Because this is a new deal
            testDealData.Add("TITLE", productLookupObj.MydlPcsrNbr); // Echo out user product name
            testDealData.Add("PAYOUT_BASED_ON", "Consumption");
            testDealData.Add("CAP_____20___0", singleProduct?.CAP ?? ""); // From PTR_SYS_PRD single Product
            testDealData.Add("YCS2_PRC_IRBT_____20___0", singleProduct?.YCS2 ?? "No YCS2"); // From PTR_SYS_PRD single Product
            testDealData.Add("OBJ_SET_TYPE_CD", dealType);
            testDealData.Add("CUST_MBR_SID", custId);
            testDealData.Add("START_DT", dealStartDate.ToString("MM/dd/yyyy"));
            testDealData.Add("END_DT", dealEndDate.ToString("MM/dd/yyyy"));
            testDealData.Add("VOLUME", quantity);
            testDealData.Add("END_CUSTOMER_RETAIL", endCustomer);
            testDealData.Add("ON_ADD_DT", dealStartDate.ToString("MM/dd/yyyy")); // defaulting to start date
            testDealData.Add("CONSUMPTION_REASON", "End Customer");
            testDealData.Add("MRKT_SEG", marketSegment);
            testDealData.Add("PROGRAM_PAYMENT", "Backend");
            testDealData.Add("REBATE_BILLING_START", billingStartDate.ToString("MM/dd/yyyy")); // defaulting to start date
            testDealData.Add("REBATE_BILLING_END", billingEndDate.ToString("MM/dd/yyyy")); // defaulting to end date
            testDealData.Add("DEAL_COMB_TYPE", groupType);
            testDealData.Add("GEO_COMBINED", geoCombined);
            testDealData.Add("PTR_USER_PRD", productLookupObj.MydlPcsrNbr);
            testDealData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD single Product
            testDealData.Add("SERVER_DEAL_TYPE", serverDealType);
            testDealData.Add("QLTR_PROJECT", projectName);
            testDealData.Add("CAP_STRT_DT_____20___0", singleProduct?.CAP_START ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD single Product
            testDealData.Add("CAP_END_DT_____20___0", singleProduct?.CAP_END ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD single Product
            testDealData.Add("PASSED_VALIDATION", PassedValidation.Complete); // From PTR_SYS_PRD
            testDealData.Add("HAS_L1", singleProduct?.HAS_L1 ?? 0); // From PTR_SYS_PRD single Product
            testDealData.Add("HAS_L2", singleProduct?.HAS_L2 ?? 0); // From PTR_SYS_PRD single Product
            testDealData.Add("PRODUCT_CATEGORIES", singleProduct?.PRD_CAT_NM ?? ""); // From PTR_SYS_PRD single Product
            testDealData.Add("SALESFORCE_ID", dealSfId);
            testDealData.Add("QUOTE_LN_ID", quoteLineNumber);
            testDealData.Add("PERIOD_PROFILE", "Bi-Weekly (2 weeks)");
            testDealData.Add("AR_SETTLEMENT_LVL", defArSettlementLvl);
            testDealData.Add("SYS_COMMENT", "SalesForce Created Deals: " + userEnteredProductName + "; Deal moved from Requested to Submitted after creation.");
            testDealData.Add("IN_REDEAL", "0");
            testDealData.Add("TERMS", terms);
            testDealData.Add("EXCLUDE_AUTOMATION", excludeAutomationFlag);  // Set all inbound tenders to allow automation - check with Tenders
            if (dealStartDate < DateTime.Now) testDealData.Add("BACK_DATE_RSN", backdateReason);
            testData.WipDeals.Add(testDealData);

            ContractToken saveContractToken = new ContractToken("ContractToken Created - Save WIP Deal")
            {
                CustId = custId, // Add as lookup above
                ContractId = contractId
            };

            // Create a save packet and load it, return will be in DC/DE format still requiring post action processing if we were to use it again.
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();
            data[OpDataElementType.PRC_ST] = testData.PricingStrategy;
            data[OpDataElementType.PRC_TBL] = testData.PricingTable;
            data[OpDataElementType.PRC_TBL_ROW] = testData.PricingTableRow;
            data[OpDataElementType.WIP_DEAL] = testData.WipDeals;

            MyDealsData saveResponse = _dataCollectorLib.SavePackets(data, new SavePacket(saveContractToken));

            int CONT_PS_ID = -201 - currentRec;
            int WIP_DEAL_ID = -1000 - currentRec;

            foreach (var objKey in saveResponse.Keys)
            {
                var actnx = saveResponse[objKey].Actions.FirstOrDefault(x => x.Action == "ID_CHANGE");
                if (actnx != null)
                {
                    if (objKey == OpDataElementType.WIP_DEAL)
                    {
                        WIP_DEAL_ID = Int32.Parse(actnx.AltID.ToString());
                    }
                    else if (objKey == OpDataElementType.PRC_ST)
                    {
                        CONT_PS_ID = Int32.Parse(actnx.AltID.ToString());
                    }
                }
            }

            if (WIP_DEAL_ID <= 0) return -100; // If creation failed, bail out, else PCT/MCT

            workRecordDataFields.recordDetails.quote.quoteLine[currentRec].DealRFQStatus = WorkFlowStages.Submitted; // Set by init setting rule

            // Update the Meet Comp data now.
            EnterMeetCompData(CONT_PS_ID, WIP_DEAL_ID, myPrdMbrSid, productLookupObj.MydlPcsrNbr, myPrdCat, custId,
                workRecordDataFields, currentRec);

            return WIP_DEAL_ID;
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

                List<TendersSFIDCheck> sfToMydlIds = _jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal);
                if (sfToMydlIds == null)
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(700, "DB Lookup Error", "Failed, SF ID lookup Error"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, -1, dealId);
                    continue; // we had error on lookup, skip to next to process
                }

                int folioId = sfToMydlIds[0].Cntrct_SID;
                dealId = sfToMydlIds[0].Wip_SID;

                List<int> passedFolioIds = new List<int>() { folioId };
                MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT }); // Make the save object

                if (custId == 0) // Need to have a working customer for this request and failed, skip!
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(701, "Invalid Customer", "Unable to find the customer with CIMId (" + custCimId + ")"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                    continue;
                }

                // Step 2 - Deal with a contract header
                if (folioId == 0) // This is a new contract header
                {
                    folioId = ProcessSalesForceContractInformation(folioId, salesForceIdCntrct, custId, workRecordDataFields);
                    workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();

                    if (folioId <= 0)  // Needed to create a new Folio for this request and failed, skip!
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(710, "Folio Error", "Failed to create the Tender Folio for this request"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }
                }
                else // Post back known Folio ID to SF
                {
                    workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();
                }

                // Step 2a - Deal with a deal structure now
                if (dealId == 0) // This is a new deal entry
                {
                    dealId = ProcessSalesForceDealInformation(folioId, salesForceIdDeal, custId, workRecordDataFields, i);
                    workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                    if (dealId < 0)  // Needed to create a new PS to WIP Deal for this request and failed, error..
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(711, "Deal Error", "Failed to create the Tender Deal"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue;
                    }
                }
                else // Post back known Deal ID to SF, append error that it exists already
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                    executionResponse += ProcessUpdateRequest(workRecordDataFields, batchId, i, ref dealId);
                    //workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(715, "Deal Error", "Tender Deal already created, Deal ID is " + dealId));
                }

                // Should have no bail outs, so post final messages here
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
            } // End of quote lines loop

            return executionResponse;
        }

        private void TagSaveActionsAndBatches(MyDealsData myDealsData)
        {
            foreach (OpDataElementType objKey in myDealsData.Keys)
            {
                if (myDealsData[objKey].GetChanges().AllDataElements.Any())
                {
                    myDealsData[objKey].AddSaveActions();
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

        private bool UpdateRecordsFromSfPackets(MyDealsData myDealsData, TenderTransferRootObject workRecordDataFields, int i, int custId, int folioId, int psId, int dealId, ref string validErrors)
        {
            int ptrId = myDealsData[OpDataElementType.PRC_TBL_ROW].Data.Keys.FirstOrDefault();
            int ptId = myDealsData[OpDataElementType.PRC_TBL].Data.Keys.FirstOrDefault();

            // TODO: Figure out what fields we will allow to change and place them here.  Let DEs drive the save and rules.  Bail on validation errors or empty required fields.
            // Update SalesForce IDs for new deal instance objects
            string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[ptId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.SALESFORCE_ID), salesForceIdDeal);

            // Update End Customer
            string endCustomer = workRecordDataFields.recordDetails.quote.EndCustomer;
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), endCustomer);
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL), endCustomer);

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


            // Clear out system comments to all objects so that updates don't stack comments incorrectly
            UpdateDeValue(myDealsData[OpDataElementType.CNTRCT].Data[folioId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL].Data[ptId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.PRC_TBL_ROW].Data[ptrId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");
            UpdateDeValue(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElement(AttributeCodes.SYS_COMMENTS), "");

            // Conduct staging push if needed - support only requested to submitted at this point - re-deal cycles will be rougher.
            // Offer and Lost/Won deals would need to verify a right way major change prior to re-setting the WF Stage.  Best to let re-deal take care.
            string psStage = myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            string dealStage = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);
            if (dealStage == WorkFlowStages.Draft && psStage == WorkFlowStages.Requested)
            {
                UpdateDeValue(myDealsData[OpDataElementType.PRC_ST].Data[psId].GetDataElement(AttributeCodes.WF_STG_CD), WorkFlowStages.Submitted);
                myDealsData[OpDataElementType.PRC_ST].Data[psId].AddTimelineComment("Deal moved from Requested to Submitted after IQR Updating.");
            }
            // Using this to allow us to dive right into rules engines
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveFullContract")
            {
                CustId = custId,
                ContractId = folioId,
                DeleteAllPTR = false
            });

            bool hasValidationErrors = myDealsData.ValidationApplyRules(savePacket); //myDealsData.ApplyRules(MyRulesTrigger.OnValidate) - myDealsData.ValidationApplyRules(savePacket)
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, myDealsData);
                foreach (OpMsg opMsg in dc.Message.Messages) // If validation errors, log and skip to next
                {
                    if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0? opMsg.Message: "; " + opMsg.Message;
                }
            }

            return hasValidationErrors;
        }

        private string ProcessUpdateRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, int recordId, ref int dealId)
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
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(712, "Deal Error", "Couldn't find deal for this request (" + dealId + ")"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..  We had error on lookup, skip to next to process
            }

            // Break out update records block so that it can be updated easier apart from the save and PCT/MCT calls

            int psId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
            int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));

            // Break out update and validate checks, then come back and do the needed saves if everything is good.
            string validErrors = "";
            if (UpdateRecordsFromSfPackets(myDealsData, workRecordDataFields, recordId, custId, folioId, psId, dealId, ref validErrors)) // If validation errors, log and skip to next
            {
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(713, "Deal Validation Error", "Deal " + dealId + " had validation errors: " + validErrors));
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
                workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages.Add(AppendError(721, "Deal Stage Error", "Save call failed at DB"));
                executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[recordId].errorMessages, folioId, dealId);
                return executionResponse; //Pre-emptive continue, but since this is relocated outside of loop..
            }

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

        private string ProcessUpdateRequestShell(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            // This was shelled out to support updating single lines from a create path as per Mahesh request.
            string executionResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
                executionResponse += ProcessUpdateRequest(workRecordDataFields, batchId, i, ref dealId);
            }

            return executionResponse;
        }

        private string ProcessStageUpdateRequest(TenderTransferRootObject workRecordDataFields, Guid batchId, ref int dealId)
        {
            string executionResponse = "";

            for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
            {
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
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(712, "Deal Error", "Couldn't find deal for this request (" + dealId + ")"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                    continue; // we had error on lookup, skip to next to process
                }

                //GetContract the packet data and place it on the right collector
                // Three stages to expect from TENDERS, Submitted, Won, and Lost, so check stage first and move accordingly. 
                string destinationStage = workRecordDataFields.recordDetails.quote.quoteLine[i].Status;
                int strategyId = myDealsData[OpDataElementType.PRC_ST].Data.Keys.FirstOrDefault();
                var currentPsWfStg = myDealsData[OpDataElementType.PRC_ST].Data[strategyId].GetDataElementValue(AttributeCodes.WF_STG_CD);
                var currentWipWfStg = myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.WF_STG_CD);

                switch (destinationStage)
                {
                    case "Submitted": // Tenders Create New Deals request
                        if (currentPsWfStg == WorkFlowStages.Requested)
                        {
                            myDealsData[OpDataElementType.PRC_ST].Data[strategyId].SetDataElementValue(AttributeCodes.WF_STG_CD, WorkFlowStages.Submitted);
                        }
                        // Place any stage to cancel here if IRQ decides they want it
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(720, "Deal Stage Error", "Stage change to " + destinationStage + " failed, current deal stage is " + currentPsWfStg));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                        //myDealsData[OpDataElementType.PRC_ST].AddSaveActions(); // Add the save action because it is PS level change and you didn't bail out
                        break;
                    case "Won":
                    case "Lost":
                        if (currentWipWfStg == WorkFlowStages.Offer)
                        {
                            myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].SetDataElementValue(AttributeCodes.WF_STG_CD,
                                destinationStage == WorkFlowStages.Won ? WorkFlowStages.Won : WorkFlowStages.Lost);
                        }
                        // Place lost to offer here as else if IRQ decides they want it
                        else
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(720, "Deal Stage Error", "Stage change to " + destinationStage + " failed, current deal stage is " + currentWipWfStg));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                        //myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions(); // Add the save action because it is WIP level change and you didn't bail out
                        break;
                }

                int custId = Int32.Parse(myDealsData[OpDataElementType.WIP_DEAL].Data[dealId].GetDataElementValue(AttributeCodes.CUST_MBR_SID));

                // Using this to allow us to dive right into rules engines
                SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveFullContract")
                {
                    CustId = custId,
                    ContractId = folioId,
                    DeleteAllPTR = false
                });

                bool hasValidationErrors = myDealsData.ValidationApplyRules(savePacket); //myDealsData.ApplyRules(MyRulesTrigger.OnValidate) - myDealsData.ValidationApplyRules(savePacket)
                string validErrors = "";
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, myDealsData);
                    foreach (OpMsg opMsg in dc.Message.Messages) // append validation messages
                    {
                        if (opMsg.Message != "Validation Errors detected in deal") validErrors += validErrors.Length == 0 ? opMsg.Message : "; " + opMsg.Message;
                    }
                }
                if (hasValidationErrors || validErrors.Length > 0) // If validation errors, log and skip to next
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(713, "Deal Validation Error", "Deal " + dealId + "  had validation errors: " + validErrors));
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
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(721, "Deal Stage Error", "Save call failed at DB"));
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                    continue;
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
            List<string> goodRequestTypes = new List<string> { "Create", "Update", "UpdateStatus", "ErrorState"};
            string executionResponse = "";

            List<TenderTransferObject> tenderStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS", workId);

            if (tenderStagedWorkRecords.Count == 0) executionResponse += "There are no records to process<br>";

            foreach (TenderTransferObject workRecord in tenderStagedWorkRecords)  // Grab all of the items that need to be processed
            {
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

                if (opUserToken.Usr.WWID == 0 || opUserToken.Usr.Idsid == "") // Bad user lookup
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(706, "User not in My Deals", "User ID " + idsid + " is not presently in My Deals"));
                    requestType = "ErrorState";
                }
                else if (opUserToken.Role.RoleTypeCd != "GA") // Wrong role
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[0].errorMessages.Add(AppendError(707, "User not a GA in My Deals", "User ID " + idsid + " is not a GA role in My Deals"));
                    requestType = "ErrorState";
                }
                OpUserStack.TendersAutomatedUserToken(opUserToken);

                Guid batchId = workRecord.BtchId;
                int dealId = -1;

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
                    default:
                        break;
                }

                if (goodRequestTypes.Contains(requestType))
                {
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
                        _jmsDataLib.UpdateTendersStage(workRecord.BtchId, "PO_Processing_Complete");
                        executionResponse += "Successful, response object created (" + saveSuccessful + ")<br>";
                    }
                    // Attempt to close out response now

                    bool saveSuccessfulReturnToTenders = _jmsDataLib.PublishBackToSfTenders(jsonData);

                    if (saveSuccessfulReturnToTenders != true) continue; // Couldn't return data to tenders, skip close out of safety record.
                    _jmsDataLib.UpdateTendersStage(saveSuccessful, "PO_Processing_Complete");
                    executionResponse += "Response object successfully returned<br><br>";
                    //executionResponse += jsonData + "<br>";
                }
                else // request type was not an expected pattern, don't report back and just close the request down as per Mahesh
                {
                    _jmsDataLib.UpdateTendersStage(workRecord.BtchId, "Line_Skipped");
                    executionResponse += "Unexpected request type of '" + requestType + "' sent.  Ignoring record request.";
                }
            }

            return executionResponse;
        }

        public string ReturnSalesForceTenderResults() // Bulk processing of Tenders Responses - Send back to MuleSoft
        {
            string executionResponse = "";

            List<TenderTransferObject> returnStagedWorkRecords = _jmsDataLib.FetchTendersStagedData("TENDER_DEALS_RESPONSE", Guid.Empty);

            foreach (TenderTransferObject workRecord in returnStagedWorkRecords)
            {
                bool saveSuccessfulReturnToTenders = _jmsDataLib.PublishBackToSfTenders(workRecord.RqstJsonData);

                if (saveSuccessfulReturnToTenders == true) // The return data has been sent back to tenders, close out our safety record
                {
                    _jmsDataLib.UpdateTendersStage(workRecord.BtchId, "PO_Processing_Complete");
                    executionResponse += "Response object [" + workRecord.BtchId + "] successfully returned<br>";
                }
            }

            return executionResponse;
        }

        #endregion CREATE TENDERS DEAL (IQR) 

    }
}