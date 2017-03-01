using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IProductCostTestLib
    {
        List<ProductCostTestRules> GetProductCostTestRules();

        List<ProductTypeMappings> GetPCTProductTypeMappings();

        List<ProductAttributeValues> GetProductAttributeValues(int verticalId);
    }
}