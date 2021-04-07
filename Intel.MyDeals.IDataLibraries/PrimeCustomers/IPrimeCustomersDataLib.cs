using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IPrimeCustomersDataLib
    {
        List<PrimeCustomers> GetPrimeCustomerDetails();

        PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data);

        List<Countires> GetCountries();

        List<PrimeCustomers> GetPrimeCustomers();

        List<UnPrimeDeals> GetUnPrimeDeals();

        List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry);

        bool UpdateUnPrimeDeals(int dealId, string primeCustomerName, string primeCustomerCountry);

        EndCustomerObject FetchEndCustomerMap(string endCustName, string endCustCountry);

    }
}
