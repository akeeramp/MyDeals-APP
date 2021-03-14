using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICustomerVendorsLib
    {
        List<CustomerVendors> GetCustomerVendors(int custId);

        List<VendorsInfo> GetVendorsData();

        CustomerVendors ManageCustomerVendors(CustomerVendors CustVendor, CrudModes type);

    }
}
