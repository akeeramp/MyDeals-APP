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

        [TestMethod]
        public void GeosGetActive()
        {
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionsActive();
            Assert.IsTrue(results.Any());
        }

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

        [TestMethod]
        public void GeosGetByGeoSid()
        {
            int sid = 7; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByGeoSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.GEO_NM_SID == sid).Count() == results.Count());
        }

        [TestMethod]
        public void GeosGetByRegionName()
        {
            string name = "Latin Amer"; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByRegionName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.RGN_NM == name).Count() == results.Count());
        }

        [TestMethod]
        public void GeosGetByRegionSid()
        {
            int sid = 9; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByRegionSid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.RGN_NM_SID == sid).Count() == results.Count());
        }

        [TestMethod]
        public void GeosGetByCountryName()
        {
            string name = "Peru"; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByCountryName(name);
            Assert.IsTrue(results.Any() && results.Where(r => r.CTRY_NM == name).Count() == results.Count());
        }

        [TestMethod]
        public void GeosGetByCountrySid()
        {
            int sid = 56; //TODO: replace with test data value
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByCountrySid(sid);
            Assert.IsTrue(results.Any() && results.Where(r => r.CTRY_NM_SID == sid).Count() == results.Count());
        }

        #endregion

    }
}
