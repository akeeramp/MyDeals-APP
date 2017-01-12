using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class UiFieldItem
    {
        public string type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool editable { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool nullable { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string values { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string valuesText { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string valuesValue { get; set; }
        
    }
}
