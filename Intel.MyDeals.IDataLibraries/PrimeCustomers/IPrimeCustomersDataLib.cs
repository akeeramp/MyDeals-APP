using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IPrimeCustomersDataLib
    {
        List<PrimeCustomers> GetPrimeCustomerDetails();

        PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data);

        List<Countires> GetCountries();

        List<PrimeCustDropdown> GetPrimeCustomers();

        List<UnPrimeDeals> GetUnPrimeDeals();

        List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry);

    }
}
