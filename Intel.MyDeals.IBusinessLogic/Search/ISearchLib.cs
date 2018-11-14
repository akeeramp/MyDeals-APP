using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface ISearchLib
	{
        List<SearchResults> GetSearchResults(string searchText, List<int> custIds);

        SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes, int skip, int take);

        DcPath GotoDcId(OpDataElementType opDataElementType, int dcid);

        SearchResultPacket GetNonTenderDealList(SearchParams data);

        SearchResultPacket GetTenderDealList(SearchParams data, bool activeOnly);

        SearchResultPacket GetTenderDashboardList(SearchParams data);

        OpDataCollectorFlattenedList GetGlobalList(SearchParams data, OpDataElementType deType);

        SearchResultPacket GetTenderList(SearchParams data);


    }
}