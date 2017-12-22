using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Extensions;
using System.Web.Http.OData.Query;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

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
        [Route("ActionTender/{dcId}/{actn}")]
        [HttpGet]
        public OpMsgQueue ActionTender(int dcId, string actn)
        {

            return SafeExecutor(() => ActionTenders(dcId.ToString(), actn)
                , "Unable to action the Tender Deal {dcId}"
            );
        }

        [Authorize]
        [Route("ActionTenders/{dcIds}/{actn}")]
        [HttpGet]
        public OpMsgQueue ActionTenders(string dcIds, string actn)
        {
            return SafeExecutor(() => _tenderLib.ActionTenders(dcIds, actn)
                , "Unable to action the Tenders"
            );
        }
    }
}
