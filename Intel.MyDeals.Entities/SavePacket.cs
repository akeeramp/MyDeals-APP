using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SavePacket
    {
        public SavePacket()
        {
            MyContractToken = new ContractToken();
            ValidateIds = new List<int>();
            SourceEvent = string.Empty;
        }

        public SavePacket(ContractToken contractToken)
        {
            MyContractToken = contractToken;
            ValidateIds = new List<int>();
            SourceEvent = string.Empty;
        }

        public ContractToken MyContractToken { get; set; }
        public List<int> ValidateIds { get; set; }
        public bool ForcePublish { get; set; }
        public string SourceEvent { get; set; }
        public bool ResetValidationChild { get; set; }
    }
}
