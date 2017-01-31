using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Linq;
using System.Net;
using Intel.MyDeals.IBusinessLogic;

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
			try
			{
				return _productCategoriesLib.GetProductCategories();
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
			}
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
		[Route("UpdateProductCategory")]
		public ProductCategory UpdateProductCategory(ProductCategory category)
		{
			if (category.ACTV_IND && (String.IsNullOrEmpty(category.DEAL_PRD_TYPE) || String.IsNullOrEmpty(category.PRD_CAT_NM)))
			{
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
			}

			List<ProductCategory> categoriesList = new List<ProductCategory>();
			categoriesList.Add(category);
			
			try
			{
				return UpdateProductCategoryBulk(categoriesList).FirstOrDefault();
			}
			catch
			{
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
			}
		}
				
		[Authorize]
		[HttpPut]
		[Route("UpdateProductCategoryBulk")]
		public List<ProductCategory> UpdateProductCategoryBulk(List<ProductCategory> categoriesList)
		{
			foreach(ProductCategory category in categoriesList)
			{
				if (category.ACTV_IND && (String.IsNullOrEmpty(category.DEAL_PRD_TYPE) || String.IsNullOrEmpty(category.PRD_CAT_NM)))
				{
					throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
				}
			}
			try
			{ 
				return _productCategoriesLib.UpdateProductCategories(categoriesList);
			}
			catch (Exception ex)
			{
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
			}
		}
	}
}
