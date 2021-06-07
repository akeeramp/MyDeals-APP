using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    //Only for internal testing
    [DataContract]
    public class VistexLogs
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public Guid? TransanctionId { get; set; }
        [DataMember]
        public int DealId { get; set; }       
        [DataMember]
        public string Mode { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public string Message { get; set; }
        [DataMember]
        public DateTime CreatedOn { get; set; }
        [DataMember]
        public DateTime? SendToPoOn { get; set; }
        [DataMember]
        public DateTime? ProcessedOn { get; set; }
    }

    [DataContract]
    public class VistexDealOutBound
    {
        [DataMember]
        public Guid TransanctionId { get; set; }
        [DataMember]
        public int DealId { get; set; }
        [DataMember]
        public List<VistexAttributes> VistexAttributes { get; set; }  
    }

    [DataContract]
    public class VistexProductVerticalOutBound
    {
        [DataMember]
        public Guid TransanctionId { get; set; }
        [DataMember]
        public List<ProductCategory> ProductVertical { get; set; }
    }

    public class VistexAttributes
    {
        public string VistexAttribute { get; set; }
        public string Value { get; set; }
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
        VISTEX_DEALS = 1,
        TENDER_DEALS = 2,
        PROD_VERT_RULES = 3,
        CNSMPTN_LD = 4,
        TENDER_DEALS_RESPONSE = 5
    }
}
