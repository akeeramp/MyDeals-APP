using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductDataLib
    {
        List<Product> GetProducts();

        List<ProductDatails> GetProductsDetails();

        List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data);

        List<ProductAlias> GetProductsFromAlias();

        List<PRD_LOOKUP_RESULTS> FindProductMatch(List<ProductEntryAttribute> productsToMatch);

        List<PRD_LOOKUP_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch, int CUST_MBR_SID, int GEO_MBR_SID);

        List<ProductIncExcAttribute> SetIncludeExclude(List<ProductIncExcAttribute> data, string opsType);

        ProductIncExcAttributeSelector GetProductIncludeExcludeAttribute();

        List<PrdDealType> GetProdDealType();

        List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID);

        ProductSelectorWrapper GetProductSelectorWrapper();

        List<ProductSelectionResults> GetProductSelectionResults(string searchHash, DateTime startDate, DateTime endDateTime,
                int selectionLevel, string drillDownFilter4, string drillDownFilter5, int custSid, string geoSid);

        List<ProductCAPYCS2> GetProductCAPYCS2Data(List<ProductCAPYCS2Calc> productCAPCalc, string getAvailable, string priceCondition);
    }
}