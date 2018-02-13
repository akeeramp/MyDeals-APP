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
}