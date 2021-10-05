using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using AttributeCollection = Intel.MyDeals.Entities.AttributeCollection;

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

        public static void ClearMyCustomerCache()
        {
            string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper().Replace("AMR\\", "");
            if (_getMyCustomers.ContainsKey(authenticatedName))
            {
                _getMyCustomers.Remove(authenticatedName);
            }
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

        public static int GetSessionComparisonHash()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getSessionComparisonHash == 0)
                {
                    _getSessionComparisonHash = Guid.NewGuid().GetHashCode();
                    return _getSessionComparisonHash;
                }
                else
                {
                    return _getSessionComparisonHash;
                }
            }
        }

        private static int _getSessionComparisonHash;

        public static List<AdminConstant> GetToolConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetAdminConstants());
            }
        }

        private static Dictionary<string, string> _getSearchString;

        public static Dictionary<string, string> GetSearchString()
        {
            // Keeping this call out of lock statement, get products cache
            var products = GetProductData();
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getSearchString == null)
                {
                    var _getSearchStringList = new List<SearchString>();
                    var searchHierColumns = products.Where(x => !string.IsNullOrEmpty(x.HIER_VAL_NM) &&
                        x.PRD_ATRB_SID <= (int)ProductHierarchyLevelsEnum.MTRL_ID
                        && x.PRD_ATRB_SID >= (int)ProductHierarchyLevelsEnum.DEAL_PRD_TYPE)
                        .Select(x => new SearchString { Name = x.HIER_VAL_NM, Type = ((ProductHierarchyLevelsEnum)x.PRD_ATRB_SID).ToString() });

                    var searchGDMFamily = products.Where(x => !string.IsNullOrEmpty(x.GDM_FMLY_NM)).
                            Select(x => new SearchString { Name = x.GDM_FMLY_NM, Type = ProductHierarchyLevelsEnum.GDM_FMLY_NM.ToString() });

                    var searchNandFamily = products.Where(x => !string.IsNullOrEmpty(x.NAND_FAMILY) && x.PRD_ATRB_SID == 7008).
                                       Select(x => new SearchString { Name = x.NAND_FAMILY, Type = ProductHierarchyLevelsEnum.NAND_FAMILY.ToString() });

                    var searchNandDensity = products.Where(x => !string.IsNullOrEmpty(x.NAND_Density) && x.PRD_ATRB_SID == 7008).
                                       Select(x => new SearchString { Name = x.NAND_Density, Type = ProductHierarchyLevelsEnum.NAND_DENSITY.ToString() });

                    var searchEPM = products.Where(x => !string.IsNullOrEmpty(x.EPM_NM) && x.PRD_ATRB_SID == 7008).
                                       Select(x => new SearchString { Name = x.EPM_NM, Type = ProductHierarchyLevelsEnum.EPM_NM.ToString() });

                    _getSearchStringList.AddRange(searchHierColumns);
                    _getSearchStringList.AddRange(searchGDMFamily);
                    _getSearchStringList.AddRange(searchNandFamily);
                    _getSearchStringList.AddRange(searchNandDensity);
                    _getSearchStringList.AddRange(searchEPM);

                    _getSearchString = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

                    foreach (var searchString in _getSearchStringList)
                    {
                        if (!_getSearchString.Keys.Contains(searchString.Name))
                            _getSearchString.Add(searchString.Name, searchString.Type);
                    }
                }

                return _getSearchString;
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

        public static List<AdminConstant> GetAdminConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAdminConstants ?? (_getAdminConstants = new ConstantLookupDataLib().GetAdminConstants());
            }
        }

        private static List<AdminConstant> _getAdminConstants;

        public static List<UsrProfileRole> GetUsrProfileRole()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getUsrProfileRole ?? (_getUsrProfileRole = new EmployeeDataLib().GetUsrProfileRole());
            }
        }

        private static List<UsrProfileRole> _getUsrProfileRole;

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
                if (_getSecurityWrapper != null)
                {
                    return _getSecurityWrapper;
                }
                else
                {
                    SecurityWrapper wrapper = new SecurityAttributesDataLib().GetSecurityWrapper();
                    _getRoleTypes = wrapper.RoleTypes;
                    _getSecurityAttributes = wrapper.SecurityAttributes.OrderBy(x => x.ATRB_CD);
                    _getSecurityMasks = wrapper.SecurityMasks;

                    if (/*_getRoleTypes != null && */ _getSecurityAttributes != null && _getSecurityMasks != null)
                    {
                        // TODO: Add roles to cache once we get it from the db
                        _getSecurityWrapper = new SecurityWrapper(/*_getRoleTypes.ToList()*/ null, _getSecurityAttributes.ToList(), _getSecurityMasks.ToList());
                    }
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

        public static List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getObjAtrbs ?? (_getObjAtrbs = new SecurityAttributesDataLib().GetSecurityAttributesDropDownData());
            }
        }

        private static List<SecurityAttributesDropDown> _getObjAtrbs;

        #endregion Security Mapping

        #region Security Attributes

        public static List<AdminDealType> GetAdminDealTypes()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getAdminDealTypes ?? (_getAdminDealTypes = new SecurityAttributesDataLib().GetAdminDealTypes());
            }
        }

        private static List<AdminDealType> _getAdminDealTypes;

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

        public static List<VistexCustomerMapping> GetVistexCustomerMappings()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if(_getVistexCustomerMappings == null || _getVistexCustomerMappings.Count == 0)
                {
                    _getVistexCustomerMappings = new VistexCustomerMappingDataLib().GetVistexCustomerMappings();
                }

                return _getVistexCustomerMappings;
            }
        }

        private static List<VistexCustomerMapping> _getVistexCustomerMappings;

        public static MyCustomerDetailsWrapper GetMyCustomers()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getMyCustomers == null || !_getMyCustomers.Any())
                {
                    _getMyCustomers = new Dictionary<string, MyCustomerDetailsWrapper>();
                }
                string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper().Replace("AMR\\", "");
                // Check customer count, this will fix when user has access to mydeals but unable to see any customers in dropdown
                if (!_getMyCustomers.ContainsKey(authenticatedName) ||
                        (_getMyCustomers.ContainsKey(authenticatedName) && !_getMyCustomers[authenticatedName].CustomerInfo.Any()))
                {
                    _getMyCustomers[authenticatedName] = new CustomerDataLib().GetMyCustomers();
                }
                return _getMyCustomers[authenticatedName];
            }
        }

        private static Dictionary<string, MyCustomerDetailsWrapper> _getMyCustomers;

        public static MyVerticalDetailsWrapper GetMyVerticals()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getMyVerticals == null || !_getMyVerticals.Any())
                {
                    _getMyVerticals = new Dictionary<string, MyVerticalDetailsWrapper>();
                }
                string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper().Replace("AMR\\", "");
                if (!_getMyVerticals.ContainsKey(authenticatedName) ||
                    (_getMyVerticals.ContainsKey(authenticatedName) && _getMyVerticals[authenticatedName] == null))
                {
                    if (!_getMyVerticals.ContainsKey(authenticatedName))
                    {
                        _getMyVerticals[authenticatedName] = new MyVerticalDetailsWrapper();
                        _getMyVerticals[authenticatedName].VerticalInfo = new List<VerticalSecurityItem>();
                    }

                    OpUserToken unitOpUserToken = new OpUserToken
                    {
                        Usr = new OpUser
                        {
                            Idsid = authenticatedName
                        }
                    };

                    _getMyVerticals[authenticatedName].VerticalInfo.AddRange(new EmployeeDataLib().GetUserSettings(unitOpUserToken).VerticalSecurity); 
                    //_getMyVerticals[authenticatedName].VerticalInfo = blah;
                }
                return _getMyVerticals[authenticatedName];
            }
        }

        private static Dictionary<string, MyVerticalDetailsWrapper> _getMyVerticals;

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

        private static ProductSelectorWrapper _getProductSelectorWrapper;
        private static ProductSelectorWrapper _getProductSelectorWrapperDensity;

        // This collection gets the selection level drill down levels for CPU, hierarchical levels
        private static IEnumerable<ProductSelectionLevels> _getProductSelectionLevels;

        // This collection gets the selection level drill down levels for non CPU, non hierarchical levels
        private static IEnumerable<ProductSelectionLevelsAttributes> _getProductSelectionLevelsAttributes;

        public static ProductSelectorWrapper GetProductSelectorWrapper()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_getProductSelectorWrapper != null)
                {
                    return _getProductSelectorWrapper;
                }
                else
                {
                    _getProductSelectorWrapper = new ProductDataLib().GetProductSelectorWrapper();
                    _getProductSelectionLevels = _getProductSelectorWrapper.ProductSelectionLevels;
                    _getProductSelectionLevelsAttributes = _getProductSelectorWrapper.ProductSelectionLevelsAttributes;

                    return _getProductSelectorWrapper;
                }
            }
        }

        public static ProductSelectorWrapper GetProductSelectorWrapperDensity(DateTime startDate, DateTime endDate, string mediaCode)
        {
            lock (LOCK_OBJECT ?? new object())
            {
                _getProductSelectorWrapperDensity = new ProductDataLib().GetProductSelectorWrapperDensity(startDate, endDate, mediaCode);
                _getProductSelectionLevels = _getProductSelectorWrapperDensity.ProductSelectionLevels;
                _getProductSelectionLevelsAttributes = _getProductSelectorWrapperDensity.ProductSelectionLevelsAttributes;

                return _getProductSelectorWrapperDensity;
            }
        }

        #region Product Vertical

        public static List<ProductCategory> GetProductCategories()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getProductCategories ?? (_getProductCategories = new ProductCategoriesDataLib().GetProductCategories());
            }
        }

        private static List<ProductCategory> _getProductCategories;

        #endregion Product Vertical

        #region Settlement_Partner
        public static List<CustomerVendors> GetCustomerVendors()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getCustomerVendors ?? (_getCustomerVendors = new CustomerVendorsDataLib().GetCustomerVendors());
            }
        }

        private static List<CustomerVendors> _getCustomerVendors;

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

        public static List<DictDropDown> GetDictDropDown(string atrbCd)
        {
            return new DropdownDataLib().GetDictDropDown(atrbCd);
        }

        private static List<Dropdown> _getDropdowns;

        /// <summary>
        ///	Returns the values from GetDropdowns, but in Dictionary form for more efficent lookup
        /// </summary>
        /// <returns>
        ///	Dictionary with (Key: Atrb Cd | Value: Another Dictionary with (Key: Uppercased name | Value: Name with capitalization as appears in db))
        /// </returns>
        public static Dictionary<string, string> GetDropdownDict(string lookupText)
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_dropdownDict == null)
                {
                    _dropdownDict = new Dictionary<string, Dictionary<string, string>>();
                }

                if (!_dropdownDict.ContainsKey(lookupText))
                {
                    List<Dropdown> dropdownList = GetDropdowns().Where(dd => dd.dropdownCategory == lookupText && dd.active == 1).OrderBy(dd => dd.dropdownName).ToList();
                    Dictionary<string, string> temp = new Dictionary<string, string>();

                    for (int i = 0; i < dropdownList.Count; i++)
                    {
                        if (!temp.ContainsKey(dropdownList[i].dropdownName.ToUpper()))
                        {
                            temp[dropdownList[i].dropdownName.ToUpper()] = dropdownList[i].dropdownName;
                        }
                    }
                    _dropdownDict[lookupText] = temp;
                }
                return _dropdownDict[lookupText];
            }
        }

        public static Dictionary<string, Dictionary<string, string>> _dropdownDict;       

        /// <summary>
        ///	Returns the values from GetBasicDropdowns, but in Dictionary form for more efficent lookup
        /// </summary>
        /// <returns>
        ///	Dictionary with (Key: Atrb Cd | Value: Another Dictionary with (Key: Uppercased name | Value: Name with capitalization as appears in db))
        /// </returns>
        public static Dictionary<string, string> GetBasicDropdownDict(string atrbCd)
        {
            lock (LOCK_OBJECT ?? new object())
            {
                if (_basicDropdownDict == null)
                {
                    _basicDropdownDict = new Dictionary<string, Dictionary<string, string>>();
                }

                if (!_basicDropdownDict.ContainsKey(atrbCd))
                {
                    List<BasicDropdown> dropdownList = GetBasicDropdowns().Where(d => d.ATRB_CD.ToUpper() == atrbCd && d.ACTV_IND).ToList<BasicDropdown>();
                    Dictionary<string, string> temp = new Dictionary<string, string>();

                    for (int i = 0; i < dropdownList.Count; i++)
                    {
                        if (!temp.ContainsKey(dropdownList[i].DROP_DOWN.ToUpper()))
                        {
                            temp[dropdownList[i].DROP_DOWN.ToUpper()] = dropdownList[i].DROP_DOWN;
                        }
                    }
                    _basicDropdownDict[atrbCd] = temp;
                }
                return _basicDropdownDict[atrbCd];
            }
        }

        public static Dictionary<string, Dictionary<string, string>> _basicDropdownDict;

        #endregion Dropdowns

        //// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
        //public static List<RetailPull> GetRetailPullList()
        //{
        //	lock (LOCK_OBJECT ?? new object())
        //	{
        //		return _getRetailPullList ?? (_getRetailPullList = new RetailPullDataLib().GetRetailPullFromSDMList());
        //	}
        //}

        //private static List<RetailPull> _getRetailPullList;

        public static List<SoldToIds> GetSoldToIdList()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getSoldToIdList ?? (_getSoldToIdList = new SoldToIdDataLib().GetSoldToIdList());
            }
        }

        private static List<SoldToIds> _getSoldToIdList;

        public static List<Funfact> GetFunfactList()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getFunfactList ?? (_getFunfactList = new FunfactDataLib().GetFunfactItems());
            }
        }

        private static List<Funfact> _getFunfactList;

        public static List<Countires> GetCountries()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _countries ?? (_countries = new PrimeCustomersDataLib().GetCountries());
            }
        }

        private static List<Countires> _countries;
    }
}