using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class DealSearchItem
    {
        public IEnumerable<int> DraftDealIds { get; set; }
        public IEnumerable<int> DealIds { get; set; }
        public IEnumerable<int> PricingTableIds { get; set; }
        public IEnumerable<int> RebateStrategyIds { get; set; }
    }
}