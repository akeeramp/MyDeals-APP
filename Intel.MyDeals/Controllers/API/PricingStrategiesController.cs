using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PricingStrategies/v1")]
    public class PricingStrategiesController : BaseApiController
    {
        private readonly IPricingStrategiesLib _pricingStrategiesLib;
        public PricingStrategiesController(IPricingStrategiesLib pricingStrategiesLib)
        {
            _pricingStrategiesLib = pricingStrategiesLib;
        }

        [Authorize]
        [Route("GetPricingStrategy/{id}")]
        public MyDealsData GetPricingStrategy(int id)
        {
            return SafeExecutor(() => _pricingStrategiesLib
                .GetPricingStrategy(id)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("GetFullNestedPricingStrategy/{id}")]
        public MyDealsData GetFullNestedPricingStrategy(int id)
        {
            return SafeExecutor(() => _pricingStrategiesLib
                .GetPricingStrategy(id, true)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("GetFullPricingStrategy/{id}")]
        public OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id)
        {
            return SafeExecutor(() => _pricingStrategiesLib
                .GetPricingStrategy(id, true)
                .BuildObjSetContainers(ObjSetPivotMode.Pivoted)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("SavePricingStrategy")]
        [HttpPost]
        public MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies)
        {
            // TODO replace when DB is ready
            return SafeExecutor(() => new MyDealsData()
                , "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("SaveFullPricingStrategy")]
        [HttpPost]
        public MyDealsData SaveFullPricingStrategy(OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            // TODO replace when DB is ready
            return SafeExecutor(() => _pricingStrategiesLib.SavePricingStrategy(
                fullpricingStrategies.ContainsKey(OpDataElementType.PricingStrategy) ? fullpricingStrategies[OpDataElementType.PricingStrategy] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PricingTable) ? fullpricingStrategies[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.WipDeals) ? fullpricingStrategies[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList())
                , "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("DeletePricingStrategy/{id}")]
        [HttpGet]
        public OpMsg DeletePricingStrategy(int id)
        {
            // TODO replace with a true delete
            return SafeExecutor(() => new OpMsg("Deleted Successfully")
                , $"Unable to delete Pricing Strategy {id}"
            );
        }
    }
}
