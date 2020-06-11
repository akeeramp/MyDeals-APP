using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class DealMassUpdateData
    {
        [DataMember]
        public string DEAL_IDS { get; set; } 

        [DataMember]
        public int ATRB_SID { get; set; }

        [DataMember]
        public string UPD_VAL { get; set; } 
    }

    public class DealMassUpdateResults
    {
        [DataMember]
        public int DEAL_ID { get; set; }

        [DataMember]
        public string UPD_MSG { get; set; }

        [DataMember]
        public int ERR_FLAG { get; set; }

    }

    public class AttributeFeilds
    {
        [DataMember]
        public int ATRB_SID { get; set; }

        [DataMember]
        public string ATRB_DESC { get; set; }

    }
}
