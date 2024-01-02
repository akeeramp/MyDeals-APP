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
    internal class MeetCompLibTest
    {
        [Test, TestCase(5758, "SvrWS", "XP", "-1"),
            TestCase(2, "EIA CPU", "Ci5", "i5-4590")]
        public void GetMeetCompData_Returns_NotNullMeetCompList(int CUST_MBR_SID, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM)
        {
            var meetCompMock = new Mock<IMeetCompDataLib>();
            List<MeetComp> meetCompObj = getSampleMeetCompData();
            meetCompMock.Setup(x => x.GetMeetCompData(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(meetCompObj);
            List<MeetComp> meetCompData = new MeetCompLib(meetCompMock.Object).GetMeetCompData(CUST_MBR_SID, PRD_CAT_NM, BRND_NM, HIER_VAL_NM);
            Assert.IsNotNull(meetCompData);
        }

        [Test, TestCase(6100, "DIM"),
            TestCase(0, "DIM")]
        public void GetMeetCompDIMData_ShouldReturn_NotNull(int CUST_MBR_SID, string MODE)
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<MEET_COMP_DIM> meetCompDimObj = getSampleDIMData(CUST_MBR_SID);
            meetCompDataLibMock.Setup(x => x.GetMeetCompDIMData(It.IsAny<int>(), It.IsAny<string>()))
                .Returns(meetCompDimObj);
            List<MEET_COMP_DIM> result = new MeetCompLib(meetCompDataLibMock.Object).GetMeetCompDIMData(CUST_MBR_SID, MODE);
            Assert.IsNotNull(result);
        }

        [Test]
        public void UploadMeetComp_Returns_BooleanProcessingResult()
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<MeetComp> lstMeetComp = getSampleMeetCompData();
            meetCompDataLibMock.Setup(x => x.UploadMeetComp(It.IsAny<List<MeetComp>>())).Returns(true);
            var meetCompLib = new MeetCompLib(meetCompDataLibMock.Object);
            var res = new MeetCompLib(meetCompDataLibMock.Object).UploadMeetComp(lstMeetComp);
            Assert.IsTrue(res);
        }

        [Test,
            TestCase(84169, true)]
        public void ActivateDeactivateMeetComp_Returns_List(int MEET_COMP_SID, bool ACTV_IND)
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<MeetComp> lstMeetComp = getSampleMeetCompData();
            meetCompDataLibMock.Setup(x => x.ActivateDeactivateMeetComp(It.IsAny<int>(), It.IsAny<bool>()))
                .Returns(lstMeetComp);
            var res = new MeetCompLib(meetCompDataLibMock.Object).ActivateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND);
            Assert.NotNull(res);
        }

        [Test,
            TestCase(110000270, "D", 1),
            TestCase(1234, "TEST", 5678)]
        public void GetMeetCompProductDetails_Returns_ListofProductData(int CNTRCT_OBJ_SID, string MODE, int OBJ_TYPE_ID)
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<MeetCompResult> lstMeetCompRes = getProductDetails(CNTRCT_OBJ_SID);
            meetCompDataLibMock.Setup(x => x.GetMeetCompProductDetails(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(lstMeetCompRes);
            var res = new MeetCompLib(meetCompDataLibMock.Object).GetMeetCompProductDetails(CNTRCT_OBJ_SID, MODE, OBJ_TYPE_ID);
            Assert.NotNull(res);
        }

        [Test,
            TestCase(110000270, 1,null)]
        public void UpdateMeetCompProductDetails_Returns_ListofProductData(int CNTRCT_OBJ_SID, int OBJ_TYPE_ID, List<MeetCompUpdate> mcu)
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<MeetCompResult> lstMeetCompRes = getProductDetails(CNTRCT_OBJ_SID);
            meetCompDataLibMock.Setup(x => x.UpdateMeetCompProductDetails(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<List<MeetCompUpdate>>(), false))
                .Returns(lstMeetCompRes);
            var res = new MeetCompLib(meetCompDataLibMock.Object).UpdateMeetCompProductDetails(CNTRCT_OBJ_SID, OBJ_TYPE_ID, mcu, false);
            Assert.NotNull(res);
        }

        [Test,
            TestCase(150000986, 92186, "CPU")]
        public void GetDealDetails_ReturnsNotNull(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE)
        {
            var meetCompDataLibMock = new Mock<IMeetCompDataLib>();
            List<DealDeatils> lstDealDeatils = getDealDetails();
            meetCompDataLibMock.Setup(x => x.GetDealDetails(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>()))
                .Returns(lstDealDeatils);
            var res = new MeetCompLib(meetCompDataLibMock.Object).GetDealDetails(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE);
            Assert.NotNull(res);
        }

        private List<MeetCompProductValidation> getSampleProductData()
        {
            List<MeetCompProductValidation> data = new List<MeetCompProductValidation>();

            data.Add(new MeetCompProductValidation
            {
                ProductId = 123,
                ProductName = "Test Product",
                IsServerProduct = true
            });

            return data;
        }

        private List<MeetComp> getSampleMeetCompData()
        {
            List<MeetComp> data = new List<MeetComp>();

            data.Add(new MeetComp
            {
                ACTV_IND = true,
                BRND_NM = null,
                CHG_DTM = new DateTime(2018, 12, 09, 1, 19, 3, 960),
                CHG_EMP_NM = "Lihua Mo",
                CHG_EMP_WWID = 10688678,
                COMP_BNCH = 0.0m,
                CRE_DTM = new DateTime(2018, 12, 09, 1, 19, 3, 960),
                CRE_EMP_NM = "Lihua Mo",
                CRE_EMP_WWID = 10688678,
                CUST_MBR_SID = 2,
                CUST_NM = "Acer",
                HIER_VAL_NM = "i5-4590",
                IA_BNCH = 0.0m,
                MEET_COMP_PRC = 100.0000m,
                MEET_COMP_PRD = "A10 Kaveri 7850K",
                MEET_COMP_SID = 84169,
                PRD_CAT_NM = "EIA CPU",
                PRD_MBR_SID = 100659
            });

            return data;
        }

        private List<MEET_COMP_DIM> getSampleDIMData(int custID)
        {
            List<MEET_COMP_DIM> data = new List<MEET_COMP_DIM>();

            data.Add(new MEET_COMP_DIM
            {
                HIER_VAL_NM = "CD8069504344600",
                PRD_CAT_NM = "SvrWS",
                CUST_MBR_SID = 6100,
                BRND_NM = "XP",
                CUST_NM = "Amazon 2"
            });
            data.Add(new MEET_COMP_DIM
            {
                HIER_VAL_NM = "i5-5575R",
                PRD_CAT_NM = "DT",
                CUST_MBR_SID = 6100,
                BRND_NM = "Ci5",
                CUST_NM = "Amazon 2"
            });
            return data.Where(c => c.CUST_MBR_SID == custID).ToList(); ;
        }

        private List<MeetCompResult> getProductDetails(int cntrctObjSID)
        {
            var prdDetails = new List<MeetCompResult>();
            prdDetails.Add(new MeetCompResult
            {
                BRND_FMLY = "Ci3 Coffee Lake",
                CAP = 109.0000m,
                CNTRCT_OBJ_SID = 110000270,
                COMP_BNCH = 0.0m,
                COMP_OVRRD_FLG = "",
                COMP_OVRRD_RSN = "",
                COMP_PRC = 45.0000m,
                COMP_SKU = "Ryzen 3 Pro 2200G",
                CUST_NM_SID = 2,
                DEAL_DESC = "",
                DEAL_OBJ_SID = "150000986",
                DEAL_PRD_TYPE = "CPU",
                DEAL_STATUS = "",
                DEFAULT_FLAG = "Y",
                ECAP_PRC = 0.0m,
                END_CUST_RETAIL = "",
                GRP = "PRD",
                GRP_PRD_NM = "i3-8100T",
                GRP_PRD_SID = 92186,
                IA_BNCH = 0.0m,
                MC_AVG_RPU = "74.00",
                MC_LAST_RUN = new DateTime(2022, 12, 26, 21, 17, 53, 833),
                MC_NULL = 0,
                MEET_COMP_ANALYSIS = "Price Only",
                MEET_COMP_FRMULA = "",
                MEET_COMP_OVERRIDE_UPD_FLG = "Y",
                MEET_COMP_STS = "Pass",
                MEET_COMP_UPD_FLG = "Y",
                OBJ_SET_TYPE = "",
                PRC_ST_OBJ_SID = 120000677,
                PRC_TBL_OBJ_SID = 130000703,
                PRD_CAT_NM = "DT",
                PS_STATUS = "",
                RW_NM = 1,
                WF_STG_CD = "",
                YCS2 = 99.0000m
            });
            prdDetails.Add(new MeetCompResult
            {
                BRND_FMLY = "Ci3 Coffee Lake",
                CAP = 109.0000m,
                CNTRCT_OBJ_SID = 110000270,
                COMP_BNCH = 0.0m,
                COMP_OVRRD_FLG = "",
                COMP_OVRRD_RSN = "",
                COMP_PRC = 45.0000m,
                COMP_SKU = "Ryzen 3 Pro 2200GE",
                CUST_NM_SID = 2,
                DEAL_DESC = "",
                DEAL_OBJ_SID = "150000986",
                DEAL_PRD_TYPE = "CPU",
                DEAL_STATUS = "",
                DEFAULT_FLAG = "N",
                ECAP_PRC = 0.0m,
                END_CUST_RETAIL = "",
                GRP = "PRD",
                GRP_PRD_NM = "i3-8100T",
                GRP_PRD_SID = 92186,
                IA_BNCH = 0.0m,
                MC_AVG_RPU = "74.00",
                MC_LAST_RUN = new DateTime(2022, 12, 26, 21, 17, 53, 833),
                MC_NULL = 0,
                MEET_COMP_ANALYSIS = "Price Only",
                MEET_COMP_FRMULA = "",
                MEET_COMP_OVERRIDE_UPD_FLG = "Y",
                MEET_COMP_STS = "Pass",
                MEET_COMP_UPD_FLG = "Y",
                OBJ_SET_TYPE = "",
                PRC_ST_OBJ_SID = 120000677,
                PRC_TBL_OBJ_SID = 130000703,
                PRD_CAT_NM = "DT",
                PS_STATUS = "",
                RW_NM = 2,
                WF_STG_CD = "",
                YCS2 = 99.0000m
            });
            prdDetails.Add(new MeetCompResult
            {
                BRND_FMLY = "Ci3 Coffee Lake",
                CAP = 109.0000m,
                CNTRCT_OBJ_SID = 110000270,
                COMP_BNCH = 0.0m,
                COMP_OVRRD_FLG = "",
                COMP_OVRRD_RSN = "",
                COMP_PRC = 45.0000m,
                COMP_SKU = "Ryzen 3 Pro 2200G",
                CUST_NM_SID = 2,
                DEAL_DESC = "",
                DEAL_OBJ_SID = "150000986",
                DEAL_PRD_TYPE = "CPU",
                DEAL_STATUS = "Active",
                DEFAULT_FLAG = "D",
                ECAP_PRC = 100.0000m,
                END_CUST_RETAIL = "",
                GRP = "DEAL",
                GRP_PRD_NM = "i3-8100T",
                GRP_PRD_SID = 92186,
                IA_BNCH = 0.0m,
                MC_AVG_RPU = "74.00",
                MC_LAST_RUN = new DateTime(2022, 12, 26, 21, 17, 53, 833),
                MC_NULL = 0,
                MEET_COMP_ANALYSIS = "Price Only",
                MEET_COMP_FRMULA = "(Minimum of (CAP, YCS2, ECAP) of a Deal - Sum of All Additive Rates (Non-MDF,NRE) - Maximum of All Non ECAP Non Additive Rates (Non-MDF,NRE) - Max of All MDF Rates - Max of All NRE Rates - Max of All Variable Rates) = ($99.00 - $0.00 - $25.00 - $0.00 - $0.00 - $0.00) = $74.00",
                MEET_COMP_OVERRIDE_UPD_FLG = "N",
                MEET_COMP_STS = "Pass",
                MEET_COMP_UPD_FLG = "N",
                OBJ_SET_TYPE = "",
                PRC_ST_OBJ_SID = 120000677,
                PRC_TBL_OBJ_SID = 130000703,
                PRD_CAT_NM = "DT",
                PS_STATUS = "Approved",
                RW_NM = 3,
                WF_STG_CD = "Active",
                YCS2 = 99.0000m
            });

            return prdDetails.Where(x => x.CNTRCT_OBJ_SID == cntrctObjSID).ToList();
        }

        private List<DealDeatils> getDealDetails()
        {
            var dealDetails = new List<DealDeatils>();
            dealDetails.Add(new DealDeatils
            {
                CNSMPTN_RSN = "",
                CTRCT_NM = "DT CPU FER 2021",
                DEAL_CMBN_TYPE = "Non Additive",
                DEAL_OBJ_SID = 632452,
                END_DT = new DateTime(2024, 12, 28),
                OBJ_SET_TYPE = "ECAP",
                REBT_TYPE = "MCP",
                STRT_DT = new DateTime(2021, 01, 01),
                WF_STG_CD = "Active"
            });
            dealDetails.Add(new DealDeatils
            {
                CNSMPTN_RSN = "End Customer",
                CTRCT_NM = "test_smoke_11222022",
                DEAL_CMBN_TYPE = "Non Additive",
                DEAL_OBJ_SID = 658605,
                END_DT = new DateTime(2022, 12, 31),
                OBJ_SET_TYPE = "PROGRAM",
                REBT_TYPE = "MCP",
                STRT_DT = new DateTime(2021, 11, 21),
                WF_STG_CD = "Active"
            });
            dealDetails.Add(new DealDeatils
            {
                CNSMPTN_RSN = "End Customer",
                CTRCT_NM = "test_smk23",
                DEAL_CMBN_TYPE = "Non Additive",
                DEAL_OBJ_SID = 150000713,
                END_DT = new DateTime(2022, 12, 31),
                OBJ_SET_TYPE = "ECAP",
                REBT_TYPE = "MCP",
                STRT_DT = new DateTime(2022, 12, 22),
                WF_STG_CD = "Active"
            });

            return dealDetails;
        }
    }
}
