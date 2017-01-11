using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class ProductCategoriesDataLibTest
	{
		[TestFixtureSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Started Customer Calendar Data Library tests");
			OpUserStack.EmulateUnitTester();
			UnitTestHelpers.SetDbConnection();
		}		
		
		#region helper functions

		private ProductCategory MakeNewProductCategory(int stepNumber = 0)
		{
			string testString = "UNIT TEST - UploadDbLogPerfLogs";
			DateTime now = DateTime.UtcNow;
			var user = OpUserStack.MyOpUserToken.Usr;
			
			return new ProductCategory {
				ACTV_IND = true
				, CHG_DTM = now
				, CHG_EMP_NM = user.FullName
				, DEAL_PRD_TYPE = testString
				, DIV_NM = testString
				, GDM_PRD_TYPE_NM = testString
				, GDM_VRT_NM = testString
				, OP_CD = testString
				, PRD_CAT_MAP_SID = 1 // TODO: This is hard coded. Replace with new ids, once we have the AddProductCategories functionaility in a future sprint
				, PRD_CAT_NM = testString
			};
		}


		private List<ProductCategory> MakeMulitpleNewProductCategories(int count)
		{
			List<ProductCategory> list = new List<ProductCategory>();
			for (var i=0; i < count; i++)
			{
				list.Add(MakeNewProductCategory(i));
			}
			return list;
		}

		#endregion
		

		[TestCase]
		public void ProductCategoriesGetAll()
		{
			// ARRANGE / ACT
			List<ProductCategory> results = new ProductCategoriesDataLib().GetProductCategories();

			// ASSERT
			Assert.IsTrue(results.Any());
		}

		[TestCase(1)]
		//[TestCase(2)] // TODO: Test other counts once we are able to add new product categories and replace the hard cded Ids
		public void ProductCategoriesUpload(int count)
		{
			// ARRANGE
			List<ProductCategory> pcList = MakeMulitpleNewProductCategories(count);

			// ACT
			bool results = new ProductCategoriesDataLib().UpdateProductCategories(pcList);

			// ASSERT
			Assert.IsTrue(results);
		}

	}
}
