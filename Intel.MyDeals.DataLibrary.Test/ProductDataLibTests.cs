using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class ProductDataLibTests
    {
        public ProductDataLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
        
        [TestMethod]
        public void ProductsGetAll()
        {
            IEnumerable<Product> results = new ProductDataLib().GetProducts();
            Assert.IsTrue(results.Any());
        }

    }
}
