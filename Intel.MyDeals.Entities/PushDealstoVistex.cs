using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class PushDealIdstoVistex
    {
        [DataMember]
        public string DEAL_IDS { get; set; }

        [DataMember]
        public bool VSTX_CUST_FLAG { get; set; }

    }

    public class PushDealstoVistexResults
    {
        [DataMember]
        public int DEAL_ID { get; set; }

        [DataMember]
        public string UPD_MSG { get; set; }

        [DataMember]
        public int ERR_FLAG { get; set; }
    }

   
}
