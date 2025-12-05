using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class EmployeeLibTest
    {
        public Mock<IEmployeeDataLib> mockEmployeeDataLib = new Mock<IEmployeeDataLib>();

        [Test,
            TestCase(99999999)]
        public void GetEmployeeHistory_Returns_NotNull(int wwid)
        {
            var mockData = getEmployeeHistoryMockData();
            mockEmployeeDataLib.Setup(x => x.GetEmployeeHistory(It.IsAny<int>())).Returns(mockData);
            var result = new EmployeesLib(mockEmployeeDataLib.Object).GetEmployeeHistory(wwid);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test]
        public void GetEmployeeHistory_Returns_EmptyList_WhenNoHistory()
        {
            
            mockEmployeeDataLib.Setup(x => x.GetEmployeeHistory(It.IsAny<int>())).Returns(new List<EmpHistoryData>());
            var result = new EmployeesLib(mockEmployeeDataLib.Object).GetEmployeeHistory(12345678);
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
        }

        [Test]
        public void GetEmployeeHistory_Calls_DataLib_WithCorrectWwid()
        {
            int testWwid = 55555555;
            var mockData = getEmployeeHistoryMockData();
            mockEmployeeDataLib.Setup(x => x.GetEmployeeHistory(testWwid)).Returns(mockData);
            var lib = new EmployeesLib(mockEmployeeDataLib.Object);
            lib.GetEmployeeHistory(testWwid);
            mockEmployeeDataLib.Verify(x => x.GetEmployeeHistory(testWwid), Times.Once);
        }

        [Test]
        public void GetEmployeeHistory_ThrowsException_WhenDataLibThrows()
        {
            mockEmployeeDataLib.Setup(x => x.GetEmployeeHistory(It.IsAny<int>())).Throws(new Exception("DB error"));
            var lib = new EmployeesLib(mockEmployeeDataLib.Object);
            Assert.Throws<Exception>(() => lib.GetEmployeeHistory(11111111));
        }

        public List<EmpHistoryData> getEmployeeHistoryMockData()
        {
            var mockData = new List<EmpHistoryData> { new EmpHistoryData
            {
                CHG_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                EFF_FR_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                EFF_TO_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                ACTV_IND = true,
                CHG_CMNTS = "User Created in System, with Name: xyz"
            } };

            return mockData;
        }
        
    }
}
