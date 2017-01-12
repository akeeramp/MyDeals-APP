using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDataCollectionsDataLib
    {
        bool ClearCache();

        IEnumerable<CacheItem> CheckCache();

        bool ClearCache(string fieldName);

        bool LoadCache();

        bool LoadCache(string fieldName);

        object ViewCache(string fieldName);

        List<ToolConstants> GetToolConstants();

        List<CustomerDivision> GetCustomerDivisions();

        List<GeoDimension> GetGeoData();

        UiTemplates GetUiTemplates();

        List<Product> GetProductData();
    }
}