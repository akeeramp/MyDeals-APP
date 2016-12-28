using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get Product information?
    [RoutePrefix("api/Products")]
    public class ProductsController : BaseApiController
    {
        [Authorize]
        [Route("GetProducts")]
        public IEnumerable<Product> GetProducts()
        {
            try
            {
                return new ProductsLib().GetProducts();
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
                return new ProductsLib().GetProduct(sid);
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
                return new ProductsLib().GetProductsActive();
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
                return new ProductsLib().GetProductByCategoryName(name, getCachedResult);
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
                return new ProductsLib().GetProductByCategorySid(sid);
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
                return new ProductsLib().GetProductByFamilyName(name);
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
                return new ProductsLib().GetProductByFamilySid(sid);
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
                return new ProductsLib().GetProductByBrandName(name);
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
                return new ProductsLib().GetProductByBrandSid(sid);
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
                return new ProductsLib().GetProductByProcessorNumberName(name);
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
                return new ProductsLib().GetProductByProcessorNumberSid(sid);
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
                return new ProductsLib().GetProductByDealProductName(name);
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
                return new ProductsLib().GetProductByDealProductNameSid(sid);
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
                return new ProductsLib().GetProductByDealProductTypeName(name);
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
                return new ProductsLib().GetProductByDealProductTypeSid(sid);
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
                return new ProductsLib().GetProductByMaterialIdName(name);
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
                return new ProductsLib().GetProductByMaterialIdSid(sid);
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}
