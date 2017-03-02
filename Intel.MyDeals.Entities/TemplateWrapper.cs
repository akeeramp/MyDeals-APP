using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public class TemplateWrapper // Result Set From: dbo.PR_MYDL_GET_OBJ_TEMPLT
    {
        [DataMember]
        public List<ObjectTypeTemplate> TemplateData { set; get; }
        [DataMember]
        public OpDataElementUITemplates TemplateDict { set; get; }
        [DataMember]
        public IEnumerable<CustomerCal> CalendarData { set; get; }
        //[DataMember]
        //public List<ObjectTypes> DealTypeData { set; get; }

        public TemplateWrapper()
        {
            TemplateData = new List<ObjectTypeTemplate>();
            TemplateDict = new OpDataElementUITemplates();
            CalendarData = new List<CustomerCal>();
            //DealTypeData = new List<ObjectTypes>();
        }

    }
}
