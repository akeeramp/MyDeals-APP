using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using System;
using System.Net;
using Intel.Opaque;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
	//TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get customer information.
	[RoutePrefix("api/Customers")]
	public class CustomersController : BaseApiController
	{
		private ICustomerLib _customerLib;

		public CustomersController(ICustomerLib _customerLib)
		{
			this._customerLib = _customerLib;
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
			try
			{
				return _customerLib.GetCustomerDivisions(getCachedResult);
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetActiveCustomers")]
		public IEnumerable<CustomerDivision> GetActiveCustomers()
		{
			try
			{
				return _customerLib.GetCustomerDivisionsActive();
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetCustomerByCategory/{category}")]
		public IEnumerable<CustomerDivision> GetCustomerByCategory(string category)
		{
			try
			{
				return _customerLib.GetCustomerDivisionsByCategory(category);
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetCustomerByGeo/{geo}")]
		public IEnumerable<CustomerDivision> GetCustomerByGep(string geo)
		{
			try
			{
				return _customerLib.GetCustomerDivisionsByHostedGeo(geo);
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetCustomerByType/{type}")]
		public IEnumerable<CustomerDivision> GetCustomerByType(string type)
		{
			try
			{
				return _customerLib.GetCustomerDivisionsByType(type);
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetMyCustomers")]
		public MyCustomerDetailsWrapper GetMyCustomers()
		{
			try
			{
				return _customerLib.GetMyCustomers();
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetMyCustomersInfo")]
		public List<MyCustomersInformation> GetMyCustomersInfo()
		{
			try
			{
				return _customerLib.GetMyCustomersInfo();
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}

		[Authorize]
		[Route("GetMyCustomersSoldTo")]
		public List<MyCustomersSoldTo> GetMyCustomersSoldTo()
		{
			try
			{
				return _customerLib.GetMyCustomersSoldTo();
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
		}
	}
}
