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

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool isDimKey { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool isRequired { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool sortable { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool filterable { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string headerTemplate { get; set; }
        public string mjrMnrChg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lookupUrl { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lookupText { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lookupValue { get; set; }

    }
}