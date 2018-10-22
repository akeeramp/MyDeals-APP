using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class ProductCategoriesLibTest
    {
        public ProductCategoriesLibTest()
        {
            Console.WriteLine("Started Product Catgeories Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
				
		#region helper functions

		private ProductCategory MakeNewProductCategory(int stepNumber = 0)
		{
			DateTime now = DateTime.UtcNow;
            string testString = "UNIT TEST - UploadDbLogPerfLogs [" + now.ToString() + "]";
            var user = OpUserStack.MyOpUserToken.Usr;

            return new ProductCategory
            {
                ACTV_IND = true,
                CHG_DTM = now,
                CHG_EMP_NM = user.FullName,
                DEAL_PRD_TYPE = testString,
                DIV_NM = testString,
                GDM_PRD_TYPE_NM = testString,
                GDM_VRT_NM = testString,
                OP_CD = testString,
                PRD_CAT_MAP_SID = 1, // TODO: This is hard coded. Replace with new ids, once we have the AddProductCategories functionaility in a future sprint
                PRD_CAT_NM = testString
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


        [TestMethod]
        public void ProdCatLib_GetProductCategories()
		{
			List<ProductCategory> results = new ProductCategoriesLib().GetProductCategories();
			
			Assert.IsTrue(results.Any());
		}

        [TestMethod]
        public void ProdCatLib_MakeNewProductCategory()
		{
            //[TestCase(2)] // TODO: Test other counts once we are able to add new product Verticals and replace the hard coded Ids
            List<int> testData = new List<int> { 1 };

            List<ProductCategory> results = new List<ProductCategory>();

            foreach (int count in testData)
            {
                List<ProductCategory> pcList = MakeMulitpleNewProductCategories(count);

                results = new ProductCategoriesLib().UpdateProductCategories(pcList);

                Assert.IsTrue(results.Any());
            }
        }
		
    }
}
