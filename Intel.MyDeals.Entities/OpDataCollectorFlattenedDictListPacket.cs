using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
