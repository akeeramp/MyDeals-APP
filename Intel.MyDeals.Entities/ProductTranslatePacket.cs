using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductTranslatePacket
    {        
        public List<ProductEntryAttribute> usrData { get; set; }
        public int CUST_MBR_SID { get; set; }
        public bool IS_TENDER { get; set; }
        public string DEAL_TYPE { get; set; }
        public int contractId { get; set; }
        public int pricingStrategyId { get; set; }
        public int pricingTableId { get; set; }
    }
}
