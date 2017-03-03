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
        private static object LOCK_OBJECT = new object();

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

                        default:
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

        public static List<ToolConstants> GetToolConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetToolConstants());
            }
        }

        private static List<ToolConstants> _getToolConstants;

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

        public static SecurityWrapper GetSecurityWrapper()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getRoleTypes != null && _getSecurityActions != null && _getSecurityMasks != null)
                    return new SecurityWrapper(_getRoleTypes.ToList(), _getSecurityActions.ToList(), _getSecurityMasks.ToList());

                SecurityWrapper wrapper = new SecurityAttributesDataLib().GetSecurityWrapper();
                _getRoleTypes = wrapper.RoleTypes;
                _getSecurityActions = wrapper.SecurityAttributes;
                _getSecurityMasks = wrapper.SecurityMasks;
                return wrapper;
            }
        }

        public static SecurityWrapper GetRoleTypes()
        {
            return GetSecurityWrapper();
        }

        public static SecurityWrapper GetSecurityActions()
        {
            return GetSecurityWrapper();
        }

        public static SecurityWrapper GetSecurityMasks()
        {
            return GetSecurityWrapper();
        }

        private static IEnumerable<OpRoleType> _getRoleTypes;
        private static IEnumerable<SecurityAttribute> _getSecurityActions;
        private static IEnumerable<SecurityMask> _getSecurityMasks;

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

        public static List<AppRoleTier> GetAppRoleTiers()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAppRoleTiers ?? (_getAppRoleTiers = new SecurityAttributesDataLib().GetAppRoleTiers());
            }
        }

        private static List<AppRoleTier> _getAppRoleTiers;

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
                if (_getTemplateData != null && _getTemplateDict != null && _getCalendarData != null)
                    return new TemplateWrapper
                    {
                        TemplateData = _getTemplateData,
                        TemplateDict = _getTemplateDict,
                        CalendarData = _getCalendarData,
                    };

                TemplateWrapper wrapper = new DataCollectorDataLib().GetTemplateData();
                _getTemplateData = wrapper.TemplateData;
                _getTemplateDict = wrapper.TemplateDict;
                _getCalendarData = wrapper.CalendarData.ToList();
                return wrapper;
            }
        }

        public static OpDataElementUITemplates GetOpDataElementUITemplates()
        {
            return GetTemplateWrapper().TemplateDict;
        }

        public static List<ObjectTypeTemplate> GetTemplateData()
        {
            return GetTemplateWrapper().TemplateData;
        }

        public static OpDataElementUITemplates GetTemplateDict()
        {
            return GetTemplateWrapper().TemplateDict;
        }

        public static IEnumerable<CustomerCal> GetCalendarData()
        {
            return GetTemplateWrapper().CalendarData;
        }

        private static List<ObjectTypeTemplate> _getTemplateData;
        private static OpDataElementUITemplates _getTemplateDict;
        private static List<CustomerCal> _getCalendarData;

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

        public static List<FilterAttribute> GetFilterAttributes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getFilterAttributes ?? (_getFilterAttributes = new MetaDataLib().GetFilterAttributes());
            }
        }

        private static List<FilterAttribute> _getFilterAttributes;

        public static List<GridType> GetGridTypes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getGridTypes ?? (_getGridTypes = new MetaDataLib().GetGridTypes());
            }
        }

        private static List<GridType> _getGridTypes;

        public static List<Operator_class> GetOperators()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getOperators ?? (_getOperators = new MetaDataLib().GetOperators());
            }
        }

        private static List<Operator_class> _getOperators;

        public static List<UIType> GetUITypes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getUITypes ?? (_getUITypes = new MetaDataLib().GetUITypes());
            }
        }

        private static List<UIType> _getUITypes;

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

        #endregion

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

        #endregion
    }
}