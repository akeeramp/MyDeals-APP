using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class OpDataCollectorFlattenedDictListPacket
    {
        public OpDataCollectorFlattenedDictListPacket()
        {
            Data = new OpDataCollectorFlattenedDictList();
            PerformanceTimes = new List<PerformanceTime>();
        }

        public OpDataCollectorFlattenedDictList Data { get; set; }
        public List<PerformanceTime> PerformanceTimes { get; set; }
        public int cId { get; set; }
        public int psId { get; set; }
        public int ptId { get; set; }

    }
}
