using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get customer information.
    [RoutePrefix("api/Customers")]
    public class CustomersController : ApiController
    {
        OpCore op = OpAppConfig.Init();

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
                return new CustomerLib().GetCustomerDivisions(getCachedResult);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetActiveCustomers")]
        public IEnumerable<CustomerDivision> GetActiveCustomers()
        {
            try
            {
                return new CustomerLib().GetCustomerDivisionsActive();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetCustomerByCategory/{category}")]
        public IEnumerable<CustomerDivision> GetCustomerByCategory(string category)
        {
            try
            {
                return new CustomerLib().GetCustomerDivisionsByCategory(category);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetCustomerByGeo/{geo}")]
        public IEnumerable<CustomerDivision> GetCustomerByGep(string geo)
        {
            try
            {
                return new CustomerLib().GetCustomerDivisionsByHostedGeo(geo);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetCustomerByType/{type}")]
        public IEnumerable<CustomerDivision> GetCustomerByType(string type)
        {
            try
            {
                return new CustomerLib().GetCustomerDivisionsByType(type);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetMyCustomers")]
        public MyCustomerDetailsWrapper GetMyCustomers()
        {
            try
            {
                return new CustomerLib().GetMyCustomers();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetMyCustomersInfo")]
        public List<MyCustomersInformation> GetMyCustomersInfo()
        {
            try
            {
                return new CustomerLib().GetMyCustomersInfo();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetMyCustomersSoldTo")]
        public List<MyCustomersSoldTo> GetMyCustomersSoldTo()
        {
            try
            {
                return new CustomerLib().GetMyCustomersSoldTo();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}
