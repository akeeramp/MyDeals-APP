using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IProductCategoriesLib
	{
		List<Product> GetProductCategories(bool getCachedResult = true);

		Product GetProductCategory(int sid);
		//Product CreateProductCategory(Product category);
		Product UpdateProductCategories(List<ProductCategory> categories);

	}
}
