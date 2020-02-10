using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.MyDeals.Helpers;
using Intel.Opaque.Data;
using Intel.MyDeals.BusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Contracts/v1")]
    public class ContractsController : BaseApiController
    {
        private readonly IContractsLib _contractsLib;

        public ContractsController(IContractsLib contractsLib)
        {
            this._contractsLib = contractsLib;
        }

        [Authorize]
        [Route("GetContract/{id}")]
        public MyDealsData GetContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContract(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("GetFullNestedContract/{id}")]
        public MyDealsData GetFullNestedContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContract(id, true)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("GetUpperContract/{id}")]
        public OpDataCollectorFlattenedList GetUpperContract(int id)
        {
            if (id <= 0) return new OpDataCollectorFlattenedList();

            OpDataCollectorFlattenedList rtn = SafeExecutor(() => _contractsLib.GetUpperContract(id)
                , $"Unable to get Contract {id}"
            );

            int custId = !rtn.Any() || rtn[0]["CUST_MBR_SID"] == null || rtn[0]["CUST_MBR_SID"].ToString() == string.Empty ? 0 : int.Parse(rtn[0]["CUST_MBR_SID"].ToString());

            //List<VerticalSecurityItem> blah = DataCollections.GetMyVerticals().VerticalInfo; // Testing call, comment out
            //List<string> objVerticals = rtn[0]["VERTICAL_ROLLUP"].ToString().Split(',').ToList(); // Testing call, comment out
            // Next line gathers the current user's verticals and cross checks them with the contract level verticals to set containsVertical flag.  Matches trigger True as does empty user verticals (WW).
            bool containsVertical = DataCollections.GetMyVerticals().VerticalInfo.Any()? DataCollections.GetMyVerticals().VerticalInfo.Select(x => x.VerticalName).Intersect(rtn[0]["VERTICAL_ROLLUP"].ToString().Split(',').ToList()).Any(): true;

            if (custId == 0 || DataCollections.GetMyCustomers().CustomerInfo.All(c => c.CUST_SID != custId) || !containsVertical)
            {
                return new OpDataCollectorFlattenedList();
            }
            return rtn;
        }

        [Authorize]
        [Route("GetExportContract/{id}")]
        public OpDataCollectorFlattenedList GetExportContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetExportContract(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("GetContractStatus/{id}")]
        public OpDataCollectorFlattenedList GetContractStatus(int id)
        {
            return SafeExecutor(() => _contractsLib.GetContractStatus(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("GetFullContract/{id}")]
        public OpDataCollectorFlattenedDictList GetFullContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetFullContract(id)
                , $"Unable to get Contract {id}"
            );
        }

        [Authorize]
        [Route("SaveContract/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveContract(int custId, int contractId, OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveContract")
            {
                CustId = custId,
                ContractId = contractId
            });

            return SafeExecutor(() => _contractsLib.SaveContract(contracts, savePacket)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("CopyContract/{custId}/{contractId}/{srcContractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList CopyContract(int custId, int contractId, int srcContractId, OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - OpDataCollectorFlattenedDictList")
            {
                CustId = custId,
                ContractId = contractId,
                CopyFromId = srcContractId,
                CopyFromObjType = OpDataElementType.CNTRCT
            });

            return SafeExecutor(() => _contractsLib.SaveContract(contracts, savePacket)
                , "Unable to copy the Contract"
            );
        }

        [Authorize]
        [Route("CopyTenderFolioContract")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList CopyTenderFolioContract(OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - OpDataCollectorFlattenedDictList")
            {
                CustId = int.Parse(contracts[0]["CUST_MBR_SID"].ToString()),
                ContractId = int.Parse(contracts[0]["DC_ID"].ToString())
                //CopyFromId = srcContractId, //contracts[0]["TITLE"]
                //CopyFromObjType = OpDataElementType.CNTRCT
            });
            return SafeExecutor(() => _contractsLib.CreateTenderFolio(contracts, savePacket).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted)
                , "Unable to copy the Contract"
            );
        }

        //copyTenderFolioContract

        [Authorize]
        [Route("CopyContractPivot/{custId}/{contractId}/{srcContractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedList CopyContractPivot(int custId, int contractId, int srcContractId, OpDataCollectorFlattenedList contracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - OpDataCollectorFlattenedDictList")
            {
                CustId = custId,
                ContractId = contractId,
                CopyFromId = srcContractId,
                CopyFromObjType = OpDataElementType.CNTRCT
            });

            return SafeExecutor(() => _contractsLib.SaveContract(contracts, savePacket)
                .ToHierarchialList(OpDataElementType.CNTRCT)
                , "Unable to copy the Contract"
            );
        }

        [Authorize]
        [Route("SaveTenderContract/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveTenderContract(int custId, int contractId, ContractTransferPacket upperContractData)
        {
            return SafeExecutor(() => _contractsLib.SaveTenderContract(custId, contractId, upperContractData)
                , "Unable to save the Contract"
            );

        }

        [Authorize]
        [Route("SaveSalesForceTenderData/{custId}/{contractId}")]
        [HttpGet]
        //[HttpPost]
        //[AntiForgeryValidate]
        public string SaveSalesForceTenderData(int custId, int contractId, ContractTransferPacket upperContractData)
        {
            // Rough this out as a get, bring back as a post since Mule soft will issue the hit as a post.
            ContractTransferPacket testData = new ContractTransferPacket();
            testData.Contract = new OpDataCollectorFlattenedList();
            testData.PricingStrategy = new OpDataCollectorFlattenedList();
            testData.PricingTable = new OpDataCollectorFlattenedList();
            testData.PricingTableRow = new OpDataCollectorFlattenedList();
            testData.WipDeals = new OpDataCollectorFlattenedList();

            OpDataCollectorFlattenedItem testContractData = new OpDataCollectorFlattenedItem();
            testContractData.Add("DC_ID", "-100");
            testContractData.Add("dc_type", "CNTRCT");
            testContractData.Add("DC_PARENT_ID", "0");
            testContractData.Add("dc_parent_type", "0");
            testContractData.Add("OBJ_SET_TYPE_CD", "ALL_TYPES");
            testContractData.Add("CUST_MBR_SID", "2");
            testContractData.Add("TITLE", "Contract Title SF1234");
            testData.Contract.Add(testContractData);

            OpDataCollectorFlattenedItem testPSData = new OpDataCollectorFlattenedItem();
            testPSData.Add("DC_ID", "-100");
            testPSData.Add("dc_type", "PRC_ST");
            testPSData.Add("DC_PARENT_ID", "-100"); //Not passed - set it func due to single object saves
            testPSData.Add("dc_parent_type", "CNTRCT");
            testPSData.Add("OBJ_SET_TYPE_CD", "ALL_TYPES");
            testPSData.Add("TITLE", "PS Title SF1234PS");
            testData.PricingStrategy.Add(testPSData);

            OpDataCollectorFlattenedItem testPTData = new OpDataCollectorFlattenedItem();
            testPTData.Add("DC_ID", "-100");
            testPTData.Add("dc_type", "PRC_TBL");
            testPTData.Add("DC_PARENT_ID", "-100"); //Not passed - set it func due to single object saves
            testPTData.Add("dc_parent_type", "PRC_ST");
            testPTData.Add("OBJ_SET_TYPE_CD", "ECAP");
            testPTData.Add("REBATE_TYPE", "TENDER");
            testPTData.Add("PAYOUT_BASED_ON", "Consumption");
            testPTData.Add("MRKT_SEG", "Corp");
            testPTData.Add("PROGRAM_PAYMENT", "Backend");
            testPTData.Add("GEO_COMBINED", "Worldwide");
            testPTData.Add("PROD_INCLDS", "Tray");
            testPTData.Add("TITLE", "PT Title SF1234PT");
            testData.PricingTable.Add(testPTData);

            OpDataCollectorFlattenedItem testPTRData = new OpDataCollectorFlattenedItem();
            testPTRData.Add("DC_ID", "-100");
            testPTRData.Add("dc_type", "PRC_TBL_ROW");
            testPTRData.Add("DC_PARENT_ID", "-100"); //Not passed - set it func due to single object saves
            testPTRData.Add("dc_parent_type", "PRC_TBL");
            testPTRData.Add("ECAP", "100");
            testPTRData.Add("REBATE_TYPE", "TENDER");
            testPTRData.Add("PAYOUT_BASED_ON", "Consumption");
            testPTRData.Add("OBJ_SET_TYPE_CD", "ECAP");
            testPTRData.Add("CUST_MBR_SID", "2");
            testPTRData.Add("START_DT", "09/19/2020");
            testPTRData.Add("END_DT", "12/28/2020");
            testPTRData.Add("VOLUME", "1000");
            testPTRData.Add("END_CUSTOMER_RETAIL", "Cisco");
            testPTRData.Add("MRKT_SEG", "Corp");
            testPTRData.Add("PROGRAM_PAYMENT", "Backend");
            testPTRData.Add("GEO_COMBINED", "Worldwide");
            testPTRData.Add("PTR_USER_PRD", "i3-8300");
            testPTRData.Add("PTR_SYS_PRD", "{\"i3-8300\":[{\"BRND_NM\":\"Ci3\",\"CAP\":\"129.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"12/7/2017\",\"DEAL_PRD_NM\":\"\",\"DEAL_PRD_TYPE\":\"CPU\",\"DERIVED_USR_INPUT\":\"i3-8300\",\"FMLY_NM\":\"Coffee Lake\",\"HAS_L1\":1,\"HAS_L2\":0,\"HIER_NM_HASH\":\"CPU DT Ci3 Coffee Lake i3-8300 \",\"HIER_VAL_NM\":\"i3-8300\",\"MM_MEDIA_CD\":\"Box, Tray\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"i3-8300\",\"PRD_ATRB_SID\":7006,\"PRD_CAT_NM\":\"DT\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":92189,\"PRD_STRT_DTM\":\"11/29/2017\",\"USR_INPUT\":\"i3-8300\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}");
            testPTRData.Add("PROD_INCLDS", "Tray");
            //testPTRData.Add("PASSED_VALIDATION", "Complete");
            testPTRData.Add("SYS_COMMENT", "SalesForce Created Pricing Table Row: i3-8300");
            testData.PricingTableRow.Add(testPTRData);

            OpDataCollectorFlattenedItem testDealData = new OpDataCollectorFlattenedItem();
            testDealData.Add("DC_ID", "0");
            testDealData.Add("dc_type", "WIP_DEAL");
            testDealData.Add("DC_PARENT_ID", "-100"); //Not passed - set it func due to single object saves
            testDealData.Add("dc_parent_type", "PRC_TBL_ROW");
            testDealData.Add("ECAP", "100");
            testDealData.Add("PRODUCT_FILTER", "92189");
            testDealData.Add("REBATE_TYPE", "TENDER");
            testDealData.Add("WF_STG_CD", "Draft"); // Because this is a new deal
            testDealData.Add("TITLE", "i3-8300"); // Echo out user product name
            testDealData.Add("PAYOUT_BASED_ON", "Consumption");
            //testDealData.Add("CAP", "129"); // From PTR_SYS_PRD
            //testDealData.Add("YCS2_PRC_IRBT", "No YCS2"); // From PTR_SYS_PRD
            testDealData.Add("OBJ_SET_TYPE_CD", "ECAP");
            testDealData.Add("CUST_MBR_SID", "2");
            testDealData.Add("START_DT", "09/19/2020");
            testDealData.Add("END_DT", "12/28/2020");
            testDealData.Add("VOLUME", "1000");
            testDealData.Add("END_CUSTOMER_RETAIL", "Cisco");
            //testDealData.Add("ON_ADD_DT", "09/19/2020"); // default to start
            testDealData.Add("CONSUMPTION_REASON", "None");
            testDealData.Add("MRKT_SEG", "Corp");
            testDealData.Add("PROGRAM_PAYMENT", "Backend");
            //testDealData.Add("REBATE_BILLING_START", "09/19/2020"); // default to start
            //testDealData.Add("REBATE_BILLING_END", "12/28/2020"); // default to end
            testDealData.Add("DEAL_COMB_TYPE", "Mutually Exclusive");
            testDealData.Add("GEO_COMBINED", "Worldwide");
            testDealData.Add("PTR_USER_PRD", "i3-8300");
            testDealData.Add("PROD_INCLDS", "Tray");
            //testDealData.Add("CAP_STRT_DT", "12/7/2017"); // From PTR_SYS_PRD
            //testDealData.Add("CAP_END_DT", "12/31/9999"); // From PTR_SYS_PRD
            testDealData.Add("PASSED_VALIDATION", "Complete"); // From PTR_SYS_PRD
            testDealData.Add("HAS_L1", "1"); // From PTR_SYS_PRD
            testDealData.Add("HAS_L2", "0"); // From PTR_SYS_PRD
            testDealData.Add("PRODUCT_CATEGORIES", "DT"); // From PTR_SYS_PRD
            testDealData.Add("SYS_COMMENT", "SalesForce Created Deals: i3-8300");
            testData.WipDeals.Add(testDealData);

            // Stage the data and pass 
            //var blah = SafeExecutor(() => _contractsLib.SaveTenderContract(custId, contractId, testData)
            //    , "Unable to save the Contract"
            //);
            var blah = SafeExecutor(() => _contractsLib.SaveSalesForceTenderData(custId, contractId, testData) //upperContractData)
                , "Unable to save the SalesForce Tender Deal"
            );

            int j = 0;
            return "Blahme";
        }

        [Authorize]
        [Route("PublishTenderContract/{objSid}")]
        [HttpPost]
        [AntiForgeryValidate]
        public bool PublishTenderContract(int objSid, List<int> excludeList)
        {
            return SafeExecutor(() => _contractsLib.PublishTenderDeals(objSid, excludeList)
                , "Unable to save the Contract"
            );

        }

        [Authorize]
        [Route("SaveFullContract/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveFullContract(int custId, int contractId, bool delPtr, OpDataCollectorFlattenedDictList fullContracts)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SaveFullContract")
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            });
            return SafeExecutor(() => _contractsLib.SaveFullContract(fullContracts, savePacket)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveContractAndPricingTable(int custId, int contractId, bool delPtr, ContractTransferPacket contractAndPricingTable)
        {
            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(new ContractToken("ContractToken Created - SaveContractAndPricingTable")
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            }, contractAndPricingTable, forceValidation: false, forcePublish: false)
                , "Unable to save the Contract"
            );

            return result;
        }

        [Authorize]
        [Route("SaveAndValidateContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictListPacket SaveAndValidateContractAndPricingTable(int custId, int contractId, bool delPtr, ContractTransferPacket contractAndPricingTable)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - SaveAndValidateContractAndPricingTable")
            {
                CustId = custId,
                ContractId = contractId,
                DeleteAllPTR = delPtr
            };

            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(contractToken, contractAndPricingTable, forceValidation: true, forcePublish: true)
                , "Unable to save the Contract"
            );

            return new OpDataCollectorFlattenedDictListPacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Save and Validation of Contract", contractToken.TimeFlow)
            };
        }

        [Authorize]
        [Route("SaveAndValidateAndPublishContractAndPricingTable/{custId}/{contractId}/{delPtr}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictListPacket SaveAndValidateAndPublishContractAndPricingTable(int custId, int contractId, ContractTransferPacket contractAndPricingTable)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - SaveAndValidateAndPublishContractAndPricingTable")
            {
                CustId = custId,
                ContractId = contractId
            };

            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(contractToken, contractAndPricingTable, forceValidation: true, forcePublish: true)
                , "Unable to save the Contract"
            );

            return new OpDataCollectorFlattenedDictListPacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Save and Validation of Contract", contractToken.TimeFlow)
            };
        }

        [Authorize]
        [Route("SaveAndValidateAndPublishContractAndPricingTableInBulk")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<OpDataCollectorFlattenedDictListPacket> SaveAndValidateAndPublishContractAndPricingTableInBulk(List<SaveAndValidatePacket> saveAndValidatePackets)
        {
            DateTime start = DateTime.Now;
            List<OpDataCollectorFlattenedDictListPacket> rtn = new List<OpDataCollectorFlattenedDictListPacket>();

            Parallel.ForEach(saveAndValidatePackets, item =>
            {
                ContractToken contractToken = new ContractToken("ContractToken Created - SaveAndValidateAndPublishContractAndPricingTable")
                {
                    CustId = item.custId,
                    ContractId = item.contractId
                };

                OpDataCollectorFlattenedDictList result = SafeExecutor(() => _contractsLib.SaveContractAndPricingTable(contractToken, item.contractAndPricingTable, forceValidation: true, forcePublish: true)
                    , "Unable to save the Contract"
                );


                lock (rtn)
                { // lock the list to avoid race conditions
                    rtn.Add(new OpDataCollectorFlattenedDictListPacket
                    {
                        Data = result,
                        cId = item.contractId,
                        psId = item.psId,
                        ptId = item.ptId,
                        PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Save and Validation of Contract", contractToken.TimeFlow)
                    });
                }
            });

            return rtn;
        }

        [Authorize]
        [Route("DeleteContract/{custId}/{contractId}")]
        [HttpGet]
        public OpMsg DeleteContract(int custId, int contractId)
        {
            return SafeExecutor(() => _contractsLib.DeleteContract(new ContractToken("ContractToken Created - DeleteContract")
            {
                CustId = custId,
                ContractId = contractId
            })
                , "Unable to delete the Contract {id}"
            );
        }

        [Authorize]
        [Route("IsDuplicateContractTitle/{dcId}/{title}")]
        [HttpGet]
        public bool IsDuplicateContractTitle(int dcId, string title)
        {
            return SafeExecutor(() => _contractsLib.IsDuplicateContractTitle(dcId, title)
                , "Unable to validate contract name {title}"
            );
        }        

        [Authorize]
        [Route("GetWipFromContract/{id}")]
        public OpDataCollectorFlattenedDictList GetWipFromContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetWipFromContract(id)
                , $"Unable to get WIP Deals {id}"
            );
        }

        [Authorize]
        [Route("GetWipExclusionFromContract/{id}")]
        public OpDataCollectorFlattenedDictList GetWipExclusionFromContract(int id)
        {
            return SafeExecutor(() => _contractsLib.GetWipExclusionFromContract(id)
                , $"Unable to get Exclusion Deals {id}"
            );
        }

        [Authorize]
        [Route("UpdateAtrbValue/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList UpdateAtrbValue(int custId, int contractId, AtrbSaveItem atrbSaveItem)
        {
            return SafeExecutor(() => _contractsLib.UpdateAtrbValue(custId, contractId, atrbSaveItem)
                , $"Unable to update attribute"
            );
        }
        //UpdateAtrbValue
    }
}