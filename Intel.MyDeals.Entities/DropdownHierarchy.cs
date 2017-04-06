using System;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public class DropdownHierarchy: BasicDropdown
    {
        [JsonProperty(TypeNameHandling = TypeNameHandling.Objects)]
        public List<BasicDropdown> items { get; set; }

        public DropdownHierarchy() {
            this.items = new List<BasicDropdown>();
        }

        public DropdownHierarchy(BasicDropdown bd)
        {
            this.items = new List<BasicDropdown>();
            
            PropertyInfo[] properties = typeof(BasicDropdown).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                property.SetValue(this, property.GetValue(bd));
            }
        }
    }


}