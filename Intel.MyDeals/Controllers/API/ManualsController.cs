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
        public List<RefManualsNavItem> GetNavigationItems()
        {
            string refType = "UserManual";
            return SafeExecutor(() => _manualEngineLib.GetNavigationItems(refType)
                , $"Unable to get Manuals Navagation Items"
            );
        }

        [Authorize]
        [Route("GetManualPageData/{pageLink}")]
        public string GetManualPageData(string pageLink)
        {
            return SafeExecutor(() => _manualEngineLib.GetManualPageData(pageLink)
                , $"Unable to get Manuals Page Data"
            );
        }

    }
}
