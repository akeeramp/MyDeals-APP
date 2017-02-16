
namespace Intel.MyDeals.Entities
{
    public class ContractTransferPacket
    {
        public OpDataCollectorFlattenedList Contract { get; set; }

        public OpDataCollectorFlattenedList PricingStrategy { get; set; }

        public OpDataCollectorFlattenedList PricingTable { get; set; }

        public OpDataCollectorFlattenedList WipDeals { get; set; }

        public string EventSource { get; set; }
    }
}
