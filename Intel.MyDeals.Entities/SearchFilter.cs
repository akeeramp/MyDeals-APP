using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class SearchFilter
    {
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }

        [JsonProperty(PropertyName = "field")]
        public string Field { get; set; }

        [JsonProperty(PropertyName = "operator")]
        public string Operator { get; set; }

        [JsonProperty(PropertyName = "value")]
        public object Value { get; set; }
    }
}
