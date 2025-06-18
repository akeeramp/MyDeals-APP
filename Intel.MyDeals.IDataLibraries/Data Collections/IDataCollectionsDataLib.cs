using Intel.MyDeals.Entities;
using System;
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

        List<VistexCustomerMapping> GetVistexCustomerMappings();

        List<GeoDimension> GetGeoData();
        GeoDetails GetGeoData(string filter, string sort, int take, int skip);

        UiTemplates GetUiTemplates();

        List<Product> GetProductData();

        List<ProductCategory> GetProductCategories();

        List<ProductAlias> GetProductsFromAlias();

        List<BasicDropdown> GetBasicDropdowns();
        DropdownDetails GetBasicDropdowns(string filter, string sort, int take, int skip, bool FthCnt);
        List<string> GetBasicDropdownsFilterData(string filterName);
        List<DictDropDown> GetDictDropDown(string atrbCd);

        Dictionary<string, string> GetDropdownDict(string lookupText);

        Dictionary<string, string> GetBasicDropdownDict(string atrbCd);

        //// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
        //List<RetailPull> GetRetailPullSDMList();

        List<SoldToIds> GetSoldToIdList();

        List<string> GetProductCategoriesByFilter(string fieldName);

        List<Funfact> GetFunfactList();

        List<Dropdown> GetDropdowns();

        #region Security Attributes

        List<AdminDealType> GetAdminDealTypes();

        #endregion Security Attributes

        List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData();

        ProductSelectorWrapper GetProductSelectorWrapper();

        ProductSelectorWrapper GetProductSelectorWrapperDensity(DateTime startDate, DateTime endDate, string mediaCode);

        Dictionary<string, string> GetSearchString();
        List<ProductCategory> GetProductCategoriesByPagination(string filter, string sort, int take, int skip);
        int GetSessionComparisonHash();
    }
}