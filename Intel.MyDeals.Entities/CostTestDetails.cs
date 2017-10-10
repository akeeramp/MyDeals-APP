
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class CostTestDetail
    {
        [DataMember]
        public List<CostTestDetailItem> CostTestDetailItems { get; set; }
        [DataMember]
        public List<CostTestGroupDetailItem> CostTestGroupDetailItems { get; set; }
        [DataMember]
        public List<CostTestGroupDealDetailItem> CostTestGroupDealDetailItems { get; set; }
    }
}
