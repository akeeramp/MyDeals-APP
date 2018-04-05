using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IProductCategoriesDataLib
	{
		List<ProductCategory> GetProductCategories();

        List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories);

	}
}
