using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface ISearchDataLib
	{
		List<SearchResults> GetSearchResults(string searchText, List<int> custIds);

        SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes, int skip, int take);

    }
}
