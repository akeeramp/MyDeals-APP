using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
	//TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get customer information.
	[RoutePrefix("api/Customers")]
	public class CustomersController : BaseApiController
	{
		private readonly ICustomerLib _customerLib;

		public CustomersController(ICustomerLib customerLib)
		{
			_customerLib = customerLib;
		}

		/// <summary>
		/// Get All Customer Divisions
		/// </summary>
		/// <param name="getCachedResult">When set to false read request is coming from Admin screens</param>
		/// <returns></returns>
		[Authorize]
		[Route("GetCustomers/{getCachedResult:bool?}")]
		public IEnumerable<CustomerDivision> GetCustomerDivisions(bool getCachedResult = true)
		{
            return SafeExecutor(() => _customerLib.GetCustomerDivisions()
                , "Unable to get Customers"
            );
		}

		[Authorize]
		[Route("GetActiveCustomers")]
		public IEnumerable<CustomerDivision> GetActiveCustomers()
		{
            return SafeExecutor(() => _customerLib.GetCustomerDivisionsActive()
                , "Unable to get Customers"
            );
		}

        [Authorize]
        [Route("GetActiveCustomersByGeo/{geos}")]
        public IEnumerable<CustomerDivision> GetActiveCustomersByGeo(string geos)
        {
            List<string> arGeos = geos.Split(',').ToList();
            return SafeExecutor(() => _customerLib.GetCustomerDivisionsActive().Where(g => geos == "WW" || arGeos.Contains(g.HOSTED_GEO))
                , "Unable to get Customers"
            );
        }

        [Authorize]
        [Route("GetCustomerDivisionsByCustNmSid/{custNmSid}")]
        public IEnumerable<CustomerDivision> GetCustomerDivisionsByCustNmSid(int custNmSid)
        {
            return SafeExecutor(() => _customerLib.GetCustomerDivisionsByCustNmSid(custNmSid)
                , "Unable to get Customers"
            );
        }

  //      [Authorize]
		//[Route("GetCustomerByCategory/{category}")]
		//public IEnumerable<CustomerDivision> GetCustomerByCategory(string category)
		//{
  //          return SafeExecutor(() => _customerLib.GetCustomerDivisionsByCategory(category)
  //              , "Unable to get Customers"
  //          );
		//}

		[Authorize]
		[Route("GetCustomerByGeo/{geo}")]
		public IEnumerable<CustomerDivision> GetCustomerByGep(string geo)
		{
            return SafeExecutor(() => _customerLib.GetCustomerDivisionsByHostedGeo(geo)
                , "Unable to get Customers"
            );
		}

		//[Authorize]
		//[Route("GetCustomerByType/{type}")]
		//public IEnumerable<CustomerDivision> GetCustomerByType(string type)
		//{
  //          return SafeExecutor(() => _customerLib.GetCustomerDivisionsByType(type)
  //              , "Unable to get Customers"
  //          );
		//}

        [Authorize]
        [Route("GetMyCustomers")]
        public MyCustomerDetailsWrapper GetMyCustomers()
        {
            return SafeExecutor(() => _customerLib.GetMyCustomers()
                , "Unable to get My Customers"
            );
        }

        [Authorize]
        [Route("GetMyCustomerNames")]
        public IEnumerable<MyCustomersInformation> GetMyCustomerNames()
        {
            return SafeExecutor(() => AppLib.GetMyCustomerNames().OrderBy(c => c.CUST_NM)
                , "Unable to get My Customer Names"
            );
        }

        [Authorize]
        [Route("GetMyCustomerDivsByCustNmSid/{custNmSid}")]
        public IEnumerable<MyCustomersInformation> GetMyCustomerDivsByCustNmSid(int custNmSid)
        {
            return SafeExecutor(() => AppLib.GetMyCustomerDivsByCustNmSid(custNmSid).OrderBy(c => c.CUST_DIV_NM)
                , "Unable to get My Customer Name IDs"
            );
        }

        [Route("GetMyCustomersInfo")]
        public IEnumerable<MyCustomersInformation> GetMyCustomersInfo()
        {
            return SafeExecutor(() => AppLib.GetMyCustomersInfo().OrderBy(c => c.CUST_NM)
                , "Unable to get My Customers Info"
            );
        }

        [Route("GetMyCustomersNameInfo")]
        public IEnumerable<MyCustomersInformation> GetMyCustomersNameInfo()
        {
            return SafeExecutor(() => AppLib.GetMyCustomersInfo().Where(c => c.CUST_LVL_SID == 2002).OrderBy(c => c.CUST_NM)
                , "Unable to get My Customers Info"
            );
        }

        [Route("GetMyCustomersDivInfo")]
        public IEnumerable<MyCustomersInformation> GetMyCustomersDivInfo()
        {
            return SafeExecutor(() => AppLib.GetMyCustomersInfo().Where(c => c.CUST_LVL_SID == 2003).OrderBy(c => c.CUST_DIV_NM)
                , "Unable to get My Customers Info"
            );
        }

        //      [Authorize]
        //[Route("GetMyCustomersSoldTo")]
        //public List<MyCustomersSoldTo> GetMyCustomersSoldTo()
        //{
        //          return SafeExecutor(AppLib.GetMyCustomersSoldTo
        //              , "Unable to get My Customer Sold Tos"
        //          );
        //}
    }
}
