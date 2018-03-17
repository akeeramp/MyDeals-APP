using System.Collections.Generic;
using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public class OpMsgQueuePacket
    {
        public OpMsgQueuePacket()
        {
            Data = new OpMsgQueue();
            PerformanceTimes = new List<PerformanceTime>();
        }

        public OpMsgQueue Data { get; set; }
        public List<PerformanceTime> PerformanceTimes { get; set; }

    }
}