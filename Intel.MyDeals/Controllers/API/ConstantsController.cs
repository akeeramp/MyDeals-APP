using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Constants/v1")]
    public class ConstantsController : BaseApiController
    {
        private readonly IConstantsLookupsLib _constantsLookupsLib;
        public ConstantsController(IConstantsLookupsLib constantsLookupsLib)
        {
            _constantsLookupsLib = constantsLookupsLib;
        }

        [Authorize]
        [Route("GetConstants")]
        public IEnumerable<ToolConstants> Get()
        {
            return SafeExecutor(() => _constantsLookupsLib.GetToolConstants()
                , "Unable to get Tool Constants"
            );
        }
    }
}
