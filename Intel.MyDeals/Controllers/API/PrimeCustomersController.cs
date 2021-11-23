using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Net.Http;


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
            var distinctPrimcustNmList = result.Select(x => x.PRIM_CUST_NM).Distinct();
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

        [Authorize]
        [HttpPost]
        [Route("UnPrimeDealsLogs/{dealId}")]
        public string UnPrimeDealsLogs(int dealId, [FromBody] string endCustData)
        {
            return SafeExecutor(() => _primeCustomersLib.UnPrimeDealsLogs(dealId, endCustData),
                    $"Unable to Update UnUnified Deals Logs");
        }

        [Authorize]
        [HttpPost]
        [Route("SaveAMCResponceObject")]
        public string SaveAMCResponceObject()
        {
            HttpContent response = this.Request.Content;
            string amcResponse = response.ReadAsStringAsync().Result;
            
            //HttpContent s = this.Request.Content;
            //string j = s.ReadAsStringAsync().Result;
            //var amqdata = "{ \"accountId\":\"0012j00000c0NnoAUU\",\"accountName\":\"ABANCAvan\",\"primaryAddress\":{ \"countryName\":\"Albania\"}," +
            //    "\"masteredSimplifiedAccountName\":\"ABANCAvan\",\"masteredBusinessPhysicalAddress\":{ \"countryCode\":\"Albania\",\"countryName\":\"Albania\"}," +
            //    "\"complianceWatchList\":[{ \"code\":\"DPL\",\"name\":\"Denied Parties List\"},{ \"code\":\"EC\",\"name\":\"Embargoed Country\"}],\"customerAggregationType\":" +
            //    "{ \"code\":\"UNFD_CTRY_CUST\",\"name\":\"Unified Country Customer\"},\"customerProcessEngagement\":[{ \"code\":\"DIR_PRC_EXCPT\",\"name\":\"Direct Price Exception\"}]," +
            //    "\"businessPartyIdentifier\":\"1000040089\",\"parentAccount\":{ \"accountId\":\"0012D00000OmHaeQAD\",\"accountName\":\"ABANCAvan\",\"businessPartyIdentifier\":\"1000783597\"}}";
            //var amqdata = "{\"RequestedAccountRejectionReason\":\"\",\"RequestedAccountRejectionNotes\":\"\",\"RecordType\":\"Intel Account\",\"PrimaryAddress\":{\"TypeCode\":\"Billing\",\"CountryName\":" +
            //    "\"Angola\",\"CountryCode\":\"ANG\"},\"ParentAccount\":{\"BusinessPartyIdentifier\":\"1000033778\",\"AccountName\":\"ABB\",\"AccountId\":\"0012i00000cGkJJAA0\"}," +
            //    "\"MasteredSimplifiedAccountName\":\"Test Platform Event 01\",\"MasteredBusinessPhysicalAddress\":{\"CountryName\":\"Angola\",\"CountryCode\":\"ANG\"},\"customerProcessEngagement\":[{\"Name\":" +
            //    "\"Direct Price Exception\",\"Code\":\"DIR_PRC_EXCPT\"}],\"CustomerAggregationType\":{\"Name\":\"Unified Country Customer\",\"Code\":\"UNFD_CTRY_CUST\"},\"ComplianceWatchList\":" +
            //    "[{\"Name\":\"No Sanction or Embargo\",\"Code\":\"NOSNCTN\"}],\"BusinessPartyIdentifier\":\"1000123456\",\"AccountName\":\"ABB\",\"AccountId\":\"0012i00000cXVLPAA4\"}";
            //AMCResponce res = new AMCResponce();
            //res = JsonConvert.DeserializeObject <AMCResponce>(amqdata);
            _primeCustomersLib.saveAMQResponse(amcResponse);
            string ret = "";
            return ret;
        }



    }
}
