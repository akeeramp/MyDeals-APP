using System.Collections.Generic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class AtrbSaveItem
    {
        [JsonProperty(PropertyName = "objSetType")]
        public OpDataElementType ObjSetType { get; set; }

        [JsonProperty(PropertyName = "ids")]
        public List<int> Ids { get; set; }

        [JsonProperty(PropertyName = "attribute")]
        public string Attribute { get; set; }

        [JsonProperty(PropertyName = "value")]
        public object Value { get; set; }
    }
}