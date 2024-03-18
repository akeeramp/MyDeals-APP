using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    public class ExpireYcs2LibTest
    {
        public Mock<IExpireYcs2DataLib> mockExpireYcs2DataLib = new Mock<IExpireYcs2DataLib>();
        [Test]
        [TestCase("1234,5678")]
        public void ExpireYcs2_Returns_NotNull(string dealId)
        {
            var dealData = ExpireYcs2();
            mockExpireYcs2DataLib.Setup(x => x.ExpireYcs2(It.IsAny<string>())).Returns(dealData);        
            var result = new ExpireYcs2Lib(mockExpireYcs2DataLib.Object).ExpireYcs2(dealId);
            Assert.NotNull(result);
        }
        private List<DownloadExpireYcs2Data> ExpireYcs2()
        {
            var data = new List<DownloadExpireYcs2Data> { new DownloadExpireYcs2Data
            {
                OBJ_SID = 1,
                STATUS = "Invalid Deal"
            }};
            return data;
        }
    }
}
