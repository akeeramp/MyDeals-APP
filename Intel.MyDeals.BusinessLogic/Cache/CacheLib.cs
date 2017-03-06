using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinessLogic
{
    public class CacheLib : ICacheLib
    {
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public CacheLib(IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        /// <summary>
        /// Check the Cache Sotores for status
        /// </summary>
        /// <returns></returns>
        public IEnumerable<CacheItem> CheckCache()
        {
            return _dataCollectionsDataLib.CheckCache();
        }

        /// <summary>
        /// Vlear all cache stores
        /// </summary>
        /// <returns></returns>
        public bool ClearCache()
        {
            return _dataCollectionsDataLib.ClearCache();
        }

        /// <summary>
        /// Clear a specific cache store
        /// </summary>
        /// <param name="cacheName">Name of the cache store</param>
        /// <returns></returns>
        public bool ClearCache(string cacheName)
        {
            return _dataCollectionsDataLib.ClearCache(cacheName);
        }

        /// <summary>
        /// Load all cache stores with content
        /// </summary>
        /// <returns></returns>
        public bool LoadCache()
        {
            return _dataCollectionsDataLib.LoadCache();
        }

        /// <summary>
        /// Load a specific cache store with content
        /// </summary>
        /// <param name="cacheName">Name of the cache store</param>
        /// <returns></returns>
        public bool LoadCache(string cacheName)
        {
            return _dataCollectionsDataLib.LoadCache(cacheName);
        }

        /// <summary>
        /// View the raw contents of a cache store
        /// </summary>
        /// <param name="cacheName">Name of the cache store</param>
        /// <returns></returns>
        public object ViewCache(string cacheName)
        {
            return _dataCollectionsDataLib.ViewCache(cacheName);
        }

    }
}
