using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductLookupPacket
    {
        public ProductLookupPacket()
        {
            Data = new ProductLookup();
            PerformanceTimes = new List<PerformanceTime>();
        }

        public ProductLookup Data { get; set; }
        public List<PerformanceTime> PerformanceTimes { get; set; }
    }
}