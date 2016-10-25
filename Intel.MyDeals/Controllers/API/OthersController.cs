using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers.API
{
    public class OthersController : ApiController
    {
        OpCore op = OpAppConfig.Init();

        [Authorize]
        [Route("api/Others/GetDBTest")]
        public Dictionary<string, string> GetDBTest()
        {
            OpUserToken user = AppLib.InitAVM(op);
            return new OthersLib().PingDbDetails(user);
        }
    }
}
