using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICustomerLib
    {
        CustomerDivision GetCustomerDivision(int sid);
        List<CustomerDivision> GetCustomerDivisions(bool getCachedResult = true);
        List<CustomerDivision> GetCustomerDivisionsActive();
        List<CustomerDivision> GetCustomerDivisionsByCustNmSid(int custNmSid);
        List<CustomerDivision> GetCustomerDivisionsByCategory(string cat);
        List<CustomerDivision> GetCustomerDivisionsByHostedGeo(string geo);
        List<CustomerDivision> GetCustomerDivisionsByType(string type);
        MyCustomerDetailsWrapper GetMyCustomers();
        List<MyCustomersInformation> GetMyCustomerNames();
        List<MyCustomersInformation> GetMyCustomerDivsByCustNmSid(int custNmSid);
        List<MyCustomersInformation> GetMyCustomersInfo();
        //List<MyCustomersSoldTo> GetMyCustomersSoldTo();
    }
}