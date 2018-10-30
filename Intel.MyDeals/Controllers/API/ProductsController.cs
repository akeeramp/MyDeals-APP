using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Intel.MyDeals.DataLibrary;

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
        [Route("GetFirstProduct")]
        public Product GetFirstProduct()
        {
            return SafeExecutor(() => _productsLib.GetProducts().FirstOrDefault()
                , $"GetFirstProduct failed"
            );
        }

        [Authorize]
        [Route("GetProductCategories")]
        public IEnumerable<Product> GetProductCategories()
        {
            try
            {
                return _productsLib.GetProducts().Where(p => p.PRD_ATRB_SID == 7003).OrderBy(s => s.PRD_CAT_NM);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetProductCategoriesWithAll")]
        public IEnumerable<Product> GetProductCategoriesWithAll()
        {
            try
            {
                // This is very hackish, but I didn't want to wreck any code that actually depended upon special division data for an admin screen,
                // so all products is added on for this manage list to pre-pend "all products" as a selection. Thank me now, shoot me later.  :)
                Product allProducts = new Product
                {
                    ACTV_IND = true,
                    ALL_PRD_NM = "All Products",
                    PRD_CAT_NM = "All Products",
                    PRD_CAT_NM_SID = 1,
                    PRD_MBR_SID = 1
                };
                List<Product> productsList = new List<Product>();
                productsList.Add(allProducts);
                productsList.AddRange(_productsLib.GetProducts().Where(p => p.PRD_ATRB_SID == 7003).OrderBy(s => s.PRD_CAT_NM));
                return productsList;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [HttpPost]
        [Route("GetProductsByIds")]
        public IEnumerable<Product> GetProductsByIds(ProductMicroPacket prdIds)
        {
            return SafeExecutor(() => _productsLib.GetProductsByIds(prdIds.PrdIds)
                , $"GetProductsByIds failed"
            );
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
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
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
        [AntiForgeryValidate]
        [Route("DeleteProductAlias")]
        public IEnumerable<ProductAlias> DeleteProductAlias(ProductAlias data)  //Delete the record from ProductAlias
        {
            return SafeExecutor(() => _productsLib.SetProductAlias(CrudModes.Delete, data)
                , $"Unable to Delete {"Product Alias"}"
             );
        }

        [Route("TranslateProducts/{CUST_MBR_SID}/{DEAL_TYPE}/{contractId}/{IS_TENDER}")]
        [HttpPost]
        [AntiForgeryValidate]
        public ProductLookupPacket TranslateProducts(List<ProductEntryAttribute> usrData, int CUST_MBR_SID, string DEAL_TYPE, int contractId, bool IS_TENDER)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - TranslateProducts")
            {
                CustId = CUST_MBR_SID,
                ContractId = contractId
            };

            ProductLookup result = SafeExecutor(() => _productsLib.TranslateProducts(contractToken, usrData, CUST_MBR_SID, DEAL_TYPE, IS_TENDER)
                , $"Unable to translate products"
            );

            return new ProductLookupPacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Translation of Products", contractToken.TimeFlow)
            };
        }

        [Route("TranslateProductsWithMapping/{CUST_MBR_SID}/{DEAL_TYPE}/{contractId}/{pricingStrategyId}/{pricingTableId}")]
        [HttpPost]
        [AntiForgeryValidate]
        public ProductLookupPacket TranslateProductsWithMapping(List<ProductEntryAttribute> usrData, int CUST_MBR_SID, string DEAL_TYPE, int contractId, bool IS_TENDER, int pricingStrategyId, int pricingTableId)
        {
            DateTime start = DateTime.Now;

            ContractToken contractToken = new ContractToken("ContractToken Created - TranslateProducts")
            {
                CustId = CUST_MBR_SID,
                ContractId = contractId
            };

            ProductLookup result = SafeExecutor(() => _productsLib.TranslateProducts(contractToken, usrData, CUST_MBR_SID, DEAL_TYPE, IS_TENDER)
                , $"Unable to translate products"
            );

            return new ProductLookupPacket
            {
                Data = result,
                PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Translation of Products", contractToken.TimeFlow),
                ContractId = contractId,
                PricingStrategyId = pricingStrategyId,
                PricingTableId = pricingTableId
            };
        }

        [Route("TranslateProductsWithMappingInBulk")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<ProductLookupPacket> TranslateProductsWithMappingInBulk(List<ProductTranslatePacket> data)
        {
            List<ProductLookupPacket> rtn = new List<ProductLookupPacket>();

            //List<ProductEntryAttribute> usrData, int CUST_MBR_SID, string DEAL_TYPE, int contractId, int pricingStrategyId, int pricingTableId
            DateTime start = DateTime.Now;

            Parallel.ForEach(data, item =>
            {
                ContractToken contractToken = new ContractToken("ContractToken Created - TranslateProducts")
                {
                    CustId = item.CUST_MBR_SID,
                    ContractId = item.contractId
                };

                ProductLookup result = SafeExecutor(() => _productsLib.TranslateProducts(contractToken, item.usrData, item.CUST_MBR_SID, item.DEAL_TYPE, item.IS_TENDER)
                    , $"Unable to translate products"
                );

                lock (rtn)
                { // lock the list to avoid race conditions
                    rtn.Add(new ProductLookupPacket
                    {
                        Data = result,
                        PerformanceTimes = TimeFlowHelper.GetPerformanceTimes(start, "Translation of Products", contractToken.TimeFlow),
                        ContractId = item.contractId,
                        PricingStrategyId = item.pricingStrategyId,
                        PricingTableId = item.pricingTableId
                    });
                }
            });

            return rtn;
        }

        /// <summary>
        /// This method skips all the translator logic (split) and hits the database
        /// </summary>
        /// <param name="userInput"></param>
        /// <param name="CUST_MBR_SID"></param>
        /// <returns></returns>
        [Route("SearchProduct/{CUST_MBR_SID}/{dealType}/{getWithoutFilters}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<PRD_LOOKUP_RESULTS> SearchProduct(List<ProductEntryAttribute> userInput, int CUST_MBR_SID, OpDataElementSetType dealType,
            bool getWithoutFilters)
        {
            return SafeExecutor(() => _productsLib.SearchProduct(userInput, CUST_MBR_SID, dealType, getWithoutFilters)
                , $"Unable to get product {"details"}"
            );
        }

        [Route("SetIncludeAttibute")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<ProductIncExcAttribute> SetIncludeAttibute(List<ProductIncExcAttribute> userInput)
        {
            return SafeExecutor(() => _productsLib.SetIncludeAttibute(userInput)
                , $"Unable to save {"include attribute"}"
            );
        }

        [Route("SetExcludeAttibute")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<ProductIncExcAttribute> SetExcludeAttibute(List<ProductIncExcAttribute> userInput)
        {
            return SafeExecutor(() => _productsLib.SetExcludeAttibute(userInput)
                , $"Unable to save {"exclude attribute"}"
            );
        }

        [Route("FetchAttributeMaster")]
        [HttpPost]
        [AntiForgeryValidate]
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

        /// <summary>
        /// Get Product selection levels
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AntiForgeryValidate]
        [Route("GetProductSelectorWrapper")]
        public ProductSelectorWrapper GetProductSelectorWrapper([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.GetProductSelectorWrapperByDates((DateTime)input.startDate, (DateTime)input.endDate, (string)input.mediaCode)
                , $"Unable to get Product selection levels"
            );
        }

        /// <summary>
        /// Get Product selection levels
        /// </summary>
        /// <returns></returns>
        [Route("GetProductSelectionResults")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<ProductSelectionResults> GetProductSelectionResults([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.GetProductSelectionResults((string)input.searchHash,
                (DateTime)input.startDate, (DateTime)input.endDate, (int)input.selectionLevel, (string)input.drillDownFilter4,
                (string)input.drillDownFilter5, (int)input.custSid, (string)input.geoSid, (string)input.mediaCd, (OpDataElementSetType)input.dealType)
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
        [AntiForgeryValidate]
        public List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition = "")
        {
            return SafeExecutor(() => _productsLib.GetProductCAPYCS2Data(productCAPCalc, getAvailable, priceCondition)
                , $"Unable to get Product CAP and YCS2 values"
            );
        }

        [Route("GetCAPForProduct")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<ProductCAPYCS2> GetCAPForProduct([FromBody]dynamic product)
        {
            return SafeExecutor(() => _productsLib.GetCAPForProduct((int)product.productsid, (int)product.custSid, (string)product.geoSid, (DateTime)product.startDate, (DateTime)product.endDate)
                , $"Unable to get Product CAP and YCS2 values"
            );
        }

        /// <summary>
        /// Get search results
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Route("GetSearchString")]
        [HttpPost]
        [AntiForgeryValidate]
        public IList<SearchString> GetSearchString([FromBody]dynamic input)

        {
            return SafeExecutor(() => _productsLib.GetSearchString((string)input.filter, (string)input.mediaCode,
                (DateTime)input.startDate, (DateTime)input.endDate, (bool)input.getWithFilters)
               , $"Unable to get Product search results"
           );
        }

        /// <summary>
        /// Check product exists in Mydeals (without any filter, for quick check. Performance matters)
        /// Note : Going with POST operation instead of GET as product name contains special characters.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [Route("IsProductExistsInMydeals")]
        [HttpPost]
        [AntiForgeryValidate]
        public bool IsProductExistsInMydeals([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.IsProductExistsInMydeals((string)input.filter)
                , $"Unable to check if product exists in MyDeals"
            );
        }

        [Route("GetSuggestions/{custId}/{dealType}")]
        [HttpPost]
        [AntiForgeryValidate]
        public IList<PRD_LOOKUP_RESULTS> GetSuggestions(ProductEntryAttribute userInput, int custId, OpDataElementSetType dealType)
        {
            return SafeExecutor(() => _productsLib.GetSuggestions(userInput, custId, dealType)
                , $"Unable to get product {"details"}"
            );
        }

        [Route("GetProductAttributes")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<PRD_LOOKUP_RESULTS> GetProductAttributes(List<PRD_LOOKUP_RESULTS> products)
        {
            return SafeExecutor(() => _productsLib.GetProductAttributes(products)
                , $"Unable to get Product details"
            );
        }

        [Route("GetLegalExceptionProducts")]
        [HttpPost]
        [AntiForgeryValidate]
        public IList<SearchString> GetLegalExceptionProducts([FromBody]dynamic input)
        {
            return SafeExecutor(() => _productsLib.GetLegalExceptionProducts((string)input.filter)
                , $"Unable to get Product details"
            );
        }

        /// <summary>
        /// Get deal product
        /// </summary>
        /// <param name="dealId"></param>
        /// <returns></returns>
        [Route("GetDealProducts/{objSid}/{objTypeSid}/{custId}/{isMissingFlag:bool?}")]
        public List<DealProducts> GetDealProducts(int objSid, OpDataElementType objTypeSid, int custId, bool isMissingFlag = true)
        {
            return SafeExecutor(() => _productsLib.GetDealProducts(objSid, objTypeSid, custId, isMissingFlag)
                , $"Unable to get Product details"
            );
        }
    }
}