using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using WebApi.OutputCache.V2;
using System.Net.Http;
using System.Net;
using Intel.MyDeals.ActionFilters;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    public class CacheController : ApiController
    {
        private readonly ICacheLib _cacheLib;

        public CacheController(ICacheLib _cacheLib)
        {
            this._cacheLib = _cacheLib;
        }

        [Route("api/Cache/v1/GetCacheStatus")]
        public IQueryable<CacheItem> GetCacheStatus()
        {
            return _cacheLib.CheckCache().AsQueryable();
        }

        [Route("api/Cache/v1/GetCacheClear")]
        public bool GetCacheClear()
        {
            return _cacheLib.ClearCache();
        }

        [Route("api/Cache/v1/GetCacheClear/{cacheName}")]
        //This attribute usage makes delete cache enabled only for developers
        [ApiAuthorize(AuthorizeDeveloper = true)]
        public bool GetCacheClear(string cacheName)
        {
            return _cacheLib.ClearCache(cacheName);
        }

        [Route("api/Cache/v1/GetCacheReload")]
        public bool GetCacheReload()
        {
            return _cacheLib.ClearCache() && _cacheLib.LoadCache();
        }

        [Route("api/Cache/v1/GetCacheLoad/{cacheName}")]
        public bool GetCacheLoad(string cacheName)
        {
            return _cacheLib.LoadCache(cacheName);
        }

        [Route("api/Cache/v1/GetCacheView/{cacheName}")]
        public object GetCacheView(string cacheName)
        {
            return _cacheLib.ViewCache(cacheName);
        }

        /// <summary>
        /// Gets the WebApi Cache Status
        /// </summary>
        /// <param name="cacheName"></param>
        /// <returns></returns>

        [Route("api/Cache/v1/GetApiCacheStatus")]
        public HttpResponseMessage GetApiCacheStatus()
        {

            //Added the logic inside controler as I dont wanted
            //to referance WebApi.OutputCache.V2 to any other project

            var cache = Configuration.CacheOutputConfiguration().GetCacheOutputProvider(Request);
            var cacheItems = cache.AllKeys.Where(x => !x.Contains("application/json") && !x.Contains("application/xml")).
                                        Select(i => new CacheItem
                                        {
                                            CacheName = i.Split(new[] { '-' }, 2)[1],
                                            CacheKey = i
                                        });

            return Request.CreateResponse(HttpStatusCode.OK, cacheItems);
        }


        /// <summary>
        /// Get the Api cache clear
        /// </summary>
        /// <returns></returns>
        [Route("api/Cache/v1/GetApiCacheClear")]
        public bool GetApiCacheClear()
        {
            var cache = Configuration.CacheOutputConfiguration().GetCacheOutputProvider(Request);
            foreach(var key in cache.AllKeys.Where(x => !x.Contains("application/json") && !x.Contains("application/xml")))
            {
                cache.RemoveStartsWith(key);
            }

            return true;
        }

        /// <summary>
        /// Get the Api cache clear by name
        /// </summary>
        /// <param name="cacheKey"></param>
        /// <returns></returns>
        [Route("api/Cache/v1/ClearApiCache")]
        [HttpPost]
        public bool ClearCache(CacheItem cacheItem)
        {
            var cache = Configuration.CacheOutputConfiguration().GetCacheOutputProvider(Request);
            if(cache.Contains(cacheItem.CacheKey))
            {
                cache.RemoveStartsWith((cacheItem.CacheKey));
                return true;
            }

            return false;
        }


    }
}
