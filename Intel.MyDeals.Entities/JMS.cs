using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class JMS
    {
        public string Url { get; set; }

        public string QueueName { get; set; }

        public string UserName { get; set; }

        //public string Password { get; set; }

        public List<string> Message { get; set; }
    }
}