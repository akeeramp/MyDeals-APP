using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public partial class PctOverrideReason
    {

        [DataMember]
        public System.Int32 CUST_NM_SID { set; get; }


        [DataMember]
        public System.Int32 DEAL_OBJ_TYPE_SID { set; get; }


        [DataMember]
        public System.Int32 DEAL_OBJ_SID { set; get; }


        [DataMember]
        public System.Int32 PRD_MBR_SIDS { set; get; }


        [DataMember]
        public System.Int32 CST_OVRRD_FLG { set; get; }


        [DataMember]
        public System.String CST_OVRRD_RSN { set; get; }


    } 
}
