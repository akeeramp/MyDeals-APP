using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

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
            return SafeExecutor(() => _pricingTablesLib
                .GetPricingTable(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetFullNestedPricingTable/{id}")]
        public OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib
                .GetPricingTable(id, true)
                .BuildObjSetContainers(ObjSetPivotMode.Pivoted)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetFullPricingTable/{id}")]
        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib
                .GetPricingTable(id, true)
                .BuildObjSetContainers(ObjSetPivotMode.Pivoted)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("SavePricingTable")]
        [HttpPost]
        public MyDealsData SavePricingTable(OpDataCollectorFlattenedList pricingTables)
        {
            //todo BECAUSE DB MADE US DO THIS
            int custId = 914;
            return SafeExecutor(() => _pricingTablesLib
                .SavePricingTable(pricingTables, custId)
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("SaveFullPricingTable")]
        [HttpPost]
        public MyDealsData SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables)
        {
            //todo BECAUSE DB MADE US DO THIS
            int custId = 914;
            return SafeExecutor(() => _pricingTablesLib.SavePricingTable(
                fullpricingTables.ContainsKey(OpDataElementType.PricingTable) ? fullpricingTables[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.WipDeals) ? fullpricingTables[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList(),
                custId)
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("DeletePricingTable/{id}")]
        [HttpGet]
        public OpMsg DeletePricingTable(int id)
        {
            // TODO replace with a true delete
            return SafeExecutor(() => new OpMsg("Deleted Successfully")
                , $"Unable to delete the Pricing Table {id}"
            );
        }
    }
}
