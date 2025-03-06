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
    [RoutePrefix("api/LogArchival")]
    public class LogArchivalController : BaseApiController
    {
        private readonly ILogArchivalLib _logArchivalLib;
        public LogArchivalController(ILogArchivalLib logArchivalLib)
        {
            _logArchivalLib = logArchivalLib;
        }

        //[Authorize]
        [HttpGet]
        [Route("GetLogArchivalDetails")]
        public List<LogArchivalDetails> GetLogArchivalDetails()
        {
            return SafeExecutor(() => _logArchivalLib.GetLogArchivalDetails()
                , $"Unable to get Log Archival details"
            );
        }

        //[Authorize]
        [HttpPost]
        [Route("UpdateLogArchival/{mode}")]
        public List<LogArchival> UpdateLogArchival([FromBody] List<LogArchival> logArchival, string mode)
        {
            return SafeExecutor(() => _logArchivalLib.UpdateLogArchival(mode, logArchival)
                , "Unable to process"
            );
        }
    }
}