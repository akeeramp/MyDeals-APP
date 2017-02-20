using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductDataLib
    {
        List<Product> GetProducts();

        List<ProductAlias> SetProductAlias(CrudModes mode, ProductAlias data);

        List<ProductAlias> GetProductsFromAlias();

        List<PRD_LOOKUP_RESULTS> FindProductMatch(List<string> productsToMatch);
    }
}