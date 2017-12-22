using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using System;

namespace Intel.MyDeals.BusinessLogic
{
    public class SearchLib : ISearchLib
    {
        private readonly ISearchDataLib _searchDataLib;
        
        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public SearchLib()
        {
            _searchDataLib = new SearchDataLib();
        }

        public SearchLib(ISearchDataLib searchDataLib)
        {
            _searchDataLib = searchDataLib;
        }

        public SearchPacket GetAdvancedSearchResults(string searchCondition, string orderBy, string searchObjTypes, int skip, int take)
        {
            //AppLib.GetMyCustomersInfo().Select(c => c.CUST_SID).Distinct().ToList()
            return _searchDataLib.GetAdvancedSearchResults(searchCondition, orderBy, searchObjTypes, skip, take);
        }

        /// <summary>
        /// Get All Search Results for given search text / customers
        /// </summary>
        /// <returns>list of Search results</returns>
        public List<SearchResults> GetSearchResults(string searchText, List<int> custIds)
        {
            return _searchDataLib.GetSearchResults(searchText, custIds).OrderBy(sr => sr.CUSTOMER).ToList();
        }
    }
}
