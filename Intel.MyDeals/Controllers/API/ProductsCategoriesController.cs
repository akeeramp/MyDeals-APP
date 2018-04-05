using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Linq;
using System.Net;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ProductCategories")]
    public class ProductCategoriesController : BaseApiController
	{
		private IProductCategoriesLib _productCategoriesLib;

		public ProductCategoriesController(IProductCategoriesLib _productCategoriesLib)
		{
			this._productCategoriesLib = _productCategoriesLib;
		}

		[Authorize]
		[HttpGet]
		[Route("GetProductCategories")]
		public IEnumerable<ProductCategory> GetProductCategories()
		{
			return SafeExecutor(() => _productCategoriesLib
				.GetProductCategories()
				, $"Unable to get Product Verticals"
			);
		}

		//[Authorize]
		//[HttpPost]
		//[Route("CreateProductCategory")]
		//public ProductCategory CreateProductCategory(ProductCategory category)
		//{			
		//	try
		//	{
		//		return _productCategoriesLib.CreateProductCategory(category);
		//	}
		//	catch (Exception ex)
		//	{
		//		OpLogPerf.Log(ex);
		//		throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
		//	}
		//}
		
		[Authorize]
		[HttpPut]
        [AntiForgeryValidate]
        [Route("UpdateProductCategory")]
		public ProductCategory UpdateProductCategory(ProductCategory category)
		{
			if (category.ACTV_IND && (String.IsNullOrEmpty(category.DEAL_PRD_TYPE) || String.IsNullOrEmpty(category.PRD_CAT_NM)))
			{
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
			}

			List<ProductCategory> categoriesList = new List<ProductCategory>();
			categoriesList.Add(category);

			return SafeExecutor(() => UpdateProductCategoryBulk(categoriesList).FirstOrDefault()
				, $"Unable to get Product Verticals"
			);			
		}
				
		[Authorize]
		[HttpPut]
		[Route("UpdateProductCategoryBulk")]
		public List<ProductCategory> UpdateProductCategoryBulk(List<ProductCategory> categoriesList)
		{
			foreach(ProductCategory category in categoriesList)
			{
				if (category.ACTV_IND && (String.IsNullOrWhiteSpace(category.DEAL_PRD_TYPE) || String.IsNullOrWhiteSpace(category.PRD_CAT_NM)))
				{
					throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
				}
			}
			
			return SafeExecutor(() => _productCategoriesLib
				.UpdateProductCategories(categoriesList)
				, $"Unable to get Product Verticals"
			);
		}
	}
}
