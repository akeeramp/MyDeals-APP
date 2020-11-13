using System;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Http;
using Intel.MyDeals.Helpers;

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
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
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
        /// To get the version details of PCT Exceptions  
        /// </summary>
        /// <returns></returns>
        [Route("GetVersionDetailsPCTExceptions/{id}/{excludeCurrVer}")]       
        public List<VersionHistPCTExceptions> GetVersionDetailsPCTExceptions(int id,int excludeCurrVer)
        {
            
            return SafeExecutor(() => _productCostTestLib.GetVersionDetailsPCTExceptions(id,excludeCurrVer)
               , $"Unable to get Version Details of PCT Exceptions  "
           );
        }

        /// <summary>
        /// Legal Exception Export  
        /// </summary>
        /// <returns></returns>
        [Route("GetDownloadLegalException/{exceptionSid}/{chkPreviousVersion}/{chkDealList}")]
        public List<LegalExceptionExport> GetDownloadLegalException(string exceptionSid,bool chkPreviousVersion,bool chkDealList)
        {

            return SafeExecutor(() => _productCostTestLib.DownloadLegalException(exceptionSid, chkPreviousVersion, chkDealList)
               , $"Unable to Download Legal Exception Data "
           );
           
        }

        /// <summary>
        /// Create LegalException
        /// </summary>
        /// <returns></returns>
        [Route("CreateLegalException")]
        [HttpPost]
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
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