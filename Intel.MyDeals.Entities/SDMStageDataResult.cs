using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SDMStageDataResult
    {
        public SDMStageDataResult()
        {
            Data = new List<SDMSummary>();
        }

        public List<SDMSummary> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
