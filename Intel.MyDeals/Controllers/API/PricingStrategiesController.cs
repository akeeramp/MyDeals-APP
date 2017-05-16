using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

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
            return SafeExecutor(() => _pricingStrategiesLib.GetPricingStrategy(id)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("GetFullNestedPricingStrategy/{id}")]
        public MyDealsData GetFullNestedPricingStrategy(int id)
        {
            return SafeExecutor(() => _pricingStrategiesLib.GetPricingStrategy(id, true)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("GetFullPricingStrategy/{id}")]
        public OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id)
        {
            return SafeExecutor(() => _pricingStrategiesLib.GetFullPricingStrategy(id)
                , $"Unable to get Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("SavePricingStrategy/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SavePricingStrategy(int custId, OpDataCollectorFlattenedList pricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.SavePricingStrategy(pricingStrategies, custId), 
                "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("SaveFullPricingStrategy/{custId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullPricingStrategy(int custId, OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.SaveFullPricingStrategy(custId, fullpricingStrategies),
                "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("DeletePricingStrategy/{custId}")]
        [HttpPost]
        public OpMsg DeletePricingStrategy(int custId, OpDataCollectorFlattenedList pricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.DeletePricingStrategy(custId, pricingStrategies)
                , "Unable to delete the Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("ActionPricingStrategy/{custId}/{actn}")]
        [HttpPost]
        public OpMsgQueue ActionPricingStrategy(int custId, string actn, OpDataCollectorFlattenedList pricingStrategies)
        {
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>
            {
                [actn] = pricingStrategies.Select(item => new WfActnItem
                {
                    DC_ID = int.Parse(item[AttributeCodes.DC_ID].ToString()),
                    WF_STG_CD = item[AttributeCodes.WF_STG_CD].ToString()
                }).ToList()
            };

            return SafeExecutor(() => ActionPricingStrategies(custId, actnPs)
                , "Unable to action the Pricing Strategy {id}"
            );
        }

        [Authorize]
        [Route("ActionPricingStrategies/{custId}")]
        [HttpPost]
        public OpMsgQueue ActionPricingStrategies(int custId, Dictionary<string, List<WfActnItem>> actnPs)
        {
            return SafeExecutor(() => _pricingStrategiesLib.ActionPricingStrategies(custId, actnPs)
                , "Unable to action the Pricing Strategy {id}"
            );
        }

    }
}
