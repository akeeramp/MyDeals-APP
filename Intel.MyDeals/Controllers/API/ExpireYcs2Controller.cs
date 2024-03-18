using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ExpireYcs2")]
    public class ExpireYcs2Controller : BaseApiController
    {
        private readonly IExpireYcs2Lib _iExpireYcs2Lib;

        public ExpireYcs2Controller(IExpireYcs2Lib iExpireYcs2Lib)
        {
            _iExpireYcs2Lib = iExpireYcs2Lib;
        }

        [Authorize]
        [HttpGet]
        [Route("ExpireYcs2/{dealId}")]
        public List<DownloadExpireYcs2Data> ExpireYcs2(string dealId)
        {            
            return SafeExecutor(() => _iExpireYcs2Lib.ExpireYcs2(dealId), 
                                       $"Unable to get Results for the given {dealId}"
             );
        }
    }
}