using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class EmailMessage
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string From { get; set; }
        public List<string> To { get; set; }

    }
}
