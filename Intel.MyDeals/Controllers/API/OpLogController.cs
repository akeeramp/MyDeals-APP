using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using WebApi.OutputCache.V2;
using System.Net.Http;
using System.Net;
using Intel.MyDeals.ActionFilters;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/OpLog")]
    public class OpLogController : BaseApiController
    {
        private readonly IOpLogLib _opLogLib;

        public OpLogController(IOpLogLib _opLogLib)
        {
            this._opLogLib = _opLogLib;
        }

        [Route("GetOpaqueLog")]
        [ApiAuthorize(AuthorizeDeveloper = true)]
        [HttpPost]
        [Authorize]        
        public List<logFileObject> GetOpaqueLog(logDate logDate)
        {
            return _opLogLib.GetOpaqueLog(logDate.startDate, logDate.endDate);
        }

        [Route("GetDetailsOpaqueLog/{fileName}")]
        [ApiAuthorize(AuthorizeDeveloper = true)]
        [Authorize]       
        public string GetDetailsOpaqueLog(string fileName)
        {
            return _opLogLib.GetDetailsOpaqueLog(fileName);
        }

        
    }

}