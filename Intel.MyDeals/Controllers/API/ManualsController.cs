using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/Manuals")]
    public class ManualsController : BaseApiController
    {
        private readonly IManualEngineLib _manualEngineLib;

        public ManualsController(IManualEngineLib _manualEngineLib)
        {
            this._manualEngineLib = _manualEngineLib;
        }

        [Authorize]
        [Route("GetNavigationItems")]
        public List<ManualsNavItem> GetNavigationItems()
        {
            return SafeExecutor(() => _manualEngineLib.GetNavigationItems()
                , $"Unable to get Manuals Navagation Items"
            );
        }
    }
}
