using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SaveAndValidatePacket
    {
        //int custId, int contractId, ContractTransferPacket contractAndPricingTable
        public int custId { get; set; }
        public int contractId { get; set; }
        public int psId { get; set; }
        public int ptId { get; set; }
        public ContractTransferPacket contractAndPricingTable { get; set; }
    }
}
