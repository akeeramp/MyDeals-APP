using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers.API
{
    public class ConstantsController : ApiController
    {
        OpCore op = OpAppConfig.Init();

        [Authorize]
        [Route("api/Constants/v1/GetConstants")]
        public IEnumerable<ToolConstants> Get()
        {
            return new ConstantsLookupsLib().GetToolConstants();
        }
    }
}
