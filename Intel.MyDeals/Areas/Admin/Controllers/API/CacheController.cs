using System.Linq;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using WebApi.OutputCache.V2;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    public class CacheController : ApiController
    {

        [Route("api/Cache/v1/GetCacheStatus")]
        public IQueryable<CacheItem> GetCacheStatus()
        {
            return new CacheLib().CheckCache().AsQueryable();
        }

        [Route("api/Cache/v1/GetCacheClear")]
        public bool GetCacheClear()
        {
            return new CacheLib().ClearCache();
        }

        [Route("api/Cache/v1/GetCacheClear/{cacheName}")]
        public bool GetCacheClear(string cacheName)
        {
            return new CacheLib().ClearCache(cacheName);
        }

        [Route("api/Cache/v1/GetCacheReload")]
        public bool GetCacheReload()
        {
            return new CacheLib().ClearCache() && new CacheLib().LoadCache();
        }

        [Route("api/Cache/v1/GetCacheLoad/{cacheName}")]
        public bool GetCacheLoad(string cacheName)
        {
            return new CacheLib().LoadCache(cacheName);
        }

        [Route("api/Cache/v1/GetCacheView/{cacheName}")]
        public object GetCacheView(string cacheName)
        {
            return new CacheLib().ViewCache(cacheName);
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
