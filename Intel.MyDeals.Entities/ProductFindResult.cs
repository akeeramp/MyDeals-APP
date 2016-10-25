using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class ProductFindResult
    {
        public ProductFindResult()
        {
            ProductMapping = new Dictionary<string, List<PrdQueryResult>>();
            UserDefinedProductMapping = new Dictionary<string, List<string>>();
        }

        public Dictionary<string, List<PrdQueryResult>> ProductMapping { get; set; }

        public Dictionary<string, List<string>> UserDefinedProductMapping { get; set; }
    }
}
