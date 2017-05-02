using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class UiFieldItem
    {

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool editable { get; set; }

		public string field  { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string format { get; set; }
		
		public string label { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool nullable { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string opLookupUrl { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string opLookupText { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string opLookupValue { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string uiType { get; set; }

        public string type { get; set; }

		public string validMsg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string values { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string valuesText { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string valuesValue { get; set; }

	}
}
