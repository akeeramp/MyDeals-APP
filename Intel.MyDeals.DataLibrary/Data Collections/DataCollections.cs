using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using AttributeCollection = Intel.MyDeals.Entities.AttributeCollection;
using Intel.RulesEngine;

namespace Intel.MyDeals.DataLibrary
{
    public static class DataCollections
    {
        private static readonly object LOCK_OBJECT = new object();

        public static bool ClearCache()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                FieldInfo[] fieldInfos = typeof(DataCollections).GetFields(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static);
                foreach (FieldInfo field in fieldInfos.Where(f => f.Name[0] == '_').OrderBy(f => f.Name))
                {
                    field.SetValue(field, null);
                }
            }
            return true;
        }

        #region Cache Functions

        public static IEnumerable<CacheItem> CheckCache()
        {
            List<CacheItem> ret = new List<CacheItem>();

            FieldInfo[] fieldInfos = typeof(DataCollections).GetFields(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static);

            foreach (FieldInfo field in fieldInfos.Where(f => f.Name[0] == '_').OrderBy(f => f.Name))
            {
                var values = field.GetValue(field);
                if (values == null)
                {
                    ret.Add(new CacheItem { CacheName = field.Name, CacheCount = 0 });
                }
                else
                    switch (values.GetType().Name)
                    {
                        case "Object":
                            break;

                        case "List`1":
                        case "Dictionary`2":
                            ret.Add(new CacheItem { CacheName = field.Name, CacheCount = (int)values.GetType().GetProperty("Count").GetValue(values, null) });
                            break;
                    }
            }

            return ret;
        }

        public static bool ClearCache(string fieldName)
        {
            if (string.IsNullOrEmpty(fieldName)) return false;

            lock (LOCK_OBJECT ?? new object())
            {
                var field = typeof(DataCollections).GetField(fieldName, BindingFlags.Static | BindingFlags.NonPublic);
                if (field == null) return false;

                field.SetValue(null, null);
                return true;
            }
        }

        public static bool LoadCache()
        {
            FieldInfo[] fields = typeof(DataCollections).GetFields(BindingFlags.Static | BindingFlags.NonPublic);

            foreach (FieldInfo fieldInfo in fields)
            {
                LoadCacheFile(fieldInfo.Name);
            }

            return true;
        }

        public static bool LoadCache(string fieldName)
        {
            if (string.IsNullOrEmpty(fieldName)) return false;

            lock (LOCK_OBJECT ?? new object())
            {
                LoadCacheFile(fieldName);
                return true;
            }
        }

        public static bool RecycleCache(string fieldName)
        {
            if (string.IsNullOrEmpty(fieldName)) return false;

            if (ClearCache(fieldName))
            {
                return LoadCache(fieldName);
            }
            return false;
        }

        private static bool LoadCacheFile(string fieldName)
        {
            FieldInfo field = typeof(DataCollections).GetField(fieldName, BindingFlags.Static | BindingFlags.NonPublic);
            if (field == null) return false;

            // clear value first
            field.SetValue(null, null);

            // get public load
            string methodName = char.ToUpper(fieldName[1]) + fieldName.Substring(2);
            var method = typeof(DataCollections).GetMethod(methodName, BindingFlags.Static | BindingFlags.Public);

            if (method == null) return false;

            method.Invoke(null, null);
            return true;
        }

        public static object ViewCache(string fieldName)
        {
            if (string.IsNullOrEmpty(fieldName)) return new object();

            lock (LOCK_OBJECT ?? new object())
            {
                var field = typeof(DataCollections).GetField(fieldName, BindingFlags.Static | BindingFlags.NonPublic);
                return field == null ? new object() : field.GetValue(field);
            }
        }

        #endregion Cache Functions

        public static List<AdminConstant> GetToolConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetAdminConstants());
            }
        }

        private static List<AdminConstant> _getToolConstants;

        public static List<AtrbMstr> GetAtrbMstrs()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAtrbMstrs ?? (_getAtrbMstrs = new AtrbMapDataLib().GetAtrbMstrs());
            }
        }

        private static List<AtrbMstr> _getAtrbMstrs;

        public static List<OpAtrbMap> GetOpAtrbMapItems()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getOpAtrbMapItems ?? (_getOpAtrbMapItems = new AtrbMapDataLib().GetOpAtrbMapItems());
            }
        }

        private static List<OpAtrbMap> _getOpAtrbMapItems;

        public static UiTemplates GetUiTemplates()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getUiTemplates ?? (_getUiTemplates = new UiTemplateDataLib().GetUiTemplates());
            }
        }

        private static UiTemplates _getUiTemplates;

        public static List<GeoDimension> GetGeoData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getGeoData ?? (_getGeoData = new GeoDataLib().GetGeoDimensions());
            }
        }

        private static List<GeoDimension> _getGeoData;

        public static List<LookupItem> GetLookupData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getLookupData ?? (_getLookupData = new ConstantLookupDataLib().GetLookups());
            }
        }

        private static List<LookupItem> _getLookupData;

        #region Security Mapping

        public static SecurityWrapper GetSecurityWrapper()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getRoleTypes != null && _getSecurityAttributes != null && _getSecurityMasks != null)
                {
                    _getSecurityWrapper = new SecurityWrapper(_getRoleTypes.ToList(), _getSecurityAttributes.ToList(), _getSecurityMasks.ToList());
                    return _getSecurityWrapper;
                }
                else
                {
                    SecurityWrapper wrapper = new SecurityAttributesDataLib().GetSecurityWrapper();
                    _getRoleTypes = wrapper.RoleTypes;
                    _getSecurityAttributes = wrapper.SecurityAttributes.OrderBy(x => x.ATRB_CD);
                    _getSecurityMasks = wrapper.SecurityMasks;
                    return wrapper;
                }
            }
        }

        // TODO: Implement when roles are in db
        //public static SecurityWrapper GetRoleTypes()
        //{
        //	return GetSecurityWrapper();
        //}

        public static IEnumerable<SecurityAttribute> GetSecurityAttributes()
        {
            return GetSecurityWrapper().SecurityAttributes;
        }

        public static IEnumerable<SecurityMask> GetSecurityMasks()
        {
            return GetSecurityWrapper().SecurityMasks;
        }

        private static SecurityWrapper _getSecurityWrapper;
        private static IEnumerable<OpRoleType> _getRoleTypes;
        private static IEnumerable<SecurityAttribute> _getSecurityAttributes;
        private static IEnumerable<SecurityMask> _getSecurityMasks;

        public static List<SecurityAttributesDropDown> GetObjAtrbs()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getObjAtrbs ?? (_getObjAtrbs = new SecurityAttributesDataLib().GetObjAtrbs());
            }
        }

        private static List<SecurityAttributesDropDown> _getObjAtrbs;

        #endregion Security Mapping

        #region Security Attributes

        public static List<AdminApplications> GetAdminApplications()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAdminApplications ?? (_getAdminApplications = new SecurityAttributesDataLib().GetAdminApplications());
            }
        }

        private static List<AdminApplications> _getAdminApplications;

        public static List<AdminDealType> GetAdminDealTypes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAdminDealTypes ?? (_getAdminDealTypes = new SecurityAttributesDataLib().GetAdminDealTypes());
            }
        }

        private static List<AdminDealType> _getAdminDealTypes;

        public static List<AdminRoleType> GetAdminRoleTypes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAdminRoleTypes ?? (_getAdminRoleTypes = new SecurityAttributesDataLib().GetAdminRoleTypes());
            }
        }

        private static List<AdminRoleType> _getAdminRoleTypes;

        public static List<SecurityActions> GetSecurityActions()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getSecurityActions ?? (_getSecurityActions = new SecurityAttributesDataLib().GetSecurityActions());
            }
        }

        private static List<SecurityActions> _getSecurityActions;

        #endregion Security Attributes

        public static IEnumerable<DcsSoldTo> GetSoldToData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getSoldToData ?? (_getSoldToData = new GeoDataLib().GetSoldTos());
            }
        }

        private static IEnumerable<DcsSoldTo> _getSoldToData;

        public static List<WorkFlowStg> GetWorkFlowStages()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getWorkFlowStages ?? (_getWorkFlowStages = new WorkFlowDataLib().GetWorkFlowStages());
            }
        }

        private static List<WorkFlowStg> _getWorkFlowStages;

        public static List<WorkFlows> GetWorkFlowItems()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getWorkFlowItems ?? (_getWorkFlowItems = new WorkFlowDataLib().GetWorkFlowItems());
            }
        }

        private static List<WorkFlows> _getWorkFlowItems;

        public static Dictionary<int, MyDealsAttribute> GetAttributeMasterDataDictionary()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAttributeMasterDataDictionary ??
                       (_getAttributeMasterDataDictionary = new AtrbMapDataLib().GetAttributeMasterDataDictionary());
            }
        }

        private static Dictionary<int, MyDealsAttribute> _getAttributeMasterDataDictionary;

        public static AttributeCollection GetAttributeData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return new AttributeCollection(GetAttributeMasterDataDictionary(), GetOpAtrbMapItems());
            }
        }

        public static List<MyDealsActionItem> GetDealActions()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getDealActions ?? (_getDealActions = new SecurityAttributesDataLib().GetDealActions());
            }
        }

        private static List<MyDealsActionItem> _getDealActions;

        public static TemplateWrapper GetTemplateWrapper()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getTemplateData != null && _getTemplateDict != null)
                    return new TemplateWrapper
                    {
                        TemplateData = _getTemplateData,
                        TemplateDict = _getTemplateDict,
                    };

                TemplateWrapper wrapper = new OpDataCollectorDataLib().GetTemplateData();
                _getTemplateData = wrapper.TemplateData;
                _getTemplateDict = wrapper.TemplateDict;
                return wrapper;
            }
        }

        public static OpDataElementAtrbTemplates GetOpDataElementUiTemplates()
        {
            return GetTemplateWrapper().TemplateDict;
        }

        public static List<ObjectTypeTemplate> GetTemplateData()
        {
            return GetTemplateWrapper().TemplateData;
        }

        public static OpDataElementAtrbTemplates GetTemplateDict()
        {
            return GetTemplateWrapper().TemplateDict;
        }

        private static List<ObjectTypeTemplate> _getTemplateData;
        private static OpDataElementAtrbTemplates _getTemplateDict;

        public static List<CustomerDivision> GetCustomerDivisions()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getCustomerDivisions == null || _getCustomerDivisions.Count == 0)
                {
                    _getCustomerDivisions = new CustomerDataLib().GetCustomerDivisions();
                }

                return _getCustomerDivisions;
            }
        }

        private static List<CustomerDivision> _getCustomerDivisions;

        public static List<Product> GetProductData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getProductData ?? (_getProductData = new ProductDataLib().GetProducts());
            }
        }

        private static List<Product> _getProductData;

        public static List<ProductAlias> GetProductsFromAlias()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getProductsFromAlias ?? (_getProductsFromAlias = new ProductDataLib().GetProductsFromAlias());
            }
        }

        private static List<ProductAlias> _getProductsFromAlias;

        #region Rules Engine

        public static List<RuleSet> GetRuleSets()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getRuleSetData ?? (_getRuleSetData = new RuleEngineDataLib().GetRuleSets());
            }
        }

        private static List<RuleSet> _getRuleSetData;

        public static List<RuleItem> GetRuleItems()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getRuleItemData ?? (_getRuleItemData = new RuleEngineDataLib().GetRuleItems());
            }
        }

        private static List<RuleItem> _getRuleItemData;

        public static List<RuleCondition> GetRuleConditions()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getRuleConditionData ?? (_getRuleConditionData = new RuleEngineDataLib().GetRuleConditions());
            }
        }

        private static List<RuleCondition> _getRuleConditionData;

        public static List<RuleTask> GetRuleTasks()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getRuleTaskData ?? (_getRuleTaskData = new RuleEngineDataLib().GetRuleTasks());
            }
        }

        private static List<RuleTask> _getRuleTaskData;

        #endregion Rules Engine

        #region Product Categories

        public static List<ProductCategory> GetProductCategories()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getProductCategories ?? (_getProductCategories = new ProductCategoriesDataLib().GetProductCategories());
            }
        }

        private static List<ProductCategory> _getProductCategories;

        #endregion Product Categories

        #region Dropdowns

        public static List<BasicDropdown> GetBasicDropdowns()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getBasicDropdowns ?? (_getBasicDropdowns = new DropdownDataLib().GetBasicDropdowns());
            }
        }

        private static List<BasicDropdown> _getBasicDropdowns;

        public static List<Dropdown> GetDropdowns()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getDropdowns ?? (_getDropdowns = new DropdownDataLib().GetDropdowns());
            }
        }

        private static List<Dropdown> _getDropdowns;

        #endregion Dropdowns
    }
}