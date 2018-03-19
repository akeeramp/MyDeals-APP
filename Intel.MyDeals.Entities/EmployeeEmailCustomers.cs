using System.Collections.Generic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class EmployeeEmailCustomers
    {
        [JsonProperty(PropertyName = "custIds")]
        public List<int> CustIds { get; set; }

        [JsonProperty(PropertyName = "emailBody")]
        public string EmailBody { get; set; }
    }
}