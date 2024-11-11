using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface ISearchLib
	{
        List<SearchResults> GetSearchResults(string searchText, List<int> custIds);

        SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes, int skip, int take);

        DcPath GotoDcId(OpDataElementType opDataElementType, int dcid, bool inactCust = false);

        SearchResultPacket GetNonTenderDealList(SearchParams data);

        SearchResultPacket GetTenderDealList(SearchParams data, bool activeOnly);

        SearchResultPacket GetTenderDashboardList(SearchParams data);

        string GetTenderResultFilter(string custName, string st, string en);

        OpDataCollectorFlattenedList GetGlobalList(SearchParams data, OpDataElementType deType, bool InactCustSrch);

        SearchResultPacket GetTenderList(SearchParams data);


    }
}