using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Linq;
using System.Web.Http;
using WebApi.OutputCache.V2;

namespace Intel.MyDeals.Controllers.API
{
    [AutoInvalidateCacheOutput]
    public class AdminConstantsController : BaseApiController
    {
        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public AdminConstantsController(IConstantsLookupsLib constantsLookupsLib)
        {
            _constantsLookupsLib = constantsLookupsLib;
        }

        [Authorize]
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants/{getCachedResult:bool?}")]
        [CacheOutput(ServerTimeSpan = 50000)]
        public IQueryable<AdminConstant> GetConstants(bool getCachedResult = true)
        {
            return _constantsLookupsLib.GetAdminConstants(getCachedResult).AsQueryable();
        }

        [Route("api/AdminConstants/v1/GetConstantsByName/{name}")]
        public AdminConstant GetConstantsByName(string name)
        {
            return SafeExecutor(() => _constantsLookupsLib.GetConstantsByName(name)
                , $"Unable to find constant with name {name}"
            );
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