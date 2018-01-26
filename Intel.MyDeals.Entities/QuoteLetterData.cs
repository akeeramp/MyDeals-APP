using System.Collections.Generic;

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
}
