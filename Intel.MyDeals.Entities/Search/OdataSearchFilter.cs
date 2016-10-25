using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{

    /// <summary>
    /// A single search clause
    /// </summary>
    [DataContract]
    public class OdataSearchFilter
    {
        public OdataSearchFilter()
        {
            AttributeNm = string.Empty;
            Operator = string.Empty;
            Value = string.Empty;
            SubFilterConjunction = string.Empty;
            SubFilters = new List<OdataSearchFilter>();
        }

        [DataMember]
        public string AttributeNm { set; get; }
        
        [DataMember]
        public string Operator { set; get; }
       
        [DataMember]
        public string Value { set; get; }

        [DataMember]
        public string SubFilterConjunction { set; get; }

        [DataMember]
        public List<OdataSearchFilter> SubFilters { set; get; }

    }
}
