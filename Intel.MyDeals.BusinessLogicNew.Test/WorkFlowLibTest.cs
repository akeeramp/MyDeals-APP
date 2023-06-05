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
    public class WorkFlowLibTest
    {
        public Mock<IWorkFlowDataLib> mockWorkFlowDataLib = new Mock<IWorkFlowDataLib> ();
        private static readonly object[] _paramListsWorkFlowStg =
        {
            new object[] {true,new DateTime(2023, 01, 23, 20, 15, 00, 277),23,new DateTime(2022, 01, 23, 20, 15, 00, 277),34,"nm","desc","loc",2,"nm","ord" }
        };
        private static readonly object[] _paramListsWorkFlows =
        {
            new object[] {"str",256,"type",23,"tr_nm",false,"wf_nm",3,"actn_nm",23,"dest","src",56,67}
        };

        [Test]
        public void GetWorkFlowStages_Returns_NotNull()
        {
            var mockData = GetWorkFlowStagesMockData();
            mockWorkFlowDataLib.Setup(x => x.GetWorkFlowStages()).Returns(mockData);
            var result = new WorkFlowLib(mockWorkFlowDataLib.Object).GetWorkFlowStages();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }
        [Test,
            TestCaseSource("_paramListsWorkFlowStg")]
        public void SetWorkFlowStages_Returns_NotNull(dynamic data)
        {
            var mockData = GetWorkFlowStagesMockData();
            var inputTestCaseData = new WorkFlowStg
            {
                ALLW_REDEAL = data[0],
                CHG_DTM = data[1],
                CHG_EMP_WWID = data[2],
                CRE_DTM = data[3],
                CRE_EMP_WWID = data[4],
                ROLE_TIER_NM = data[5],
                WFSTG_DESC = data[6],
                WFSTG_LOC = data[7],
                WFSTG_MBR_SID = data[8],
                WFSTG_NM = data[9],
                WFSTG_ORD = data[10]
            };
            var crudMode = CrudModes.Insert;
            mockWorkFlowDataLib.Setup(x => x.SetWorkFlowStages(It.IsAny<CrudModes>(), It.IsAny<WorkFlowStg>())).Returns(mockData);
            var result = new WorkFlowLib(mockWorkFlowDataLib.Object).SetWorkFlowStages(crudMode,inputTestCaseData);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }
        [Test,
            TestCaseSource("_paramListsWorkFlows")]
        public void SetWorkFlows_Returns_NotNull(dynamic data)
        {
            var mockData = GetWorkFlowsMockData();
            var inputTestCaseData = new WorkFlows {
                OBJ_SET_TYPE_CD = data[0], 
                OBJ_SET_TYPE_SID = data[1], 
                OBJ_TYPE = data[2], 
                OBJ_TYPE_SID = data[3], 
                ROLE_TIER_NM = data[4], 
                TRKR_NBR_UPD = data[5], 
                WF_NM = data[6], 
                WF_SID = data[7],
                WFSTG_ACTN_NM = data[8], 
                WFSTG_ACTN_SID = data[9], 
                WFSTG_CD_DEST = data[10], 
                WFSTG_CD_SRC = data[11], 
                WFSTG_DEST_MBR_SID = data[12], 
                WFSTG_MBR_SID = data[13] 
            };
            var crudMode = CrudModes.Update;
            mockWorkFlowDataLib.Setup(x => x.SetWorkFlows(It.IsAny<CrudModes>(), It.IsAny<WorkFlows>())).Returns(mockData);
            var result = new WorkFlowLib(mockWorkFlowDataLib.Object).SetWorkFlows(crudMode,inputTestCaseData );
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }
        [Test]
        public void GetDropDownValues_Returns_NotNull()
        {
            var mockData = GetDropDownValuesMockData();
            mockWorkFlowDataLib.Setup(x => x.GetDropDownValues()).Returns(mockData);
            var result = new WorkFlowLib(mockWorkFlowDataLib.Object).GetDropDownValues();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }
        [Test]
        public void GetWorkFlowItems_Returns_NotNull()
        {
            var mockData = GetWorkFlowsMockData();
            mockWorkFlowDataLib.Setup(x => x.GetWorkFlowItems()).Returns(mockData);
            var result = new WorkFlowLib(mockWorkFlowDataLib.Object).GetWorkFlowItems();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        public List<WorkFlowStg> GetWorkFlowStagesMockData()
        {
            var mockData = new List<WorkFlowStg> { new WorkFlowStg
            {
                ALLW_REDEAL = true,
                CHG_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CHG_EMP_WWID = 23,
                CRE_DTM = new DateTime(2022, 01, 23, 20, 15, 00, 277),
                CRE_EMP_WWID = 34,
                ROLE_TIER_NM = "nm",
                WFSTG_DESC = "desc",
                WFSTG_LOC = "loc",
                WFSTG_MBR_SID = 2,
                WFSTG_NM = "nm",
                WFSTG_ORD = "ord"
            } };
            return mockData;
        }

        public List<WorkFlows> GetWorkFlowsMockData()
        {
            var mockData = new List<WorkFlows> { new WorkFlows
            {    
                OBJ_SET_TYPE_CD = "str",
                OBJ_SET_TYPE_SID = 256,
                OBJ_TYPE = "type",
                OBJ_TYPE_SID = 23,
                ROLE_TIER_NM = "tr_nm",
                TRKR_NBR_UPD = false,
                WF_NM = "wf_nm",
                WF_SID = 3,
                WFSTG_ACTN_NM = "actn_nm",
                WFSTG_ACTN_SID = 23,
                WFSTG_CD_DEST = "dest",
                WFSTG_CD_SRC = "src",
                WFSTG_DEST_MBR_SID = 56,
                WFSTG_MBR_SID = 67
            } };
            return mockData;
        }

        public List<WorkFlowAttribute> GetDropDownValuesMockData()
        {
            var mockData = new List<WorkFlowAttribute> { new WorkFlowAttribute
            {
                COL_NM = "col_nm",
                Key = "key",
                Value = "val"
            } };
            return mockData;
        }
    }
}
