using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PricingTables/v1")]
    public class RebateTablesController : BaseApiController
    {
        private readonly IPricingTablesLib _pricingTablesLib;
        public RebateTablesController(IPricingTablesLib pricingTablesLib)
        {
            _pricingTablesLib = pricingTablesLib;
        }

        [Authorize]
        [Route("GetPricingTable/{id}")]
        public MyDealsData GetPricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.GetPricingTable(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetFullNestedPricingTable/{id}")]
        public OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.GetFullNestedPricingTable(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetFullPricingTable/{id}")]
        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.GetFullPricingTable(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("SavePricingTable/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SavePricingTable(int custId, int contractId, OpDataCollectorFlattenedList pricingTables)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - SavePricingTable")
            {
                CustId = custId,
                ContractId = contractId
            });

            return SafeExecutor(() => _pricingTablesLib.SavePricingTable(pricingTables, savePacket)
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("SaveFullPricingTable/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList SaveFullPricingTable(int custId, int contractId, OpDataCollectorFlattenedDictList fullpricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.SaveFullPricingTable(fullpricingTables, new ContractToken("ContractToken Created - SaveFullPricingTable")
            {
                CustId = custId,
                ContractId = contractId
            })
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("DeletePricingTable/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsg DeletePricingTable(int custId, int contractId, OpDataCollectorFlattenedList pricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.DeletePricingTable(new ContractToken("ContractToken Created - DeletePricingTable")
            {
                CustId = custId,
                ContractId = contractId
            }, pricingTables)
                , "Unable to delete the Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("RollBackPricingTable/{custId}/{contractId}/{dcId}")]
        [HttpGet]
        public OpMsg RollBackPricingTable(int custId, int contractId, int dcId)
        {
            return SafeExecutor(() => _pricingTablesLib.RollBackObject(OpDataElementType.PRC_TBL,
                new ContractToken("ContractToken Created - RollBackPricingTable")
                {
                    CustId = custId,
                    ContractId = contractId
                },
                dcId)
                , "Unable to rollback the Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("RollBackPricingTableRow/{custId}/{contractId}/{dcId}")]
        [HttpGet]
        public OpMsg RollBackPricingTableRow(int custId, int contractId, int dcId)
        {
            return SafeExecutor(() => _pricingTablesLib.RollBackObject(OpDataElementType.PRC_TBL_ROW,
                new ContractToken("ContractToken Created - RollBackPricingTableRow")
                {
                    CustId = custId,
                    ContractId = contractId
                },
                dcId)
                , "Unable to rollback the Pricing Table Row {id}"
            );
        }

        [Authorize]
        [Route("CancelPricingTable/{custId}/{contractId}/{contractCustAccpt}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsgQueue CancelPricingTable(int custId, int contractId, string contractCustAccpt, OpDataCollectorFlattenedList pricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.CancelPricingTable(new ContractToken("ContractToken Created - CancelPricingTable")
            {
                CustId = custId,
                ContractId = contractId,
                CustAccpt = contractCustAccpt
            }, pricingTables)
                , "Unable to cancel the Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("DeletePricingTableRow/{custId}/{contractId}/{ptrId}")]
        [HttpGet]
        public OpMsg DeletePricingTableRow(int custId, int contractId, int ptrId)
        {
            return SafeExecutor(() => _pricingTablesLib.DeletePricingTableRowById(new ContractToken("ContractToken Created - DeletePricingTableRow")
            {
                CustId = custId,
                ContractId = contractId
            }, ptrId)
                , "Unable to delete the Pricing Table Row {id}"
            );
        }

        [Authorize]
        [Route("UnGroupPricingTableRow/{custId}/{contractId}/{ptrId}")]
        [HttpGet]
        public OpMsgQueue UnGroupPricingTableRow(int custId, int contractId, int ptrId)
        {
            return SafeExecutor(() => _pricingTablesLib.UnGroupPricingTableRowById(new ContractToken("ContractToken Created - UnGroupPricingTableRow")
            {
                CustId = custId,
                ContractId = contractId
            }, ptrId)
                , "Unable to split the Pricing Table Row {id}"
            );
        }


        [Authorize]
        [Route("GetWipDealsByPtr/{id}")]
        public OpDataCollectorFlattenedDictList GetWipDealsByPtr(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.GetWipDealsByPtr(id)
                , $"Unable to get Wip Deals {id}"
            );
        }


        [Authorize]
        [Route("ActionWipDeal/{custId}/{contractId}/{actn}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsgQueue ActionWipDeal(int custId, int contractId, string actn, OpDataCollectorFlattenedList wipDeals)
        {
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>
            {
                [actn] = wipDeals.Select(item => new WfActnItem
                {
                    DC_ID = int.Parse(item[AttributeCodes.DC_ID].ToString()),
                    WF_STG_CD = item[AttributeCodes.WF_STG_CD].ToString()
                }).ToList()
            };

            return SafeExecutor(() => ActionWipDeals(custId, contractId, actnPs)
                , "Unable to action the Wip Deal {id}"
            );
        }

        [Authorize]
        [Route("ActionWipDeals/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsgQueue ActionWipDeals(int custId, int contractId, Dictionary<string, List<WfActnItem>> actnPs)
        {
            //_pricingTablesLib.ActionWipDeals(new ContractToken
            //{
            //    CustId = custId,
            //    ContractId = contractId
            //}, actnPs);
            return SafeExecutor(() => _pricingTablesLib.ActionWipDeals(new ContractToken("ContractToken Created - ActionWipDeals")
            {
                CustId = custId,
                ContractId = contractId
            }, actnPs)
                , "Unable to action the Wip Deal {id}"
            );
        }

        [Authorize]
        [Route("getOverlappingDealsFromContract/{ids}")]
        public OverlappingListPacket getOverlappingDealsFromContract(string ids)     //Get all Product with Alias from ProductAlias
        {
            DateTime start = DateTime.Now;
            List<TimeFlowItem> timeFlows = new List<TimeFlowItem>();

            var results = SafeExecutor(() => _pricingTablesLib.GetOverlappingDeals(OpDataElementType.CNTRCT, ids.Split(',').Select(int.Parse).ToList(), timeFlows)
                , $"Unable to get {"Overlapping Data"}"
             );

            return new OverlappingListPacket
            {
                Data = results,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Overlap Check of Contract", timeFlows)
            };
        }

        [Authorize]
        [Route("getOverlappingDealsFromPricingStrategy/{ids}")]
        public OverlappingListPacket getOverlappingDealsFromPricingStrategy(string ids)     //Get all Product with Alias from ProductAlias
        {
            DateTime start = DateTime.Now;
            List<TimeFlowItem> timeFlows = new List<TimeFlowItem>();

            var results = SafeExecutor(() => _pricingTablesLib.GetOverlappingDeals(OpDataElementType.PRC_ST, ids.Split(',').Select(int.Parse).ToList(), timeFlows)
                , $"Unable to get {"Overlapping Data"}"
             );

            return new OverlappingListPacket
            {
                Data = results,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Overlap Check of Contract", timeFlows)
            };
        }

        [Authorize]
        [Route("getOverlappingDealsFromPricingTable/{ids}")]
        public OverlappingListPacket getOverlappingDealsFromPricingTable(string ids)     //Get all Product with Alias from ProductAlias
        {
            DateTime start = DateTime.Now;
            List<TimeFlowItem> timeFlows = new List<TimeFlowItem>();

            var results = SafeExecutor(() => _pricingTablesLib.GetOverlappingDeals(OpDataElementType.PRC_TBL, ids.Split(',').Select(int.Parse).ToList(), timeFlows)
                , $"Unable to get {"Overlapping Data"}"
             );

            return new OverlappingListPacket
            {
                Data = results,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Overlap Check of Contract", timeFlows)
            };
        }

        [HttpPost]
        [AntiForgeryValidate]
        [Authorize]
        [Route("UpdateOverlappingDeals/{PRICING_TABLES_ID}/{YCS2_OVERLAP_OVERRIDE}")]
        public List<Overlapping> UpdateOverlappingDeals(int PRICING_TABLES_ID, string YCS2_OVERLAP_OVERRIDE)     //Get all Product with Alias from ProductAlias
        {
            return SafeExecutor(() => _pricingTablesLib.UpdateOverlappingDeals(PRICING_TABLES_ID, YCS2_OVERLAP_OVERRIDE)
                , $"Unable to get {"Overlapping Data"}"
             );
        }

        [HttpPost]
        [AntiForgeryValidate]
        [Authorize]
        [Route("SetPctOverride")]
        public PctOverrideReason SetPctOverride(PctOverrideReason data)
        {
            return SafeExecutor(() => _pricingTablesLib.SetPctOverrideReason(data)
                , $"Unable to set PCT Override Reason"
            );
        }

        [Authorize]
        [Route("GetPctDetails/{id}")]
        public CostTestDetail GetPctDetails(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.GetPctDetails(id)
                , $"Unable to get PCT Details {id}"
            );
        }

        [Authorize]
        [Route("GetPath/{id}/{opType}")]
        public string GetPath(int id, string opType)
        {
            return SafeExecutor(() => _pricingTablesLib.GetPath(id, opType)
                , $"Unable to get Path for {id}"
            );
        }

        [Authorize]
        [Route("CopyPricingTable/{custId}/{contractId}/{srcId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList CopyPricingTable(int custId, int contractId, int srcId, OpDataCollectorFlattenedList data)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - CopyPricingTable")
            {
                CustId = custId,
                ContractId = contractId,
                CopyFromId = srcId,
                CopyFromObjType = OpDataElementType.PRC_TBL
            });

            foreach (OpDataCollectorFlattenedItem item in data)
            {
                item[AttributeCodes.CAP_MISSING_FLG] = "0";
            }

            return SafeExecutor(() => _pricingTablesLib.SavePricingTable(data, savePacket)
                , "Unable to copy the Pricing Strategy"
            );
        }

        [Authorize]
        [Route("UpdateWipDeals/{custId}/{contractId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictList UpdateWipDeals(int custId, int contractId, OpDataCollectorFlattenedList wipDeals)
        {
            SavePacket savePacket = new SavePacket(new ContractToken("ContractToken Created - UpdateWipDeals")
            {
                CustId = custId,
                ContractId = contractId
            });

            return SafeExecutor(() => _pricingTablesLib.UpdateWipDeals(wipDeals, savePacket)
                , "Unable to save the Pricing Table"
            );
        }
        
    }

}
