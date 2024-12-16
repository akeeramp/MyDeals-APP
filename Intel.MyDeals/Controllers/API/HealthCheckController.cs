using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Results;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/HealthCheck")]
    public class HealthCheckController : BaseApiController
    {
        private readonly IHealthCheckLib _healthCheckLib;

        public HealthCheckController(IHealthCheckLib healthCheckLib)
        {
            _healthCheckLib = healthCheckLib;
        }
        
        [Route("getstatus")]
        [HttpGet]
        public string GetHealthCheckStatus()
        {            
            return "200 OK";
        }

        [Route("getDbStatus")]
        [HttpGet]
        public NegotiatedContentResult<HealthCheckData> GetDbHealthCheckStatus()
        {
            var res = _healthCheckLib.GetDbHealthCheckStatus();
            if (res[0].STATUS == "Pass")
            {
                return Content(HttpStatusCode.OK, res[0]);
            }
            else
            {
                return Content(HttpStatusCode.InternalServerError, res[0]);
            }
        }

        [Route("GetCpuStatus")]
        [HttpGet]
        public NegotiatedContentResult <int> GetDbaasCpuHealthStatus()
        {
            int res = _healthCheckLib.GetDbaasCpuHealthStatus();
            if (res == 200)
            {
                return Content(HttpStatusCode.OK, res);
            }
            else
            {
                return Content(HttpStatusCode.InternalServerError, res);
            }
        }
    }
}