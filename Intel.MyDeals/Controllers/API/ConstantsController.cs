using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    public class ConstantsController : BaseApiController
    {
        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public ConstantsController(IConstantsLookupsLib _constantsLookupsLib)
        {
            this._constantsLookupsLib = _constantsLookupsLib;
        }

        [Authorize]
        [Route("api/Constants/v1/GetConstants")]
        public IEnumerable<ToolConstants> Get()
        {
            return _constantsLookupsLib.GetToolConstants();
        }
    }
}
