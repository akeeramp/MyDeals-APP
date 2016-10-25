using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class MyDealsActionItem
    {
        public MyDealsActionItem()
        {
            Actions = new Dictionary<string, bool>();
            Settings = new Dictionary<string, bool>();
        }

        public string Stage { get; set; }
        public string Role { get; set; }
        public string ObjsetType { get; set; }
        public Dictionary<string, bool> Actions { get; set; }
        public Dictionary<string, bool> Settings { get; set; }
    }
}