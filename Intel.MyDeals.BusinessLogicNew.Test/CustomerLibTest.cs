using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using Assert = NUnit.Framework.Assert;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class CustomerLibTest
    {
        public Mock<ICustomerDataLib> mockCustomerDataLib = new Mock<ICustomerDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test, 
            TestCase(true), 
            TestCase(false)]
        public void GetCustomerDivisions_ShouldReturnNotNull(bool getCachedResult)
        {
            if(!getCachedResult)
            {
                var mockData = GetCustomerDivisionsMockData();
                mockCustomerDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
                var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisions(getCachedResult);
                Assert.IsNotNull(result);
            }
            else
            {
                var mockData = GetCustomerDivisionsMockData();
                mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
                var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisions(getCachedResult);
                Assert.IsNotNull(result);
            }
        }

        [Test,
            TestCase(20)]
        public void GetCustomerDivision_ForCustMbrSID_ShouldReturnNotNull(int sid)
        {            
            var mockData = GetCustomerDivisionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
            var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivision(sid);
            Assert.IsNotNull(result);
        }
        
        [Test,
            TestCase(30)]
        public void GetCustomerDivisionsByCustNmSid_ShouldReturnNotNull(int sid)
        {
            var mockData = GetCustomerDivisionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
            var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisionsByCustNmId(sid);
            Assert.IsNotNull(result);
        }
        
        [Test]
        public void GetCustomerDivisionsActive_ShouldReturnNotNull()
        {
            var mockData = GetCustomerDivisionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
            var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisionsActive();
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(3)]
        public void GetCustomerDivisionsActiveByCustNmSid_ShouldReturnNotNull(int custNmSid)
        {
            var mockData = GetCustomerDivisionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
            var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisionsByCustNmSid(custNmSid);
            Assert.IsNotNull(result);
        }
        
        [Test,
            TestCase("GAR")]
        public void GetCustomerDivisionsByHostedGeo_ShouldReturnNotNull(string geo)
        {
            var mockData = GetCustomerDivisionsMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetCustomerDivisions()).Returns(mockData);
            var result = new CustomerLib(mockCustomerDataLib.Object, mockDataCollectionsDataLib.Object).GetCustomerDivisionsByHostedGeo(geo);
            Assert.IsNotNull(result);
        }

        private List<CustomerDivision> GetCustomerDivisionsMockData()
        {
            var result = new List<CustomerDivision>()
            {
                new CustomerDivision()
                {
                    ACTV_IND = true,
                    CUST_CAT = "customerCategory",
                    CUST_DIV_NM = "customerDivisionName",
                    CUST_DIV_NM_SID = 1,
                    CUST_MBR_SID = 2,
                    CUST_NM = "customerName",
                    CUST_NM_SID = 3,
                    CUST_TYPE = "lenovo",
                    HOSTED_GEO = "GAR",
                    PRC_GRP_CD = "priceGroup"
                },
                new CustomerDivision()
                {
                    ACTV_IND = false,
                    CUST_CAT = "customerCategory",
                    CUST_DIV_NM = "customerDivisionName",
                    CUST_DIV_NM_SID = 10,
                    CUST_MBR_SID = 20,
                    CUST_NM = "customerName",
                    CUST_NM_SID = 30,
                    CUST_TYPE = "lenovo",
                    HOSTED_GEO = "APAC",
                    PRC_GRP_CD = "priceGroup"
                }
            };
            return result;
        }
    }
}