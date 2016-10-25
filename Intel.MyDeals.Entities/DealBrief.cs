using System;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class DealBrief
    {
        [DataMember]
        public int DealNbr { set; get; }

        [DataMember]
        public string DealType { set; get; }

        [DataMember]
        public string Stage { set; get; }

        [DataMember]
        public DateTime StartDate { set; get; }

        [DataMember]
        public DateTime EndDate { set; get; }

        [DataMember]
        public string Customer { set; get; }


    }
}