
using System;

namespace Intel.MyDeals.Entities
{
    public class SearchParams
    {
        public string StrWhere { get; set; }
        public DateTime StrStart { get; set; }
        public DateTime StrEnd { get; set; }
        public string StrSearch { get; set; }
        public string StrFilters { get; set; }
        public string StrSorts { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
