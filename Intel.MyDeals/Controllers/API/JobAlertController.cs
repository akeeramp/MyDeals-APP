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
        [Authorize]
        [HttpGet]
        [Route("SendJobAlerts")]
        public string SendJobAlerts()
        {
            return SafeExecutor(() => _iJobAlertLib.SendJobAlerts()
                , "Unable to send Job alert."
            );
        }
    }
}