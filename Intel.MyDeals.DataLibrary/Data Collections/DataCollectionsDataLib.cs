using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.RulesEngine;
using System;
using System.Collections.Generic;

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

        #endregion Cache Functions

        public List<ToolConstants> GetToolConstants()
        {
            return DataCollections.GetToolConstants();
        }

        public List<CustomerDivision> GetCustomerDivisions()
        {
            return DataCollections.GetCustomerDivisions();
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

        public List<RuleSet> GetRuleSets()
        {
            return DataCollections.GetRuleSets();
        }

        public List<RuleItem> GetRuleItems()
        {
            return DataCollections.GetRuleItems();
        }

        public List<RuleCondition> GetRuleConditions()
        {
            return DataCollections.GetRuleConditions();
        }

		public List<RuleTask> GetRuleTasks()
		{
			return DataCollections.GetRuleTasks();
		}
		public List<ProductCategory> GetProductCategories()
		{
			return DataCollections.GetProductCategories();
		}
	}
}