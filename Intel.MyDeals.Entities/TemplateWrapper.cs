using System.Collections.Generic;
using System.Runtime.Serialization;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class TemplateWrapper // Result Set From: app.PR_GET_NEW_DEAL
    {
        [DataMember]
        public List<DealTemplateDataGram> TemplateData { set; get; }
        [DataMember]
        public Dictionary<string, List<OpDataElementUI>> TemplateDict { set; get; }
        [DataMember]
        public IEnumerable<CustomerCalendar> CalendarData { set; get; }
        [DataMember]
        public List<DealType> DealTypeData { set; get; }

        public TemplateWrapper()
        {
            TemplateData = new List<DealTemplateDataGram>();
            TemplateDict = new Dictionary<string, List<OpDataElementUI>>();
            CalendarData = new List<CustomerCalendar>();
            DealTypeData = new List<DealType>();
        }

    }
}
