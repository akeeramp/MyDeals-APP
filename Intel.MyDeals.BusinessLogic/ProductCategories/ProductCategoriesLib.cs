using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinesssLogic
{
    public class ProductCategoriesLib
	{

		//public ProductCategory CreateProductCategory(ProductCategory category)
		//{
		//	return new ProductCategoriesDataLib().CreateProductCategory(category);
		//}

		/// <summary>
		/// Get All Product Categories
		/// </summary>
		/// <returns>list of Product Categories</returns>
		public List<ProductCategory> GetProductCategories()
        {
            return new ProductCategoriesDataLib().GetProductCategories();
		}

		/// <summary>
		/// Updates a list of product categories
		/// </summary>
		/// <param name="categories">The list of changed products to be updated</param>
		/// <returns>A boolean of whether the update successed or not</returns>
		public bool UpdateProductCategories(List<ProductCategory> categories)
		{
			return new ProductCategoriesDataLib().UpdateProductCategories(categories);
		}

	}
}
