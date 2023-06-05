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
    public class PushDealstoVistexLibTest
    {
        public Mock<IPushDealstoVistexDataLib> mockPushDealstoVistexDataLib = new Mock<IPushDealstoVistexDataLib>();

        [Test,
            TestCase("654,23,12", true)]
        public void DealsPushtoVistex_Returns_NotNull(string DEAL_IDS, bool VSTX_CUST_FLAG)
        {
            var mockData = DealsPushtoVistexMockResult();
            mockPushDealstoVistexDataLib.Setup(x => x.DealsPushtoVistex(It.IsAny<PushDealIdstoVistex>())).Returns(mockData);
            var pushDealIds = new PushDealIdstoVistex();
            pushDealIds.DEAL_IDS = DEAL_IDS;
            pushDealIds.VSTX_CUST_FLAG = VSTX_CUST_FLAG;
            var result = new PushDealstoVistexLib(mockPushDealstoVistexDataLib.Object).DealsPushtoVistex(pushDealIds);
            Assert.IsNotNull(result);
        }

        public List<PushDealstoVistexResults> DealsPushtoVistexMockResult()
        {
            var mockData = new List<PushDealstoVistexResults> { new PushDealstoVistexResults
            {
                DEAL_ID = 1 ,
                UPD_MSG = "msg",
                ERR_FLAG = 0
            } };
            return mockData;
        }
    }
}
