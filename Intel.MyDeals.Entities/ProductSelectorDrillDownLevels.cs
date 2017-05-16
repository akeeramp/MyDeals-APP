using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductSelectorWrapper
    {
        public ProductSelectorWrapper()
        {
            ProductSelectionLevels = new List<ProductSelectionLevels>();
            ProductSelectionLevelsAttributes = new List<ProductSelectionLevelsAttributes>();
        }

        public IList<ProductSelectionLevels> ProductSelectionLevels { get; set; }

        public IList<ProductSelectionLevelsAttributes> ProductSelectionLevelsAttributes { get; set; }
    }
}