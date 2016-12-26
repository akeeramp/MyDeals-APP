using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    public class ConstantsController : BaseApiController
    {
        [Authorize]
        [Route("api/Constants/v1/GetConstants")]
        public IEnumerable<ToolConstants> Get()
        {
            return new ConstantsLookupsLib().GetToolConstants();
        }
    }
}
