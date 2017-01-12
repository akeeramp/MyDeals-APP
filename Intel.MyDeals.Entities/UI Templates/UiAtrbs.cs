using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class UiAtrbs
    {
        public dynamic value { get; set; }
        public string label { get; set; }
        public string type { get; set; }
        public bool isRequired { get; set; }
        public bool isError { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string opLookupUrl { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string opLookupText { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string opLookupValue { get; set; }

        public string validMsg { get; set; }

    }
}