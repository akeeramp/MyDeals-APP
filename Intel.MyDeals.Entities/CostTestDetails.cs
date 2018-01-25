using System.Collections.Generic;
using System.Runtime.Serialization;
using CustomEntities = Intel.MyDeals.Entities.Custom;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class CostTestDetail
    {
        [DataMember]
        public List<CustomEntities.CostTestDetailItem> CostTestDetailItems { get; set; }

        [DataMember]
        public List<CostTestGroupDetailItem> CostTestGroupDetailItems { get; set; }

        [DataMember]
        public List<CostTestGroupDealDetailItem> CostTestGroupDealDetailItems { get; set; }
    }
}