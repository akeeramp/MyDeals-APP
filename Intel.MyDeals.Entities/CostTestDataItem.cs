using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities.Custom
{
    /// <summary>
    /// Custom entity to support null able decimal values
    /// In ui when blank(null) show blank instead of showing 0.0
    /// </summary>
    public class CostTestDetailItem : Entities.CostTestDetailItem
    {
        [DataMember]
        public new System.Decimal? AVG_RPU { set; get; }

        [DataMember]
        public new System.Decimal? CAP { set; get; }

        [DataMember]
        public new System.Decimal? ECAP_FLR { set; get; }

        [DataMember]
        public new System.Decimal? ECAP_PRC { set; get; }

        [DataMember]
        public new System.Decimal? LOW_NET_PRC { set; get; }

        [DataMember]
        public new System.Decimal? MAX_RPU { set; get; }

        [DataMember]
        public new System.Decimal? PRD_COST { set; get; }

        [DataMember]
        public new System.Decimal? RTL_PULL_DLR { set; get; }

        [DataMember]
        public new System.Decimal? YCS2 { set; get; }
    }
}