using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Linq;
using System.Web.Http;
using WebApi.OutputCache.V2;

namespace Intel.MyDeals.Areas.Admin.Controllers.API
{
    [AutoInvalidateCacheOutput]
    public class AdminConstantsController : ApiController
    {

        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public AdminConstantsController(IConstantsLookupsLib _constantsLookupsLib)
        {
            this._constantsLookupsLib = _constantsLookupsLib;
        }

        [Authorize]
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants")]
        [CacheOutput(ServerTimeSpan = 50000)]
        public IQueryable<AdminConstant> GetConstants()
        {
            return _constantsLookupsLib.GetAdminConstants().AsQueryable();
        }

        [Authorize]
        [HttpPost]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/CreateConstant")]
        public AdminConstant CreateConstant(AdminConstant adminConstant)
        {
            return _constantsLookupsLib.CreateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/UpdateConstant")]
        public AdminConstant UpdateConstant(AdminConstant adminConstant)
        {
            return _constantsLookupsLib.UpdateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/DeleteConstant")]
        public void DeleteConstant(AdminConstant adminConstant)
        {
            _constantsLookupsLib.DeleteAdminConstant(adminConstant);
        }
    }
}
