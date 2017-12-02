using System.Reflection;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class DropdownHierarchy : BasicDropdown
    {
        [JsonProperty(TypeNameHandling = TypeNameHandling.Objects)]
        public DropdownHierarchy[] items { get; set; }

        [JsonProperty(TypeNameHandling = TypeNameHandling.Objects)]
        public bool expanded { get; set; }      //determines whether this particular hierarchy node is expanded by default

        public DropdownHierarchy() {
            this.items = null; // new List<BasicDropdown>();
            this.expanded = false;
        }

        public DropdownHierarchy(BasicDropdown bd)
        {
            this.items = null;
            this.expanded = false;
            PropertyInfo[] properties = typeof(BasicDropdown).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                property.SetValue(this, property.GetValue(bd));
            }
        }
    }


}