using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SearchResultPacket
    {
        public SearchResultPacket()
        {
            SearchResults = new List<OpDataCollectorFlattenedItem>();
        }

        public List<OpDataCollectorFlattenedItem> SearchResults { get; set; }
        public int SearchCount { get; set; }
    }
}