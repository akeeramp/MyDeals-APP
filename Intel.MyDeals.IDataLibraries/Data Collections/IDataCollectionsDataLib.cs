using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDataCollectionsDataLib
    {
        bool ClearCache();

        IEnumerable<CacheItem> CheckCache();

        bool ClearCache(string fieldName);

        void ClearMyCustomerCache();

        bool LoadCache();

        bool LoadCache(string fieldName);

        object ViewCache(string fieldName);

        List<AdminConstant> GetToolConstants();

        List<CustomerDivision> GetCustomerDivisions();

        List<GeoDimension> GetGeoData();

        UiTemplates GetUiTemplates();

        List<Product> GetProductData();

        List<ProductCategory> GetProductCategories();

        List<ProductAlias> GetProductsFromAlias();

        List<BasicDropdown> GetBasicDropdowns();

        Dictionary<string, string> GetDropdownDict(string lookupText);

        Dictionary<string, string> GetBasicDropdownDict(string atrbCd);

        //// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
        //List<RetailPull> GetRetailPullSDMList();

        List<SoldToIds> GetSoldToIdList();

        List<Funfact> GetFunfactList();

        List<Dropdown> GetDropdowns();

        #region Security Attributes

        List<AdminDealType> GetAdminDealTypes();

        #endregion Security Attributes

        List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData();

        ProductSelectorWrapper GetProductSelectorWrapper();

        Dictionary<string, string> GetSearchString();

        int GetSessionComparisonHash();
    }
}