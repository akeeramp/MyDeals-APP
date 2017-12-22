using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
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
        [Route("GetAdvancedSearchResults/{searchCondition}/{orderBy}/{searchObjTypes}")]
        public SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes)
        {
            return SafeExecutor(() => _searchLib.GetAdvancedSearchResults(searchCondition, orderBy, searchObjTypes, 0, 1000)
                , $"Unable to get Search Results"
            );
        }
    }
}
