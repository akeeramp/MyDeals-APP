using Intel.MyDeals.Entities;
using Intel.RulesEngine;
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

        List<RuleSet> GetRuleSets();

        List<RuleItem> GetRuleItems();

        List<RuleCondition> GetRuleConditions();

        List<RuleTask> GetRuleTasks();

        List<ProductCategory> GetProductCategories();

        List<ProductAlias> GetProductsFromAlias();

        List<BasicDropdown> GetBasicDropdowns();

        List<Dropdown> GetDropdowns();

		#region Security Attributes

		List<AdminApplications> GetAdminApplications();

		List<AdminDealType> GetAdminDealTypes();

		List<AdminRoleType> GetAdminRoleTypes();

		List<SecurityActions> GetSecurityActions();

		#endregion
		List<SecurityAttributesDropDown> GetObjAtrbs();

	}
}