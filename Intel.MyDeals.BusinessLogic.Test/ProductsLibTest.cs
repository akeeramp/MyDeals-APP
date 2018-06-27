using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [Ignore("Takes time to build")]
    public class ProductLibTests
    {
        public ProductLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        #region Get Products

        [TestCase]
        public void ProductsGetAll()
        {
            IEnumerable<Product> results = new ProductsLib().GetProducts();
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void ProductsGetActive()
        {
            IEnumerable<Product> results = new ProductsLib().GetProductsActive();
            Assert.IsTrue(results.Any());
        }

        //TODO: The below have tentatively hardcoded sid/name/etc values that the tests search for.  We need to inject our own test data that is guaranteed to be in the db every time the test is run.

        [TestCase]
        public void ProductsGetSpecific()
        {
            int sid = 1; //TODO: replace with test data value
            Product results = new ProductsLib().GetProduct(sid);
            Assert.IsTrue(results != null && results.PRD_MBR_SID == sid);
        }

        [TestCase]
        public void ProductsGetByCategoryName()
        {
            string name = "NAND"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByCategoryName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRD_CAT_NM.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByCategorySid()
        {
            int sid = 9; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByCategorySid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.PRD_CAT_NM_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByFamilyName()
        {
            string name = "SandyBridge"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByFamilyName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.FMLY_NM.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByFamilySid()
        {
            int sid = 18; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByFamilySid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.FMLY_NM_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByBrandName()
        {
            string name = "Atom"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByBrandName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.BRND_NM.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByBrandSid()
        {
            int sid = 17; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByBrandSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.BRND_NM_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByProcessorNumberName()
        {
            string name = "i7-6700K"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByProcessorNumberName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.PCSR_NBR.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByProcessorNumberSid()
        {
            int sid = 56345; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByProcessorNumberSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.PCSR_NBR_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByDealProductTypeName()
        {
            string name = "CPU"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByDealProductTypeName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.DEAL_PRD_TYPE.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByDealProductTypeSid()
        {
            int sid = 3; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByDealProductTypeSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.DEAL_PRD_TYPE_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByDealProductName()
        {
            string name = "MKLWG"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByDealProductName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.DEAL_PRD_NM.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByDealProductNameSid()
        {
            int sid = 46882; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByDealProductNameSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.DEAL_PRD_NM_SID == sid).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByMaterialIdName()
        {
            string name = "892544"; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByMaterialIdName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.MTRL_ID.Contains(name)).Count() == results.Count());
        }

        [TestCase]
        public void ProductsGetByMaterialIdSid()
        {
            int sid = 4325; //TODO: replace with test data value
            IEnumerable<Product> results = new ProductsLib().GetProductByMaterialIdSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.MTRL_ID_SID == sid).Count() == results.Count());
        }

        #endregion Get Products

        #region Product Selector

        /// <summary>
        /// Contract products translation to Mydeals Product
        /// </summary>
        /// <param name="contractProducts"></param>
        [Test, TestCaseSource("_contarctProducts")]
        public void TranslateProducts(List<string> contractProducts)
        {
        }

        private static object[] _contarctProducts = {new object[] {new List<string> { "i7-4770(S/T)" } },  //case 1
                                     new object[] {new List<string> {"430"}} //case 2
                                 };

        #endregion Product Selector
    }
}