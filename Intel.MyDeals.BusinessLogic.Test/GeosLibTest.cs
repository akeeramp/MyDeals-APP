using System;
using NUnit.Framework;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class GeoLibTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Geos Lib tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Geos Lib tests.");
        }

        #region Get Geos

        [TestCase]
        public void GeoLib_GetGeoDimensions()
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensions();
            Assert.IsTrue(geosListResults.Any());
        }

        [TestCase]
        public void GeoLib_GetGeoDimensionsActive()
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionsActive();
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Where(g => g.ACTV_IND == false).Any());
        }

        [TestCase(56)] // Sid 56 = 'Peru'
        public void GeoLib_GetGeoDimension(int peruGeoDimSid)
        {
            GeoDimension singleGeoResults = new GeosLib().GetGeoDimension(peruGeoDimSid);
            Assert.IsTrue(singleGeoResults != null && singleGeoResults.GEO_MBR_SID == peruGeoDimSid);
        }

        [TestCase("APAC")]
        public void GeoLib_GetGeoDimensionByGeoName(string geoName)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByGeoName(geoName);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(r => r.GEO_NM != geoName).Any());
        }

        [TestCase(7)] // APAC
        public void GeoLib_GetGeoDimensionByGeoSid(int sid)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByGeoSid(sid);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(r => r.GEO_NM != "APAC").Any());
        }


        [TestCase("Latin Amer")]
        public void GeoLib_GetGeoDimensionByRegionName(string rngName)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByRegionName(rngName);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(g => g.RGN_NM != rngName).Any());
        }

        [TestCase(9)] // Sid 9 = Latin America
        public void GeoLib_GetGeoDimensionByRegionSid(int rgnSid)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByRegionSid(rgnSid);
            Assert.IsTrue(geosListResults.Any());
            Assert.IsFalse(geosListResults.Any() && geosListResults.Where(g => g.RGN_NM_SID != rgnSid).Any());
        }

        [TestCase("Peru")]
        public void GeoLib_GetGeoDimensionByGeoSid(string peruName)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByCountryName(peruName);
            Assert.IsTrue(geosListResults.Any() && geosListResults.Where(r => r.CTRY_NM == peruName).Any());
        }

        [TestCase(56)] // APAC
        public void GeoLib_GetGeoDimensionByCountrySid(int peruCtryNmSid)
        {
            IEnumerable<GeoDimension> geosListResults = new GeosLib().GetGeoDimensionByCountrySid(peruCtryNmSid);
            Assert.IsTrue(geosListResults.Any() && geosListResults.Where(r => r.CTRY_NM_SID == peruCtryNmSid).Any());
        }

        #endregion

    }
}
