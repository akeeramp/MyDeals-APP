using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/JobAlert")]
    public class JobAlertController : BaseApiController
    {
        private readonly IJobAlertLib _iJobAlertLib;

        public JobAlertController(IJobAlertLib iJobAlertLib)
        {
            _iJobAlertLib = iJobAlertLib;
        }
        /// <summary>
        /// Checks the status and sends mail to users, if any job is having issues
        /// </summary>
        /// <returns></returns>

        [HttpPost]
        [Route("TrgrJobAlerts")]
        public IHttpActionResult TrgrJobAlerts()
        {
            try
            {
                _iJobAlertLib.SendJobAlerts();
                return Ok("Alert Successfully Triggered");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}