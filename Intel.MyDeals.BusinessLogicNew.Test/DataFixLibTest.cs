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
    internal class DataFixLibTest
    {
        [Test]
        public void getDataFixActions_ShouldReturnNotNullData()
        {
            var mockDataFixDataLib = new Mock<IDataFixDataLib>();
            var data = fetchData();
            mockDataFixDataLib.Setup(x => x.GetDataFixActions()).Returns(data);

            var dataFixLibTest = new DataFixLib(mockDataFixDataLib.Object).GetDataFixActions();
            Assert.IsNotNull(dataFixLibTest);
            Assert.Greater(dataFixLibTest.Count, 0);
        }

        [Test]
        public void GetDataFixes_ShouldReturnNotNullData()
        {
            var mockDataFixDataLib = new Mock<IDataFixDataLib>();
            var data = getDataFixList();

            mockDataFixDataLib.Setup(x => x.GetDataFixes()).Returns(data);

            var res = new DataFixLib(mockDataFixDataLib.Object).GetDataFixes();

            Assert.IsNotNull(res);
            Assert.Greater(res.Count, 0);
        }

        [Test]
        public void UpdateDataFix_ShouldReturnPass()
        {
            var mockDataFixDataLib = new Mock<IDataFixDataLib>();
            mockDataFixDataLib.Setup(x => x.UpdateDataFix(It.IsAny<DataFix>(), It.IsAny<bool>()))
                .Returns(new IncdnActnUpd() { RESULT = 1 });

            var res = new DataFixLib(mockDataFixDataLib.Object).UpdateDataFix(new DataFix(), true);

            Assert.IsNotNull(res);
            Assert.AreEqual(res.RESULT, 1);
        }

        [Test]
        public void UpdateDataFix_ShouldReturnFail()
        {
            var mockDataFixDataLib = new Mock<IDataFixDataLib>();
            mockDataFixDataLib.Setup(x => x.UpdateDataFix(It.IsAny<DataFix>(), It.IsAny<bool>()))
                .Returns(new IncdnActnUpd() { RESULT = 0 });

            var res = new DataFixLib(mockDataFixDataLib.Object).UpdateDataFix(new DataFix(), true);

            Assert.IsNotNull(res);
            Assert.AreEqual(res.RESULT, 0);
        }

        private List<DropDownsList> fetchData()
        {
            var dataList = new List<DropDownsList>();
            dataList.Add(new DropDownsList
            {
                Value = 1,
                Text = "CNTRCT_ROLLUP",
                DdlType = "ACTN_LIST"
            });
            dataList.Add(new DropDownsList
            {
                Value = 3464,
                Text = "Consumption Country/Region",
                DdlType = "ATRB_LIST"
            });
            dataList.Add(new DropDownsList
            {
                Value = 3601,
                Text = "Avg RPU",
                DdlType = "ATRB_LIST"
            });

            return dataList;
        }

        private List<IncdnDataFix> getDataFixList()
        {
            var data = new List<IncdnDataFix>();
            data.Add(new IncdnDataFix
            {
                CRE_DTM = new DateTime(2023, 01, 25, 2, 22, 38, 520),
                CRE_EMP_NM = "Test1, User 1",
                INCDN_MSG = "test",
                INCDN_NBR = "14545",
                INCDN_STS = "PRCSS_CMPL"
            });
            data.Add(new IncdnDataFix
            {
                CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CRE_EMP_NM = "Test2, User 2",
                INCDN_MSG = "",
                INCDN_NBR = "123",
                INCDN_STS = "PRCSS_CMPL"
            });
            data.Add(new IncdnDataFix
            {
                CRE_DTM = new DateTime(2023, 01, 17, 20, 38, 17, 933),
                CRE_EMP_NM = "Test3, User 3",
                INCDN_MSG = "Exception",
                INCDN_NBR = "ABCD12Jan 17 2023  8:38PM",
                INCDN_STS = "PRCSS_CMPL"
            });

            return data;
        }
    }
}
