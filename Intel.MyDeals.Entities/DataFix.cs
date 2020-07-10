
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class DataFix
    {
        [DataMember]
        public int RequestId { get; set; }

        [DataMember]
        public int ActionId { get; set; }

        [DataMember]
        public string IncidentNumber { get; set; }

        [DataMember]
        public string Notes { get; set; }

        [DataMember]
        public bool IsActive { get; set; }

        [DataMember]
        public bool IsApproved { get; set; }

        [DataMember]
        public List<rule> DataToFix { get; set; }
    }
}
