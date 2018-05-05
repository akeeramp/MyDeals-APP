using System.Collections.Generic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class TimelinePacket
    {
        [JsonProperty(PropertyName = "objSid")]
        public int ObjSid { get; set; }

        [JsonProperty(PropertyName = "objTypeSid")]
        public int ObjTypeSid { get; set; }

        [JsonProperty(PropertyName = "objTypeIds")]
        public List<int> ObjTypeIds { get; set; }
    }
}
