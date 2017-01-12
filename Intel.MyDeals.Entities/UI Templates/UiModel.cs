using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class UiModel
    {
        public UiModel()
        {
            fields = new Dictionary<string, UiFieldItem>();
        }
        public string id { get; set; }
        public Dictionary<string, UiFieldItem> fields { get; set; }

    }
}