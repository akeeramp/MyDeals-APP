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
        [Route("ExecuteSalesForceTenderData")]
        [HttpGet]
        public string TestPath()
        {
            // Path to catch all unprocessed items
            Guid workId = Guid.Empty;
            return SafeExecutor(() => _contractsLib.ExecuteSalesForceTenderData(workId)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("ExecuteSalesForceTenderData/{workId}/")]
        [HttpGet]
        public string TestPath(Guid workId)
        {
            // Path to kick off any ad-hoc needed runs via admin page
            return SafeExecutor(() => _contractsLib.ExecuteSalesForceTenderData(workId)
                , "Unable to save the Contract"
            );
        }

        [Authorize]
        [Route("SaveSalesForceTenderData")]
        [HttpGet]
        //[HttpPost]
        //[AntiForgeryValidate]
        public string SaveSalesForceTenderData(string jsonDataPacket)
        {

            jsonDataPacket = "{\"SALESFORCEIDCNTRCT\":\"50130000000X14c\",\"SALESFORCEIDDEAL\":\"001i000001AWbWu\",\"DEAL_ID\":\"502592\",\"OBJ_SET_TYPE_CD\":\"ECAP\",\"CUST_NM\":\"Acer\",\"PRODUCT_FILTER\":\"FH8067703417714\",\"START_DT\":\"2018-08-06\",\"END_DT\":\"2018-09-29\",\"MRKT_SEG\":\"Consumer No Pull, Consumer Retail Pull, Education, Government\",\"GEO_COMBINED\":\"Worldwide\",\"VOLUME\":\"999999999.0000\",\"PAYOUT_BASED_ON\":\"Billings\"}";

            Guid saveSuccessful = SafeExecutor(() => _contractsLib.SaveSalesForceTenderData(jsonDataPacket) //upperContractData)
                , "Unable to save the SalesForce Tender Deal"
            );

            return saveSuccessful != Guid.Empty ? saveSuccessful.ToString() : "Tender Data Stage Failed"; ;
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