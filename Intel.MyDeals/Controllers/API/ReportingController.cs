using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using System.Net;
using System.Text;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Reporting")]
    public class ReportingController : BaseApiController
    {
        private readonly IReportingLib _reportingLib;
        public ReportingController(IReportingLib reportingLib)
        {
            _reportingLib = reportingLib;
        }

        [Authorize]
        [Route("GetReportDashboard")]
        [HttpGet]
        public ReportMasterData GetReportDashboard()
        {
            return SafeExecutor(() => _reportingLib.GetReportDashboard()
                , $"Unable to get {"Workflow Stages"}"
            );            
        }

        
    }
}
