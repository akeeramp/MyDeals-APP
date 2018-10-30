using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductDataLib
    {
        List<Product> GetProducts();

        List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data);

        List<ProductAlias> GetProductsFromAlias();

        List<PRD_TRANSLATION_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, string DEAL_TYPE, bool IS_TENDER);

        List<PRD_LOOKUP_RESULTS> SearchProduct(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, OpDataElementSetType dealType, bool getWithoutFilters);

        List<ProductIncExcAttribute> SetIncludeExclude(List<ProductIncExcAttribute> data, string opsType);

        ProductIncExcAttributeSelector GetProductIncludeExcludeAttribute();

        List<PrdDealType> GetProdDealType();

        List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID);

        ProductSelectorWrapper GetProductSelectorWrapper();

        List<ProductSelectionResults> GetProductSelectionResults(string searchHash, DateTime startDate, DateTime endDateTime,
                int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, string geoSid, string mediaCd, OpDataElementSetType dealType);

        List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition);

        List<ProductCAPYCS2> GetCAPForProduct(List<ProductCAPYCS2Calc> product, string getAvailable, string priceCondition);

        List<ProductEngName> GetEngProducts(List<int> prds);

        List<DealProducts> GetDealProducts(int objSid, OpDataElementType objTypeSid, int custId, bool isMissingFlag);
    }
}