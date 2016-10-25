using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinesssLogic
{
    public class CacheLib
    {
        public IEnumerable<CacheItem> CheckCache()
        {
            return DataCollections.CheckCache();
        }

        public bool ClearCache()
        {
            return DataCollections.ClearCache();
        }

        public bool ClearCache(string cacheName)
        {
            return DataCollections.ClearCache(cacheName);
        }

        public bool LoadCache()
        {
            return DataCollections.LoadCache();
        }

        public bool LoadCache(string cacheName)
        {
            return DataCollections.LoadCache(cacheName);
        }

        public object ViewCache(string cacheName)
        {
            return DataCollections.ViewCache(cacheName);
        }

    }
}
