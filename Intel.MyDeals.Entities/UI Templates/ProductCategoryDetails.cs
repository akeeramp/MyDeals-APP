using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductCategoryDetails
    {
        public List<ProductCategory> Items { get; set; }
        public int TotalRows { get; set; }
    }
}