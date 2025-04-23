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
    public class VistexCustomerMappingLibTest
    {
        public Mock<IVistexCustomerMappingDataLib> mockVistexCustomerMappingDataLib = new Mock<IVistexCustomerMappingDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        private static readonly object[] _paramList =
        {
            new object[] {33,"cst","level",false,true,false,"abc","xyz","geo",456,"id","prtn" }
        };

        [Test,
            TestCase(true),
            TestCase(false)]
        public void GetVistexCustomerMapping_Returns_NotNull(bool getCachedResult)
        {
            var mockData = getVistexCustomerMappingMockData();
            if(getCachedResult == true)
            {
                mockDataCollectionsDataLib.Setup(x=>x.GetVistexCustomerMappings()).Returns(mockData);
                var result = new VistexCustomerMappingLib(mockVistexCustomerMappingDataLib.Object, mockDataCollectionsDataLib.Object).GetVistexCustomerMapping();
                Assert.IsNotNull(result);
                Assert.Greater(result.Count, 0);
            }
            else
            {
                mockVistexCustomerMappingDataLib.Setup(x => x.GetVistexCustomerMappings()).Returns(mockData);
                var result = new VistexCustomerMappingLib(mockVistexCustomerMappingDataLib.Object, mockDataCollectionsDataLib.Object).GetVistexCustomerMapping(getCachedResult);
                Assert.IsNotNull(result);
                Assert.Greater(result.Count, 0);
            }
        }

        [Test,
            TestCaseSource("_paramList")]
        public void SetVistexCustomerMapping_Returns_NotNull(dynamic data)
        {
            var mockData = getVistexCustomerMappingMockData();
            var inputTestCaseData = new VistexCustomerMapping
            {
                CUST_MBR_SID = data[0],
                CUST_NM = data[1],
                DFLT_AR_SETL_LVL = data[2] ,
                VISTEX_CUST_FLAG = data[3],
                DFLT_DOUBLE_CONSUMPTION = data[4],
                DFLT_ENFORCE_PAYABLE_QUANTITY = data[5],
                DFLT_PERD_PRFL = data[6],
                DFLT_TNDR_AR_SETL_LVL = data[7],
                DFLT_CUST_RPT_GEO = data[8],
                DFLT_LOOKBACK_PERD = data[9],
                CUST_MAP_ID = data[10],
                DFLT_SETTLEMENT_PARTNER = data[11]
            };
            var crudMode = CrudModes.Update;
            mockVistexCustomerMappingDataLib.Setup(x=>x.SetVistexCustomerMapping(It.IsAny<CrudModes>(),It.IsAny<VistexCustomerMapping>())).Returns(mockData);
            var result = new VistexCustomerMappingLib(mockVistexCustomerMappingDataLib.Object, mockDataCollectionsDataLib.Object).SetVistexCustomerMapping(crudMode, inputTestCaseData);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        public List<VistexCustomerMapping> getVistexCustomerMappingMockData()
        {
            var mockData = new List<VistexCustomerMapping> { new VistexCustomerMapping
            {
                CUST_MBR_SID = 23,
                CUST_NM = "cust_nm",
                DFLT_AR_SETL_LVL = "lvl" ,
                VISTEX_CUST_FLAG = true,
                DFLT_DOUBLE_CONSUMPTION = false,
                DFLT_ENFORCE_PAYABLE_QUANTITY = false,
                DFLT_PERD_PRFL = "pfrl",
                DFLT_TNDR_AR_SETL_LVL = "lvl",
                DFLT_CUST_RPT_GEO = "geo",
                DFLT_LOOKBACK_PERD = 23,
                CUST_MAP_ID = "id",
                DFLT_SETTLEMENT_PARTNER = "prtnr"
            } };
            return mockData;
        }

    }
}