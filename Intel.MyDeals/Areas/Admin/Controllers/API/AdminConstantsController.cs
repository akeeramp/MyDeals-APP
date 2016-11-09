using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using System.Linq;
using System.Web.Http;
using WebApi.OutputCache.V2;

namespace Intel.MyDeals.Areas.Admin.Controllers.API
{
    [AutoInvalidateCacheOutput]
    public class AdminConstantsController : ApiController
    {
        [Authorize]
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants")]
        [CacheOutput(ClientTimeSpan = 50000, ServerTimeSpan = 50000)]
        public IQueryable<AdminConstant> GetConstants()
        {
            return new ConstantsLookupsLib().GetAdminConstants().AsQueryable();
        }

        [Authorize]
        [HttpPost]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/CreateConstant")]
        public AdminConstant CreateConstant(AdminConstant adminConstant)
        {
            return new ConstantsLookupsLib().CreateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [Route("api/AdminConstants/v1/UpdateConstant")]
        public AdminConstant UpdateConstant(AdminConstant adminConstant)
        {
            return new ConstantsLookupsLib().UpdateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [Route("api/AdminConstants/v1/DeleteConstant")]
        public void DeleteConstant(AdminConstant adminConstant)
        {
            new ConstantsLookupsLib().DeleteAdminConstant(adminConstant);
        }
    }
}
