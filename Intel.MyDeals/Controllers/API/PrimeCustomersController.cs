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
            return SafeExecutor(() => _primeCustomersLib.GetPrimeCustomerDetails(), "Unable to Get Unified Customers");
        }

        [Route("SetPrimeCustomers")]
        [HttpPost]
        [AntiForgeryValidate]
        public PrimeCustomers SetPrimeCustomers(PrimeCustomers data)
        {
            return SafeExecutor(() => _primeCustomersLib.ManagePrimeCustomers(CrudModes.Insert, data)
                , $"Unable to get {"Unified Customers"}"
            );
        }


        [Route("UpdatePrimeCustomer")]
        [HttpPost]
        [AntiForgeryValidate]
        public PrimeCustomers UpdatePrimeCustomer(PrimeCustomers data)
        {
            return SafeExecutor(() => _primeCustomersLib.ManagePrimeCustomers(CrudModes.Update, data)
                , $"Unable to get {"Unified Customers"}"
            );
        }


        [Route("GetCountries")]
        public IEnumerable<Countires> GetCountries()
        {
            return SafeExecutor(() => _primeCustomersLib.GetCountries(),
                $"Unable to Get Countries");
        }


        [Route("GetPrimeCustomers")]
        public IEnumerable<PrimeCustomers> GetPrimeCustomers()
        {
            return SafeExecutor(() => _primeCustomersLib.GetPrimeCustomers(),
                $"Unable to Get Unified Customers");
        }

        [Route("GetUnPrimeDeals")]
        public IEnumerable<UnPrimeDeals> GetUnPrimeDeals()
        {
            return SafeExecutor(() => _primeCustomersLib.GetUnPrimeDeals(), "Unable to get deals");
        }

        [Authorize]
        [HttpPost]
        [Route("GetEndCustomerData")]
        public IEnumerable<PrimeCustomerDetails> GetEndCustomerData(string[] endCustomerData)
        {
            return SafeExecutor(() => _primeCustomersLib.GetEndCustomerData(endCustomerData[0], endCustomerData[1]),
                    $"Unable to Get Unified Customers");
        }

        [Authorize]
        [HttpPost]
        [Route("UpdateUnPrimeDeals/{dealId}/{primeCustId}")]
        public bool UpdateUnPrimeDeals(int dealId, string primeCustId ,[FromBody] string[] primeDetails)
        {
            return SafeExecutor(() => _primeCustomersLib.UpdateUnPrimeDeals(dealId, primeCustId, primeDetails),
                    $"Unable to Update UnUnified Deals");
        }

        [Authorize]
        [HttpPost]
        [Route("ValidateEndCustomer")]
        public IEnumerable<EndCustomer> ValidateEndCustomer([FromBody] string endCustObj)
        {
            return SafeExecutor(() => _primeCustomersLib.ValidateEndCustomer(endCustObj), "Unable to validate End Customer");
        }

        [Authorize]
        [HttpPost]
        [Route("UploadBulkUnifyDeals")]
        public IEnumerable<UnifiedDealsSummary> UploadBulkUnifyDeals(List<UnifyDeal> unifyDeals)
        {
            return SafeExecutor(() => _primeCustomersLib.UploadBulkUnifyDeals(unifyDeals), "Unable to do bulk update");
        }

    }
}
