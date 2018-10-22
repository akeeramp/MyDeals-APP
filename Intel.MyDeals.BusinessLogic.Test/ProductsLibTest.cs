using System;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    //[Ignore("Takes time to build")]
    [TestClass]
    public class ProductLibTests
    {
        public ProductLibTests()
        {
            Console.WriteLine("Started Product Lib tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        #region Get Products

        public void GetFirstProductBy(int prdLevel, out int prdSid, out string prdName)
        {
            IEnumerable<Product> resultsList = new ProductsLib().GetProductsActive();
            Product selectedProduct = resultsList.FirstOrDefault(p => p.PRD_ATRB_SID == prdLevel);
            switch (prdLevel)
            {
                case 7003: // Category level
                    prdSid = selectedProduct.PRD_CAT_NM_SID;
                    prdName = selectedProduct.PRD_CAT_NM;
                    break;
                case 7004: // Brand Level
                    prdSid = selectedProduct.BRND_NM_SID;
                    prdName = selectedProduct.BRND_NM;
                    break;
                case 7005: // Family Level
                    prdSid = selectedProduct.FMLY_NM_SID;
                    prdName = selectedProduct.FMLY_NM;
                    break;
                case 7006: // Processor level
                    prdSid = selectedProduct.PCSR_NBR_SID;
                    prdName = selectedProduct.PCSR_NBR;
                    break;
                case 7007: // Product Name level
                    prdSid = selectedProduct.DEAL_PRD_NM_SID;
                    prdName = selectedProduct.DEAL_PRD_NM;
                    break;
                case 7008: // Material level
                    prdSid = selectedProduct.MTRL_ID_SID;
                    prdName = selectedProduct.MTRL_ID;
                    break;
                default: // Assume 7002, Product Type
                    prdSid = selectedProduct.DEAL_PRD_TYPE_SID;
                    prdName = selectedProduct.DEAL_PRD_TYPE;
                    break;
            }
        }

        //[TestCase]
        [TestMethod]
        public void ProdLib_ProductsTesting()
        {
            int singleProdSid = 0;
            string singlePrdName = "";

            // First products call is expensive because it needs to load products cache (2 minutes run time)
            // After the load, all product items are cached for this instance
            IEnumerable<Product> resultsList = new ProductsLib().GetProducts();
            Assert.IsTrue(resultsList.Any(), "Failed ProductsLib().GetProducts Test");

            // Check fetching active products
            resultsList = new ProductsLib().GetProductsActive();
            Assert.IsTrue(resultsList.Any(), "Failed ProductsLib().GetProductsActive() Test");
            Assert.IsFalse(resultsList.Any(p => p.ACTV_IND == false), "Failed ProductsLib().GetProductsActive()");


            // Set Category (Vertical) Level name and sid (DT for example)
            GetFirstProductBy(7003, out singleProdSid, out singlePrdName); // 7003 is Product Category (Vertical) level

            // Check fetching a specific product (single node)
            Product singleProductResults = new ProductsLib().GetProduct(singleProdSid);
            Assert.IsTrue(singleProductResults != null && singleProductResults.PRD_MBR_SID == singleProdSid
                , "Failed ProductsLib().GetProduct(" + singleProdSid + ") Test");

            // Check fetching an entire category by name (list)
            resultsList = new ProductsLib().GetProductByCategoryName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.PRD_CAT_NM.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByCategoryName('" + singlePrdName + "') Test");

            // Check fetching an entire category by sid (list)
            resultsList = new ProductsLib().GetProductByCategorySid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.PRD_CAT_NM_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByCategorySid(" + singleProdSid + ") Test");



            // Set Brand Level name and sid (Atom for example)
            GetFirstProductBy(7004, out singleProdSid, out singlePrdName); // 7004 is Brand level

            // Check fetching an entire family by name (list)
            resultsList = new ProductsLib().GetProductByBrandName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.BRND_NM.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByBrandName('" + singlePrdName + "') Test");

            // Check fetching an entire family by sid (list)
            resultsList = new ProductsLib().GetProductByBrandSid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.BRND_NM_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByBrandSid(" + singleProdSid + ") Test");



            // Set Family Level name and sid (Diamondville-DC for example)
            GetFirstProductBy(7005, out singleProdSid, out singlePrdName); // 7005 is Family level

            // Check fetching an entire family by name (list)
            resultsList = new ProductsLib().GetProductByFamilyName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.FMLY_NM.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByFamilyName('" + singlePrdName + "') Test");

            // Check fetching an entire family by sid (list)
            resultsList = new ProductsLib().GetProductByFamilySid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.FMLY_NM_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByFamilySid(" + singleProdSid + ") Test");



            // Set Processor Level name and sid (E3-1505 for example)
            GetFirstProductBy(7006, out singleProdSid, out singlePrdName); // 7006 is Processor level

            // Check fetching an entire processor by name (list)
            resultsList = new ProductsLib().GetProductByProcessorNumberName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.PCSR_NBR.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByProcessorNumberName('" + singlePrdName + "') Test");

            // Check fetching an entire processor by sid (list)
            resultsList = new ProductsLib().GetProductByProcessorNumberSid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.PCSR_NBR_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByProcessorNumberSid(" + singleProdSid + ") Test");



            // Set Product Type Level name and sid (CPU for example)
            GetFirstProductBy(7002, out singleProdSid, out singlePrdName); // 7002 is Product Type level

            // Check fetching an entire product type by name (list)
            resultsList = new ProductsLib().GetProductByDealProductTypeName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.DEAL_PRD_TYPE.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByDealProductTypeName('" + singlePrdName + "') Test");

            // Check fetching an entire product type by sid (list)
            resultsList = new ProductsLib().GetProductByDealProductTypeSid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.DEAL_PRD_TYPE_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByDealProductTypeSid(" + singleProdSid + ") Test");



            // Set Product Name Level name and sid (CL8066202399804 for example)
            GetFirstProductBy(7007, out singleProdSid, out singlePrdName); // 7007 is Product Name level

            // Check fetching an entire product name by name (list)
            resultsList = new ProductsLib().GetProductByDealProductName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.DEAL_PRD_NM.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByDealProductName('" + singlePrdName + "') Test");

            // Check fetching an entire product name by sid (list)
            resultsList = new ProductsLib().GetProductByDealProductNameSid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.DEAL_PRD_NM_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByDealProductNameSid(" + singleProdSid + ") Test");



            // Set Material Level name and sid (944067 for example)
            GetFirstProductBy(7008, out singleProdSid, out singlePrdName); // 7008 is Material level

            // Check fetching an entire material by name (list)
            resultsList = new ProductsLib().GetProductByMaterialIdName(singlePrdName);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.MTRL_ID.Contains(singlePrdName)).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByMaterialIdName('" + singlePrdName + "') Test");

            // Check fetching an entire material by sid (list)
            resultsList = new ProductsLib().GetProductByMaterialIdSid(singleProdSid);
            Assert.IsTrue(resultsList.Any() && resultsList.Where(r => r.MTRL_ID_SID == singleProdSid).Count() == resultsList.Count()
                , "Failed ProductsLib().GetProductByMaterialIdSid(" + singleProdSid + ") Test");
        }

        #endregion Get Products

        #region Product Selector

        // TO DO - Flesh out product selector testing

        /// <summary>
        /// Contract products translation to Mydeals Product
        /// </summary>
        /// <param name="contractProducts"></param>
        //[Test, TestCaseSource("_contarctProducts")]
        public void TranslateProducts(List<string> contractProducts)
        {
        }

        private static object[] _contarctProducts = {new object[] {new List<string> { "i7-4770(S/T)" } },  //case 1
                                     new object[] {new List<string> {"430"}} //case 2
                                 };

        #endregion Product Selector
    }
}