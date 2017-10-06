using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IAdvancedSearchDataLib
	{
        List<AdvancedSearchResults> GetAdvancedSearchResults(string searchText, List<int> custIds);
    }
}
