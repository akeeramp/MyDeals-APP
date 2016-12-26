using Intel.Opaque;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    public abstract class BaseApiController : ApiController
    {
        /// <summary>
        /// Op core
        /// </summary>
        public OpCore op;

        public BaseApiController()
        {
            op = OpAppConfig.Init();
        }
    }
}
