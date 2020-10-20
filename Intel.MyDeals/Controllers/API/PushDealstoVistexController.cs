using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Linq;
using Intel.MyDeals.DataLibrary;


namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PushDealstoVistex")]
    public class PushDealstoVistexController : BaseApiController
    {
        private readonly IPushDealstoVistexLib _pushDealstoVistexLib;

        public PushDealstoVistexController(IPushDealstoVistexLib pushDealstoVistexLib)
        {
            _pushDealstoVistexLib = pushDealstoVistexLib;
        }

        [Route("DealsPushtoVistex")]
        [HttpPost]
        public List<PushDealstoVistexResults> DealsPushtoVistex(PushDealIdstoVistex dealIds)
        {
            return SafeExecutor(() => _pushDealstoVistexLib.DealsPushtoVistex(dealIds), "Unable to Send Deals");
        }
    }
}