
using System;

namespace Intel.MyDeals.Entities
{
    public class SearchParams
    {
        public string StrWhere { get; set; }
        public DateTime StrStart { get; set; }
        public DateTime StrEnd { get; set; }
        public string StrSearch { get; set; }
        public FilterItem StrFilters { get; set; }
        public string StrSorts { get; set; }
    }
}
