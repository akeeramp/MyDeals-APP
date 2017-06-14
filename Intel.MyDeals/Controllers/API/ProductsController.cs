using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get Product information?
    [RoutePrefix("api/Products")]
    public class ProductsController : BaseApiController
    {
        private readonly IProductsLib _productsLib;

        public ProductsController(IProductsLib _productsLib)
        {
            this._productsLib = _productsLib;
        }

        [Authorize]
        [Route("GetProducts")]
        public IEnumerable<Product> GetProducts()
        {
            try
            {
                return _productsLib.GetProducts();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProduct")]
        public Product GetProduct(int sid)
        {
            try
            {
                return _productsLib.GetProduct(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetActiveProducts")]
        public IEnumerable<Product> GetActiveProducts()
        {
            try
            {
                return _productsLib.GetProductsActive();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByCategoryName/{name}/{getCachedResult:bool?}")]
        public IEnumerable<Product> GetProductByCategoryName(string name, bool getCachedResult = true)   //searches for products with category that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByCategoryName(name, getCachedResult);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByCategorySid/{sid}")]
        public IEnumerable<Product> GetProductByCategorySid(int sid)   //searches for products with category that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByCategorySid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByFamilyName/{name}")]
        public IEnumerable<Product> GetProductByFamilyName(string name)   //searches for products with family that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByFamilyName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByFamilySid/{sid}")]
        public IEnumerable<Product> GetProductByFamilySid(int sid)   //searches for products with family that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByFamilySid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByBrandName/{name}")]
        public IEnumerable<Product> GetProductByBrandName(string name)   //searches for products with Brand that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByBrandName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByBrandSid/{sid}")]
        public IEnumerable<Product> GetProductByBrandSid(int sid)   //searches for products with Brand that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByBrandSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByProcessorNumberName/{name}")]
        public IEnumerable<Product> GetProductByProcessorNumberName(string name)   //searches for products with ProcessorNumber that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByProcessorNumberName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByProcessorNumberSid/{sid}")]
        public IEnumerable<Product> GetProductByProcessorNumberSid(int sid)   //searches for products with ProcessorNumber that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByProcessorNumberSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByDealProductName/{name}")]
        public IEnumerable<Product> GetProductByDealProductName(string name)   //searches for products with DealProduct that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByDealProductName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByDealProductSid/{sid}")]
        public IEnumerable<Product> GetProductByDealProductSid(int sid)   //searches for products with DealProduct that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByDealProductNameSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByDealProductTypeName/{name}")]
        public IEnumerable<Product> GetProductByDealProductTypeName(string name)   //searches for products with DealProductType that contains string 'name'
        {
            try
            {
                return _productsLib.GetProductByDealProductTypeName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByDealProductTypeSid/{sid}")]
        public IEnumerable<Product> GetProductByDealProductTypeSid(int sid)   //searches for products with DealProductType that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByDealProductTypeSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByMaterialIdName/{name}")]
        public IEnumerable<Product> GetProductByMaterialIdName(string name)   //searches for products with MaterialId that matches string 'name'
        {
            try
            {
                return _productsLib.GetProductByMaterialIdName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductByMaterialIdSid/{sid}")]
        public IEnumerable<Product> GetProductByMaterialIdSid(int sid)   //searches for products with MaterialId that matches int 'sid'
        {
            try
            {
                return _productsLib.GetProductByMaterialIdSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductsFromAlias/{getCachedResult:bool?}")]
        public IEnumerable<ProductAlias> GetProductsFromAlias(bool getCachedResult = true)     //Get all Product with Alias from ProductAlias
        {
            return SafeExecutor(() => _productsLib.GetProductsFromAlias(getCachedResult)
                , $"Unable to get {"Product Alias"}"
             );
        }

        [Authorize]
        [HttpPost]
        [Route("CreateProductAlias")]
        public IEnumerable<ProductAlias> CreateProductAlias(ProductAlias data)   // Insert the record in ProductAlias
        {
            var productAlias = new List<ProductAlias>();
            try
            {
                productAlias = _productsLib.SetProductAlias(CrudModes.Insert, data);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                });
            }
            return productAlias;
        }

        [Authorize]
        [HttpPost]
        [Route("UpdateProductAlias")]
        public IEnumerable<ProductAlias> UpdateProductAlias(ProductAlias data)  // Update the record from ProductAlias
        {
            var productAlias = new List<ProductAlias>();
            try
            {
                productAlias = _productsLib.SetProductAlias(CrudModes.Update, data);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                });
            }
            return productAlias;
        }

        [Authorize]
        [HttpPost]
        [Route("DeleteProductAlias")]
        public IEnumerable<ProductAlias> DeleteProductAlias(ProductAlias data)  //Delete the record from ProductAlias
        {
            return SafeExecutor(() => _productsLib.SetProductAlias(CrudModes.Delete, data)
                , $"Unable to Delete {"Product Alias"}"
             );
        }

        [Route("TranslateProducts/{CUST_MBR_SID}")]
        [HttpPost]
        public ProductLookup TranslateProducts(List<ProductEntryAttribute> userInput, int CUST_MBR_SID)
        {
            return SafeExecutor(() => _productsLib.TranslateProducts(userInput, CUST_MBR_SID)
                , $"Unable to get product {"details"}"
            );
        }

        [Route("SetIncludeAttibute")]
        [HttpPost]
        public List<ProductIncExcAttribute> SetIncludeAttibute(List<ProductIncExcAttribute> userInput)
        {
            return SafeExecutor(() => _productsLib.SetIncludeAttibute(userInput)
                , $"Unable to save {"include attribute"}"
            );
        }

        [Route("SetExcludeAttibute")]
        [HttpPost]
        public List<ProductIncExcAttribute> SetExcludeAttibute(List<ProductIncExcAttribute> userInput)
        {
            return SafeExecutor(() => _productsLib.SetExcludeAttibute(userInput)
                , $"Unable to save {"exclude attribute"}"
            );
        }

        [Route("FetchAttributeMaster")]
        [HttpPost]
        public ProductIncExcAttributeSelector FetchAttributeMaster()
        {
            return SafeExecutor(() => _productsLib.GetProductIncludeExcludeAttribute()
                , $"Unable to get {"attribute master"}"
            );
        }

        [Route("GetProdDealType")]
        [HttpGet]
        public List<PrdDealType> GetProdDealType()
        {
            return SafeExecutor(() => _productsLib.GetProdDealType()
                , $"Unable to get {"deal types"}"
            );
        }

        [Route("GetProdSelectionLevel/{OBJ_SET_TYPE_SID}")]
        public List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID)
        {
            return SafeExecutor(() => _productsLib.GetProdSelectionLevel(OBJ_SET_TYPE_SID)
                , $"Unable to get {"selection level"}"
            );
        }

        [Route("SuggestProductsByDates")]
        [HttpPost]
        public List<Product> FindSuggestedProductByDates([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.SuggestProductsByDates((string)input.prdEntered, (int?)input.returnMax, (DateTime)input.startDate, (DateTime)input.endDate)
                , $"Unable to Suggest Products 3"
            );
        }

        /// <summary>
        /// Get Product selection levels
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("GetProductSelectorWrapper")]
        public ProductSelectorWrapper GetProductSelectorWrapper([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.GetProductSelectorWrapperByDates((DateTime)input.startDate, (DateTime)input.endDate)
                , $"Unable to get Product selection levels"
            );
        }

        /// <summary>
        /// Get Product selection levels
        /// </summary>
        /// <returns></returns>
        [Route("GetProductSelectionResults")]
        [HttpPost]
        public List<ProductSelectionResults> GetProductSelectionResults([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.GetProductSelectionResults((string)input.searchHash,
                (DateTime)input.startDate, (DateTime)input.endDate, (int)input.selectionLevel, (string)input.drillDownFilter4,
                (string)input.drillDownFilter5, (int)input.custSid, (string)input.geoSid)
                , $"Unable to get product selection levels"
            );
        }

        /// <summary>
        /// Get CAP and YCS2 data for the Product
        /// </summary>
        /// <param name="productCAPCalc"></param>
        /// <param name="getAvailable">Will get available CAP or YCS2 values</param>
        /// <param name="priceCondition">Price condition can be (YCS2 or YCP1) for CAP and YCS2</param>
        /// <returns></returns>
        [Route("GetProductCAPYCS2Data/{getAvailable}/{priceCondition?}")]
        [HttpPost]
        public List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition = "")
        {
            return SafeExecutor(() => _productsLib.GetProductCAPYCS2Data(productCAPCalc, getAvailable, priceCondition)
                , $"Unable to get Product CAP and YCS2 values"
            );
        }

        [Route("GetCAPForProduct")]
        [HttpPost]
        public List<ProductCAPYCS2> GetCAPForProduct([FromBody]dynamic product)
        {            
            return SafeExecutor(() => _productsLib.GetCAPForProduct((int)product.productsid, (int)product.custSid, (string)product.geoSid, (DateTime)product.startDate, (DateTime)product.endDate)
                , $"Unable to get Product CAP and YCS2 values"
            );
        }
    }
}