using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class CustomerVendorsLib : ICustomerVendorsLib
    {
        private readonly ICustomerVendorsDataLib _customerVendorsDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public CustomerVendorsLib()
        {
            _customerVendorsDataLib = new CustomerVendorsDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();

        }

        public CustomerVendorsLib(ICustomerVendorsDataLib vendorCustMappingDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _customerVendorsDataLib = vendorCustMappingDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public List<CustomerVendors> GetCustomerVendors(int custId)
        {
            return _customerVendorsDataLib.GetCustomerVendors(custId);
        }

        public List<VendorsInfo> GetVendorsData()
        {
            return _customerVendorsDataLib.GetVendorsData();
        }

        public CustomerVendors ManageCustomerVendors(CustomerVendors CustVendor, CrudModes type)
        {
            return _customerVendorsDataLib.ManageCustomerVendors(CustVendor, type);
        }


    }
}
