using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IProductCategoriesDataLib
	{
		List<ProductCategory> GetProductCategories();

		//Product CreateProductCategory(Product category);
		List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories);

	}
}
