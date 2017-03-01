using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class ProductCostTestLib : IProductCostTestLib
    {
        private readonly IProductCostTestDataLib _productCostTestDataLib;

        public ProductCostTestLib(IProductCostTestDataLib _productCostTestDataLib)
        {
            this._productCostTestDataLib = _productCostTestDataLib;
        }

        /// <summary>
        /// Get Price Cost Test Rules
        /// </summary>
        /// <returns></returns>
        public List<ProductCostTestRules> GetProductCostTestRules()
        {
            return _productCostTestDataLib.GetProductCostTestRules();
        }

        /// <summary>
        /// Get product type Mappings
        /// </summary>
        /// <returns></returns>
        public List<ProductTypeMappings> GetPCTProductTypeMappings()
        {
            return _productCostTestDataLib.GetPCTProductTypeMappings();
        }

        public List<ProductAttributeValues> GetProductAttributeValues(int verticalId)
        {
            return _productCostTestDataLib.GetProductAttributeValues(verticalId);
        }
    }
}