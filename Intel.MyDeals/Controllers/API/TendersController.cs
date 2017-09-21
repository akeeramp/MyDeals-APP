using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Tenders/v1")]
    public class TendersController : BaseApiController
    {
        private readonly ITendersLib _tenderLib;
        public TendersController(ITendersLib pricingTablesLib)
        {
            _tenderLib = pricingTablesLib;
        }

        [Authorize]
        [Route("GetMaster/{id}")]
        public OpDataCollectorFlattenedDictList GetMaster(int id)
        {
            return SafeExecutor(() => _tenderLib.GetMaster(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetChildren/{id}")]
        public OpDataCollectorFlattenedDictList GetChildren(int id)
        {
            return SafeExecutor(() => _tenderLib.GetChildren(id)
                , $"Unable to get Pricing Table {id}"
            );
        }
    }
}
