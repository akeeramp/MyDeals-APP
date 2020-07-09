using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.OpDataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessLogic
{
    public class ContractsLib : IContractsLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;
        private readonly IUiTemplateLib _uiTemplateLib;
        private readonly IDropdownLib _dropdownLib;
        private readonly IPricingStrategiesLib _pricingStrategiesLib;
        private readonly IPricingTablesLib _pricingTablesLib;
        //private readonly IDsaWorkQueueLib _dsaWorkQueueLib;

        public ContractsLib(IOpDataCollectorLib dataCollectorLib, IUiTemplateLib uiTemplateLib, IDropdownLib dropdownLib, IPricingTablesLib pricingTablesLib, IPricingStrategiesLib pricingStrategiesLib) //, IDsaWorkQueueLib dsaWorkQueueLib
        {
            _dataCollectorLib = dataCollectorLib;
            _uiTemplateLib = uiTemplateLib;
            _dropdownLib = dropdownLib;
            _pricingStrategiesLib = pricingStrategiesLib;
            _pricingTablesLib = pricingTablesLib;
            //_dsaWorkQueueLib = dsaWorkQueueLib;
        }

        /// <summary>
        /// Get a Contract by ID
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="inclusive">true will get all components of the contract while false will only get the header</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                    {
                        OpDataElementType.CNTRCT,
                        OpDataElementType.PRC_ST,
                        OpDataElementType.PRC_TBL,
                        OpDataElementType.PRC_TBL_ROW,
                        OpDataElementType.WIP_DEAL
                    }
                : new List<OpDataElementType>
                    {
                        OpDataElementType.CNTRCT
                    };

            return GetContract(id, opDataElementTypes);
        }

        /// <summary>
        /// Get Contract By Id and return the levels specified by opDataElementTypes
        /// </summary>
        /// <param name="id">Id of the contract</param>
        /// <param name="opDataElementTypes">List of OpDataElements to return</param>
        /// <returns>MyDealsData</returns>
        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes = null)
        {
            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.CNTRCT }).FillInHolesFromAtrbTemplate();
        }

        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes, IEnumerable<int> atrbs)
        {
            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes ?? new List<OpDataElementType> { OpDataElementType.CNTRCT }, atrbs);
        }

        public OpDataCollectorFlattenedList GetUpperContract(int id)
        {
            return GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.CNTRCT,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL
                })
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }

        public OpDataCollectorFlattenedList GetContractStatus(int id)
        {
            List<int> atrbs = new List<int>
            {
                Attributes.TITLE.ATRB_SID,
                Attributes.PTR_USER_PRD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID
            };

            return GetContract(id, new List<OpDataElementType>
                {
                    OpDataElementType.CNTRCT,
                    OpDataElementType.PRC_ST,
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW,
                    OpDataElementType.WIP_DEAL
                }, atrbs)
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, false)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }

        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return GetContract(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedList GetExportContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.CNTRCT,
                OpDataElementType.PRC_ST,
                OpDataElementType.PRC_TBL,
                OpDataElementType.PRC_TBL_ROW
            };

            return OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes)
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                .ToHierarchialList(OpDataElementType.CNTRCT);
        }

        /// <summary>
        /// Save a Tender contract
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contractId"></param>
        /// /// <param name="upperContractData"></param>
        /// <returns>MyDealsData</returns>
        public OpDataCollectorFlattenedDictList SaveTenderContract(int custId, int contractId, ContractTransferPacket upperContractData)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveContract")
            {
                CustId = custId,
                ContractId = contractId
            });

            OpDataCollectorFlattenedDictList baseContract = SaveContract(upperContractData.Contract, savePacket);

            int updateContractId = -100;
            foreach (var item in baseContract)
            {
                if (item.Key.ToString() == OpDataElementType.CNTRCT.ToString())
                {
                    foreach (var itm in item.Value)
                    {
                        if (itm.ContainsKey("DC_ID"))
                        {
                            int.TryParse(itm[AttributeCodes.DC_ID].ToString(), out updateContractId);
                        }
                    }
                }
            }

            // Purpose: Creating PS for Tender Contract
            SavePacket savePacketPS = new SavePacket(new ContractToken("ContractToken Created - SavePricingStrategy")
            {
                CustId = custId,
                ContractId = updateContractId
            });

            foreach (var ps in upperContractData.PricingStrategy)
            {
                if (ps.ContainsKey(AttributeCodes.DC_PARENT_ID.ToString()))
                {
                    ps[AttributeCodes.DC_PARENT_ID.ToString()] = updateContractId;
                }

                if (ps.ContainsKey(AttributeCodes.TITLE.ToString()))
                {
                    ps[AttributeCodes.TITLE.ToString()] = updateContractId + ps[AttributeCodes.TITLE.ToString()].ToString();
                }
            }

            OpDataCollectorFlattenedDictList prcPsData = _pricingStrategiesLib.SavePricingStrategy(upperContractData.PricingStrategy, savePacketPS);

            //Purpose: Creating PT for Tender
            int CONT_PS_ID = -100;
            foreach (var item in prcPsData)
            {
                if (item.Key.ToString() == OpDataElementType.PRC_ST.ToString())
                {
                    foreach (var itm in item.Value)
                    {
                        if (itm.ContainsKey("DC_ID"))
                        {
                            int.TryParse(itm[AttributeCodes.DC_ID].ToString(), out CONT_PS_ID);
                        }
                    }
                }
            }
            foreach (var pt in upperContractData.PricingTable)
            {
                if (!pt.ContainsKey(AttributeCodes.DC_PARENT_ID.ToString()))
                {
                    pt.Add(AttributeCodes.DC_PARENT_ID.ToString(), CONT_PS_ID);
                }
                else
                {
                    pt[AttributeCodes.DC_PARENT_ID.ToString()] = CONT_PS_ID;
                }

                if (pt.ContainsKey(AttributeCodes.TITLE.ToString()))
                {
                    pt[AttributeCodes.TITLE.ToString()] = updateContractId + pt[AttributeCodes.TITLE.ToString()].ToString();
                }
            }

            SavePacket savePacketPT = new SavePacket(new ContractToken("ContractToken Created - SavePricingTable")
            {
                CustId = custId,
                ContractId = updateContractId
            });

            OpDataCollectorFlattenedDictList PRC_TBL_DATA = _pricingTablesLib.SavePricingTable(upperContractData.PricingTable, savePacketPT);

            baseContract.Add(OpDataElementType.PRC_ST, prcPsData[OpDataElementType.PRC_ST]);
            baseContract.Add(OpDataElementType.PRC_TBL, PRC_TBL_DATA[OpDataElementType.PRC_TBL]);

            return baseContract;
        }




        #region TENDERS INTEGRATION ITEMS IN CONTRACTS CONTROLLER

        private int ProcessSalesForceContractInformation(int contractId, string contractSfId, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
        {
            // Save a new Tender Folio Contract Header here.  Update the JSON data with whatever is needed and pass back the new Folio ID

            if (contractId > 0) return contractId; // only process new contract headers
            
            // Pull needed data out of JSON
            string contractStartDt = workRecordDataFields.recordDetails.quote.ShipmentStartDate;
            string contractEndDt = workRecordDataFields.recordDetails.quote.ShipmentEndDate;
            string quoteLineId = workRecordDataFields.recordDetails.quote.Name;
            string contractTitle = "SalesForce Contract - " + quoteLineId + " - " + contractSfId;

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
            testContractData.Add("START_DT", contractStartDt); 
            testContractData.Add("END_DT", contractEndDt); 
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

            return contractId > 0? contractId: -100; // Return a positive contract ID or -100 for failure
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
                FILTER = "Tray", // Do we assume this?
                START_DATE = strtDt,
                END_DATE = endDt,
                GEO_COMBINED = geoCombined,
                PROGRAM_PAYMENT = "Backend",
                MOD_USR_INPUT = "",
                COLUMN_TYPE = true
            });
            ProductsLib productlib = new ProductsLib();
            ProductLookup resultsList = productlib.TranslateProducts(contractToken, usrData, 2, OpDataElementSetType.ECAP.ToString(), true);

            // Need to get resultsList down to a single product json string - if it fails, return the null empty object
            if (resultsList.ValidProducts.Count <= 0) // No valid products returned, clear return list and post error
            {
                productErrorResponse.Add(AppendError(402, "Product Error", "Product not found"));
            }
            else if (resultsList.ValidProducts.Count > 1) // Multiple matches returned -- Might be able to consolidate this and next and deal with it externally
            {
                productErrorResponse.Add(AppendError(403, "Product Error", "Product search returned multiple products"));
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
                    productErrorResponse.Add(AppendError(404, "Product Error", "No valid products matched"));
                }
            }

            return returnedProducts;
        }

        private void EnterMeetCompData(int strategyId, int dealId, int prdId, string usrInputProd, string myPrdCat, int custId, TenderTransferRootObject workRecordDataFields, int currentRec)
        {
            // We only take the first instance of values as per Mahesh ([0] below)
            string competitorProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].competetorProduct.Name;
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
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(501, "PCT/MCT Error", "Saving Meet Comp data failed"));
                }
            }
            catch (Exception e)
            {
                string errMsg = "PR_MYDL_UI_SAVE_MEET_COMP threw an error on save.  Call data: <br>";
                errMsg += strategyId + ", " + OpDataElementType.PRC_ST.ToId() + ", " + JsonConvert.SerializeObject(mcu) + "<br>";
                errMsg += e.Message + "<br>";
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(505, "PCT/MCT Error", errMsg));
            }

            // Get formal results
            CostTestDataLib _costTestDataLib = new CostTestDataLib();
            List<int> deadIdList = new List<int>() { strategyId };
            List<PctMctResult> pctResults = _costTestDataLib.RunPct(OpDataElementType.PRC_ST.ToId(), deadIdList);
            if (pctResults == null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(504, "PCT/MCT Error", "PR_MYDL_GET_MEET_COMP failed to return data, Assume PCT/MCT failed"));
            }
            else
            {
                if (pctResults.Any(m => m.MEETCOMP_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(503, "PCT/MCT Error", "Meet Comp Test FAILED"));
                }

                if (pctResults.Any(m => m.COST_TEST_RESULT == "Fail"))
                {
                    workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(502, "PCT/MCT Error", "Price Cost Test FAILED"));
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

        private int ProcessSalesForceDealInformation(int dealId, int contractId, string dealSfId, int custId, MyDealsData myDealsData, TenderTransferRootObject workRecordDataFields, int currentRec)
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
            string geoCombined = workRecordDataFields.recordDetails.quote.Region; 
            string dealType = workRecordDataFields.recordDetails.quote.DealType;
            // Embedded Array Items
            string dealStartDate = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedStartDate;
            DateTime dealStartDateCheck = DateTime.ParseExact(dealStartDate, "yyyy-MM-dd", null);
            string dealEndDate = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedEndDate;
            string quoteLineId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].Name;
            string quoteLineNumber = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].QuoteLineNumber;
            string ecapPrice = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedECAPPrice; 
            string quantity = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].ApprovedQuantity; 
            string userEnteredProductName = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.Name;
            string productEpmId = workRecordDataFields.recordDetails.quote.quoteLine[currentRec].product.ProductNameEPMID; // For lookup

            #region Product Check and translation
            // Use the MyTranslatedProduct function and expect null if no product is matched
            int epmId = int.TryParse(productEpmId, out epmId) ? epmId : 0;

            JmsDataLib jmsDataLib = new JmsDataLib();
            ProductEpmObject productLookupObj = jmsDataLib.FetchProdFromProcessorEpmMap(epmId);

            if (productLookupObj?.MydlPcsrNbr == null)
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.Add(AppendError(401, "Product Error", "Product EMP ID not found"));
                return -100; // Bail out - no products matched
            }

            List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages> productErrors = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();
            ProdMappings myTranslatedProduct = LookupProducts(productLookupObj.MydlPcsrNbr, dealStartDate, dealEndDate, geoCombined, custId, contractId, ref productErrors);
            if (productErrors.Any())
            {
                workRecordDataFields.recordDetails.quote.quoteLine[currentRec].errorMessages.AddRange(productErrors);
                return -100;  // Bail out of this deal creation since it is missing critical field and errors have already been appended
            }

            string translatedValidProductJson = JsonConvert.SerializeObject(myTranslatedProduct);
            ProdMapping singleProduct = myTranslatedProduct[productLookupObj.MydlPcsrNbr].FirstOrDefault();

            int myPrdMbrSid = singleProduct != null? ToInt32(singleProduct.PRD_MBR_SID): 0;
            string myPrdCat = singleProduct != null ? singleProduct.PRD_CAT_NM: "";
            #endregion Product Check

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
            testPtData.Add("MRKT_SEG", "Corp");
            testPtData.Add("PROGRAM_PAYMENT", "Backend");
            testPtData.Add("GEO_COMBINED", "Worldwide"); // We need to inject the GEO here
            testPtData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD singleProduct
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
            testPtrData.Add("START_DT", dealStartDate);
            testPtrData.Add("END_DT", dealEndDate);
            testPtrData.Add("VOLUME", quantity);
            testPtrData.Add("END_CUSTOMER_RETAIL", endCustomer);
            testPtrData.Add("MRKT_SEG", "Corp");
            testPtrData.Add("PROGRAM_PAYMENT", "Backend");
            testPtrData.Add("GEO_COMBINED", geoCombined);
            testPtrData.Add("PTR_USER_PRD", userEnteredProductName);
            testPtrData.Add("PTR_SYS_PRD", translatedValidProductJson); // "{\"i3-8300\":[{\"BRND_NM\":\"Ci3\",\"CAP\":\"129.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"12/7/2017\",\"DEAL_PRD_NM\":\"\",\"DEAL_PRD_TYPE\":\"CPU\",\"DERIVED_USR_INPUT\":\"i3-8300\",\"FMLY_NM\":\"Coffee Lake\",\"HAS_L1\":1,\"HAS_L2\":0,\"HIER_NM_HASH\":\"CPU DT Ci3 Coffee Lake i3-8300 \",\"HIER_VAL_NM\":\"i3-8300\",\"MM_MEDIA_CD\":\"Box, Tray\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"i3-8300\",\"PRD_ATRB_SID\":7006,\"PRD_CAT_NM\":\"DT\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":92189,\"PRD_STRT_DTM\":\"11/29/2017\",\"USR_INPUT\":\"i3-8300\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}");
            testPtrData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD singleProduct
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
            testDealData.Add("TITLE", userEnteredProductName); // Echo out user product name
            testDealData.Add("PAYOUT_BASED_ON", "Consumption");
            testDealData.Add("CAP_____20___0", singleProduct?.CAP ?? ""); // From PTR_SYS_PRD singleProduct
            testDealData.Add("YCS2_PRC_IRBT_____20___0", singleProduct?.YCS2 ?? "No YCS2"); // From PTR_SYS_PRD singleProduct
            testDealData.Add("OBJ_SET_TYPE_CD", dealType);
            testDealData.Add("CUST_MBR_SID", custId);
            testDealData.Add("START_DT", dealStartDate);
            testDealData.Add("END_DT", dealEndDate);
            testDealData.Add("VOLUME", quantity);
            testDealData.Add("END_CUSTOMER_RETAIL", endCustomer);
            testDealData.Add("ON_ADD_DT", dealStartDate); // defaulting to start date
            testDealData.Add("CONSUMPTION_REASON", "Platform");
            testDealData.Add("MRKT_SEG", "Corp");
            testDealData.Add("PROGRAM_PAYMENT", "Backend");
            testDealData.Add("REBATE_BILLING_START", dealStartDate); // defaulting to start date
            testDealData.Add("REBATE_BILLING_END", dealEndDate); // defaulting to end date
            testDealData.Add("DEAL_COMB_TYPE", "Mutually Exclusive");
            testDealData.Add("GEO_COMBINED", geoCombined);
            testDealData.Add("PTR_USER_PRD", userEnteredProductName); 
            testDealData.Add("PROD_INCLDS", singleProduct?.MM_MEDIA_CD ?? ""); // From PTR_SYS_PRD singleProduct
            testDealData.Add("SERVER_DEAL_TYPE", serverDealType);
            testDealData.Add("QLTR_PROJECT", projectName);
            testDealData.Add("CAP_STRT_DT_____20___0", singleProduct?.CAP_START ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD singleProduct
            testDealData.Add("CAP_END_DT_____20___0", singleProduct?.CAP_END ?? DateTime.Now.ToString("MM/dd/yyyy")); // From PTR_SYS_PRD singleProduct
            testDealData.Add("PASSED_VALIDATION", PassedValidation.Complete); // From PTR_SYS_PRD
            testDealData.Add("HAS_L1", singleProduct?.HAS_L1 ?? 0); // From PTR_SYS_PRD singleProduct
            testDealData.Add("HAS_L2", singleProduct?.HAS_L2 ?? 0); // From PTR_SYS_PRD singleProduct
            testDealData.Add("PRODUCT_CATEGORIES", singleProduct?.PRD_CAT_NM ?? ""); // From PTR_SYS_PRD singleProduct
            testDealData.Add("SALESFORCE_ID", dealSfId); 
            testDealData.Add("QUOTE_LN_ID", quoteLineId + " - " + quoteLineNumber); 
            testDealData.Add("PERIOD_PROFILE", "Bi-Weekly (2 weeks)");
            testDealData.Add("AR_SETTLEMENT_LVL", defArSettlementLvl);
            testDealData.Add("SYS_COMMENT", "SalesForce Created Deals: " + userEnteredProductName);
            testDealData.Add("IN_REDEAL", "0");
            testDealData.Add("EXCLUDE_AUTOMATION", "Yes");  // Do we want this set like so??
            if (dealStartDateCheck < DateTime.Now) testDealData.Add("BACK_DATE_RSN", "Contract Negotiation Delay");
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

        public string ExecuteSalesForceTenderData(Guid workId)
        {
            // Processing steps
            // 1. Read the data from DB, update status to working
            // 2. tear it apart and make our save objects - need to do cust/prod lookups
            // 3. Save the objects

            string executionResponse = "";

            // Fetch data (START WORK)
            JmsDataLib jmsDataLib = new JmsDataLib();
            OpUserStack.TendersAutomatedUserToken(); // Fetch a generic faceless GA account to use

            List<TenderTransferObject> tenderStagedWorkRecords = jmsDataLib.FetchTendersStagedData("TENDER_DEALS", workId);

            if (tenderStagedWorkRecords.Count == 0) executionResponse += "There are no records to process<br>";

            foreach (TenderTransferObject workRecord in tenderStagedWorkRecords)
            {
                int custId;
                int folioId = -1;
                int dealId = -1;

                TenderTransferRootObject workRecordDataFields = JsonConvert.DeserializeObject<TenderTransferRootObject>(workRecord.RqstJsonData);

                // Walk through deal records now
                for (int i = 0; i < workRecordDataFields.recordDetails.quote.quoteLine.Count(); i++)
                {
                    // TODO: Ask Mahesh if he is going to use the same code body for Create/Update/StageChange, if so, place mode checks first with C/U following same path
                    string salesForceIdCntrct = workRecordDataFields.recordDetails.quote.Id;
                    string salesForceIdDeal = workRecordDataFields.recordDetails.quote.quoteLine[i].Id;
                    string custCimId = workRecordDataFields.recordDetails.quote.account.CIMId; // empty string still returns Dell ID
                    workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages = new List<TenderTransferRootObject.RecordDetails.Quote.QuoteLine.ErrorMessages>();

                    // TODO: Do a record stability check first and if no error messages, continue, catch things like ECAP/GEO/ETC

                    executionResponse += "Processing [" + workRecord.BtchId + "] - [" + salesForceIdCntrct + "] - [" + salesForceIdDeal + "]<br>";
                    custId = jmsDataLib.FetchCustFromCimId(custCimId); // set the customer ID based on Customer CIM ID

                    List<TendersSFIDCheck> sfToMydlIds = jmsDataLib.FetchDealsFromSfiDs(salesForceIdCntrct, salesForceIdDeal);
                    if (sfToMydlIds == null)
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(100, "DB Lookup Error", "Failed, ID lookup Error"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue; // we had error on lookup, skip to next to process
                    }

                    folioId = sfToMydlIds[0].Cntrct_SID;
                    dealId = sfToMydlIds[0].Wip_SID;

                    List<int> passedFolioIds = new List<int>() { folioId };
                    MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(passedFolioIds, new List<OpDataElementType> { OpDataElementType.CNTRCT }); // Make the save object

//List<int> passedFolioIds2 = new List<int>() { 512632 };
//MyDealsData myDealsData2 = OpDataElementType.WIP_DEAL.GetByIDs(passedFolioIds2, new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }).FillInHolesFromAtrbTemplate(); // Make the save object .FillInHolesFromAtrbTemplate()

                    if (custId == 0) // Need to have a working customer for this request and failed, skip!
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(101, "Invalid Customer", "Unable to find the customer with CIMId"));
                        executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                        continue; 
                    }

                    // Step 2 - Deal with a contract header
                    if (folioId == 0) // This is a new contract header
                    {
                        folioId = ProcessSalesForceContractInformation(folioId, salesForceIdCntrct, custId, workRecordDataFields, i);
                        workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();

                        if (folioId <= 0)  // Needed to create a new Folio for this request and failed, skip!
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(201, "Folio Error", "Failed to create the Tender Folio for this request"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue; 
                        }
                    }
                    else // Potential Folio update route
                    {
                        workRecordDataFields.recordDetails.quote.FolioID = folioId.ToString();
                    }

                    // Step 2a - Deal with a deal structure now
                    if (dealId == 0) // This is a new deal entry
                    {
                        dealId = ProcessSalesForceDealInformation(dealId, folioId, salesForceIdDeal, custId, myDealsData, workRecordDataFields, i);
                        workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                        if (dealId < 0)  // Needed to create a new PS to WIP Deal for this request and failed, error..
                        {
                            workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages.Add(AppendError(301, "Deal Error", "Failed to create the Tender Deal"));
                            executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                            continue;
                        }
                    }
                    else // Potential Deals update route 
                    {
                        workRecordDataFields.recordDetails.quote.quoteLine[i].DealRFQId = dealId.ToString();
                    }

                    // Should have no bail outs, so post final messages here
                    executionResponse += dumpErrorMessages(workRecordDataFields.recordDetails.quote.quoteLine[i].errorMessages, folioId, dealId);
                } // End of quote lines loop


                // Process the response message now
                workRecordDataFields.header.source_system = "MyDeal";
                workRecordDataFields.header.target_system = "Tender";
                workRecordDataFields.header.action = "Update";

                string jsonData = JsonConvert.SerializeObject(workRecordDataFields);
                List<int> deadIdList = new List<int>() { dealId };
                Guid saveSuccessful =
                    jmsDataLib.SaveTendersDataToStage("TENDER_DEALS_RESPONSE", deadIdList, jsonData);

                if (saveSuccessful != Guid.Empty
                ) // Then we can close out the processing record and go for an immediate send back
                {
                    jmsDataLib.UpdateTendersStage(workRecord.BtchId, "Processing_Complete");
                    executionResponse += "Successful, response object created (" + saveSuccessful + ")<br>";
                }
                // Attempt to close out response now

                bool saveSuccessfulReturnToTenders = jmsDataLib.PublishBackToSfTenders(jsonData);

                if (saveSuccessfulReturnToTenders == true) // The return data has been sent back to tenders, close out our safety record
                {
                    jmsDataLib.UpdateTendersStage(saveSuccessful, "Processing_Complete");
                    executionResponse += "Response object successfully returned<br><br>";
                }
                //executionResponse += jsonData + "<br>";
            }

            return executionResponse;
        }

        public string ReturnSalesForceTenderResults() // Bulk processing of Renders Responses - Send back to MuleSoft
        {
            string executionResponse = "";

            JmsDataLib jmsDataLib = new JmsDataLib();
            List<TenderTransferObject> returnStagedWorkRecords = jmsDataLib.FetchTendersStagedData("TENDER_DEALS_RESPONSE", Guid.Empty);

            foreach (TenderTransferObject workRecord in returnStagedWorkRecords)
            {
                bool saveSuccessfulReturnToTenders = jmsDataLib.PublishBackToSfTenders(workRecord.RqstJsonData);

                if (saveSuccessfulReturnToTenders == true) // The return data has been sent back to tenders, close out our safety record
                {
                    jmsDataLib.UpdateTendersStage(workRecord.BtchId, "Processing_Complete");
                    executionResponse += "Response object [" + workRecord.BtchId + "] successfully returned<br>";
                }
            }

            return executionResponse;
        }
        #endregion TENDERS INTEGRATION ITEMS IN CONTRACTS CONTROLLER

        // This is old tenders management page header and body below
        public MyDealsData CreateTenderFolio(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            List<int> dealIds = data[0]["dealIds"].ToString().Split(',').Select(Int32.Parse).ToList();
            
            //string dealIdsWithPrefix = string.Join("#", data[0]["dealIds"]);
            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(dealIds, new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW });
            string custAccountDivisionsFromContract = "";

            List<MyDealsAttribute> cntrctAtrbs = new List<MyDealsAttribute>
            {
                Attributes.WF_STG_CD,
                Attributes.TITLE,
                Attributes.COMP_MISSING_FLG,
                Attributes.HAS_ATTACHED_FILES,
                Attributes.OBJ_SET_TYPE_CD,
                Attributes.TENDER_PUBLISHED,
                Attributes.CUST_MBR_SID,
                Attributes.START_DT,
                Attributes.END_DT,
                Attributes.C2A_DATA_C2A_ID,
                Attributes.CUST_ACCNT_DIV,
                Attributes.MEETCOMP_TEST_RESULT,
                Attributes.COST_TEST_RESULT,
                Attributes.CUST_ACCPT,
                Attributes.PASSED_VALIDATION,
                Attributes.HAS_TRACKER,
                Attributes.OVERLAP_RESULT,
                Attributes.COST_MISSING_FLG,
                Attributes.SYS_COMMENTS,
                Attributes.CAP_MISSING_FLG,
                Attributes.IN_REDEAL,
                Attributes.IS_TENDER,
                Attributes.VERTICAL_ROLLUP
            };

            List<KeyValuePair<MyDealsAttribute, string>> psAtrbs = new List<KeyValuePair<MyDealsAttribute, string>>();

            // Only FSE and GA can create/copy tenders
            var stage = OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA ? WorkFlowStages.Requested : WorkFlowStages.Draft;
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.WF_STG_CD, stage.ToString())); // When we copy always set
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.TITLE, data[0]["TITLE"] + " PS"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.COMP_MISSING_FLG, "0"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.OBJ_SET_TYPE_CD, "ALL_TYPES"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.MEETCOMP_TEST_RESULT, "Not Run Yet"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.COST_TEST_RESULT, "Not Run Yet"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.PASSED_VALIDATION, "Dirty"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.HAS_TRACKER, "0"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.OVERLAP_RESULT, "Not Run Yet"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.COST_MISSING_FLG, "0"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.SYS_COMMENTS, "Pricing Strategy Created from a Copy"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.CAP_MISSING_FLG, "0"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.IN_REDEAL, "0"));
            psAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.VERTICAL_ROLLUP, ""));

            List<KeyValuePair<MyDealsAttribute, string>> ptAtrbs = new List<KeyValuePair<MyDealsAttribute, string>>();
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.REBATE_TYPE, "TENDER"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.TITLE, data[0]["TITLE"] + " PT"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.COMP_MISSING_FLG, "0"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.PAYOUT_BASED_ON, "Consumption"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.OBJ_SET_TYPE_CD, data[0][AttributeCodes.OBJ_SET_TYPE_CD].ToString()));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.MRKT_SEG, "Corp"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.PROGRAM_PAYMENT, "Backend"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.GEO_COMBINED, "Worldwide"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.PROD_INCLDS, "Tray"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.PASSED_VALIDATION, "Dirty"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.HAS_TRACKER, "0"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.COST_MISSING_FLG, "0"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.SYS_COMMENTS, "Pricing Table Created from a Copy"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.CAP_MISSING_FLG, "0"));
            ptAtrbs.Add(new KeyValuePair<MyDealsAttribute, string>(Attributes.IN_REDEAL, "0"));

            List<OpDataElement> cntrctDEs = new List<OpDataElement>();
            foreach (MyDealsAttribute atrb in cntrctAtrbs)
            {
                if (data[0].ContainsKey(atrb.ATRB_COL_NM))
                {
                    if (atrb.ATRB_COL_NM == AttributeCodes.SYS_COMMENTS)
                    {
                        data[0][atrb.ATRB_COL_NM] = "Folio created from a Copy of deal(s) #" + data[0]["dealIds"].ToString();
                    }
                    if (atrb.ATRB_COL_NM == AttributeCodes.CUST_ACCNT_DIV && data[0][atrb.ATRB_COL_NM].ToString() != "")
                    {
                        custAccountDivisionsFromContract = data[0][atrb.ATRB_COL_NM].ToString(); // Set the division values for later
                    }
                    if (atrb.ATRB_COL_NM == AttributeCodes.CUST_ACCNT_DIV && data[0][atrb.ATRB_COL_NM].ToString() == "") // Only save populated not empty diviions
                    {
                        // Don't save an empty division
                    }
                    else
                    { 
                        cntrctDEs.Add(new OpDataElement
                        {
                            DcID = -101,
                            DcType = OpDataElementTypeConverter.StringToId(OpDataElementType.CNTRCT.ToString()),
                            DcParentType = 0,
                            DcParentID = 0,
                            AtrbID = atrb.ATRB_SID,
                            AtrbValue = data[0][atrb.ATRB_COL_NM].ToString(),
                            OrigAtrbValue = String.Empty,
                            PrevAtrbValue = String.Empty,
                            AtrbCd = atrb.ATRB_COL_NM,
                            State = OpDataElementState.Modified
                        });
                    }
                }
            }

            // Assumption that this is middle tier located in Cali, so I don't have to set CultureInfo("en-US")
            var quarterDetails = new CustomerCalendarDataLib().GetCustomerQuarterDetails(2, DateTime.Now, null, null);
            var strtDt = cntrctDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.START_DT);
            var endDt = cntrctDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.END_DT);
            strtDt.AtrbValue = quarterDetails.QTR_STRT.ToString("d"); // This is likely in the past, just setting the post, might switch to today (DateTime.Now)
            endDt.AtrbValue = quarterDetails.QTR_END.ToString("d");

            List<OpDataElement> psDEs = new List<OpDataElement>();
            foreach (KeyValuePair<MyDealsAttribute, string> item in psAtrbs)
            {
                psDEs.Add(new OpDataElement
                {
                    DcID = -201,
                    DcType = OpDataElementTypeConverter.StringToId(OpDataElementType.PRC_ST.ToString()),
                    DcParentType = OpDataElementTypeConverter.StringToId(OpDataElementType.CNTRCT.ToString()),
                    DcParentID = -101,
                    AtrbID = item.Key.ATRB_SID,
                    AtrbValue = item.Value,
                    OrigAtrbValue = String.Empty,
                    PrevAtrbValue = String.Empty,
                    AtrbCd = item.Key.ATRB_COL_NM,
                    State = OpDataElementState.Modified
                });
            }

            List<OpDataElement> ptDEs = new List<OpDataElement>();
            foreach (KeyValuePair<MyDealsAttribute, string> item in ptAtrbs)
            {
                ptDEs.Add(new OpDataElement
                {
                    DcID = -301,
                    DcType = OpDataElementTypeConverter.StringToId(OpDataElementType.PRC_TBL.ToString()),
                    DcParentType = OpDataElementTypeConverter.StringToId(OpDataElementType.PRC_ST.ToString()),
                    DcParentID = -201,
                    AtrbID = item.Key.ATRB_SID,
                    AtrbValue = item.Value,
                    OrigAtrbValue = String.Empty,
                    PrevAtrbValue = String.Empty,
                    AtrbCd = item.Key.ATRB_COL_NM,
                    State = OpDataElementState.Modified
                });
            }

            int uid = -401;
            AttributeCollection attrCollection = DataCollections.GetAttributeData();
            List<OpDataCollector> ptrDCs = new List<OpDataCollector>();
            foreach (OpDataCollector ptr in myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors)
            {
                ptr.DcID = uid--;
                ptr.DcParentID = -301;

                // Set values of PTR items as needed (customer, division, stage), clean out things that will harm us down the road as well..

                ptr.DataElementDict[AttributeCodes.CUST_MBR_SID + "|0"].AtrbValue = cntrctDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.CUST_MBR_SID).AtrbValue;
                if (custAccountDivisionsFromContract != "")
                {
                    AddOrUpdateElementInPTR(ptr, AttributeCodes.CUST_ACCNT_DIV, cntrctDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.CUST_ACCNT_DIV).AtrbValue, attrCollection);
                }
                AddOrUpdateElementInPTR(ptr, AttributeCodes.WF_STG_CD, WorkFlowStages.Draft, attrCollection);
                AddOrUpdateElementInPTR(ptr, AttributeCodes.PS_WF_STG_CD, psDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.WF_STG_CD).AtrbValue, attrCollection);
                ptr.SetDataElementValue(AttributeCodes.PTR_SYS_PRD, "");  // Force the products to be re-validated.
                ptr.SetDataElementsValue(AttributeCodes.HAS_TRACKER, ""); // copied items can't have a tracker
                ptr.SetDataElementsValue(AttributeCodes.IN_REDEAL, ""); // copied items can't be in redeal
                ptr.SetDataElementsValue(AttributeCodes.IS_CANCELLED, ""); // copied items can't be already cancelled

                // Set important values within all DEs now
                foreach (OpDataElement de in ptr.DataElements)
                {
                    de.DcID = ptr.DcID;
                    de.DcParentID = ptr.DcParentID;
                    de.State = OpDataElementState.Modified;
                    de.PrevAtrbValue = "";
                    de.OrigAtrbValue = "";
                }

                ptrDCs.Add(ptr);
            }

            // Setting KIT or ECAP based on data passed
            var ptTargetType = ptDEs.FirstOrDefault(p => p.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD);
            ptTargetType.AtrbValue = ptrDCs.FirstOrDefault().GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            //ptAtrbs OBJ_SET_TYPE_CD update to PTR

            // Construct a list of verticals at the contract/PS levels for vertical security workaround.
            List<string> verts = new List<string>();
            foreach (OpDataCollector dc in ptrDCs)
            {
                string tempVerts = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.VERTICAL_ROLLUP).AtrbValue.ToString();
                List<string> vertsArry = tempVerts.Split(',').ToList();
                foreach (string item in vertsArry)
                {
                    if (!verts.Contains(item)) verts.Add(item);
                }
            }
            var cntrctVerts = cntrctDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.VERTICAL_ROLLUP);
            cntrctVerts.AtrbValue = string.Join(",", verts);
            var psVerts = psDEs.FirstOrDefault(d => d.AtrbCd == AttributeCodes.VERTICAL_ROLLUP);
            cntrctVerts.AtrbValue = string.Join(",", verts);

            MyDealsData myDealsDataNewObject = new MyDealsData();
            myDealsDataNewObject[OpDataElementType.CNTRCT] = new OpDataPacket<OpDataElementType>()
            {
                Data =
                            {
                                [-101] = new OpDataCollector
                                {
                                    DcID = -101,
                                    DcParentID = 0,
                                    DcParentType = "ALL_OBJ_TYPE",
                                    DcType = OpDataElementType.CNTRCT.ToString(),
                                    DataElements = cntrctDEs
                                }
                            },
                BatchID = Guid.NewGuid(),
                PacketType = OpDataElementType.CNTRCT,
                GroupID = -101
            };
            myDealsDataNewObject[OpDataElementType.CNTRCT].AddSaveActions();

            myDealsDataNewObject[OpDataElementType.PRC_ST] = new OpDataPacket<OpDataElementType>()
            {
                Data =
                            {
                                [-201] = new OpDataCollector
                                {
                                    DcID = -201,
                                    DcParentID = -101,
                                    DcParentType = OpDataElementType.CNTRCT.ToString(),
                                    DcType = OpDataElementType.PRC_ST.ToString(),
                                    DataElements = psDEs
                                }
                            },
                BatchID = Guid.NewGuid(),
                PacketType = OpDataElementType.PRC_ST,
                GroupID = -201
            };
            myDealsDataNewObject[OpDataElementType.PRC_ST].AddSaveActions();

            myDealsDataNewObject[OpDataElementType.PRC_TBL] = new OpDataPacket<OpDataElementType>()
            {
                Data =
                            {
                                [-301] = new OpDataCollector
                                {
                                    DcID = -301,
                                    DcParentID = -201,
                                    DcParentType = OpDataElementType.PRC_ST.ToString(),
                                    DcType = OpDataElementType.PRC_TBL.ToString(),
                                    DataElements = ptDEs
                                }
                            },
                BatchID = Guid.NewGuid(),
                PacketType = OpDataElementType.PRC_TBL,
                GroupID = -301
            };
            myDealsDataNewObject[OpDataElementType.PRC_TBL].AddSaveActions();

            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW] = new OpDataPacket<OpDataElementType>();
            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW].Data.AddRange(ptrDCs);
            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW].BatchID = Guid.NewGuid();
            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW].PacketType = OpDataElementType.PRC_TBL_ROW;
            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW].GroupID = -401;
            myDealsDataNewObject[OpDataElementType.PRC_TBL_ROW].AddSaveActions();

            return myDealsDataNewObject.Save(savePacket.MyContractToken);
        }

        public void AddOrUpdateElementInPTR(OpDataCollector ptr, string fieldName, object setValue, AttributeCollection attrCollection)
        {
            if (ptr.DataElements.FirstOrDefault(d => d.AtrbCd == fieldName) != null)
            {
                ptr.DataElementDict[fieldName + "|0"].AtrbValue = setValue;
            }
            else
            {
                ptr.AddDataElement(fieldName, setValue, attrCollection);
            }
        }

        /// <summary>
        /// Save a contract header
        /// </summary>
        /// <param name="data"></param>
        /// <param name="savePacket"></param>
        /// <returns>MyDealsData</returns>
        public OpDataCollectorFlattenedDictList SaveContract(OpDataCollectorFlattenedList data, SavePacket savePacket)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.CNTRCT] = data
            }, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        /// <summary>
        /// Save a contract and all of it's levels
        /// </summary>
        /// <param name="contracts">Contract collection</param>
        /// <param name="pricingStrategies">Pricing Strategy collection</param>
        /// <param name="pricingTables">Pricing Table collection</param>
        /// <param name="pricingTableRows">Pricing table Row collection</param>
        /// <param name="wipDeals">Wip Deals collection</param>
        /// <param name="savePacket"></param>
        /// <returns>MyDealsData</returns>
        public MyDealsData SaveContract(
            OpDataCollectorFlattenedList contracts,
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            SavePacket savePacket)
        {
            OpLog.Log("contractsLib.SaveContract - Start.");
            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 1)
            {
                stopwatch.Start();
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\tSaving Contract {1}", stopwatch.Elapsed.TotalMilliseconds, savePacket.MyContractToken.ContractId, DateTime.Now);
            }

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            List<int> primaryIds = new List<int>();
            List<int> secondaryIds = new List<int>();

            List<OpDataElementType> primaryOpDataElementTypes = new List<OpDataElementType>();
            List<OpDataElementType> secondaryOpDataElementTypes = new List<OpDataElementType>();

            if (contracts != null && contracts.Any())
            {
                data[OpDataElementType.CNTRCT] = contracts;
                primaryOpDataElementTypes.Add(OpDataElementType.CNTRCT);
                primaryIds = contracts.Where(items => items.ContainsKey(AttributeCodes.DC_ID))
                        .Select(items => int.Parse(items[AttributeCodes.DC_ID].ToString())).ToList();
            }
            if (pricingStrategies != null && pricingStrategies.Any())
            {
                data[OpDataElementType.PRC_ST] = pricingStrategies;
                primaryOpDataElementTypes.Add(OpDataElementType.PRC_ST);
            }
            if (pricingTables != null && pricingTables.Any())
            {
                data[OpDataElementType.PRC_TBL] = pricingTables;
                primaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL);
                //secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL);
                secondaryIds = pricingTables.Where(items => items.ContainsKey(AttributeCodes.DC_ID))
                        .Select(items => int.Parse(items[AttributeCodes.DC_ID].ToString())).ToList();
            }

            // Don't check for ANY becuase we might have to delete the last item
            if (pricingTableRows != null && (savePacket.MyContractToken.DeleteAllPTR) || pricingTableRows.Any())
            {
                data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
                secondaryOpDataElementTypes.Add(OpDataElementType.PRC_TBL_ROW);
            }

            if (wipDeals != null && wipDeals.Any())
            {
                data[OpDataElementType.WIP_DEAL] = wipDeals;
                secondaryOpDataElementTypes.Add(OpDataElementType.WIP_DEAL);
            }


            MyDealsData rtn = _dataCollectorLib.SavePackets(
                data, savePacket,
                primaryIds, primaryOpDataElementTypes, OpDataElementType.CNTRCT,
                secondaryIds, secondaryOpDataElementTypes, OpDataElementType.PRC_TBL);

            if (EN.GLOBAL.DEBUG >= 1)
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\tSaved Contract {1}", stopwatch.Elapsed.TotalMilliseconds, savePacket.MyContractToken.ContractId, DateTime.Now);

            OpLog.Log("contractsLib.SaveContract - Complete.");
            return rtn;
        }

        public OpDataCollectorFlattenedDictList SaveFullContract(OpDataCollectorFlattenedDictList fullContracts, SavePacket savePacket)
        {
            return SaveContract(
                fullContracts.ContainsKey(OpDataElementType.CNTRCT) ? fullContracts[OpDataElementType.CNTRCT] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_ST) ? fullContracts[OpDataElementType.PRC_ST] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL) ? fullContracts[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullContracts[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullContracts.ContainsKey(OpDataElementType.WIP_DEAL) ? fullContracts[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(ContractToken contractToken, ContractTransferPacket contractAndStrategy, bool forceValidation, bool forcePublish)
        {
            OpDataCollectorFlattenedList translatedFlattenedList = new OpDataCollectorFlattenedList();

            // Check to see if a translation from PTR to WIP or WIP to PTR is needed
            bool isPrcTblSource = contractAndStrategy.EventSource == OpDataElementType.PRC_TBL.ToString();
            bool isWipDealSource = contractAndStrategy.EventSource == OpDataElementType.WIP_DEAL.ToString();
            List<int> validationIds = new List<int>();
            bool resetValidationChild = false;

            contractToken.NeedToCheckForDelete = isPrcTblSource;

            // if we are deleting a PTR... only the PTR is being passed.  We don't want to issue deleted for the rest of the PTRs not passed
            //if (contractToken.DelPtr) contractToken.NeedToCheckForDelete = false;

            contractToken.DeleteAllPTR = (contractAndStrategy.PricingTableRow.Count == 0);

            if (forceValidation)
            {
                if (isPrcTblSource)
                {
                    validationIds.AddRange(contractAndStrategy.PricingTableRow.Select(item => int.Parse(item[AttributeCodes.DC_ID].ToString())));
                }
                else if (isWipDealSource)
                {
                    validationIds.AddRange(contractAndStrategy.WipDeals.Select(item => int.Parse(item[AttributeCodes.DC_ID].ToString())));
                }
            }

            if (forcePublish)
            {
                if (isPrcTblSource)
                {
                    translatedFlattenedList = contractAndStrategy.PricingTableRow.TranslateToWip();
                    resetValidationChild = true;
                }
                else if (isWipDealSource)
                {
                    if (contractToken != null && contractToken.BulkTenderUpdate == true)    //tenders
                    {
                        //special actions taken for tender because all other regular deals assume the user would only be modifying a single pricing table at a time
                        //we need to make sure the pricing table we pass in to TranslateToPrcTbl is the pricing table that correlates to the tender deal... which is tricky because we do not have PTR information (that's the whole point of calling Translate to PrcTbl after all.  Luckily we store pricing strategy information temporarily with every tender wip deal we pass in that we can use to match against pricing table parent ids
                        string ps_id_str;
                        OpDataCollectorFlattenedList tempWipList;
                        foreach (OpDataCollectorFlattenedItem wipData in contractAndStrategy.WipDeals)
                        {
                            //we want to invoke translateToPrcTbl once for each wip deal so lets start by finding its psId and the single pricing table that has the same parentId (PS_ID).  
                            //Here we make an ASSUMPTION that tender deals will always exist in a 1:1:1:1:1 Cntrct/PS/PT/PTR/WIP ratio
                            ps_id_str = wipData["_parentIdPS"].ToString();
                            foreach (OpDataCollectorFlattenedItem ptData in contractAndStrategy.PricingTable)
                            {
                                if (ptData["DC_PARENT_ID"].ToString() == ps_id_str)
                                {
                                    //entering this if means we found the pricing table that had a parent id (PS_ID) which matched the temp atrb pricing strategy id we passed in at wip deal level
                                    tempWipList = new OpDataCollectorFlattenedList();
                                    tempWipList.Add(wipData);
                                    translatedFlattenedList.AddRange(tempWipList.TranslateToPrcTbl(ptData));
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        //all non-tender deal types go through here
                        OpDataCollectorFlattenedItem pt = (contractAndStrategy.PricingTable != null && contractAndStrategy.PricingTable.Count > 0) ? contractAndStrategy.PricingTable[0] : new OpDataCollectorFlattenedItem();
                        translatedFlattenedList = contractAndStrategy.WipDeals.TranslateToPrcTbl(pt);
                    }
                }
            }

            if (contractAndStrategy.PtrDelIds != null && contractAndStrategy.PtrDelIds.Any()) validationIds.AddRange(contractAndStrategy.PtrDelIds);

            SavePacket savePacket = new SavePacket
            {
                MyContractToken = contractToken,
                ValidateIds = validationIds,
                ForcePublish = forcePublish,
                SourceEvent = contractAndStrategy.EventSource,
                ResetValidationChild = resetValidationChild
            };

            MyDealsData myDealsData = SaveContract(
                contractAndStrategy.Contract,
                contractAndStrategy.PricingStrategy,
                contractAndStrategy.PricingTable,
                isWipDealSource ? translatedFlattenedList : contractAndStrategy.PricingTableRow, //
                isPrcTblSource ? translatedFlattenedList : contractAndStrategy.WipDeals,
                savePacket);
            //.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested);

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            myDealsData.FillInHolesFromAtrbTemplate();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType,
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested);
            }

            return data;
            // == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested
        }

        public OpMsg DeleteContract(ContractToken contractToken)
        {
            OpDataCollectorFlattenedDictList opDcDict = GetContract(contractToken.ContractId, false).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.UniqueKey);
            OpDataCollectorFlattenedList contracts = opDcDict[OpDataElementType.CNTRCT];
            return contracts.DeleteByIds(OpDataElementType.CNTRCT, contractToken, _dataCollectorLib);
        }

        public bool IsDuplicateContractTitle(int dcId, string title)
        {
            return new OpDataCollectorValidationDataLib().IsDuplicateTitle(OpDataElementType.CNTRCT, dcId, 0, title);
        }
        
        /// <summary>
        /// Get wip exclusions 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public OpDataCollectorFlattenedDictList GetWipExclusionFromContract(int id)
        {
            MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(
                new List<int> { id },
                new List<OpDataElementType>
                {
                    OpDataElementType.WIP_DEAL
                },
                new List<int>
                {
                    Attributes.WF_STG_CD.ATRB_SID,
                    Attributes.PS_WF_STG_CD.ATRB_SID,
                    Attributes.DEAL_GRP_EXCLDS.ATRB_SID,
                    Attributes.DEAL_GRP_CMNT.ATRB_SID,
                    Attributes.TITLE.ATRB_SID,
                    Attributes.PTR_USER_PRD.ATRB_SID,
                    Attributes.COST_TEST_RESULT.ATRB_SID,
                    Attributes.MEETCOMP_TEST_RESULT.ATRB_SID,
                    Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                    Attributes.START_DT.ATRB_SID,
                    Attributes.END_DT.ATRB_SID,
                    Attributes.OEM_PLTFRM_LNCH_DT.ATRB_SID,
                    Attributes.OEM_PLTFRM_EOL_DT.ATRB_SID,
                    Attributes.DEAL_COMB_TYPE.ATRB_SID,
                    Attributes.MRKT_SEG.ATRB_SID,
                    Attributes.MAX_RPU.ATRB_SID,
                    Attributes.REBATE_TYPE.ATRB_SID,
                    Attributes.ECAP_PRICE.ATRB_SID,
                    Attributes.DEAL_DESC.ATRB_SID,
                    Attributes.CONSUMPTION_REASON.ATRB_SID,
                    Attributes.CONSUMPTION_REASON_CMNT.ATRB_SID
                });

            //// Get all the products in a collection base on the PRODUCT_FILTER
            //// Note: the first hit is a performance dog as the product cache builds for the first time
            //List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
            //    .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
            //    .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            //List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);

            //foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            //{
            //    dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
            //}

            OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            return data;
        }

        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>();

            MyDealsData myDealsData = OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes, atrbs);

            // Get all the products in a collection base on the PRODUCT_FILTER
            // Note: the first hit is a performance dog as the product cache builds for the first time
            List<int> prodIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                .Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbValue.ToString() != "")
                .Select(d => int.Parse(d.AtrbValue.ToString())).ToList();
            List<ProductEngName> prods = new ProductDataLib().GetEngProducts(prodIds);
            Dictionary<int, List<ProductEngName>> prodMap = new Dictionary<int, List<ProductEngName>>();
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                dc.ApplyRules(MyRulesTrigger.OnDealListLoad, null, prods);
                prodMap[dc.DcID] = dc.GetDataElements(AttributeCodes.PRODUCT_FILTER).Select(d => (ProductEngName)d.PrevAtrbValue).ToList();
            }

            OpDataCollectorFlattenedDictList data = myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            //OpDataCollectorFlattenedDictList data = OpDataElementType.CNTRCT.GetByIDs(new List<int> { id }, opDataElementTypes, atrbs).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            CustomerLib custLib = new CustomerLib();
            foreach (OpDataCollectorFlattenedItem item in data[OpDataElementType.WIP_DEAL])
            {
                int dcId = int.Parse(item[AttributeCodes.DC_ID].ToString());
                item["products"] = prodMap.ContainsKey(dcId) ? prodMap[dcId] : new List<ProductEngName>();

                if (item.ContainsKey(AttributeCodes.CUST_MBR_SID))
                {
                    CustomerDivision cust = custLib.GetCustomerDivisionsByCustNmId(int.Parse(item[AttributeCodes.CUST_MBR_SID].ToString())).FirstOrDefault();
                    item["Customer"] = cust ?? new CustomerDivision();
                }
                else
                {
                    item["Customer"] = new CustomerDivision();
                }
            }

            return data;
        }

        public OpDataCollectorFlattenedDictList UpdateAtrbValue(int custId, int contractId, AtrbSaveItem atrbSaveItem)
        {
            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            MyDealsAttribute myDealsAttribute = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == atrbSaveItem.Attribute);

            MyDealsData myDealsData = atrbSaveItem.ObjSetType.UpdateAtrbValue(new ContractToken("ContractToken Created - UpdateAtrbValue")
            {
                CustId = custId,
                ContractId = contractId
            },
            atrbSaveItem.Ids,
            myDealsAttribute,
            atrbSaveItem.Value);

            return myDealsData.ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted, true);
        }

        public bool PublishTenderDeals(int CONTRACT_SID, List<int> excludeList)
        {
            OpDataCollectorDataLib opdc = new OpDataCollectorDataLib();
            return opdc.PublishTenderDeals(CONTRACT_SID, excludeList);
        }
    }
}