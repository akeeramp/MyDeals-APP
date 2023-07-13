using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class SdsDealOverride
    {
        [DataMember]
        public string OBJECT_IDS { get; set; }

        [DataMember]
        public int RULE_ID { get; set; }

        [DataMember]
        public string RULE_NM { get; set; }

        [DataMember]
        public int LVL_ID { get; set; }

        [DataMember]
        public bool IS_CHECKED { get; set; }
    }

    public class SdsPassedData
    {
        public int obj_lvl { get; set; }

        public string obj_ids { get; set; }

        public int set_value { get; set; }

        public string message { get; set; }
    }

}
