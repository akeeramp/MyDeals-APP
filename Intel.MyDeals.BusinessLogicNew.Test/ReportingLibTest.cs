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
    public class ReportingLibTest
    {
        public Mock<IReportingDataLib> mockReportingDataLib = new Mock<IReportingDataLib>();

        [Test]
        public void GetReportDashboard_Returns_NotNull()
        {
            var mockReportDashboardData = GetReportDashboardMockData();
            mockReportingDataLib.Setup(m => m.GetReportDashboard()).Returns(mockReportDashboardData);
            var result = new ReportingLib(mockReportingDataLib.Object).GetReportDashboard();
            Assert.IsNotNull(result);
        }

        public ReportMasterData GetReportDashboardMockData()
        {
            var mockReportMasterData = new ReportMasterData();

            var ReportDashboardData = new List<ReportDashboardData> { new ReportDashboardData
            {
                AVG_TIME = 2,
                CRE_EMP_IDSID = "idsid",
                MAX_TIME = 1,
                MIN_TIME = 3,
                RPT_COUNT = 4,
                RPT_NM = "rnm" ,
                TOTAL_REPORT_TIME =2 ,
                TOTAL_TIME =5
            } };

            var ReportDealType = new List<ReportDealType> { new ReportDealType
            {
                Customer_Count  = 2,
                Deal_Count  = 4,
                DEAL_TYPE  = "type",
                Distinct_Customer  = 2,
                Product_Count  = 5,
                Total_Dollar_Amount  = "amt",
            } };

            var ReportDealStage = new List<ReportDealStage> { new ReportDealStage
            {
                DEAL_STAGE  = "stg",
                Deal_Stage_Count  = 4,
            } };

            var ReportProductCount = new List<ReportProductCount> { new ReportProductCount
            {
                Deal_Product_Count  = 2,
                Primary_Product  = "prd",
            } };

            var ReportLogDeatils = new List<ReportLogDeatils> { new ReportLogDeatils
            {
                ATRB_LIST  = "lst",
                END_TIME  = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                REPORT_NAME  = "rnm",
                RPT_ALS_NM  = "ralsnm",
                START_TIME  = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                TOTAL_REPORT_TIME_TAKEN  = 3,
            } };

            var ReportSummary = new List<ReportSummary> { new ReportSummary
            {
                SUM_AMOUNT  = 43,
            } };

            var ReportName = new List<ReportName> { new ReportName
            {
                COLR_CD  = "colr",
                CTGR_NM  = "ctgrNm",
                ID  = 3,
                RPT_UNIQ_NM  = "rptNm",
                RPT_URL  = "rptUrl",
                SUB_CTGR_NM  = "subCtgNm",
                UI_ORD  = 23,
            } };

            mockReportMasterData.ReportDashboardData = ReportDashboardData;
            mockReportMasterData.ReportDealStage = ReportDealStage;
            mockReportMasterData.ReportDealType = ReportDealType;
            mockReportMasterData.ReportProductCount = ReportProductCount;
            mockReportMasterData.ReportLogDeatils = ReportLogDeatils;
            mockReportMasterData.ReportSummary = ReportSummary;
            mockReportMasterData.ReportName = ReportName;

            return mockReportMasterData;
        }
    }
}
