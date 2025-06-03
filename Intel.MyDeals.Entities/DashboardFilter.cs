using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class DashboardFilter
    {
        public List<int> CustomerIds { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool DontIncludeTenders { get; set; }
        public string InFilters { get; set; }
        public string grpFltr {  get; set; }
        public string Sort { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }

}