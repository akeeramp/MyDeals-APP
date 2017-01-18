using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IProductCategoriesLib
	{
		List<ProductCategory> GetProductCategories();

		//Product CreateProductCategory(Product category);
		List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories);

	}
}