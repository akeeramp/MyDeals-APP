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
        public void GeoLib_GetGeoCalls()
        {
            // Check Get all geos
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensions();
            Assert.IsTrue(geosListResults.Any());

            // Check fetching only active geos
            geosListResults = new GeosLib().GetGeoDimensionsActive();
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Where(g => g.ACTV_IND == false).Any());

            // Check single item back
            int peruGeoDimSid = 56; // Sid 56 = 'Peru'
            GeoDimension singleGeoResults = new GeosLib().GetGeoDimension(peruGeoDimSid);
            Assert.IsTrue(singleGeoResults != null && singleGeoResults.GEO_MBR_SID == peruGeoDimSid);

            // Check pulling list of all items within a geo by name
            string geoName = "APAC"; 
            geosListResults = new GeosLib().GetGeoDimensionByGeoName(geoName);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(r => r.GEO_NM != geoName).Any());

            // Check pulling list of all items within a geo by sid
            int sid = 7; // APAC
            IEnumerable<GeoDimension> results = new GeosLib().GetGeoDimensionByGeoSid(sid);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(r => r.GEO_NM != "APAC").Any());

            // Check get item by Region Name
            string rngName = "Latin Amer";
            geosListResults = new GeosLib().GetGeoDimensionByRegionName(rngName);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(g => g.RGN_NM != rngName).Any());

            // Check get item by Region Sid
            int rgnSid = 9; // Sid 9 = Latin America
            geosListResults = new GeosLib().GetGeoDimensionByRegionSid(rgnSid);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(g => g.RGN_NM_SID != rgnSid).Any());

            // Check get item by Country Name
            string peruName = "Peru";
            geosListResults = new GeosLib().GetGeoDimensionByCountryName(peruName);
            Assert.IsTrue(geosListResults.Any() && geosListResults.Where(r => r.CTRY_NM == peruName).Any());

            // Check get item by Country Name Sid
            int peruCtryNmSid = 56; // Country Name Sid 56 = 'Peru'
            geosListResults = new GeosLib().GetGeoDimensionByCountrySid(peruCtryNmSid);
            Assert.IsTrue(geosListResults.Any() && geosListResults.Where(r => r.CTRY_NM_SID == peruCtryNmSid).Any());
        }

        #endregion

    }
}
