using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class VistexLogFilters
    {
        public string Dealmode { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string DealId { get; set; }
    }
    public class VistexLogFiltersRequest: VistexLogFilters
    {
        public string FilterName { get; set; }
        public string InFilters { get; set; }
        public string Sort { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
    public class VistexResponseData
    {
        public int OBJ_SID { get; set; }
        public string RSPN_MSG { get; set; }
        public string RQST_STS { get; set; }
    }

    public class VistexResponseUpdData
    {
        public string strTransantionId { get; set; }
        public string strVistexStage { get; set; }
        public int? dealId { get; set; }
        public int rqstSid { get; set; }
        public string strErrorMessage { get; set; }
    }

}
