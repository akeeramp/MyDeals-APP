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
using Intel.MyDeals.BusinessLogic;
using Newtonsoft.Json;

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
        [AntiForgeryValidate]
        public List<DashboardContractSummary> GetDashboardContractSummary([FromBody] DashboardFilter data)
        {
            if (data.CustomerIds == null || !data.CustomerIds.Any() || data.CustomerIds[0] == 0)
            {
                data.CustomerIds = AppLib.GetMyCustomers(OpUserStack.MyOpUserToken).CustomerInfo.Select(c => c.CUST_SID).ToList();
            }

            // TWC3119-850: Throw exception when a out of range date is passed
            var SQL_MIN_VALID_DATE = new DateTime(1753, 1, 1);
            var SQL_MAX_VALID_DATE = new DateTime(9999, 12, 31);
            if (data.StartDate < SQL_MIN_VALID_DATE || data.EndDate < SQL_MIN_VALID_DATE || data.StartDate > SQL_MAX_VALID_DATE || data.EndDate > SQL_MAX_VALID_DATE)
            {
                throw new HttpResponseException(new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Date(s) are outside of the valid SQL range 1/1/1753 to 12/31/9999")
                });
            }

            return SafeExecutor(() => Temp(data)
                , $"Unable to get Contracts Status"
            );
            //return SafeExecutor(() => _dashboardLib.GetDashboardContractSummary(data.CustomerIds, data.StartDate, data.EndDate)
            //    , $"Unable to get Contracts Status"
            //);
        }

        List<DashboardContractSummary> Temp(DashboardFilter data)
        {
            List<int> verticalIds = AppLib.GetMyVerticals(OpUserStack.MyOpUserToken).Select(v => v.Id).ToList();
            List<DashboardContractSummary> retItems = _dashboardLib.GetDashboardContractSummary(data.CustomerIds, data.StartDate, data.EndDate, data.InFilters, data.grpFltr, data.Sort, data.Take, data.Skip, verticalIds);

            // Remove tender items if this is a copy contracts call.
            List<DashboardContractSummary> contractSummaryItems = data.DontIncludeTenders ? retItems.Where(c => c.IS_TENDER != 1).ToList() : retItems.ToList();

            //foreach (DashboardContractSummary item in contractSummaryItems)
            //{
            //    //if (item.WF_STG_CD == string.Empty) item.WF_STG_CD = stages[rnd.Next(stages.Count)];
            //    if (item.WF_STG_CD == string.Empty) item.WF_STG_CD = "InComplete"; //TODO: hook up to workflow
            //}
            retItems = contractSummaryItems;

            return retItems;
        }

        [Authorize]
        [Route("GetDashboardContractSummaryFltr")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<string> GetDashboardContractSummaryFltr([FromBody] DashboardFilter data)
        {
            if (data.CustomerIds == null || !data.CustomerIds.Any() || data.CustomerIds[0] == 0)
            {
                data.CustomerIds = AppLib.GetMyCustomers(OpUserStack.MyOpUserToken).CustomerInfo.Select(c => c.CUST_SID).ToList();
            }

            // TWC3119-850: Throw exception when a out of range date is passed
            var SQL_MIN_VALID_DATE = new DateTime(1753, 1, 1);
            var SQL_MAX_VALID_DATE = new DateTime(9999, 12, 31);
            if (data.StartDate < SQL_MIN_VALID_DATE || data.EndDate < SQL_MIN_VALID_DATE || data.StartDate > SQL_MAX_VALID_DATE || data.EndDate > SQL_MAX_VALID_DATE)
            {
                throw new HttpResponseException(new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Date(s) are outside of the valid SQL range 1/1/1753 to 12/31/9999")
                });
            }

            List<int> verticalIds = AppLib.GetMyVerticals(OpUserStack.MyOpUserToken).Select(v => v.Id).ToList();

            return SafeExecutor(() => _dashboardLib.GetDashboardContractSummaryFltr(data.CustomerIds, data.StartDate, data.EndDate, data.InFilters, data.grpFltr, data.Sort, data.Take, data.Skip, verticalIds)
                , $"Unable to get Contracts Status"
            );
        }

        [Authorize]
        [Route("GetDashboardContractSummaryCount")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<DashboardContractSummaryCount> GetDashboardContractSummaryCount([FromBody] DashboardFilter data)
        {
            if (data.CustomerIds == null || !data.CustomerIds.Any() || data.CustomerIds[0] == 0)
            {
                data.CustomerIds = AppLib.GetMyCustomers(OpUserStack.MyOpUserToken).CustomerInfo.Select(c => c.CUST_SID).ToList();
            }

            List<int> verticalIds = AppLib.GetMyVerticals(OpUserStack.MyOpUserToken).Select(v => v.Id).ToList();
            //DashboardPacket retItems = _dashboardLib.GetDashboardContractSummary(data.CustomerIds, data.StartDate, data.EndDate, data.InFilters, data.Sort, data.Take, data.Skip, verticalIds);

            return SafeExecutor(() => _dashboardLib.GetDashboardContractSummaryCount(data.CustomerIds, data.StartDate, data.EndDate, data.InFilters, data.grpFltr, data.Sort, data.Take, data.Skip, verticalIds)
                , $"Unable to get Contracts Status"
            );
        }

        [Authorize]
        [Route("GetWipSummary/{id}")]
        [HttpGet]
        public OpDataCollectorFlattenedList GetWipSummary(int id)
        {
            return SafeExecutor(() => _dashboardLib.GetWipSummary(id)[OpDataElementType.WIP_DEAL]
                , $"Unable to get Pricing Table {id}"
            );
        }
    }
}
