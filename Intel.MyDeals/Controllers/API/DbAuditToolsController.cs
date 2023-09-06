using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DbAuditTools")]
    public class DbAuditToolsController : BaseApiController
    {
        private readonly IDbAuditToolsLib _dbAuditToolsLib;

        public DbAuditToolsController(IDbAuditToolsLib dbAuditToolsLib)
        {
            _dbAuditToolsLib = dbAuditToolsLib;
        }

        [Authorize]
        [Route("GetDbEnvData")]
        [HttpGet]
        public string GetDbEnvData()
        {
            string mode = "GET_ENVS";
            return SafeExecutor(() => _dbAuditToolsLib.GetDbAuditData(mode)
                , "Unable to get GetDbAuditData GET_ENVS"
            );
        }

        [Authorize]
        [Route("GetDbObjData")]
        [HttpGet]
        public string GetDbObjData()
        {
            string mode = "GET_OBJECTS";
            return SafeExecutor(() => _dbAuditToolsLib.GetDbAuditData(mode)
                , "Unable to get GetDbAuditData GET_OBJECTS"
            );
        }

        [Authorize]
        [Route("FetchDbAuditData")]
        [HttpPost]
        public string FetchDbAuditData(DbAuditToolFetchAudit Test1)
        {
            string mode = "RUN_AUDIT";
            string test2 = JsonConvert.SerializeObject(Test1);
            return SafeExecutor(() => _dbAuditToolsLib.RunDbAudit(mode, test2)
                , "Unable to get RunDbAudit RUN_AUDIT"
            );
        }

        [Authorize]
        [Route("GetObjText")]
        [HttpPost]
        public string GetObjText(DbAuditToolFetchObjectText data)
        {
            string mode = "GET_OBJ_TEXT";
            string jsonData = JsonConvert.SerializeObject(data);
            return SafeExecutor(() => _dbAuditToolsLib.GetDbAuditObjectText(mode, jsonData)
                , "Unable to get GetDbAuditData GET_OBJECTS"
            );
        }

    }
}