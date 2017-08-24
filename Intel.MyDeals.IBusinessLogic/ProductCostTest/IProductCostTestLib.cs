using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IProductCostTestLib
    {
        List<ProductCostTestRules> GetProductCostTestRules();

        List<ProductTypeMappings> GetPCTProductTypeMappings();

        List<ProductAttributeValues> GetProductAttributeValues(int verticalId);

        List<ProductCostTestRules> CreatePCTRule(ProductCostTestRules pctRules);

        List<ProductCostTestRules> UpdatePCTRule(ProductCostTestRules pctRules);

        List<ProductCostTestRules> DeletePCTRule(ProductCostTestRules pctRules);

        PCTLegalException DeleteLegalException(PCTLegalException input);

        PCTLegalException UpdateLegalException(PCTLegalException input);

        PCTLegalException CreateLegalException(PCTLegalException input);

        List<PCTLegalException> GetLegalExceptions();
    }
}