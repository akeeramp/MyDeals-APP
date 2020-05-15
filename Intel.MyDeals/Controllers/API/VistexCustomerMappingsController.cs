using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Linq;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/VistexCustomerMappings")]
    public class VistexCustomerMappingsController : BaseApiController
    {
        private readonly IVistexCustomerMappingLib _vistexCustomerMappingLib;

        public VistexCustomerMappingsController(IVistexCustomerMappingLib vistexCustomerMappingLib)
        {
            _vistexCustomerMappingLib = vistexCustomerMappingLib;
        }

        /// <summary>
        /// Get Vistex Customers List
        /// </summary>
        /// <param name="getCachedResult"></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetVistexCustomersMapList/{getCachedResult:bool?}")]
        public IEnumerable<VistexCustomerMappingWrapper> GetVistexCustomersMapList(bool getCachedResult = true)
        {
            return SafeExecutor(() => _vistexCustomerMappingLib.GetVistexCustomerMapping(), "Unable to get Customers");
        }

        /// <summary>
        /// Save Is Vistex Customer Flag Changes 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Authorize]
        [Route("UpdateVistexCustomer")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<VistexCustomerMappingWrapper> UpdateVistexCustomer(VistexCustomerMappingWrapper data)
        {
            data.VistexCustomerInfo.DFLT_CUST_RPT_GEO = string.Join(",", data.CustomerReportedGeos.OrderBy(x => x));
            return SafeExecutor(() => _vistexCustomerMappingLib.SetVistexCustomerMapping(CrudModes.Update, data.VistexCustomerInfo), "Unable to update Customers");
        }
    }
}