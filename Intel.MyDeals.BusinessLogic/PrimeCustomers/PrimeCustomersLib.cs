using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class PrimeCustomersLib : IPrimeCustomersLib
    {
        private readonly IPrimeCustomersDataLib _primeCustomersDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public PrimeCustomersLib()
        {
            _primeCustomersDataLib = new PrimeCustomersDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public PrimeCustomersLib(IPrimeCustomersDataLib primeCustomersDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _primeCustomersDataLib = primeCustomersDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            return _primeCustomersDataLib.GetPrimeCustomerDetails();
        }

        public PrimeCustomers ManagePrimeCustomers(CrudModes mode, PrimeCustomers data)
        {
            return _primeCustomersDataLib.ManagePrimeCustomers(mode, data);
        }

        public List<Countires> GetCountries()
        {
            return _primeCustomersDataLib.GetCountries();
        }

        public List<PrimeCustDropdown> GetPrimeCustomers()
        {
            return _primeCustomersDataLib.GetPrimeCustomers();
        }

        public List<UnPrimeDeals> GetUnPrimeDeals()
        {
            return _primeCustomersDataLib.GetUnPrimeDeals();
        }

        public List<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry)
        {
            return _primeCustomersDataLib.GetEndCustomerData(endCustomerName, endCustomerCountry);
        }



    }
}
