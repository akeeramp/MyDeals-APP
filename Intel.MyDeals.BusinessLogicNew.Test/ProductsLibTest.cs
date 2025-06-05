using System;
using System.Collections.Generic;
using NUnit.Framework;
using Moq;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.BusinessLogic;
using System.Collections;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class ProductsLibTest
    {
        public Mock<IProductDataLib> mockProductDataLib = new Mock<IProductDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        public Mock<IConstantsLookupsLib> mockConstantsLookupsLib = new Mock<IConstantsLookupsLib>();

        [Test, TestCase(true), TestCase(false)]
        public void GetProducts_ShouldReturnNotNull(bool cachedData)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            if (!cachedData)
            {
                mockProductDataLib.Setup(x => x.GetProducts()).Returns(mockedProdData);
                mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
                var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProducts(cachedData);
                Assert.IsNotNull(res);
            }
            else
            {
                mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
                var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProducts();
                Assert.IsNotNull(res);
            }
        }

        [Test, TestCase(true), TestCase(false)]
        public void GetProductsDetails_ShouldReturnNotNull(bool cachedData)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            if (!cachedData)
            {
                mockProductDataLib.Setup(x => x.GetProducts()).Returns(mockedProdData);
                mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
                var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsDetails(cachedData);
                Assert.IsNotNull(res);
            }
            else
            {
                mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
                var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsDetails();
                Assert.IsNotNull(res);
            }
        }

        private static readonly object[] GetProductsByIdsParams =
        {
            new object[] {new List<int> {}},
            new object[] {new List<int> {1}},
            new object[] {new List<int> {1,2}}
        };
        //convert input type to ienum
        [Test,
            TestCaseSource("GetProductsByIdsParams")]
        public void GetProductsByIds_ShouldReturnNotNull(dynamic data)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsByIds(data);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(1)]
        public void GetProduct_ShouldReturnNotNull(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProduct(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(3)]
        public void GetProduct_ShouldReturnNull(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProduct(sid);
            Assert.IsNull(res);
        }

        [Test]
        public void GetProductsActive_ShouldReturnNotNull()
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsActive();
            Assert.IsNotNull(res);
            Assert.AreEqual(res.Count, 2);
        }

        private static readonly object[] objSearchParams =
        {
            new object[] {
                null
            }
        };


        [Test, TestCaseSource("objSearchParams")]
        public void GetProductByCategoryName_ShouldBeEmpty_WhenInvalidName(dynamic data)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByCategoryName(data);
            Assert.IsNull(res);

        }

        [Test, TestCase(1)]
        public void GetProductByCategorySid_ShouldReturnNotNull_WhenValidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByCategorySid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(100)]
        public void GetProductByCategorySid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByCategorySid(sid);
            Assert.IsEmpty(res);

        }

        [Test, TestCase("family_name_1")]
        public void GetProductByFamilyName_ShouldReturnNotNull_WhenValidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByFamilyName(name);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("wrong_family_name")]
        public void GetProductByFamilyName_ShouldBeEmpty_WhenInvalidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByFamilyName(name);
            Assert.IsEmpty(res);
        }

        [Test, TestCase(1)]
        public void GetProductByFamilySid_ShouldReturnNotNull_WhenValidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByFamilySid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(100)]
        public void GetProductByFamilySid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByFamilySid(sid);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("brand_name_2")]
        public void GetProductByBrandName_ShouldReturnNotNull_WhenValidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByBrandName(name);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("invalid_name")]
        public void GetProductByBrandName_ShouldBeEmpty_WhenInvalidId(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByBrandName(name);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("1")]
        public void GetProductByBrandSid_ShouldReturnNotNull_WhenValidName(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByBrandSid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("1000")]
        public void GetProductByBrandSid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByBrandSid(sid);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("name_1")]
        public void GetProductByProcessorNumberName_ShouldReturnNotNull_WhenValidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByProcessorNumberName(name);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("1000")]
        public void GetProductByProcessorNumberName_ShouldBeEmpty_WhenInvalidId(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByProcessorNumberName(name);
            Assert.IsEmpty(res);
        }

        [Test, TestCase(1)]
        public void GetProductByProcessorNumberSid_ShouldReturnNotNull_WhenValidName(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByProcessorNumberSid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(1000)]
        public void GetProductByProcessorNumberSid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByProcessorNumberSid(sid);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("type_3")]
        public void GetProductByDealProductTypeName_ShouldReturnNotNull_WhenValidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductTypeName(name);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("invalid_input")]
        public void GetProductByDealProductTypeName_ShouldBeEmpty_WhenInvalidId(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductTypeName(name);
            Assert.IsEmpty(res);
        }

        [Test, TestCase(1)]
        public void GetProductByDealProductTypeSid_ShouldReturnNotNull_WhenValidName(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductTypeSid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(10000)]
        public void GetProductByDealProductTypeSid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductTypeSid(sid);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("deal_prd_name_1")]
        public void GetProductByDealProductName_ShouldReturnNotNull_WhenValidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductName(name);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("invalid_name")]
        public void GetProductByDealProductName_ShouldBeEmpty_WhenInvalidName(string name)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductName(name);
            Assert.IsEmpty(res);
        }

        [Test, TestCase(1)]
        public void GetProductByDealProductNameSid_ShouldReturnNotNull_WhenValidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductNameSid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(1000)]
        public void GetProductByDealProductNameSid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByDealProductNameSid(sid);
            Assert.IsEmpty(res);
        }

        [Test, TestCase("1")]
        public void GetProductByMaterialIdName_ShouldReturnNotNull_WhenValidId(string id)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByMaterialIdName(id);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("1000")]
        public void GetProductByMaterialIdName_ShouldBeEmpty_WhenInvalidId(string id)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByMaterialIdName(id);
            Assert.IsEmpty(res);
        }

        [Test, TestCase(3)]
        public void GetProductByMaterialIdSid_ShouldReturnNotNull_WhenValidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByMaterialIdSid(sid);
            Assert.IsNotNull(res);
        }

        [Test, TestCase(1000)]
        public void GetProductByMaterialIdSid_ShouldBeEmpty_WhenInvalidId(int sid)
        {
            List<Product> mockedProdData = GetProductsMockedData();
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockedProdData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductByMaterialIdSid(sid);
            Assert.IsEmpty(res);
        }

        private static readonly object[] _GetProdDetailsParams =
        {
            new object[] {new List<ProductEntryAttribute> {} ,1, "deal_type_1", true}
        };

        [Test, TestCaseSource("_GetProdDetailsParams")]
        public void GetProductDetails_ShouldReturnNotNull(dynamic data)
        {
            List<PRD_TRANSLATION_RESULTS> mockedProdTranslationData = GetProductTranslationMockedData();
            mockProductDataLib.Setup(x => x.GetProductDetails(It.IsAny<List<ProductEntryAttribute>>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool>())).Returns(mockedProdTranslationData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductDetails(data[0], data[1], data[2], data[3]);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("searchText", true), TestCase("searchText", false)]
        public void IsProductNamePartiallyExists_ShouldReturnFalse_IfProductNameDoesNotContainSearchText(string searchText, bool isEPMsearch)
        {
            var mockData = new Dictionary<string, string>();
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).IsProductNamePartiallyExists(searchText, isEPMsearch);
            Assert.IsFalse(res);
        }

        [Test,
            TestCase("searchText", false)]
        public void IsProductNamePartiallyExists_ShouldReturnFalse_If_EPM_NM_StringFoundAndEPMsearchIsFalse(string searchText, bool isEPMsearch)
        {
            var mockData = new Dictionary<string, string>()
            {
                { "i3-1305U", "EPM_NM" } //ProductHierarchyLevelsEnum.EPM_NM
            };
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).IsProductNamePartiallyExists(searchText, isEPMsearch);
            Assert.IsFalse(res);
        }

        [Test,
            TestCase("i3", true), TestCase("i3", false)]
        public void IsProductNamePartiallyExists_ShouldReturnTrue_IfProductNameContainsSearchText(string searchText, bool isEPMsearch)
        {
            var mockData = new Dictionary<string, string>()
            {
                { "i3-1305U", "Intel® Core™ i3-1305U Processor (10M Cache, up to 4.50 GHz) FC-BGA16F, Tray" } //Product and EPM Name
            };
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).IsProductNamePartiallyExists(searchText, isEPMsearch);
            Assert.IsTrue(res);
        }

        [Test, TestCase("searchText")]
        public void IsProductExistsInMydeals_ShouldReturnFalse_ForNonMatchingKey(string searchText)
        {
            var mockData = new Dictionary<string, string>();
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).IsProductExistsInMydeals(searchText);
            Assert.IsFalse(res);
        }

        [Test, TestCase("i3-1305U")]
        public void IsProductExistsInMydeals_ShouldReturnTrue_ForMatchingKey(string searchText)
        {
            var mockData = new Dictionary<string, string>()
            {
                { "i3-1305U", "Intel® Core™ i3-1305U Processor (10M Cache, up to 4.50 GHz) FC-BGA16F, Tray" } //Product and EPM Name
            };
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).IsProductExistsInMydeals(searchText);
            Assert.IsTrue(res);
        }

        //TransformProducts()

        private static readonly object[] SetIncludeAttibuteParams =
        {
            new List<ProductIncExcAttribute>()
        };

        [Test, TestCaseSource("SetIncludeAttibuteParams")]
        public void SetIncludeAttibute_ShouldReturnNotNull(List<ProductIncExcAttribute> data)
        {
            List<ProductIncExcAttribute> mockData = new List<ProductIncExcAttribute>();
            mockProductDataLib.Setup(x => x.SetIncludeExclude(It.IsAny<List<ProductIncExcAttribute>>(), "INCLUDE")).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).SetIncludeAttibute(data);
            Assert.IsNotNull(res);
        }

        private static readonly object[] SetExcludeAttibuteParams =
        {
            new List<ProductIncExcAttribute>()
        };

        [Test,
            TestCaseSource("SetExcludeAttibuteParams")]
        public void SetExcludeAttibute_ShouldReturnNotNull(dynamic data)
        {
            var mockData = new List<ProductIncExcAttribute>();
            mockProductDataLib.Setup(x => x.SetIncludeExclude(It.IsAny<List<ProductIncExcAttribute>>(), It.IsAny<string>())).Returns(mockData);
            var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).SetExcludeAttibute(data);
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetProductIncludeExcludeAttribute_ShouldReturnNotNull()
        {
            var mockData = new ProductIncExcAttributeSelector();
            mockProductDataLib.Setup(x => x.GetProductIncludeExcludeAttribute()).Returns(mockData);
            var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductIncludeExcludeAttribute();
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetProdDealType_ShouldReturnNotNull()
        {
            var mockData = new List<PrdDealType>();
            mockProductDataLib.Setup(x => x.GetProdDealType()).Returns(mockData);
            var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProdDealType();
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(5)]
        public void GetProdSelectionLevel_ShouldReturnNotNull(int OBJ_SET_TYPE_SID)
        {
            var mockData = new List<PrdSelLevel>();
            mockProductDataLib.Setup(x => x.GetProdSelectionLevel(It.IsAny<int>())).Returns(mockData);
            var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProdSelectionLevel(OBJ_SET_TYPE_SID);
            Assert.IsNotNull(result);
        }

        private static readonly object[] SetProductAliasParams =
        {
            new object[] {
                CrudModes.Insert, new ProductAlias(){
                    PRD_NM = "i3",
                    PRD_ALS_NM = "i3-core"
                }
            },
            new object[] {
                CrudModes.Update, new ProductAlias(){
                    PRD_NM = "i3",
                    PRD_ALS_NM = "i3-core"
                }
            }
        };

        [Test, TestCaseSource("SetProductAliasParams")]
        public void SetProductAlias_ShouldThrowException_ForProductNameNotExistingInMyDeals(dynamic data)
        {
            var crudmode = data[0];
            var ProductAliasData = data[1];
            var mockData = new List<ProductAlias>()
            {
                new ProductAlias
                {
                    PRD_NM = "i5"
                }
            };
            mockProductDataLib.Setup(x => x.SetProductAlias(It.IsAny<CrudModes>(), It.IsAny<ProductAlias>())).Returns(mockData);
            var ex = Assert.Throws<Exception>(() => new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).SetProductAlias(crudmode, ProductAliasData));
            Assert.That(ex.Message, Is.EqualTo($"The product name \"{ProductAliasData.PRD_NM}\" you are trying to map does not exists in Mydeals."));
        }

        [Test, TestCaseSource("SetProductAliasParams")]
        public void SetProductAlias_ShouldThrowException_ForValidProductAliasNameInMyDeals(dynamic data)
        {
            var crudmode = data[0];
            var ProductAliasData = data[1];
            var mockData = new List<ProductAlias>()
            {
                new ProductAlias
                {
                    PRD_NM = "i3",
                    PRD_ALS_NM = "i5-core"
                }
            };
            mockProductDataLib.Setup(x => x.SetProductAlias(It.IsAny<CrudModes>(), It.IsAny<ProductAlias>())).Returns(mockData);
            var ex = Assert.Throws<Exception>(() => new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).SetProductAlias(crudmode, ProductAliasData));
            Assert.That(ex.Message, Is.EqualTo($" \"{ProductAliasData.PRD_ALS_NM}\" is valid product name in MyDeals, this cannot be added as alias name."));
        }

        private static readonly object[] SetProductAliasParams2 =
        {
            new object[] {
                CrudModes.Select, new ProductAlias()
            },
            new object[] {
                CrudModes.Delete, new ProductAlias()
            },
            new object[] {
                CrudModes.Insert, new ProductAlias()
            },
            new object[] {
                CrudModes.Update, new ProductAlias()
            }
        };

        [Test, TestCaseSource("SetProductAliasParams2")]
        public void SetProductAlias_ShouldReturnNotNull(dynamic data)
        {
            var crudmode = data[0];
            var ProductAliasData = data[1];
            var mockData = new List<ProductAlias>()
            {
                new ProductAlias()
            };
            mockProductDataLib.Setup(x => x.SetProductAlias(It.IsAny<CrudModes>(), It.IsAny<ProductAlias>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).SetProductAlias(crudmode, ProductAliasData);
            Assert.NotNull(res);
        }

        [Test,
            TestCase(true), TestCase(false)]
        public void GetProductsFromAlias_ShouldReturnNotNull(bool getCachedResult)
        {
            var mockData = new List<ProductAlias>();
            if (!getCachedResult)
            {
                mockProductDataLib.Setup(x => x.GetProductsFromAlias()).Returns(mockData);
                var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsFromAlias(getCachedResult);
                Assert.IsNotNull(result);
            }
            else
            {
                mockDataCollectionsDataLib.Setup(x => x.GetProductsFromAlias()).Returns(mockData);
                var result = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductsFromAlias(getCachedResult);
                Assert.IsNotNull(result);
            }
        }

        [Test]
        public void GetProductSelectorWrapper_ShouldReturnNotNull()
        {
            var mockData = new ProductSelectorWrapper();
            mockDataCollectionsDataLib.Setup(x => x.GetProductSelectorWrapper()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductSelectorWrapper();
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetProductSelectorWrapperDensityParams =
        {
            new object[] {
                new DateTime(2022, 1, 1), new DateTime(2023, 1, 1), "TRAY"
            }
        };
        [Test, TestCaseSource("GetProductSelectorWrapperDensityParams")]
        public void GetProductSelectorWrapperDensity_ShouldReturnNotNull(dynamic data)
        {
            var startDate = data[0];
            var endDate = data[1];
            var mediaCode = data[2];
            var mockData = new ProductSelectorWrapper();
            mockDataCollectionsDataLib.Setup(x => x.GetProductSelectorWrapperDensity(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<string>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductSelectorWrapperDensity(startDate, endDate, mediaCode);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetProductSelectorWrapperByDatesParams =
        {
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01),"TRAY", "DENSITY" },
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01),"BOX", "DENSITY" },
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01), "EIA CPU", "DENSITY" },
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01),"TRAY", "ECAP" },
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01),"BOX", "ECAP" },
            new object[] { new DateTime(2022, 01, 01), new DateTime(2023, 01, 01), "EIA CPU", "ECAP" }
        };
        [Test, 
            TestCaseSource("GetProductSelectorWrapperByDatesParams")]
        public void GetProductSelectorWrapperByDates_ShouldReturnCountGreaterThanZero(dynamic data)
        {
            var startDate = data[0];
            var endDate = data[1];
            var mediaCode = data[2];
            var dealType = data[3];
            var mockData = GetProductSelectorWrapperByDatesMockedData();
            mockDataCollectionsDataLib.Setup(x=>x.GetProductSelectorWrapperDensity(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<string>())).Returns(mockData);
            mockDataCollectionsDataLib.Setup(x => x.GetProductSelectorWrapper()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductSelectorWrapperByDates(startDate, endDate, mediaCode, dealType);
            Assert.IsNotNull(res);
            Assert.Greater(res.ProductSelectionLevels.Count, 0);
            Assert.Greater(res.ProductSelectionLevelsAttributes.Count, 0);
        }

        private static readonly object[] GetProductSelectorWrapperByDatesParams2 =
        {
            new object[] { new DateTime(), new DateTime(), "EIA CPU", "ECAP" },
            new object[] { new DateTime(), new DateTime(), "TRAY", "ECAP" },
            new object[] { new DateTime(), new DateTime(),"BOX", "ECAP" },
            new object[] { new DateTime(2024, 01, 01), new DateTime(2024, 01, 01), "EIA CPU", "ECAP" },
            new object[] { new DateTime(2024, 01, 01), new DateTime(2024, 01, 01), "TRAY", "ECAP" },
            new object[] { new DateTime(2024, 01, 01), new DateTime(2024, 01, 01),"BOX", "ECAP" }
        };
        [Test, 
            TestCaseSource("GetProductSelectorWrapperByDatesParams2")]
        public void GetProductSelectorWrapperByDates_ShouldReturnCountZero(dynamic data)
        {
            var startDate = data[0];
            var endDate = data[1];
            var mediaCode = data[2];
            var dealType = data[3];
            var mockData = GetProductSelectorWrapperByDatesMockedData();
            mockDataCollectionsDataLib.Setup(x=>x.GetProductSelectorWrapperDensity(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<string>())).Returns(mockData);
            mockDataCollectionsDataLib.Setup(x => x.GetProductSelectorWrapper()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductSelectorWrapperByDates(startDate, endDate, mediaCode, dealType);
            Assert.IsNotNull(res);
            Assert.AreEqual(res.ProductSelectionLevels.Count, 0);
            Assert.AreEqual(res.ProductSelectionLevelsAttributes.Count, 0);
        }

        private static readonly object[] GetProductCAPYCS2DataParams =
        {
            new object[] {
                new List<ProductCAPYCS2Calc>(), "getAvailable", "priceCondition"
            }
        };
        [Test, TestCaseSource("GetProductCAPYCS2DataParams")]
        public void GetProductCAPYCS2Data_ShouldReturnNotNull(dynamic data)
        {
            List<ProductCAPYCS2Calc> productCAPCalc = data[0];
            string getAvailable = data[1];
            string priceCondition = data[2];

            var mockData = new List<ProductCAPYCS2>();
            mockProductDataLib.Setup(x => x.GetProductCAPYCS2Data(It.IsAny<List<ProductCAPYCS2Calc>>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductCAPYCS2Data(productCAPCalc, getAvailable, priceCondition);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetCAPForProductParams =
        {
            new object[] {
                10, 12, "GEO_MBR_SID", new DateTime(2022, 1, 1), new DateTime(2023, 1, 1)
            }
        };
        [Test, TestCaseSource("GetCAPForProductParams")]
        public void GetCAPForProduct_ShouldReturnNotNull(dynamic data)
        {
            var PRD_MBR_SID = data[0];
            var CUST_CD = data[1];
            var GEO_MBR_SID = data[2];
            var START_DT = data[3];
            var END_DT = data[4];
            var mockData = new List<ProductCAPYCS2>();
            mockProductDataLib.Setup(x => x.GetCAPForProduct(It.IsAny<List<ProductCAPYCS2Calc>>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetCAPForProduct(PRD_MBR_SID, CUST_CD, GEO_MBR_SID, START_DT, END_DT);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetProductAttributesParams =
        {
            new object[] {
                new List<PRD_LOOKUP_RESULTS>
                {
                    new PRD_LOOKUP_RESULTS {
                        PRD_MBR_SID = 10,
                        CAP = "CAP"
                    }
                }
            }
        };
        [Test, TestCaseSource("GetProductAttributesParams")]
        public void GetProductAttributes_ShouldReturnNotNull(dynamic product)
        {
            List<Product> mockData = new List<Product>
            {
                new Product
                {
                    PRD_MBR_SID = 10,
                    BRND_NM = "brandName"
                }
            };
            mockDataCollectionsDataLib.Setup(x => x.GetProductData()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductAttributes(product);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetAutcorrectedSugestionsParams =
        {
            new object[] {
                "abcd", new Dictionary<string, string>()
                {
                    ["abc"] = "efghijklmnop"
                }
            },
            new object[] {
                "bcde", new Dictionary<string, string>()
                {
                    ["bc"] = "fghj"
                }
            },
            new object[] {
                "dcba", new Dictionary<string, string>()
                {
                    ["da"] = "fghj"
                }
            },
            new object[] {
                "as", new Dictionary<string, string>()
                {
                    ["asb"] = null
                }
            },
            new object[] {
                "match", new Dictionary<string, string>()
                {
                    ["match"] = "random"
                }
            }
        };
        [Test, TestCaseSource("GetAutcorrectedSugestionsParams")]
        public void GetAutcorrectedSugestions_ShouldReturnCountOne(dynamic data)
        {
            var searchText = data[0];
            var searchString = data[1];
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetAutcorrectedSugestions(searchText, searchString);
            Assert.IsNotNull(res);
            Assert.AreEqual(res.Count, 1);
        }
        
        private static readonly object[] GetAutcorrectedSugestionsParam =
        {
            new object[] {
                "ac", new Dictionary<string, string>()
                {
                    ["fg"] = "ac"
                }
            },
            new object[] {
                "dcab", new Dictionary<string, string>()
                {
                    ["c"] = "ac"
                }
            },
            new object[] {
                "abcd", new Dictionary<string, string>()
                {
                    ["dcba"] = "ac"
                }
            },
            new object[] {
                "asf", new Dictionary<string, string>()
                {
                    ["asfgd"] = "fghj"
                }
            }
        };
        [Test, TestCaseSource("GetAutcorrectedSugestionsParam")]
        public void GetAutcorrectedSugestions_ShouldReturnCountZero(dynamic data)
        {
            var searchText = data[0];
            var searchString = data[1];
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetAutcorrectedSugestions(searchText, searchString);
            Assert.IsNotNull(res);
            Assert.AreEqual(res.Count, 0);
        }

        [Test]
        public void GetSearchString_ShouldReturnNotNull()
        {
            var mockData = new Dictionary<string, string>();
            mockDataCollectionsDataLib.Setup(x => x.GetSearchString()).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetSearchString();
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetEngProductsParam =
        {
            new object[] {
                new List<int> {1,2}
            }
        };
        [Test, TestCaseSource("GetEngProductsParam")]
        public void GetEngProducts_ReturnsNotNull(dynamic prds)
        {
            var mockData = new List<ProductEngName>();
            mockProductDataLib.Setup(x => x.GetEngProducts(It.IsAny<List<int>>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetEngProducts(prds);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetDealProductsParams =
        {
            new object[] {
                10, OpDataElementType.DEAL, 10, true
            }
        };
        [Test, TestCaseSource("GetDealProductsParams")]
        public void GetDealProducts_ReturnsNotNull(dynamic data)
        {
            var objSid = data[0];
            var objTypeSid = data[1];
            var custId = data[2];
            var isMissingFlag = data[3];
            var mockData = new List<DealProducts>();
            mockProductDataLib.Setup(x => x.GetDealProducts(It.IsAny<int>(), It.IsAny<OpDataElementType>(), It.IsAny<int>(), It.IsAny<bool>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetDealProducts(objSid, objTypeSid, custId, isMissingFlag);
            Assert.IsNotNull(res);
        }

        private static readonly object[] GetProductOVLPValidationParams =
        {
            new object[] {
                new ProductOVLPValidation()
            }
        };
        [Test, TestCaseSource("GetProductOVLPValidationParams")]
        public void GetProductOVLPValidation_ReturnsNotNull(dynamic objProductOVLPValidation)
        {
            var mockData = new List<FlexProdOvlp>();
            mockProductDataLib.Setup(x => x.GetProductOVLPValidation(It.IsAny<ProductOVLPValidation>())).Returns(mockData);
            var res = new ProductsLib(mockProductDataLib.Object, mockDataCollectionsDataLib.Object, mockConstantsLookupsLib.Object).GetProductOVLPValidation(objProductOVLPValidation);
            Assert.IsNotNull(res);
        }

        //Render full data objects.
        private List<Product> GetProductsMockedData()
        {
            var productMockedData = new List<Product>();
            productMockedData.Add(new Product
            {
                ACTV_IND = true,
                PRD_MBR_SID = 1,
                PRD_CAT_NM = "one",
                PRD_CAT_NM_SID = 1,
                FMLY_NM = "family_name_1",
                FMLY_NM_SID = 1,
                BRND_NM = "brand_name_1",
                BRND_NM_SID = 1,
                PCSR_NBR = "name_1",
                PCSR_NBR_SID = 1,
                DEAL_PRD_TYPE = "type_1",
                DEAL_PRD_TYPE_SID = 1,
                DEAL_PRD_NM = "deal_prd_name_1",
                DEAL_PRD_NM_SID = 1,
                MTRL_ID = "1",
                MTRL_ID_SID = 1
            }
            );
            productMockedData.Add(new Product
            {
                ACTV_IND = true,
                PRD_MBR_SID = 2,
                PRD_CAT_NM = "two",
                PRD_CAT_NM_SID = 2,
                FMLY_NM = "family_name_2",
                FMLY_NM_SID = 2,
                BRND_NM = "brand_name_2",
                BRND_NM_SID = 2,
                PCSR_NBR = "name_2",
                PCSR_NBR_SID = 2,
                DEAL_PRD_TYPE = "type_2",
                DEAL_PRD_TYPE_SID = 2,
                DEAL_PRD_NM = "deal_prd_name_2",
                DEAL_PRD_NM_SID = 2,
                MTRL_ID = "2",
                MTRL_ID_SID = 2
            }
            );
            productMockedData.Add(new Product
            {
                ACTV_IND = false,
                PRD_MBR_SID = 1,
                PRD_CAT_NM = "three",
                PRD_CAT_NM_SID = 3,
                FMLY_NM = "family_name_3",
                FMLY_NM_SID = 3,
                BRND_NM = "brand_name_3",
                BRND_NM_SID = 3,
                PCSR_NBR = "name_3",
                PCSR_NBR_SID = 3,
                DEAL_PRD_TYPE = "type_3",
                DEAL_PRD_TYPE_SID = 3,
                DEAL_PRD_NM = "deal_prd_name_3",
                DEAL_PRD_NM_SID = 3,
                MTRL_ID = "3",
                MTRL_ID_SID = 3
            }
            );
            return productMockedData;
        }

        private List<PRD_TRANSLATION_RESULTS> GetProductTranslationMockedData()
        {
            var productTranslationMockedData = new List<PRD_TRANSLATION_RESULTS>();
            productTranslationMockedData.Add(new PRD_TRANSLATION_RESULTS { });
            return productTranslationMockedData;
        }

        private ProductSelectorWrapper GetProductSelectorWrapperByDatesMockedData()
        {
            var data = new ProductSelectorWrapper
            {
                ProductSelectionLevels = new List<ProductSelectionLevels>
                {
                    new ProductSelectionLevels
                    {
                        PRD_STRT_DTM = new DateTime(2022, 01, 01),
                        PRD_END_DTM = new DateTime(2023, 01, 01),
                        TRAY_STRT_DT = new DateTime(2022, 12, 12),
                        TRAY_END_DT = new DateTime(2023, 12, 12),
                        BOX_STRD_DT = new DateTime(2022, 12, 12),
                        BOX_END_DT = new DateTime(2023, 12, 12),
                        DEAL_PRD_TYPE = "CPU"
                    },
                    new ProductSelectionLevels
                    {
                        PRD_STRT_DTM = new DateTime(2022, 01, 01),
                        PRD_END_DTM = new DateTime(2023, 01, 01),
                        TRAY_STRT_DT = new DateTime(2022, 12, 12),
                        TRAY_END_DT = new DateTime(2023, 12, 12),
                        BOX_STRD_DT = new DateTime(2022, 12, 12),
                        BOX_END_DT = new DateTime(2023, 12, 12),
                        DEAL_PRD_TYPE = "test"
                    }
                },
                ProductSelectionLevelsAttributes = new List<ProductSelectionLevelsAttributes>
                {
                    new ProductSelectionLevelsAttributes
                    {
                        PRD_STRT_DTM = new DateTime(2022, 01, 01),
                        PRD_END_DTM = new DateTime(2023, 01, 01),
                        TRAY_STRT_DT = new DateTime(2022, 12, 12),
                        TRAY_END_DT = new DateTime(2023, 12, 12),
                        BOX_STRD_DT = new DateTime(2022, 12, 12),
                        BOX_END_DT = new DateTime(2023, 12, 12),
                        PRD_CAT_NM = "CPU"
                    },
                    new ProductSelectionLevelsAttributes
                    {
                        PRD_STRT_DTM = new DateTime(2022, 01, 01),
                        PRD_END_DTM = new DateTime(2023, 01, 01),
                        TRAY_STRT_DT = new DateTime(2022, 12, 12),
                        TRAY_END_DT = new DateTime(2023, 12, 12),
                        BOX_STRD_DT = new DateTime(2022, 12, 12),
                        BOX_END_DT = new DateTime(2023, 12, 12),
                        PRD_CAT_NM = "test"
                    }
                }
            };
            return data;
        }
    }
}