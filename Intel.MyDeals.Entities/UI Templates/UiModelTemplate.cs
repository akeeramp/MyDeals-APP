using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class UiModelTemplate
    {
        public UiModelTemplate()
        {
            extraAtrbs = new Dictionary<string, UiAtrbs>();
            defaultAtrbs = new Dictionary<string, UiAtrbs>();
        }
        public string name { get; set; }
        public UiModel model { get; set; }
        public IEnumerable<UiColumn> columns { get; set; }
        public UiModel detailsModel { get; set; }
        public IEnumerable<UiColumn> detailsColumns { get; set; }
        public Dictionary<string, UiAtrbs> extraAtrbs { get; set; }
        public Dictionary<string, UiAtrbs> defaultAtrbs { get; set; }

    }
}