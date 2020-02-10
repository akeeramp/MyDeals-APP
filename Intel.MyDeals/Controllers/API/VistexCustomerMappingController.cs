using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/VistexCustomerMapping")]
    public class VistexCustomerMappingController : BaseApiController
    {
        private readonly IVistexCustomerMappingLib _vistexCustomerMappingLib;

        public VistexCustomerMappingController(IVistexCustomerMappingLib vistexCustomerMappingLib)
        {
            _vistexCustomerMappingLib = vistexCustomerMappingLib;
        }

        [Authorize]
        [Route("GetVistexCustomersMapList/{getCachedResult:bool?}")]
        public IEnumerable<VistexCustomerMapping> GetVistexCustomersMapList(bool getCachedResult = true)
        {
            return SafeExecutor(() => _vistexCustomerMappingLib.GetVistexCustomerMapping(), "Unable to get Customers");
        }
    }
}