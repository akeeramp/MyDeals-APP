using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class GeosLibTest
    {

        public Mock<IGeoDataLib> mockGeoDataLib = new Mock<IGeoDataLib> ();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib> ();

        [Test,
            TestCase(true),
            TestCase(false)]
        public void GetGeoDimensions_Returns_NotNull(bool getCachedResult)
        {
            List<GeoDimension> mockData = getGeoDimensionsMockData();
            GeoDetails mockData1 = getGeoDimensionsMockData1();
            
            if (getCachedResult == true)
            {
                mockDataCollectionsDataLib.Setup(x=>x.GetGeoData()).Returns(mockData);
                var result = new GeosLib(mockGeoDataLib.Object,mockDataCollectionsDataLib.Object).GetGeoDimensions(getCachedResult);
                Assert.IsNotNull(result);  
                Assert.Greater(result.Count, 0);
            }
            else
            {
                mockGeoDataLib.Setup(x => x.GetGeoDimensions(null)).Returns(mockData1);
                mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
                var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensions(getCachedResult);
                Assert.IsNotNull(result);
                Assert.Greater(result.Count, 0);
            }
        }

        [Test,
            TestCase(56)]
        public void GetGeoDimensionsByGeoMbrSid_Returns_NotNull_forMatchingInput(int geo_mbr_sid) 
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimension(geo_mbr_sid);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(23)]
        public void GetGeoDimensionsByGeoMbrSid_Returns_Null_forNonMatchingInput(int geo_mbr_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimension(geo_mbr_sid);
            Assert.IsNull(result);
        }

        [Test]
        public void GetGeoDimensionsActive_Returns_NotNull_When_ACTVIND_isPresent()
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionsActive();
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetGeoDimensionsActive_Returns_EmptyList_When_ACTVIND_isNotPresent()
        {
            var mockData = getGeoDimensionsMockData();
            mockData[0].ACTV_IND = false;
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionsActive();
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase("APAC")]
        public void GetGeoDimensionByGeoName_Returns_NotNull_forMatchingInput(string geo_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByGeoName(geo_nm);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("GAR")]
        public void GetGeoDimensionByGeoName_Returns_EmptyList_forNonMatchingInput(string geo_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByGeoName(geo_nm);
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase(7)]
        public void GetGeoDimensionByGeoSid_Returns_NotNull_forMatchingInput(int geo_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByGeoSid(geo_nm_sid);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(8)]
        public void GetGeoDimensionByGeoSid_Returns_EmptyList_forNonMatchingInput(int geo_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByGeoSid(geo_nm_sid);
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase("Latin Amer")]
        public void GetGeoDimensionByRegionName_Returns_NotNull_forMatchingInput(string rgn_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByRegionName(rgn_nm);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("Europe")]
        public void GetGeoDimensionByRegionName_Returns_EmptyList_forNonMatchingInput(string rgn_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByRegionName(rgn_nm);
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase(9)]
        public void GetGeoDimensionByRegionSid_Returns_NotNull_forMatchingInput(int rgn_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByRegionSid(rgn_nm_sid);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(8)]
        public void GetGeoDimensionByRegionSid_Returns_EmptyList_forNonMatchingInput(int rgn_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByRegionSid(rgn_nm_sid);
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase("Peru")]
        public void GetGeoDimensionByCountryName_Returns_NotNull_forMatchingInput(string ctry_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByCountryName(ctry_nm);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("Canada")]
        public void GetGeoDimensionByCountryName_Returns_EmptyList_forNonMatchingInput(string ctry_nm)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByCountryName(ctry_nm);
            Assert.IsEmpty(result);
        }

        [Test,
           TestCase(56)]
        public void GetGeoDimensionByCountrySid_Returns_NotNull_forMatchingInput(int ctry_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByCountrySid(ctry_nm_sid);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(10)]
        public void GetGeoDimensionByCountrySid_Returns_EmptyList_forNonMatchingInput(int ctry_nm_sid)
        {
            var mockData = getGeoDimensionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetGeoData()).Returns(mockData);
            var result = new GeosLib(mockGeoDataLib.Object, mockDataCollectionsDataLib.Object).GetGeoDimensionByCountrySid(ctry_nm_sid);
            Assert.IsEmpty(result);
        }


        public List<GeoDimension> getGeoDimensionsMockData()
        {
            var mockData = new List<GeoDimension> { new GeoDimension
            {
                ACTV_IND  = true,
                CTRY_NM  = "Peru",
                CTRY_NM_SID  = 56,
                GEO_ATRB_SID  = 56,
                GEO_MBR_SID  = 56,
                GEO_NM  = "APAC",
                GEO_NM_SID  = 7,
                RGN_NM  = "Latin Amer",
                RGN_NM_SID = 9
            } };
            return mockData;

        }

        public GeoDetails getGeoDimensionsMockData1()
        {
            var mockData = new List<GeoDimension> { new GeoDimension
            {
                ACTV_IND  = true,
                CTRY_NM  = "Peru",
                CTRY_NM_SID  = 56,
                GEO_ATRB_SID  = 56,
                GEO_MBR_SID  = 56,
                GEO_NM  = "APAC",
                GEO_NM_SID  = 7,
                RGN_NM  = "Latin Amer",
                RGN_NM_SID = 9
            } };
            //return mockData;
            return new GeoDetails
            {
                Items = mockData,
                TotalRows = 1
            };

        }
    }
}
