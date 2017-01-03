using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ICustomerDataLib
    {
        List<CustomerDivision> GetCustomerDivisions();
        MyCustomerDetailsWrapper GetMyCustomers(bool fullAccess = false, bool allCustomers = false);
    }
}