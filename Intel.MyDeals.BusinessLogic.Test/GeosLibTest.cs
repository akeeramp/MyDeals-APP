using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class GeoLibTests
    {
        public GeoLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        #region Get Geos

        [TestMethod]
        public void GeosGetAll()
        {
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensions();
            Assert.IsTrue(results.Any());
        }

        //TODO: once the final version of Geo Dimensions is crafted and more columns are added, we will be able to add more specific filters.
        //[TestMethod]
        //public void GeosGetActive()
        //{
        //    IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionsActive();
        //    Assert.IsTrue(results.Any());
        //}

        //TODO: The below have tentatively hardcoded sid/name/etc values that the tests search for.  We need to inject our own test data that is guaranteed to be in the db every time the test is run.

        [TestMethod]
        public void GeosGetSpecific()
        {
            int sid = 1; //TODO: replace with test data value
            GeoDimension results = new GeosLib().GetGeoDimension(sid);
            Assert.IsTrue(results != null && results.GEO_MBR_SID == sid);
        }

        [TestMethod]
        public void GeosGetByGeoName()
        {
            string name = "APAC"; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByGeoName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.GEO_NM == name).Count() == results.Count());
        }
        
        #endregion
        
    }
}
