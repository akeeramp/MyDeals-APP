using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.RulesEngine;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.DataLibrary
{
    /// <summary>
    /// Wrapper class for static methods of DataCollections
    /// We are creating these wrapper methods so that we can mock them, as we cannot mock the statics class or methods
    /// </summary>
    public class DataCollectionsDataLib : IDataCollectionsDataLib
    {
        #region Cache Functions

        /// <summary>
        /// Clear Cache
        /// </summary>
        /// <returns></returns>
        public bool ClearCache()
        {
            return DataCollections.ClearCache();
        }

        /// <summary>
        /// Check cache status
        /// </summary>
        /// <returns></returns>
        public IEnumerable<CacheItem> CheckCache()
        {
            return DataCollections.CheckCache();
        }

        /// <summary>
        /// Clear cache
        /// </summary>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public bool ClearCache(string fieldName)
        {
            return DataCollections.ClearCache(fieldName);
        }

        /// <summary>
        /// Load Cache
        /// </summary>
        /// <returns></returns>
        public bool LoadCache()
        {
            return DataCollections.LoadCache();
        }

        /// <summary>
        /// Load Cache
        /// </summary>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public bool LoadCache(string fieldName)
        {
            return DataCollections.LoadCache(fieldName);
        }

        /// <summary>
        /// View cache by name
        /// </summary>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public object ViewCache(string fieldName)
        {
            return DataCollections.ViewCache(fieldName);
        }

		/// <summary>
		/// Gets the random hash we generate each time we have cached data. 
		/// We use this to check against whether or not to refresh the javascript sessionStorage.
		/// </summary>
		/// <param name="cacheKey"></param>
		/// <returns>A random hash</returns>
		public int GetSessionComparisonHash()
		{
			return DataCollections.GetSessionComparisonHash();
		}

		#endregion Cache Functions

		public List<AdminConstant> GetToolConstants()
        {
            return DataCollections.GetToolConstants();
        }

        public List<AtrbMstr> GetAtrbMstrs()
        {
            return DataCollections.GetAtrbMstrs();
        }

        public List<CustomerDivision> GetCustomerDivisions()
        {
            return DataCollections.GetCustomerDivisions();
        }

        public List<UsrProfileRole> GetUsrProfileRole()
        {
            return DataCollections.GetUsrProfileRole();
        }

        public List<GeoDimension> GetGeoData()
		{
			return DataCollections.GetGeoData();
		}
		
		public UiTemplates GetUiTemplates()
        {
            return DataCollections.GetUiTemplates();
        }

        public List<Product> GetProductData()
        {
            return DataCollections.GetProductData();
        }

        #region Security Attributes

        public SecurityWrapper GetSecurityWrapper()
        {
            return DataCollections.GetSecurityWrapper();
        }

        public List<AdminApplications> GetAdminApplications()
        {
            return DataCollections.GetAdminApplications();
        }

        public List<AdminDealType> GetAdminDealTypes()
        {
            return DataCollections.GetAdminDealTypes();
        }

        public List<AdminRoleType> GetAdminRoleTypes()
        {
            return DataCollections.GetAdminRoleTypes();
        }

        public List<SecurityActions> GetSecurityActions()
        {
            return DataCollections.GetSecurityActions();
        }

        public List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData()
        {
            return DataCollections.GetSecurityAttributesDropDownData();
        }

        #endregion Security Attributes

        public List<ProductCategory> GetProductCategories()
        {
            return DataCollections.GetProductCategories();
        }

        public List<ProductAlias> GetProductsFromAlias()
        {
            return DataCollections.GetProductsFromAlias();
        }

        public ProductSelectorWrapper GetProductSelectorWrapper()
        {
            return DataCollections.GetProductSelectorWrapper();
        }

        public List<BasicDropdown> GetBasicDropdowns()
        {
            return DataCollections.GetBasicDropdowns();
        }

		public Dictionary<string, string> GetDropdownDict(string lookupText)
		{
			return DataCollections.GetDropdownDict(lookupText);
		}

		public Dictionary<string, string> GetBasicDropdownDict(string atrbcd)
		{
			return DataCollections.GetBasicDropdownDict(atrbcd);
		}

		public List<Dropdown> GetDropdowns()
        {
            return DataCollections.GetDropdowns();
        }

        //public List<RetailPull> GetRetailPullSDMList()
        //{
        //	return DataCollections.GetRetailPullList();
        //}
        public List<SoldToIds> GetSoldToIdList()
        {
            return DataCollections.GetSoldToIdList();
        }

        /// <summary>
        /// Get Search string
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, string> GetSearchString()
        {
            return DataCollections.GetSearchString();
        }
    }
}