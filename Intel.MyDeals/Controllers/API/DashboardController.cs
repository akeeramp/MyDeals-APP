using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : BaseApiController
    {
        private readonly IDashboardLib _dashboardLib;

        public DashboardController(IDashboardLib dashboardLib)
        {
            _dashboardLib = dashboardLib;
        }

        [Authorize]
        [Route("GetDashboardContractSummary")]
        [HttpPost]
        public List<DashboardContractSummary> GetDashboardContractSummary([FromBody] DashboardFilter data)
        {
            if (data.CustomerIds == null || !data.CustomerIds.Any() || data.CustomerIds[0] == 0) data.CustomerIds = AppLib.GetMyCustomers(OpUserStack.MyOpUserToken).CustomerInfo.Select(c => c.CUST_SID).ToList();
            return SafeExecutor(() => Temp(data)
                , $"Unable to get Contracts Status"
            );
            //return SafeExecutor(() => _dashboardLib.GetDashboardContractSummary(data.CustomerIds, data.StartDate, data.EndDate)
            //    , $"Unable to get Contracts Status"
            //);
        }

        List<DashboardContractSummary> Temp(DashboardFilter data)
        {
            List<DashboardContractSummary> y = _dashboardLib.GetDashboardContractSummary(data.CustomerIds, data.StartDate, data.EndDate);
            Random rnd = new Random();
            List<string> stages = new List<string> {"Complete", "InComplete", "Archived"};
            
            foreach (DashboardContractSummary item in y)
            {
                if (item.WF_STG_CD == string.Empty) item.WF_STG_CD = stages[rnd.Next(stages.Count)];
            }
            return y;
        }


    }
}
