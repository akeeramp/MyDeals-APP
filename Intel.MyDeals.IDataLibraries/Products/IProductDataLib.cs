using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductDataLib
    {
        List<Product> GetProducts();
    }
}