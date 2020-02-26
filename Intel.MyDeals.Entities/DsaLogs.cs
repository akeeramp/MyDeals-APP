using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class Vistex
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public Guid? TransanctionId { get; set; }
        [DataMember]
        public int DealId { get; set; }
        [DataMember]
        public Dictionary<VistexAttribute, string> DataBody { get; set; }
        [DataMember]
        public VistexMode Mode { get; set; }
        [DataMember]
        public string ModeLabel { get; set; }
        [DataMember]
        public VistexStage Status { get; set; }
        [DataMember]
        public string StatusLabel { get; set; }
        [DataMember]
        public string Message { get; set; }
        [DataMember]
        public DateTime CreatedOn { get; set; }
        [DataMember]
        public DateTime? SendToPoOn { get; set; }
        [DataMember]
        public DateTime? ProcessedOn { get; set; }
    }

    public class VistexAttributes
    {
        public string VistexAttribute { get; set; }
        public string Value { get; set; }
    }

    public enum VistexAttribute
    {
        DEAL_ID = 3616,
        OBJ_SET_TYPE_CD = 3002,
        CUST_NM = 4004,
        PRODUCT_FILTER = 15,
        START_DT = 3319,
        END_DT = 3320,
        MRKT_SEG = 3474,
        GEO_COMBINED = 3620,
        VOLUME = 3321,
        PAYOUT_BASED_ON = 35
    }

    public enum VistexStage
    {
        Pending = 1,
        PO_Staging = 2,
        PO_Error_Rollback = 3,
        PO_Send_Completed = 4,
        PO_Processing_Complete = 5,
        Line_Skipped = 6,
        Error = 7,
        PO_Complete = 8
    }

    public enum VistexMode
    {
        VISTEX_DEALS = 1,
        TENDER_DEALS = 2
    }
}
