
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class DataFix
    {
        [DataMember]
        public string INCDN_NBR { get; set; }

        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public List<DataFixAttribute> DataFixAttributes { get; set; }

        [DataMember]
        public List<DataFixAction> DataFixActions { get; set; }

        [DataMember]
        public string CreatedBy { get; set; }

        [DataMember]
        public DateTime CreatedOn { get; set; }
    }

    public class DataFixAttribute
    {
        public int OBJ_TYPE_SID { get; set; }
        public int ATRB_SID { get; set; }
        public int ATRB_RVS_NBR { get; set; }
        public int ATRB_MTX_SID { get; set; }
        public int OBJ_SID { get; set; }
        public string ATRB_VAL { get; set; }
        public string ATRB_VAL_MAX { get; set; }
        public string MDX_CD { get; set; }
        public int CUST_MBR_SID { get; set; }
        public int BTCH_ID { get; set; }
        public string value { get; set; }
        public List<string> values { get; set; }
        public ValueType valueType { get; set; }
    }

    public class DataFixAction
    {
        public int OBJ_TYPE_SID { get; set; }
        public string ACTN_NM { get; set; }
        public string ACTN_VAL_LIST { get; set; }
        public int BTCH_ID { get; set; }
    }
}
