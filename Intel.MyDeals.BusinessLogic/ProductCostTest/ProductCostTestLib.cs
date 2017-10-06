using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class ProductCostTestLib : IProductCostTestLib
    {
        private readonly IProductCostTestDataLib _productCostTestDataLib;

        public ProductCostTestLib(IProductCostTestDataLib productCostTestDataLib)
        {
            _productCostTestDataLib = productCostTestDataLib;
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

        /// <summary>
        ///
        /// </summary>
        /// <param name="verticalId"></param>
        /// <returns></returns>
        public List<ProductAttributeValues> GetProductAttributeValues(int verticalId)
        {
            return _productCostTestDataLib.GetProductAttributeValues(verticalId);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="pctRules"></param>
        /// <returns></returns>

        public List<ProductCostTestRules> CreatePCTRule(ProductCostTestRules pctRules)
        {
            return _productCostTestDataLib.SetPCTRules(CrudModes.Insert, pctRules);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="pctRules"></param>
        /// <returns></returns>
        public List<ProductCostTestRules> UpdatePCTRule(ProductCostTestRules pctRules)
        {
            return _productCostTestDataLib.SetPCTRules(CrudModes.Update, pctRules);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="pctRules"></param>
        /// <returns></returns>
        public List<ProductCostTestRules> DeletePCTRule(ProductCostTestRules pctRules)
        {
            return _productCostTestDataLib.SetPCTRules(CrudModes.Delete, pctRules);
        }

        public PCTLegalException DeleteLegalException(PCTLegalException input)
        {
            return _productCostTestDataLib.SetPCTlegalException(CrudModes.Delete, input);
        }

        public PCTLegalException UpdateLegalException(PCTLegalException input)
        {
            return _productCostTestDataLib.SetPCTlegalException(CrudModes.Update, input);
        }

        public PCTLegalException CreateLegalException(PCTLegalException input)
        {
            return _productCostTestDataLib.SetPCTlegalException(CrudModes.Insert, input);
        }

        public List<PCTLegalException> GetLegalExceptions()
        {
            return _productCostTestDataLib.GetLegalExceptions().Where(l => l.ACTV_IND).ToList();
        }
        public List<PCTLegalException> GetLegalExceptions(DateTime endDate)
        {
            return _productCostTestDataLib.GetLegalExceptions().Where(l => l.ACTV_IND && l.PCT_LGL_EXCPT_END_DT >= endDate).ToList();
        }

    }
}