using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinesssLogic
{
    public class CacheLib : ICacheLib
    {
        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public CacheLib(IDataCollectionsDataLib _dataCollectionsDataLib)
        {
            this._dataCollectionsDataLib = _dataCollectionsDataLib;
        }

        public IEnumerable<CacheItem> CheckCache()
        {
            return this._dataCollectionsDataLib.CheckCache();
        }

        public bool ClearCache()
        {
            return this._dataCollectionsDataLib.ClearCache();
        }

        public bool ClearCache(string cacheName)
        {
            return this._dataCollectionsDataLib.ClearCache(cacheName);
        }

        public bool LoadCache()
        {
            return this._dataCollectionsDataLib.LoadCache();
        }

        public bool LoadCache(string cacheName)
        {
            return this._dataCollectionsDataLib.LoadCache(cacheName);
        }

        public object ViewCache(string cacheName)
        {
            return this._dataCollectionsDataLib.ViewCache(cacheName);
        }

    }
}
