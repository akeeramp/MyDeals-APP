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
        [Route("SavePricingTable/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SavePricingTable(int custId, OpDataCollectorFlattenedList pricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.SavePricingTable(pricingTables, custId)
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("SaveFullPricingTable/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullPricingTable(int custId, OpDataCollectorFlattenedDictList fullpricingTables)
        {
            return SafeExecutor(() => _pricingTablesLib.SaveFullPricingTable(fullpricingTables, custId)
                , "Unable to save the Pricing Table"
            );
        }

        [Authorize]
        [Route("DeletePricingTable/{id}")]
        [HttpGet]
        public OpMsg DeletePricingTable(int id)
        {
            return SafeExecutor(() => _pricingTablesLib.DeletePricingTable(id)
                , "Unable to delete the Pricing Table {id}"
            );
        }
    }
}
