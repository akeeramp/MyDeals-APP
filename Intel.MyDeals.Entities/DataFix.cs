
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class DataFix
    {
        [DataMember]
        public string IncidentNumber { get; set; }

        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public List<DataFixAttribute> DataFixAttributes { get; set; }

        [DataMember]
        public List<DataFixAction> DataFixActions { get; set; }
    }

    public class DataFixAttribute
    {
        public string DataElement { get; set; }
        public string Attribute { get; set; }
        public string MtxValue { get; set; }
        public string ObjectId { get; set; }
        public string ValueMax { get; set; }
        public string MDX { get; set; }
        public int CustId { get; set; }
        public string value { get; set; }
    }

    public class DataFixAction
    {
        public string DataElement { get; set; }
        public string Action { get; set; }
        public string TargetObjectIds { get; set; }
    }
}
