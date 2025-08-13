using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IProductCategoriesLib
	{
		List<ProductCategory> GetProductCategories();
		ProductCategoryDetails GetProductCategoriesByPagination(string filter, string sort, int take, int skip);

        List<ProductCategory> UpdateProductCategories(List<ProductCategory> categories);
        List<string> GetProductCategoriesByFilter(string fieldName);

    }
}