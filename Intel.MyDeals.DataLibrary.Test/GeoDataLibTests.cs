using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class GeoDataLibTests
    {
        public GeoDataLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
        
        [TestMethod]
        public void GeosGetAll()
        {
            IEnumerable<GeoDimension> results = new GeoDataLib().GetGeoDimensions();
            Assert.IsTrue(results.Any());
        }

    }
}
