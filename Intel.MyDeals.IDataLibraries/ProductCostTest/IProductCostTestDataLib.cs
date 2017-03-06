using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductCostTestDataLib
    {
        List<ProductCostTestRules> GetProductCostTestRules();

        List<ProductTypeMappings> GetPCTProductTypeMappings();

        List<ProductAttributeValues> GetProductAttributeValues(int verticalId);

        List<ProductCostTestRules> SetPCTRules(CrudModes mode, ProductCostTestRules pctRules);
    }
}