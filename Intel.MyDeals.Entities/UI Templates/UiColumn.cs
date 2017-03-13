using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class UiColumn
    {
        public string field { get; set; }

        public string title { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int width { get; set; }

        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string template { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool hidden { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string uiType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string editor { get; set; }
    }
}