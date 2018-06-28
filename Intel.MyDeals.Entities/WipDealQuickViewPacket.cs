using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class WipDealQuickViewPacket
    {
        public WipDealQuickViewPacket()
        {
            Data = new OpDataCollectorFlattenedItem();
            Path = new DcPathTitle();
            AtrbMap = new Dictionary<string, string>();
        }

        public OpDataCollectorFlattenedItem Data { get; set; }
        public DcPathTitle Path { get; set; }
        public Dictionary<string,string> AtrbMap { get; set; }
    }
}
