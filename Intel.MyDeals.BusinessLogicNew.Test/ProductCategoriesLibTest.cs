using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class ProductCategoriesLibTest
    {
        public Mock<IProductCategoriesDataLib> mockProductCategoriesDataLib = new Mock<IProductCategoriesDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test]
        public void GetProductCategories_ShouldReturnNotNull()
        {
            var mockData = GetProductCategoriesMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductCategories()).Returns(mockData);
            var result = new ProductCategoriesLib(mockProductCategoriesDataLib.Object, mockDataCollectionsDataLib.Object).GetProductCategories();
            Assert.NotNull(result);
        }
        [Test]
        public void GetProductCategoriesByPagination_ShouldReturnNotNull()
        {
            var mockData = GetProductCategoriesMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductCategories()).Returns(mockData);
            var result = new ProductCategoriesLib(mockProductCategoriesDataLib.Object, mockDataCollectionsDataLib.Object).GetProductCategories();
            Assert.NotNull(result);
        }
        [Test]
        public void GetProductCategoriesByFilter_ShouldReturnNotNull()
        {
            var mockData = new List<string>();
            string field = "GDM_VRT_NM";
            mockDataCollectionsDataLib.Setup(x => x.GetProductCategoriesByFilter(field)).Returns(mockData);
            var result = new ProductCategoriesLib(mockProductCategoriesDataLib.Object, mockDataCollectionsDataLib.Object).GetProductCategoriesByFilter(field);
            Assert.NotNull(result);
        }
        private static readonly object[] UpdateProductCategoriesParams =
        {
            new object[] { new List<ProductCategory> {
                    new ProductCategory
                    {
                        ACTV_IND = false,
                        CHG_DTM = new DateTime(2023),
                        CHG_EMP_NM = "chg_name",
                        DEAL_PRD_TYPE = "prodType",
                        DIV_NM = "div_name",
                        GDM_PRD_TYPE_NM = "prodTypeName",
                        GDM_VRT_NM = "verticalName",
                        OP_CD = "op_cd",
                        PRD_CAT_MAP_SID = 2,
                        PRD_CAT_NM = "prod_cat_name"
                    }
                }
            }
        };

        [Test,
            TestCaseSource("UpdateProductCategoriesParams")]
        public void UpdateProductCategories_ShouldReturnNotNull(dynamic categories)
        {
            var mockData = UpdateProductCategoriesMockData();
            mockProductCategoriesDataLib.Setup(x => x.UpdateProductCategories(It.IsAny<List<ProductCategory>>())).Returns(mockData);
            var result = new ProductCategoriesLib(mockProductCategoriesDataLib.Object, mockDataCollectionsDataLib.Object).UpdateProductCategories(categories);
            Assert.NotNull(result);
        }

        public List<ProductCategory> GetProductCategoriesMockData(){
            var mockData = new List<ProductCategory>
            {
                new ProductCategory
                {
                    ACTV_IND = true,
                    CHG_DTM = new DateTime(2021),
                    CHG_EMP_NM = "chg_name",
                    DEAL_PRD_TYPE = "prodType",
                    DIV_NM = "div_name",
                    GDM_PRD_TYPE_NM = "prodTypeName",
                    GDM_VRT_NM = "verticalName",
                    OP_CD = "op_cd",
                    PRD_CAT_MAP_SID = 3,
                    PRD_CAT_NM = "prod_cat_name"
                }
            };
            return mockData;
        }

        public List<ProductCategory> UpdateProductCategoriesMockData()
        {
            var mockData = new List<ProductCategory>
            {
                new ProductCategory
                {
                    ACTV_IND = true,
                    CHG_DTM = new DateTime(2022),
                    CHG_EMP_NM = "chg_name",
                    DEAL_PRD_TYPE = "prodType",
                    DIV_NM = "div_name",
                    GDM_PRD_TYPE_NM = "prodTypeName",
                    GDM_VRT_NM = "verticalName",
                    OP_CD = "op_cd",
                    PRD_CAT_MAP_SID = 1,
                    PRD_CAT_NM = "prod_cat_name"
                }
            };
            return mockData;
        }
    }
}
