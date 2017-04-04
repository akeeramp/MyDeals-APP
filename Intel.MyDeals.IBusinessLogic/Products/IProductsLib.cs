using Intel.MyDeals.Entities;
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

        ProductLookup TranslateProducts(List<ProductEntryAttribute> products);

        List<PRD_LOOKUP_RESULTS> GetProductDetails(List<ProductEntryAttribute> productsToMatch);

        ProductLookup FetchProducts(List<ProductIEValues> products);

        List<ProductIncExcAttribute> SetIncludeAttibute(List<ProductIncExcAttribute> prodNames);

        List<ProductIncExcAttribute> SetExcludeAttibute(List<ProductIncExcAttribute> products);

        ProductIncExcAttributeSelector GetProductIncludeExcludeAttribute();

        List<PrdDealType> GetProdDealType();

        List<PrdSelLevel> GetProdSelectionLevel(int OBJ_SET_TYPE_SID);
    }
}