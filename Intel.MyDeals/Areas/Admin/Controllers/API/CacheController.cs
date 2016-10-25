using System.Linq;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;

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


    }
}
