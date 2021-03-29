using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;


namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PrimeCustomers")]
    public class PrimeCustomersController :BaseApiController
    {

        private readonly IPrimeCustomersLib _primeCustomersLib;

        public PrimeCustomersController(IPrimeCustomersLib primeCustomersLib)
        {
            _primeCustomersLib = primeCustomersLib;
        }

        [Route("GetPrimeCustomerDetails")]
        public List<PrimeCustomers> GetPrimeCustomerDetails()
        {
            return SafeExecutor(() => _primeCustomersLib.GetPrimeCustomerDetails(), "Unable to Get Prime Customers");
        }

        [Route("SetPrimeCustomers")]
        [HttpPost]
        [AntiForgeryValidate]
        public PrimeCustomers SetPrimeCustomers(PrimeCustomers data)
        {
            return SafeExecutor(() => _primeCustomersLib.ManagePrimeCustomers(CrudModes.Insert, data)
                , $"Unable to get {"Prime Customers"}"
            );
        }
        

        [Route("UpdatePrimeCustomer")]
        [HttpPost]
        [AntiForgeryValidate]
        public PrimeCustomers UpdatePrimeCustomer(PrimeCustomers data)
        {
            return SafeExecutor(() => _primeCustomersLib.ManagePrimeCustomers(CrudModes.Update, data)
                , $"Unable to get {"Prime Customers"}"
            );
        }


        [Route("GetCountries")]
        public IEnumerable<Countires> GetCountries()
        {
            return SafeExecutor(() => _primeCustomersLib.GetCountries(),
                $"Unable to Get Countries");
        }


        [Route("GetPrimeCustomers")]
        public IEnumerable<PrimeCustDropdown> GetPrimeCustomers()
        {
            return SafeExecutor(() => _primeCustomersLib.GetPrimeCustomers(),
                $"Unable to Get Prime Customers");
        }

        [Route("GetUnPrimeDeals")]
        public IEnumerable<UnPrimeDeals> GetUnPrimeDeals()
        {
            return SafeExecutor(() => _primeCustomersLib.GetUnPrimeDeals(), "Unable to get deals");
        }

        [Route("GetEndCustomerData/{endCustomerName}/{endCustomerCountry}")]
        public IEnumerable<PrimeCustomerDetails> GetEndCustomerData(string endCustomerName, string endCustomerCountry)
        {
            return SafeExecutor(() => _primeCustomersLib.GetEndCustomerData(endCustomerName, endCustomerCountry),
                $"Unable to Get Prime Customers");
        }




    }
}