using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/AsyncProcTrigger")]
    public class AsyncProcTriggerController : BaseApiController
    {
        private readonly IAsyncProcTriggerLib _asyncProcTriggerLib;

        public AsyncProcTriggerController(IAsyncProcTriggerLib asyncProcTriggerLib)
        {
            _asyncProcTriggerLib = asyncProcTriggerLib;
        }

        [Authorize]
        [Route("GetAsyncProcTriggers")]
        [HttpGet]
        public List<AsyncProcTrigger> GetAsyncProcTriggers()
        {
            return SafeExecutor(() => _asyncProcTriggerLib.GetAsyncProcTriggers(),
                "Unable to get AsyncProcTriggers");
        }

        [Route("SaveAsyncProcTrigger")]
        [HttpPost]
        public List<AsyncProcTrigger> SaveAsyncProcTrigger(CreateAsyncProcTriggerData data)
        {
            return SafeExecutor(() => _asyncProcTriggerLib.SaveAsyncProcTrigger(data),
                "Unable to save AsyncProcTriggers");
        }
    }
}