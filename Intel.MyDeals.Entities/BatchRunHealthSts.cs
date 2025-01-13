using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class BatchRunHealthSts
    {
        [DataMember(Name = "BATCH_RUN_ID")]
        public Int32 BATCH_RUN_ID { get; set; }

        [DataMember(Name = "BATCH_DSC")]
        public string BATCH_DSC { get; set; }

        [DataMember(Name = "BATCH_SCHDL")]
        public string BATCH_SCHDL { get; set; }

        [DataMember(Name = "BATCH_RUN_STATUS")]
        public string BATCH_RUN_STATUS { get; set; }

        [DataMember(Name = "HEALTH")]
        public string HEALTH { get; set; }

        [DataMember(Name = "END_DTM")]
        public DateTime END_DTM { get; set; }

        [DataMember(Name = "START_DTM")]
        public DateTime START_DTM { get; set; }

        [DataMember(Name = "TIMEDIFF")]
        public Int32 TIMEDIFF { get; set; }

        [DataMember(Name = "MCHN_NM")]
        public string MCHN_NM { get; set; }

        [DataMember(Name = "PKG_NM")]
        public string PKG_NM { get; set; }

        [DataMember(Name = "THRESHOLD")]
        public Int32 THRESHOLD { get; set; }

        [DataMember(Name = "LST_RUN_DTM")]
        public DateTime LST_RUN_DTM { get; set; }

        [DataMember(Name = "ERR_MSG")]
        public string ERR_MSG { get; set; }
    }
}