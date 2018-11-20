using Newtonsoft.Json;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// Message center payload structure
    /// </summary>
    public class MessageCenterPayload
    {
        public IList<PayLoad> payload { get; set; }

        public string recipients { get; set; }

        public bool sent_test_email { get; set; }
    }

    /// <summary>
    /// Payload
    /// </summary>
    public class PayLoad
    {
        public string Language { get; set; }

        public Values Values { get; set; }
    }

    public class Values
    {
        /// <summary>
        /// Subject key value in MC
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// RespondTo key value in MC
        /// </summary>
        public string RespondTo { get; set; }

        /// <summary>
        /// HTML table which will replace keys in MC
        /// </summary>
        public string table { get; set; }
    }

    public class ApiToken
    {
        public string data { get; set; }

        public string token { get; set; }
    }
}