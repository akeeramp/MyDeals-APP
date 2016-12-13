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
    public class ProductsController : ApiController
    {
        OpCore op = OpAppConfig.Init();

        [Authorize]
        [Route("api/Products/GetProducts")]
        public IEnumerable<Product> GetProducts()
        {
            try
            {
                return new ProductsLib().GetProducts();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProduct")]
        public Product GetProduct(int sid)
        {
            try
            {
                return new ProductsLib().GetProduct(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetActiveProducts")]
        public IEnumerable<Product> GetActiveProducts()
        {
            try
            {
                return new ProductsLib().GetProductsActive();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByCategoryName")]
        public IEnumerable<Product> GetProductByCategoryName(string name)   //searches for products with category that contains string 'name'
        {
            try
            {
                return new ProductsLib().GetProductByCategoryName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByCategorySid")]
        public IEnumerable<Product> GetProductByCategorySid(int sid)   //searches for products with category that matches int 'sid'
        {
            try
            {
                return new ProductsLib().GetProductByCategorySid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByFamilyName")]
        public IEnumerable<Product> GetProductByFamilyName(string name)   //searches for products with family that contains string 'name'
        {
            try
            {
                return new ProductsLib().GetProductByFamilyName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByFamilySid")]
        public IEnumerable<Product> GetProductByFamilySid(int sid)   //searches for products with family that matches int 'sid'
        {
            try
            {
                return new ProductsLib().GetProductByFamilySid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByBrandName")]
        public IEnumerable<Product> GetProductByBrandName(string name)   //searches for products with Brand that contains string 'name'
        {
            try
            {
                return new ProductsLib().GetProductByBrandName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByBrandSid")]
        public IEnumerable<Product> GetProductByBrandSid(int sid)   //searches for products with Brand that matches int 'sid'
        {
            try
            {
                return new ProductsLib().GetProductByBrandSid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByProcessorNumberName")]
        public IEnumerable<Product> GetProductByProcessorNumberName(string name)   //searches for products with ProcessorNumber that contains string 'name'
        {
            try
            {
                return new ProductsLib().GetProductByProcessorNumberName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Products/GetProductByProcessorNumberSid")]
        public IEnumerable<Product> GetProductByProcessorNumberSid(int sid)   //searches for products with ProcessorNumber that matches int 'sid'
        {
            try
            {
                return new ProductsLib().GetProductByProcessorNumberSid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}
