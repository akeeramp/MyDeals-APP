using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Extensions;
using System.Web.Http.OData.Query;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Search")]
    public class SearchController : BaseApiController
    {
        private readonly ISearchLib _searchLib;

        public SearchController(ISearchLib searchLib)
        {
            _searchLib = searchLib;
        }

        [Authorize]
        [Route("GetSearchResults/{searchText}")]
        public List<SearchResults> GetSearchResults(string searchText)
        {
            return SafeExecutor(() => _searchLib.GetSearchResults(searchText, AppLib.GetMyCustomersInfo().Select(c => c.CUST_SID).Distinct().ToList())
                , $"Unable to get Search Results for {searchText}"
            );
        }

        [Authorize]
        [HttpGet]
        [Route("GotoDeal/{dcid}")]
        public DcPath GotoDeal(int dcid)
        {
            return SafeExecutor(() => _searchLib.GotoDcId(OpDataElementType.WIP_DEAL, dcid)
                , $"Unable to get Search Results"
            );
        }

        [Authorize]
        [HttpGet]
        [Route("GotoPt/{dcid}")]
        public DcPath GotoPt(int dcid)
        {
            return SafeExecutor(() => _searchLib.GotoDcId(OpDataElementType.PRC_TBL, dcid)
                , $"Unable to get Search Results"
            );
        }

        [Authorize]
        [HttpGet]
        [Route("GotoPs/{dcid}")]
        public DcPath GotoPs(int dcid)
        {
            return SafeExecutor(() => _searchLib.GotoDcId(OpDataElementType.PRC_ST, dcid)
                , $"Unable to get Search Results"
            );
        }

        [Authorize]
        [Route("GetDealList/{st}/{en}/{searchText}")]
        [HttpGet]
        public PageResult<OpDataCollectorFlattenedItem> GetDealList(ODataQueryOptions<CustomerDivision> options, DateTime st, DateTime en, string searchText)
        {
            int maxLength = 1000;
            if (string.IsNullOrEmpty(searchText) || searchText == "null") searchText = "";

            SearchResultPacket rtn = _searchLib.GetNonTenderDealList(new SearchParams
            {
                StrStart = st,
                StrEnd = en,
                Customers = string.IsNullOrEmpty(searchText) ? new List<string>() : searchText.Split(',').ToList(),
                StrSorts = options.RawValues.OrderBy ?? "",
                StrFilters = options.Filter == null ? "" : options.Filter.RawValue ?? "",
                Skip = options.RawValues.Skip == null ? 0 : int.Parse(options.RawValues.Skip),
                Take = options.RawValues.Top == null || options.RawValues.Top == "all" ? maxLength : int.Parse(options.RawValues.Top)
            });

            return new PageResult<OpDataCollectorFlattenedItem>(
                rtn.SearchResults,
                Request.ODataProperties().NextLink,
                rtn.SearchCount);
        }

        [Authorize]
        [Route("GetTenderList/{st}/{en}/{actv}/{searchText}")]
        [HttpGet]
        public PageResult<OpDataCollectorFlattenedItem> GetTenderList(ODataQueryOptions<CustomerDivision> options, DateTime st, DateTime en, int actv, string searchText)
        {
            int maxLength = 1000;
            if (string.IsNullOrEmpty(searchText) || searchText == "null") searchText = "";

            SearchResultPacket rtn = _searchLib.GetTenderDealList(new SearchParams
            {
                StrStart = st,
                StrEnd = en,
                StrSearch = searchText,
                StrSorts = options.RawValues.OrderBy ?? "",
                StrFilters = options.Filter == null ? "" : options.Filter.RawValue ?? "",
                Skip = options.RawValues.Skip == null ? 0 : int.Parse(options.RawValues.Skip),
                Take = options.RawValues.Top == null || options.RawValues.Top == "all" ? maxLength : int.Parse(options.RawValues.Top)
            }, actv == 1);

            return new PageResult<OpDataCollectorFlattenedItem>(
                rtn.SearchResults,
                Request.ODataProperties().NextLink,
                rtn.SearchCount);
        }

        [Authorize]
        [Route("GetGlobalSearchList/{opType}/{take}/{searchText}")]
        [HttpGet]
        public OpDataCollectorFlattenedList GetGlobalSearchList(string opType, int take, string searchText)
        {
            if (string.IsNullOrEmpty(searchText) || searchText == "null") searchText = "";

            return _searchLib.GetGlobalList(new SearchParams
            {
                StrStart = DateTime.MinValue,
                StrEnd = DateTime.MaxValue,
                StrSearch = searchText,
                StrFilters = "",
                Skip = 0,
                Take = take <= 1 ? 1 : take - 1
            }, OpDataElementTypeConverter.FromString(opType));
        }

    }
}
