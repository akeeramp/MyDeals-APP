using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class ProductCategoriesLib : IProductCategoriesLib
	{
		private readonly IProductCategoriesDataLib _productCategoriesDataLib;

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public ProductCategoriesLib()
		{
			this._productCategoriesDataLib = new ProductCategoriesDataLib();
		}

		public ProductCategoriesLib(IProductCategoriesDataLib _productCategoriesDataLib)
		{
			this._productCategoriesDataLib = _productCategoriesDataLib;
		}


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
			return _productCategoriesDataLib.GetProductCategories();
		}

		/// <summary>
		/// Updates a list of product categories
		/// </summary>
		/// <param name="categories">The list of changed products to be updated</param>
		/// <returns>A boolean of whether the update successed or not</returns>
		public List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories)
		{
			return _productCategoriesDataLib.UpdateProductCategories(categories);
		}

	}
}
