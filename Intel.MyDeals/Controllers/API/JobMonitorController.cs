using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Web;
using System.Net.Http;

namespace Intel.MyDeals.Controllers.API
{

    [RoutePrefix("api/JobMonitor")]
    public class JobMonitorController : BaseApiController
    {
        private readonly IJobMonitorLib _jobMonitorLib;

        public JobMonitorController(IJobMonitorLib jobMonitorLib)
        {
            _jobMonitorLib = jobMonitorLib;
        }

        [Authorize]
        [Route("GetBatchRunHealthStatus")]
        [HttpGet]
        [AntiForgeryValidate]
        public List<BatchRunHealthSts> GetBatchRunHealthStatus()
        {
            return SafeExecutor(() => _jobMonitorLib.GetBatchRunHealthStatus()
                , $"Unable to get Batch Run Health Status"
            );
        }


        [Authorize]
        [Route("GetBatchStepsRunHealthStatus/{jobNm}")]
        [HttpGet]
        [AntiForgeryValidate]
        public List<BatchRunHealthSts> GetBatchStepsRunHealthStatus(string jobNm)
        {
            return SafeExecutor(() => _jobMonitorLib.GetBatchStepsRunHealthStatus(jobNm)
                , $"Unable to get Batch Steps Run Health Status"
            );
        }


        [Authorize]
        [Route("GetBatchStepRunHistory")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<BatchRunHealthSts> GetBatchStepRunHistory([FromBody] BatchStepRunHistory data)
        {
            return SafeExecutor(() => _jobMonitorLib.GetBatchStepRunHistory(data.btchNm, data.stepNm, data.take)
                , $"Unable to get Batch Step Run History"
            );
        }
    }
}
