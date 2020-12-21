using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class VistexLogFilters
    {
        public string Dealmode { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class VistexResponseData
    {
        public int OBJ_SID { get; set; }
        public string RSPN_MSG { get; set; }
        public string RQST_STS { get; set; }
    }

}
