using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class ProductLibTests
    {
        public ProductLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        #region Get Products

        [TestMethod]
        public void ProductsGetAll()
        {
            IEnumerable<Product> results = new ProductsLib().GetProducts();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void ProductsGetActive()
        {
            IEnumerable<Product> results = new ProductsLib().GetProductsActive();
            Assert.IsTrue(results.Any());
        }

        //TODO: The below have tentatively hardcoded sid/name/etc values that the tests search for.  We need to inject our own test data that is guaranteed to be in the db every time the test is run.

        [TestMethod]
        public void ProductsGetSpecific()
        {
            int sid = 1; //TODO: replace with test data value
            Product results = new ProductsLib().GetProduct(sid);
            Assert.IsTrue(results != null && results.PRD_MBR_SID == sid);
        }

        [TestMethod]
        public void ProductsGetByCategoryName()
        {
            string name = "NAND"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByCategoryName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRD_CATGRY_NM.Contains(name)).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByCategorySid()
        {
            int sid = 9; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByCategorySid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRD_CATGRY_NM_SID == sid).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByFamilyName()
        {
            string name = "SandyBridge"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByFamilyName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.FMLY_NM.Contains(name)).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByFamilySid()
        {
            int sid = 18; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByFamilySid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.FMLY_NM_SID == sid).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByBrandName()
        {
            string name = "Atom"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByBrandName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.BRND_NM.Contains(name)).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByBrandSid()
        {
            int sid = 17; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByBrandSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.BRND_NM_SID == sid).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByProcessorNumberName()
        {
            string name = "i7-6700K"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByProcessorNumberName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRCSSR_NBR.Contains(name)).Count() == results.Count());
        }

        [TestMethod]
        public void ProductsGetByProcessorNumberSid()
        {
            int sid = 56345; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByProcessorNumberSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRCSSR_NBR_SID == sid).Count() == results.Count());
        }

        #endregion

    }
}
