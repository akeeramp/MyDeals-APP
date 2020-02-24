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
        public int? TransanctionId { get; set; }
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
        public DateTime SendToPoOn { get; set; }
        [DataMember]
        public DateTime ProcessedOn { get; set; }
    }

    public class VistexAttributes
    {
        public string VistexAttribute { get; set; }
        public string Value { get; set; }
    }

    public enum VistexAttribute
    {
        CUST_NM = 2002,
        CUST_DIV_NM = 2003,
        SOLD_TO_ID = 2004,
        END_CUSTOMER_RETAIL = 3348,
        PAYOUT_BASED_ON = 35,
        DEAL_PRD_NM = 7007,
        MTRL_ID = 7008,
        PRODUCT_FILTER = 15,
        VOLUME = 3321
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

    public enum VistexMode
    {
        Deals = 1,
        Products = 2,
        Customer = 3
    }
}
