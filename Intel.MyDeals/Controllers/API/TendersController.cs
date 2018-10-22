using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Extensions;
using System.Web.Http.OData.Query;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Tenders/v1")]
    public class TendersController : BaseApiController
    {
        private readonly ITendersLib _tenderLib;
        public TendersController(ITendersLib pricingTablesLib)
        {
            _tenderLib = pricingTablesLib;
        }

        [Authorize]
        [Route("GetMaster/{id}")]
        public OpDataCollectorFlattenedDictList GetMaster(int id)
        {
            return SafeExecutor(() => _tenderLib.GetMaster(id)
                , $"Unable to get Pricing Table {id}"
            );
        }

        [Authorize]
        [Route("GetChildren/{id}")]
        public OpDataCollectorFlattenedDictList GetChildren(int id)
        {
            return SafeExecutor(() => _tenderLib.GetChildren(id)
                , $"Unable to get Pricing Table {id}"
            );
        }


        [Authorize]
        [Route("GetTenderList/{st}/{en}/{searchText}")]
        [HttpGet]
        public PageResult<OpDataCollectorFlattenedItem> GetTenderList(ODataQueryOptions<CustomerDivision> options, DateTime st, DateTime en, string searchText)
        {
            int maxLength = 1000;
            if (string.IsNullOrEmpty(searchText) || searchText == "null") searchText = "";

            SearchResultPacket rtn = _tenderLib.GetTenderList(new SearchParams
            {
                StrStart = st,
                StrEnd = en,
                StrSearch = searchText,
                StrSorts = options.RawValues.OrderBy ?? "",
                StrFilters = options.Filter == null ? "" : options.Filter.RawValue ?? "",
                Skip = options.RawValues.Skip == null ? 0 : int.Parse(options.RawValues.Skip),
                Take = options.RawValues.Top == null ? maxLength : int.Parse(options.RawValues.Top)
            });

            return new PageResult<OpDataCollectorFlattenedItem>(
                rtn.SearchResults, 
                Request.ODataProperties().NextLink,
                rtn.SearchCount);
        }

        [Authorize]
        [Route("ActionTenders/{actn}")]
        [HttpPost]
        public OpMsgQueuePacket ActionTenders(List<TenderActionItem> data, string actn)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - ActionTenders")
            {
                CustId = 0,
                ContractId = 0,
                NeedToCheckForDelete = false
            };

            OpMsgQueue result = SafeExecutor(() => _tenderLib.ActionTenders(contractToken, data, actn)
                , "Unable to action the Tenders"
            );

            return new OpMsgQueuePacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Action Tender Deals", contractToken.TimeFlow)
            };
        }

        [Authorize]
        [Route("BulkTenderUpdate")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpDataCollectorFlattenedDictListPacket BulkTenderUpdate(ContractTransferPacket tenderData)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - BulkTenderUpdate")
            {
                CustId = -1,
                ContractId = -1,
                //DeleteAllPTR = delPtr,
                BulkTenderUpdate = true
            };

            tenderData.EventSource = OpDataElementType.WIP_DEAL.ToString(); //tenders are bulk edited from the tender dashboard in only wip deal form

            OpDataCollectorFlattenedDictList result = SafeExecutor(() => _tenderLib.BulkTenderUpdate(contractToken, tenderData)
                , "Unable to save the Tenders"
            );

            return new OpDataCollectorFlattenedDictListPacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Save and Validation of Tenders", contractToken.TimeFlow)
            };
        }
    }
}
