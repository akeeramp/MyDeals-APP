using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface ISearchLib
	{
        List<SearchResults> GetSearchResults(string searchText, List<int> custIds);

        List<AdvancedSearchResults> GetAdvancedSearchResults(string searchText, List<int> custIds);
    }
}