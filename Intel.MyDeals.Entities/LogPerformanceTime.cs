using System;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class LogPerformanceTime
    {
        [JsonProperty(PropertyName = "uid")]
        public string UID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "executionMs")]
        public float ExecutionMs { get; set; }

        [JsonProperty(PropertyName = "start")]
        public DateTime Start { get; set; }

        [JsonProperty(PropertyName = "end")]
        public DateTime End { get; set; }

        [JsonProperty(PropertyName = "mode")]
        public string Mode { get; set; }

        [JsonProperty(PropertyName = "task")]
        public string Task { get; set; }

        [JsonProperty(PropertyName = "taskMs")]
        public float TaskMs { get; set; }
    }
}
