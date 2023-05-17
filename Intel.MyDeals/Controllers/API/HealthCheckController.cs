using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/HealthCheck")]
    public class HealthCheckController : ApiController
    {
        [Route("getstatus")]
        [HttpGet]
        public string GetHealthCheckStatus()
        {
            return "API Response Status Code: 200 OK";
        }
    }
}
