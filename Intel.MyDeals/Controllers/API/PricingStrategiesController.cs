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
        [Route("SavePricingStrategy/{custId}/{contractId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SavePricingStrategy(int custId, int contractId, OpDataCollectorFlattenedList pricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.SavePricingStrategy(pricingStrategies, new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }), 
                "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("SaveFullPricingStrategy/{custId}/{contractId}")]
        [HttpPost]
        public OpDataCollectorFlattenedDictList SaveFullPricingStrategy(int custId, int contractId, OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.SaveFullPricingStrategy(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, fullpricingStrategies),
                "Unable to save the Pricing Strategy"
            );
        }


        [Authorize]
        [Route("DeletePricingStrategy/{custId}/{contractId}")]
        [HttpPost]
        public OpMsg DeletePricingStrategy(int custId, int contractId, OpDataCollectorFlattenedList pricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.DeletePricingStrategy(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, pricingStrategies)
                , "Unable to delete the Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("RollBackPricingStrategy/{custId}/{contractId}")]
        [HttpPost]
        public OpMsg RollBackPricingStrategy(int custId, int contractId, OpDataCollectorFlattenedList pricingStrategies)
        {
            // ROLLBACK FILL IN WITH PROPER ROLLBACK LOGIC
            return SafeExecutor(() => _pricingStrategiesLib.RollBackPricingStrategy(new ContractToken
            {
                CustId = custId,
                ContractId = contractId
            }, pricingStrategies)
                , "Unable to rollback the Pricing Strategy {id}"
            );
        }

        [Authorize]
        [Route("CancelPricingStrategy/{custId}/{contractId}/{contractCustAccpt}")]
        [HttpPost]
        public OpMsgQueue CancelPricingStrategy(int custId, int contractId, string contractCustAccpt, OpDataCollectorFlattenedList pricingStrategies)
        {
            return SafeExecutor(() => _pricingStrategiesLib.CancelPricingStrategy(new ContractToken
            {
                CustId = custId,
                ContractId = contractId,
                CustAccpt = contractCustAccpt
            }, pricingStrategies)
                , "Unable to cancel the Pricing Strategy {id}"
            );
        }


        [Authorize]
        [Route("ActionPricingStrategy/{custId}/{contractId}/{contractCustAccpt}/{actn}")]
        [HttpPost]
        public OpMsgQueue ActionPricingStrategy(int custId, int contractId, string contractCustAccpt, string actn, OpDataCollectorFlattenedList pricingStrategies)
        {
            Dictionary<string, List<WfActnItem>> actnPs = new Dictionary<string, List<WfActnItem>>
            {
                [actn] = pricingStrategies.Select(item => new WfActnItem
                {
                    DC_ID = int.Parse(item[AttributeCodes.DC_ID].ToString()),
                    WF_STG_CD = item[AttributeCodes.WF_STG_CD].ToString()
                }).ToList()
            };

            return SafeExecutor(() => ActionPricingStrategies(custId, contractId, contractCustAccpt, actnPs)
                , "Unable to action the Pricing Strategy {id}"
            );
        }

        [Authorize]
        [Route("ActionPricingStrategies/{custId}/{contractId}/{contractCustAccpt}")]
        [HttpPost]
        public OpMsgQueue ActionPricingStrategies(int custId, int contractId, string contractCustAccpt, Dictionary<string, List<WfActnItem>> actnPs)
        {
            return SafeExecutor(() => _pricingStrategiesLib.ActionPricingStrategies(new ContractToken
                {
                    CustId = custId,
                    ContractId = contractId,
                    CustAccpt = contractCustAccpt
                } , actnPs)
                , "Unable to action the Pricing Strategy {id}"
            );
        }

    }
}
