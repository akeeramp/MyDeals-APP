using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class LogArchivalDetails
    {
        [DataMember(Name = "LOG_ARCHVL_PRG_TBL_DTL_SID")]
        public Int32 LOG_ARCHVL_PRG_TBL_DTL_SID { get; set; }

        [DataMember(Name = "SRT_ORDR")]
        public Int32 SRT_ORDR { get; set; }

        [DataMember(Name = "DB_NAME")]
        public string DB_NAME { get; set; }

        [DataMember(Name = "SCHEMA")]
        public string SCHEMA { get; set; }

        [DataMember(Name = "LOG_TBL_NM")]
        public string LOG_TBL_NM { get; set; }

        [DataMember(Name = "IS_PURGE")]
        public bool IS_PURGE { get; set; }

        [DataMember(Name = "IS_ARCHV")]
        public bool IS_ARCHV { get; set; }

        [DataMember(Name = "ARCHV_DB_NAME")]
        public string ARCHV_DB_NAME { get; set; }

        [DataMember(Name = "ARCHV_SCHEMA")]
        public string ARCHV_SCHEMA { get; set; }

        [DataMember(Name = "ARCHV_TBL_NM")]
        public string ARCHV_TBL_NM { get; set; }

        [DataMember(Name = "VIEW_NM")]
        public string VIEW_NM { get; set; }

        [DataMember(Name = "JSON_COND")]
        public string JSON_COND { get; set; }

        [DataMember(Name = "ACTV_IND")]
        public bool ACTV_IND { get; set; }

        [DataMember(Name = "STATUS")]
        public string STATUS { get; set; }

        [DataMember(Name = "LST_RUN")]
        public DateTime LST_RUN { get; set; }

        [DataMember(Name = "CRE_DTM")]
        public DateTime CRE_DTM { get; set; }

        [DataMember(Name = "CRE_EMP_WWID")]
        public Int32 CRE_EMP_WWID { get; set; }

        [DataMember(Name = "CHG_DTM")]
        public DateTime CHG_DTM { get; set; }

        [DataMember(Name = "CHG_EMP_WWID")]
        public Int32 CHG_EMP_WWID { get; set; }
    }
}