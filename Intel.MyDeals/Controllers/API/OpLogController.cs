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
using System.Web;

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
        [HttpPost]        
        public string GetDetailsOpaqueLog(string fileName)
        {            
            if (fileName.IndexOfAny(System.IO.Path.GetInvalidFileNameChars()) == -1 && fileName.Contains("FileLogPerf"))
            {
               return HttpUtility.HtmlEncode(_opLogLib.GetDetailsOpaqueLog(HttpUtility.HtmlEncode(fileName)));
            }            
            else
            {
                return "Something went wrong";
            }
            
        }

        
    }

}