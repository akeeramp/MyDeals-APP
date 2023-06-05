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
    internal class DataQualityLibTest
    {
        [Test,
            TestCase(1, 2, "", true),
            TestCase(3, 4, "123", false)]
        public void ExecuteCostGapFiller_ReturnsTrue(int startYearQuarter, int endYearQuarter, string productIds, bool isnullCheck)
        {
            var mockDataQualityDataLib = new Mock<IDataQualityDataLib>();
            mockDataQualityDataLib.Setup(x => x.ExecuteCostGapFiller(It.IsAny<int>(), It.IsAny<int>(),
                It.IsAny<string>(), It.IsAny<bool>())).Returns(true);

            var res = new DataQualityLib(mockDataQualityDataLib.Object)
                .ExecuteCostGapFiller(startYearQuarter, endYearQuarter, productIds, isnullCheck);

            Assert.True(res);

        }

        [Test]
        public void GetDataQualityUseCases_Returns_NotNull()
        {
            var mockDataQualityDataLib = new Mock<IDataQualityDataLib>();
            var data = getUseCaseMockData();
            mockDataQualityDataLib.Setup(x => x.GetDataQualityUseCases())
                .Returns(data);
            var res = new DataQualityLib(mockDataQualityDataLib.Object).GetDataQualityUseCases();

            Assert.IsNotNull(res);
            Assert.Greater(res.Count, 0);
        }

        [Test]
        public void RunDQ_ReturnsTrue()
        {
            var mockDataQualityDataLib = new Mock<IDataQualityDataLib>();
            mockDataQualityDataLib.Setup(x => x.RunDQ(It.IsAny<string>()))
                .Returns(true);
            var res = new DataQualityLib(mockDataQualityDataLib.Object).RunDQ("Test_UseCase");

            Assert.True(res);
        }

        private List<DataQualityUsecase> getUseCaseMockData()
        {
            var data = new List<DataQualityUsecase>();
            data.Add(new DataQualityUsecase
            {
                DQ_ENBL_IND = "Y",
                DQ_SEND_MAX_NUM_ISS_ROWS = 500,
                DQ_USE_CASE_CD = "Backup_Tables_to_be_Dropped",
                DQ_USE_CASE_DSC = "This report is to notify users which backup tables will be dropped within the next 10 Days.",
                DQ_USE_CASE_HELP_TXT = "",
                DQ_USE_CASE_NM = "Backup Tables to be Dropped",
                LOG_RETEN_NUM_DAY = 60,
                SUBJ_AREA_CD = "Drop BKUP Table "
            });

            return data;

        }
    }
}
