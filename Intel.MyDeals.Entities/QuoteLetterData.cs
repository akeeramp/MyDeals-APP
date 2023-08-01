using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class QuoteLetterData
    {
        public QuoteLetterData()
        {
        }

        public QuoteLetterData(string customerId, string objectTypeId, string objectSid)
        {
            this.CustomerId = customerId;
            this.ObjectTypeId = objectTypeId;
            this.ObjectSid = objectSid;
        }

        public string CustomerId { set; get; }
        public string ObjectTypeId { set; get; }
        public string ObjectSid { set; get; }
        public QuoteLetterContentInfo ContentInfo { get; set; }
        public QuoteLetterTemplateInfo TemplateInfo { get; set; }       
    }

    public class DownloadQuoteLetterData
    {
        [DataMember]
        public string ObjectTypeId { set; get; }
        [DataMember]
        public string ObjectSid { set; get; }
        [DataMember]
        public string RebateType { set; get; }
        [DataMember]
        public string Status { set; get; }

        [DataMember]
        public string CustomerSid { set; get; }

        [DataMember]
        public string DealStage { set; get; }
    }
}
