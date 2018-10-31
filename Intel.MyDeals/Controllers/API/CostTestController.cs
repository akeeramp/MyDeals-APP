using System.Web.Http;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System.Collections.Generic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/CostTest/v1")]
    public class CostTestController : BaseApiController
    {
        private readonly ICostTestLib _costTestLib;

        /// <summary>
        /// Cost Test Controller
        /// </summary>
        /// <param name="costTestLib"></param>
        public CostTestController(ICostTestLib costTestLib)
        {
            _costTestLib = costTestLib;
        }

        /// <summary>
        /// Run Cost Test (Contract)
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        [Route("RunPctContract/{id}")]
        public OpMsg RunPctContract(int id)
        {
            return SafeExecutor(() => _costTestLib.RunPctContract(id)
               , $"Unable to get Price Cost Test Rules"
           );
        }

        /// <summary>
        /// Run Cost Test (Contract)
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        [Route("RunPctPricingStrategy/{id}")]
        public OpMsg RunPctPricingStrategy(int id)
        {
            return SafeExecutor(() => _costTestLib.RunPctPricingStrategy(id)
               , $"Unable to get Price Cost Test Rules"
           );
        }

        /// <summary>
        /// Run Cost Test (Contract)
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("RunBulkPctPricingStrategy")]
        public OpMsg RunBulkPctPricingStrategy(List<int> psIDS)
        {
            return SafeExecutor(() => _costTestLib.RunPctBulkPricingStrategy(psIDS)
               , $"Unable to get Price Cost Test Rules"
           );
        }

        /// <summary>
        /// Run Cost Test (Contract)
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        [Route("RunPctPricingTable/{id}")]
        public OpMsg RunPctPricingTable(int id)
        {
            return SafeExecutor(() => _costTestLib.RunPctPricingTable(id)
               , $"Unable to get Price Cost Test Rules"
           );
        }

    }
}
