using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IProductsLib
    {
        Product GetProduct(int sid);

        List<Product> GetProductByBrandName(string name);

        List<Product> GetProductByBrandSid(int sid);

        List<Product> GetProductByCategoryName(string name, bool getCachedResult = true);

        List<Product> GetProductByCategorySid(int sid);

        List<Product> GetProductByDealProductName(string name);

        List<Product> GetProductByDealProductNameSid(int sid);

        List<Product> GetProductByDealProductTypeName(string name);

        List<Product> GetProductByDealProductTypeSid(int sid);

        List<Product> GetProductByFamilyName(string name);

        List<Product> GetProductByFamilySid(int sid);

        List<Product> GetProductByMaterialIdName(string id);

        List<Product> GetProductByMaterialIdSid(int sid);

        List<Product> GetProductByProcessorNumberName(string name);

        List<Product> GetProductByProcessorNumberSid(int sid);

        List<Product> GetProducts(bool getCachedResult = true);

        List<Product> GetProductsActive();

        List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data);

        List<ProductAlias> GetProductsFromAlias(bool getCachedResult = true);

        ProductLookup TranslateProducts(List<ProductEntryAttribute> products, int CUST_MBR_SID);

        List<PRD_LOOKUP_RESULTS> SearchProduct(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, bool getWithoutFilters);

        List<ProductIncExcAttribute> SetIncludeAttibute(List<ProductIncExcAttribute> prodNames);

        List<ProductIncExcAttribute> SetExcludeAttibute(List<ProductIncExcAttribute> products);

        ProductIncExcAttributeSelector GetProductIncludeExcludeAttribute();

        List<PrdDealType> GetProdDealType();

        List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID);

        ProductSelectorWrapper GetProductSelectorWrapper();

        ProductSelectorWrapper GetProductSelectorWrapperByDates(DateTime startDate, DateTime endDate);

        List<ProductSelectionResults> GetProductSelectionResults(string searchHash, DateTime startDate, DateTime endDateTime,
                int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, string geoSid);

        List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition);

        List<ProductCAPYCS2> GetCAPForProduct(int product, int CUST_CD, string GEO_MBR_SID, DateTime START_DT, DateTime END_DT);

        List<PRD_LOOKUP_RESULTS> GetProductAttributes(List<PRD_LOOKUP_RESULTS> product);

        IList<SearchString> GetSearchString(string searchText, string mediaCode, DateTime startDate, DateTime endDate, bool getWithFilters = true);

        IList<PRD_LOOKUP_RESULTS> GetSuggestions(ProductEntryAttribute userInput, int custId);

        bool IsProductExistsInMydeals(string filter);
    }
}