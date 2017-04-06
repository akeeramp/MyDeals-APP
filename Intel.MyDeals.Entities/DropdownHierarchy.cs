using System.Collections.Generic;
using System.Reflection;

namespace Intel.MyDeals.Entities
{
    public class DropdownHierarchy: BasicDropdown
    {
        public List<BasicDropdown> notitems { get; set; }

        public DropdownHierarchy() {
            this.notitems = new List<BasicDropdown>();
        }

        public DropdownHierarchy(BasicDropdown bd)
        {
            this.notitems = new List<BasicDropdown>();
            
            PropertyInfo[] properties = typeof(BasicDropdown).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                property.SetValue(this, property.GetValue(bd));
            }
        }
    }
}