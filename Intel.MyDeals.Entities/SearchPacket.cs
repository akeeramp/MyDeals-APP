using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SearchPacket
    {
        public SearchPacket()
        {
            SearchResults = new List<AdvancedSearchResults>();
        }

        public List<AdvancedSearchResults> SearchResults { get; set; }
        public int SearchCount { get; set; }
    }
}
