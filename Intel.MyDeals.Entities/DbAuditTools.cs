using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{

    [DataContract]
    public class DbAuditToolFetchAudit
    {
        [DataMember]
        public string TESTITEM { get; set; }

        [DataMember]
        public List<DbAuditToolEnvs> ENVIRONMENTS { get; set; }

        [DataMember]
        public List<DbAuditToolObjs> DB_OBJECTS { get; set; }
    }

    public class DbAuditToolEnvs
    {
        public string ENV_NM { get; set; }

        public string ENV_TAG { get; set; }
    }

    public class DbAuditToolObjs
    {
        public string DB_TYPE { get; set; }

        public string DB_OBJ { get; set; }

        public string DB_DATA { get; set; }
    }

    public class DbAuditToolFetchObjectText
    {
        [DataMember]
        public string ENV_NM { get; set; }

        [DataMember]
        public string ENV_TAG { get; set; }

        [DataMember]
        public string DB_TYPE { get; set; }

        [DataMember]
        public string DB_OBJ { get; set; }

        [DataMember]
        public string DB_DATA { get; set; }
    }

}

