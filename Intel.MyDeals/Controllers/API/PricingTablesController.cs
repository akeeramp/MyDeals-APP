using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

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
        public OpDataCollectorFlattenedDictList SavePricingTable(int custId, int contractId, OpDataCollectorFlattenedList pricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.SavePricingTable(pricingTables, new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            })
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("SaveFullPricingTable/{custId}/{contractId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullPricingTable(int custId, int contractId, OpDataCollectorFlattenedDictList fullpricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.SaveFullPricingTable(fullpricingTables, new ContractToken
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
        public OpMsg DeletePricingTable(int custId, int contractId, OpDataCollectorFlattenedList pricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.DeletePricingTable(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, pricingTables)
                , "Unable to delete the Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("DeletePricingTableRow/{custId}/{contractId}/{ptrId}")]
        [HttpGet]
        public OpMsg DeletePricingTableRow(int custId, int contractId, int ptrId)
        {
            return SafeExecutor(() => _pricingTablesLib.DeletePricingTableRowById(new ContractToken
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
            return SafeExecutor(() => _pricingTablesLib.UnGroupPricingTableRowById(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, ptrId)
                , "Unable to split the Pricing Table Row {id}"
            );
        }


        [Authorize]
        [Route("ActionWipDeal/{custId}/{contractId}/{actn}")]
        [HttpPost]
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
        public OpMsgQueue ActionWipDeals(int custId, int contractId, Dictionary<string, List<WfActnItem>> actnPs)
        {
            return SafeExecutor(() => _pricingTablesLib.ActionWipDeals(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, actnPs)
                , "Unable to action the Wip Deal {id}"
            );
        }

        [Authorize]
        [Route("GetOverlappingDeals/{ID}")]
        public List<Overlapping> GetOverlappingDeals(int ID)     //Get all Product with Alias from ProductAlias
        {
            return SafeExecutor(() => _pricingTablesLib.GetOverlappingDeals(ID)
                , $"Unable to get {"Product Alias"}"
             );
        }

        [HttpPost]
        [Authorize]
        [Route("UpdateOverlappingDeals/{ID}")]
        public List<Overlapping> UpdateOverlappingDeals(int ID)     //Get all Product with Alias from ProductAlias
        {
            return SafeExecutor(() => _pricingTablesLib.UpdateOverlappingDeals(ID)
                , $"Unable to get {"Product Alias"}"
             );
        }
    }

}
