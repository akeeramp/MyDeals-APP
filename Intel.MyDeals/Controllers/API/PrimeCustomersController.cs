using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Net.Http;
using System;


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
        public IEnumerable<System.Web.Mvc.SelectListItem> GetPrimeCustomers()
        {
            var result = SafeExecutor(() => _primeCustomersLib.GetPrimeCustomers(),
                $"Unable to Get Unified Customers");
            //get the distinct end customer names irrespective of the case. ex. Amazon or amazon only one distinct value should be considered.
            var distinctPrimcustNmList = result.Select(x => x.PRIM_CUST_NM).Distinct(StringComparer.OrdinalIgnoreCase);
            return distinctPrimcustNmList.Select(x => new System.Web.Mvc.SelectListItem { Value = x, Text = x });
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
        [Route("UpdateUnPrimeDeals/{dealId}")]
        public bool UpdateUnPrimeDeals(int dealId , [FromBody] UnPrimeAtrbs endCustData)
        {
            return SafeExecutor(() => _primeCustomersLib.UpdateUnPrimeDeals(dealId, endCustData),
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
        // Commenting the below methods to disable the UCD Code changes
        //[Authorize]
        //[HttpPost]
        //[Route("UnPrimeDealsLogs/{dealId}")]
        //public string UnPrimeDealsLogs(int dealId, [FromBody] string endCustData)
        //{
        //    return SafeExecutor(() => _primeCustomersLib.UnPrimeDealsLogs(dealId, endCustData),
        //            $"Unable to Update UnUnified Deals Logs");
        //}

        //[Authorize]
        //[HttpGet]
        //[Route("RetryUCDRequest")]
        //public bool RetryUCDRequest()
        //{
        //    return SafeExecutor(() => _primeCustomersLib.RetryUCDRequest(),
        //            $"Unable to retry UCD request");
        //}

        //[Authorize]
        //[HttpPost]
        //[Route("SaveAMCResponceObject")]
        //public string SaveAMCResponceObject()
        //{
        //    HttpContent response = this.Request.Content;
        //    string amcResponse = response.ReadAsStringAsync().Result;

        //    if(amcResponse!=null && amcResponse != "")
        //    {
        //        _primeCustomersLib.saveAMQResponse(amcResponse);
        //    }
            
        //    string ret = "";
        //    return ret;
        //}

        [Route("GetRplStatusCodes")]
        public IEnumerable<RplStatusCode> GetRplStatusCodes()
        {
            return SafeExecutor(() => _primeCustomersLib.GetRplStatusCodes(),
                $"Unable to Get Rpl Status Code");
        }


    }
}
