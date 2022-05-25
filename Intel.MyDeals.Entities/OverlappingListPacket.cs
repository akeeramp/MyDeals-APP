using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class OverlappingListPacket
    {
        public OverlappingListPacket()
        {
            Data = new List<Overlapping>();
            PerformanceTimes = new List<PerformanceTime>();
        }

        public List<Overlapping> Data { get; set; }
        public List<PerformanceTime> PerformanceTimes { get; set; }
    }

    public class OverlappingTenders
    {
        public int DealId { get; set; }
        public string StartDt { get; set; }
        public string EndDt { get; set; }
        public string Stage { get; set; }
    }

}