using System;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ProductCostTest")]
    public class ProductCostTestController : BaseApiController
    {
        private readonly IProductCostTestLib _productCostTestLib;

        /// <summary>
        /// Product Cost Test Controller
        /// </summary>
        /// <param name="_productCostTestLib"></param>
        public ProductCostTestController(IProductCostTestLib _productCostTestLib)
        {
            this._productCostTestLib = _productCostTestLib;
        }

        /// <summary>
        /// Get Product Cost Test Product Mappings
        /// </summary>
        /// <returns></returns>
        public List<ProductCostTestRules> GetProductCostTestRules()
        {
            return SafeExecutor(() => _productCostTestLib.GetProductCostTestRules()
               , $"Unable to get Price Cost Test Rules"
           );
        }

        /// <summary>
        /// Get Price Cost Test Rules
        /// </summary>
        /// <returns></returns>
        [Route("GetProductTypeMappings")]
        public List<ProductTypeMappings> GetPCTProductTypeMappings()
        {
            return SafeExecutor(() => _productCostTestLib.GetPCTProductTypeMappings()
               , $"Unable to get PCT Product type mappings"
           );
        }

        /// <summary>
        /// Get Price Cost Test Rules
        /// </summary>
        /// <returns></returns>
        [Route("GetProductAttributeValues/{verticalId}")]
        public List<ProductAttributeValues> GetProductAttributeValues(int verticalId)
        {
            return SafeExecutor(() => _productCostTestLib.GetProductAttributeValues(verticalId)
               , $"Unable to get PCT Product Attribute values"
           );
        }

        /// <summary>
        /// Create Product Cost Test Rules
        /// </summary>
        /// <returns></returns>
        [Route("CreatePCTRule")]
        [HttpPost]
        public List<ProductCostTestRules> CreatePCTRule([FromBody]ProductCostTestRules input)
        {
            return SafeExecutor(() => _productCostTestLib.CreatePCTRule(input)
              , $"Unable to create product cost test rule"
          );
        }

        /// <summary>
        /// Update Product Cost Test Rules
        /// </summary>
        /// <returns></returns>
        [Route("UpdatePCTRule")]
        [HttpPost]
        public List<ProductCostTestRules> UpdatePCTRule([FromBody]ProductCostTestRules input)
        {
            return SafeExecutor(() => _productCostTestLib.UpdatePCTRule(input)
              , $"Unable to create product cost test rule"
          );
        }

        /// <summary>
        /// Delete Product Cost Test Rules
        /// </summary>
        /// <returns></returns>
        [Route("DeletePCTRule")]
        [HttpPost]
        public List<ProductCostTestRules> DeletePCTRule([FromBody]ProductCostTestRules input)
        {
            return SafeExecutor(() => _productCostTestLib.DeletePCTRule(input)
              , $"Unable to create product cost test rule"
          );
        }

        /// <summary>
        /// Get Product Cost Test LegalExceptions
        /// </summary>
        /// <returns></returns>
        [Route("GetLegalExceptions")]
        public List<PCTLegalException> GetLegalExceptions()
        {
            return SafeExecutor(() => _productCostTestLib.GetLegalExceptions()
               , $"Unable to get Price Cost Test Rules"
           );
        }

        /// <summary>
        /// Create LegalException
        /// </summary>
        /// <returns></returns>
        [Route("CreateLegalException")]
        [HttpPost]
        public PCTLegalException CreateLegalException([FromBody]PCTLegalException input)
        {
            return SafeExecutor(() => _productCostTestLib.CreateLegalException(input)
              , $"Unable to create Legal Exception"
          );
        }

        /// <summary>
        /// Update LegalException
        /// </summary>
        /// <returns></returns>
        [Route("UpdateLegalException")]
        [HttpPost]
        public PCTLegalException UpdateLegalException([FromBody]PCTLegalException input)
        {
            return SafeExecutor(() => _productCostTestLib.UpdateLegalException(input)
              , $"Unable to update Legal Exception"
          );
        }

        /// <summary>
        /// Delete LegalException
        /// </summary>
        /// <returns></returns>
        [Route("DeleteLegalException")]
        [HttpPost]
        public PCTLegalException DeleteLegalException([FromBody]PCTLegalException input)
        {
            return SafeExecutor(() => _productCostTestLib.DeleteLegalException(input)
              , $"Unable to delete Legal Exception"
          );
        }

        [Route("GetLegalExceptionsPct/{endDt}")]
        public List<PCTLegalException> GetLegalExceptionsPct(string endDt)
        {
            DateTime endDate = DateTime.Parse(endDt.Replace("-", "/"));
            return SafeExecutor(() => _productCostTestLib.GetLegalExceptions(endDate)
               , $"Unable to get Price Cost Test Rules"
           );
        }

    }
}