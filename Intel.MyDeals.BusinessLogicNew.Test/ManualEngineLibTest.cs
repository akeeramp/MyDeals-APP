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
    public class ManualEngineLibTest
    {
        public Mock<IMyDealsManualDataLib> mockMyDealsManualDataLib = new Mock<IMyDealsManualDataLib> ();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();

        [Test,
            TestCase("testString")]
        public void GetNavigationItems_Returns_NotNull(string refType)
        {
            var mockData = GetNavigationItemsMockData();
            mockMyDealsManualDataLib.Setup(x => x.GetNavigationItems(It.IsAny<string>())).Returns(mockData);
            var result = new ManualEngineLib(mockMyDealsManualDataLib.Object, mockDataCollectionsDataLib.Object).GetNavigationItems(refType);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("testString")]
        public void GetManualPageData_Returns_NotNull(string pageLink)
        {
            mockMyDealsManualDataLib.Setup(x => x.GetManualPageData(It.IsAny<string>())).Returns("mockOutputString");
            var result = new ManualEngineLib(mockMyDealsManualDataLib.Object, mockDataCollectionsDataLib.Object).GetManualPageData(pageLink);
            Assert.IsNotNull(result);
        }

        public List<RefManualsNavItem> GetNavigationItemsMockData()
        {
            var mockData = new List<RefManualsNavItem> { new RefManualsNavItem
            {
                DOC_SID = 2,
                ORD = 34,
                PARNT = 23,
                REF_LNK = "lnk",
                REF_TTL = "ttl"
            } };
            return mockData;
        }

    }
}
