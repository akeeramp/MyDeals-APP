using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;


namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/CustomerVendors")]
    public class CustomerVendorsController : BaseApiController
    {
        private readonly ICustomerVendorsLib _customerVendorsLib;

        public CustomerVendorsController(ICustomerVendorsLib customerVendorsLib)
        {
            _customerVendorsLib = customerVendorsLib;
        }

        /// <summary>
        /// To get Customer Vendor Mapped Data
        /// </summary>
        /// <param name="custId"></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetCustomerVendors/{custId}")]
        public List<CustomerVendors> GetCustomerVendors(int custId)
        {
            return SafeExecutor(() => _customerVendorsLib.GetCustomerVendors(custId), $"Unable to Get Customer Vendors Info");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [Route("GetVendorsData")]
        public List<VendorsInfo> GetVendorsData()
        {
            return SafeExecutor(() => _customerVendorsLib.GetVendorsData(), $"Unable to Get Vendors");
        }

        [HttpPut]
        [AntiForgeryValidate]
        [Route("UpdateCustomerVendor")]
        public CustomerVendors UpdateCustomerVendor(CustomerVendors data)
        {
            return SafeExecutor(() => _customerVendorsLib.ManageCustomerVendors(data, CrudModes.Update)
                , $"Unable to update basic dropdown"
            );
        }

        //[Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("InsertCustomerVendor")]
        public CustomerVendors InsertCustomerVendor(CustomerVendors data)
        {
            return SafeExecutor(() => _customerVendorsLib.ManageCustomerVendors(data, CrudModes.Insert)
                , $"Unable to insert basic dropdown"
            );

        }


    }
}