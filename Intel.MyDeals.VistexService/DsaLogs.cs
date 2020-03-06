using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class Vistex
    {
        public int Id { get; set; }
        public Guid? TransanctionId { get; set; }
        public int DealId { get; set; }
        public string DataBody { get; set; }
        public string Mode { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? SendToPoOn { get; set; }
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
        CUST_NM = 2002,
        PRODUCT_FILTER = 15,
        START_DT = 3319,
        END_DT = 3320,
        MRKT_SEG = 3474,
        GEO_COMBINED = 3620,
        VOLUME = 3321,
        PAYOUT_BASED_ON = 35,
        END_CUSTOMER_RETAIL = 3348
    }

    public enum VistexStage
    {
        Pending = 1,
        PO_Staging = 2,
        PO_Error_Rollback = 3,
        PO_Send_Completed = 4,
        PO_Processing_Complete = 5,
        Line_Skipped = 6,
        Error = 7
    }

    public enum ResponseType
    {
        None = 0,
        UnableToReachServer,
        Unauthorized,
        Success,
        Failed,
        Unknown,
        ConnectionClosed
    }

    public enum VistexMode
    {
        VISTEX_DEALS = 1,
        TENDER_DEALS = 2
    }
}