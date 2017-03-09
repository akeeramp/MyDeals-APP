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
        public OpDataElementAtrbTemplates TemplateDict { set; get; }

        public TemplateWrapper()
        {
            TemplateData = new List<ObjectTypeTemplate>();
            TemplateDict = new OpDataElementAtrbTemplates();
        }

    }

}

