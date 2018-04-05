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
		private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public ProductCategoriesLib()
		{
			_productCategoriesDataLib = new ProductCategoriesDataLib();
		}

		public ProductCategoriesLib(IProductCategoriesDataLib productCategoriesDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
		{
			_productCategoriesDataLib = productCategoriesDataLib;
			_dataCollectionsDataLib = dataCollectionsDataLib;
		}


        //public ProductCategory CreateProductCategory(ProductCategory category)
        //{
        //	return new ProductCategoriesDataLib().CreateProductCategory(category);
        //}

        /// <summary>
        /// Get All Product Verticals
        /// </summary>
        /// <returns>list of Product Verticals</returns>
        public List<ProductCategory> GetProductCategories()
		{
			return _dataCollectionsDataLib.GetProductCategories();
		}

        /// <summary>
        /// Updates a list of product Verticals
        /// </summary>
        /// <param name="categories">The list of changed products to be updated</param>
        /// <returns>A boolean of whether the update successed or not</returns>
        public List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories)
		{
			return _productCategoriesDataLib.UpdateProductCategories(categories);
		}

	}
}
