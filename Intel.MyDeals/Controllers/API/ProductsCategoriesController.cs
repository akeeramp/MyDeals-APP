using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Net;
using Intel.MyDeals.IBusinessLogic;
using Kendo.Mvc.UI;

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
			List<ProductCategory> categoriesList = new List<ProductCategory>();
			categoriesList.Add(category);
			
			if (UpdateProductCategoryBulk(categoriesList).Count > 0)
			{
				return category;
			}
			else
			{
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  // responds with a simple status code for ajax call to consume.
			}
		}
				
		[Authorize]
		[HttpPut]
		[Route("UpdateProductCategoryBulk")]
		public List<ProductCategory> UpdateProductCategoryBulk(List<ProductCategory> categoriesList)
		{
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
