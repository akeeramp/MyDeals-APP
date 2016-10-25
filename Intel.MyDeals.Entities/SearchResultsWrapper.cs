using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class SearchResultsWrapper
    {
        public SearchResultsWrapper()
        {
            Deals = new List<DealBrief>();
            Workbooks = new List<DealGroupHeaderItem>();
        }

        [DataMember]
        public List<DealBrief> Deals { get; set; }

        [DataMember]
        public List<DealGroupHeaderItem> Workbooks { get; set; }


    }
}