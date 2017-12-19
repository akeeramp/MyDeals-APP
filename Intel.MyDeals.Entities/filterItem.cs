using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class FilterItem
    {

        public FilterItem()
        {
            Filters = new List<FilterItem>();
        }

        [DataMember(Name = "field")]
        public string Field { get; set; }

        [DataMember(Name = "logic")]
        public string Logic { get; set; }

        [DataMember(Name = "value")]
        public string Value { get; set; }

        [DataMember(Name = "filters")]
        public List<FilterItem> Filters { get; set; }

        [DataMember(Name = "operator")]
        public string Operator { get; set; }

    }
}
