using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Core;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class ConstantsLooksupsLibTest
    {
        public Mock<IConstantLookupDataLib> mockConstantLookupDataLib = new Mock<IConstantLookupDataLib>();
        public Mock<IDataCollectionsDataLib> mockDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        public Mock<INotificationsLib> mockNotificationsLib = new Mock<INotificationsLib>();

        [Test,
            TestCase("cnst_name", "cust_val")]
        public void UpdateRecycleCacheConstants_isVoidMethod(string cnstName, string cnstVal)
        {
            mockConstantLookupDataLib.Setup(x => x.UpdateRecycleCacheConstants(It.IsAny<string>(), It.IsAny<string>())).Verifiable();
            mockNotificationsLib.Setup(x => x.SendEmailNotifications()).Verifiable();
            new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).UpdateRecycleCacheConstants(cnstName, cnstVal);
            mockConstantLookupDataLib.Verify();
            mockNotificationsLib.Verify();
        }

        private static readonly object[] DeleteAdminConstantParams =
        {
            new object[] { null },
            new object[] {
                new AdminConstant
                {
                    CNST_SID = 1,
                    CNST_NM = "name"
                }
            }
        };

        [Test,
            TestCaseSource("DeleteAdminConstantParams")]
        public void DeleteAdminConstant_isVoidMethod(AdminConstant data)
        {
            if (data != null)
            {
                mockConstantLookupDataLib.Setup(x => x.SetAdminConstants(It.IsAny<CrudModes>(), It.IsAny<AdminConstant>())).Verifiable();
                new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).DeleteAdminConstant(data);
                mockConstantLookupDataLib.Verify();
            }
            else {
                new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).DeleteAdminConstant(data);
            }
        }

        [Test,
            TestCase("constantName")]
        public void GetConstantsByName_ShouldReturnNull_ForNonMatchingInput(string constant)
        {
            var mockData = GetConstantsByNameMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetToolConstants()).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetConstantsByName(constant);
            Assert.IsNull(result);
        }
        
        [Test,
            TestCase("constant name")]
        public void GetConstantsByName_ShouldReturnNotNull_ForMatchingInput(string constant)
        {
            var mockData = GetConstantsByNameMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetToolConstants()).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetConstantsByName(constant);
            Assert.IsNotNull(result);
        }
        
        [Test,
            TestCase("constantName", true)]
        public void GetConstantsByName_ShouldReturnNull_ForNonMatchingInput(string constant, bool nonCachedData)
        {
            var mockData = GetConstantsByNameMockData();
            mockConstantLookupDataLib.Setup(x => x.GetAdminConstants()).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetConstantsByName(constant, nonCachedData);
            Assert.IsNull(result);
        }
        
        [Test,
            TestCase("constant name", true)]
        public void GetConstantsByName_ShouldReturnNotNull_ForMatchingInput(string constant, bool nonCachedData)
        {
            var mockData = GetConstantsByNameMockData();
            mockConstantLookupDataLib.Setup(x => x.GetAdminConstants()).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetConstantsByName(constant, nonCachedData);
            Assert.IsNotNull(result);
        }
        
        [Test,
            TestCase("constant name")]
        public void GetToolConstantValue_ShouldReturnNotNull(string constant)
        {
            var mockData = GetToolConstantValueMockData();
            mockDataCollectionsDataLib.Setup(x => x.GetToolConstants()).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetToolConstantValue(constant);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(true), TestCase(false)]
        public void GetAdminConstants_ShouldReturnNotNull(bool getCachedResult)
        {
            if (!getCachedResult)
            {
                var data = GetAdminConstantsMockData();
                mockConstantLookupDataLib.Setup(x => x.GetAdminConstants()).Returns(data);
                var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetAdminConstants(getCachedResult);
                Assert.IsNotNull(result);
            }
            else
            {
                var data = GetAdminConstantsMockData();
                mockDataCollectionsDataLib.Setup(x => x.GetToolConstants()).Returns(data);
                var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).GetAdminConstants(getCachedResult);
                Assert.IsNotNull(result);
            }
        }

        private static readonly object[] CreateAdminConstantParams =
        {
            new object[] {
                new AdminConstant
                {
                    CNST_DESC = "desc",
                    CNST_SID = 1,
                    CNST_NM = "name",
                    CNST_VAL_TXT = "text",
                    UI_UPD_FLG = false
                }
            }
        };

        [Test,
            TestCaseSource("CreateAdminConstantParams")]
        public void CreateAdminConstant_ShouldReturnNotNull_ForNotNullInput(dynamic data)
        {
            var mockData = CreateAdminConstantMockData();
            mockConstantLookupDataLib.Setup(x => x.SetAdminConstants(It.IsAny<CrudModes>(), It.IsAny<AdminConstant>())).Returns(mockData);
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).CreateAdminConstant(data);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase(null)]
        public void CreateAdminConstant_ShouldReturnNull_ForNullInput(AdminConstant data)
        {
            var result = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).CreateAdminConstant(data);
            Assert.IsNull(result);
        }

        private static readonly object[] _UpdateAdminConstant_paramList =
        {
            new object[]{"cst_str","VERBOSE_LOG_TO_DB",5646,"true",false},
            new object[] { "cst_str", "VERBOSE_LOG_TO_DB", 1234, "false", false},
            new object[]{"test_string","verbose_test",6763,"true", false},
        };

        [Test,
            TestCaseSource("_UpdateAdminConstant_paramList")]
        public void UpdateAdminConstant_ShouldReturnNotNull(dynamic data)
        {
            var mockData = UpdateAdminConstant_mockData();
            var inputData = new AdminConstant
            {
                CNST_DESC = data[0],
                CNST_NM = data[1],
                CNST_SID = data[2],
                CNST_VAL_TXT = data[3],
                UI_UPD_FLG = data[4]
            };
            mockConstantLookupDataLib.Setup(x => x.SetAdminConstants(It.IsAny<CrudModes>(), It.IsAny<AdminConstant>())).Returns(mockData);
            var res = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).UpdateAdminConstant(inputData);
            Assert.IsNotNull(res);
        }
        [Test]
        public void UpdateBatchJobConstants_ShouldReturnNotNull()
        {
            var mockData = UpdateBatchJobConstants_mockData();
            var inputData = new BatchJobConstants
            {
                BTCH_SID = 2,
                BTCH_NM = "idfcdudealags301a",
                BTCH_DSC = "Used to get AGS roles",
                RUN_SCHDL = "[{\"D\":\"3\",\"START\":\"0:0:0\",\"END\":\"23:59:59\",\"INTERVAL\":\"30\"}]",
                ADHC_RUN = false,
                ACTV_IND = true,
                STATUS = "Completed",
                EMP_WWID = 999999,
                TRGRD_BY = "SQL Job Agent"

            };
            mockConstantLookupDataLib.Setup(x => x.SetBatchJobConstants("SELECT", It.IsAny<BatchJobConstants>())).Returns(mockData);
            var res = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).UpdateBatchJobConstants("SELECT",inputData);
            Assert.IsNotNull(res);
        }
        [Test]
        public void UpdateBatchJobStepConstants_ShouldReturnNotNull()
        {
            string json = "[{\"BTCH_STEP_SID\":43,\"BTCH_SID\":5,\"STEP_NM\":\"PR_MYDL_LD_STG_ESDR_ACCESS_REQUESTS @get_data=1\",\"STEP_SRT_ORDR\":20,\"STEP_TYPE\":\"PROCEDURE\",\"ADHC_RUN\":false,\"ACTV_IND\":true,\"TRGRD_BY\":\"\"},{\"BTCH_STEP_SID\":44,\"BTCH_SID\":5,\"STEP_NM\":\"PR_MYDL_LD_STG_ESDR_ACCESS_REQUESTS @delete_stg=1,@upd_day1_cnst=1\",\"STEP_SRT_ORDR\":10,\"STEP_TYPE\":\"PROCEDURE\",\"ADHC_RUN\":false,\"ACTV_IND\":true,\"TRGRD_BY\":\"\"},{\"BTCH_STEP_SID\":45,\"BTCH_SID\":5,\"STEP_NM\":\"PR_AGS_PROCESS_ESDR_REQUESTS\",\"STEP_SRT_ORDR\":30,\"STEP_TYPE\":\"PROCEDURE\",\"ADHC_RUN\":false,\"ACTV_IND\":true,\"TRGRD_BY\":\"\"}]";
            var mockData = UpdateBatchJobStepConstants_mockData();
            mockConstantLookupDataLib.Setup(x => x.SetBatchJobStepConstants("SELECT", 5,json)).Returns(mockData);
            var res = new ConstantsLookupsLib(mockConstantLookupDataLib.Object, mockDataCollectionsDataLib.Object, mockNotificationsLib.Object).UpdateBatchJobStepConstants("SELECT", 5,json);
            Assert.IsNotNull(res);
        }



        private List<AdminConstant> GetConstantsByNameMockData()
        {
            List<AdminConstant> returnConstantsList = new List<AdminConstant>()
            {
                new AdminConstant()
                {
                    CNST_DESC = "constant description",
                    CNST_NM = "constant name",
                    CNST_SID = 1,
                    CNST_VAL_TXT = "constant text",
                    UI_UPD_FLG = true
                }
            };
            return returnConstantsList;
        }
        
        private List<AdminConstant> GetToolConstantValueMockData()
        {
            List<AdminConstant> returnConstantsList = new List<AdminConstant>()
            {
                new AdminConstant()
                {
                    CNST_DESC = "constant description",
                    CNST_NM = "constant name",
                    CNST_SID = 1,
                    CNST_VAL_TXT = "constant value",
                    UI_UPD_FLG = true
                }
            };
            return returnConstantsList;
        }

        private List<AdminConstant> GetAdminConstantsMockData()
        {
            List<AdminConstant> returnConstantsList = new List<AdminConstant>()
            {
                new AdminConstant()
                {
                    CNST_DESC = "constant description",
                    CNST_NM = "constant name",
                    CNST_SID = 1,
                    CNST_VAL_TXT = "constant text",
                    UI_UPD_FLG = true
                },
                new AdminConstant()
                {
                    CNST_DESC = "constant description",
                    CNST_NM = "constantName",
                    CNST_SID = 1,
                    CNST_VAL_TXT = "constant text",
                    UI_UPD_FLG = true
                }
            };
            return returnConstantsList;
        }

        private AdminConstant CreateAdminConstantMockData()
        {
            AdminConstant returnConstantsList = new AdminConstant
            {
                CNST_DESC = "constant description",
                CNST_NM = "constant name",
                CNST_SID = 1,
                CNST_VAL_TXT = "constant text",
                UI_UPD_FLG = true
            };            
            return returnConstantsList;
        }
        private AdminConstant UpdateAdminConstant_mockData()
        {
            var mockData = new AdminConstant
            {
                CNST_DESC = "cnst",
                CNST_NM = "cst_nm",
                CNST_SID = 231,
                CNST_VAL_TXT = "txt",
                UI_UPD_FLG = true
            };
            return mockData;
        }
        private List<BatchJobConstants> UpdateBatchJobConstants_mockData()
        {
            List<BatchJobConstants> batchJobConstants =new List<BatchJobConstants>();
            var mockData = new BatchJobConstants
            {

              BTCH_SID=2 ,
              BTCH_NM="idfcdudealags301a",
              BTCH_DSC="Used to get AGS roles",
              RUN_SCHDL= "[{\"D\":\"3\",\"START\":\"0:0:0\",\"END\":\"23:59:59\",\"INTERVAL\":\"30\"}]", 
              ADHC_RUN=false,
              ACTV_IND=true ,
              STATUS="Completed",
              EMP_WWID=999999,
              TRGRD_BY="SQL Job Agent"
             };
            batchJobConstants.Add(mockData);
            return batchJobConstants;
        }
        private List<BatchJobStepConstants> UpdateBatchJobStepConstants_mockData()
        {
            List<BatchJobStepConstants> batchJobConstants = new List<BatchJobStepConstants>();
            var mockData = new BatchJobStepConstants
            {

                BTCH_STEP_SID = 45,
                BTCH_SID = 5,
                STEP_SRT_ORDR = 30,
                STEP_NM = "PR_AGS_PROCESS_ESDR_REQUESTS",
                STEP_TYPE="PRDOCEDURE",
                ADHC_RUN = false,
                ACTV_IND = true,
                EMP_WWID = 999999,
            };
            batchJobConstants.Add(mockData);
            return batchJobConstants;
        }
    }
}