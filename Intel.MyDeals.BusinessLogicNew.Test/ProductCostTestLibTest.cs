using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.DataLibrary;
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
    public class ProductCostTestLibTest
    {

        public Mock<IProductCostTestDataLib> mockProductCostTestDataLib = new Mock<IProductCostTestDataLib> ();
        private static readonly object[] _paramList_ProductCostTestRules =
        {
            new object[] { "xyz","abc","def","asd",34526,"str","test",2345 }
        };
        private static readonly object[] _paramList_PCTLegalException =
        {
            new object[] {true,"vfd","pqr", new DateTime(2023, 01, 23, 20, 15, 00, 277),"nm",345,"cost", new DateTime(2023, 01, 23, 20, 15, 00, 277),3, "cust_prd","sjhyf",new DateTime(2023, 01, 23, 20, 15, 00, 277),"ydgiue","dkud","wkdu",false,"sjygj","sjygj","sjygj",3267,"kuf","kuf",new DateTime(2023, 01, 23, 20, 15, 00, 277),new DateTime(2023, 01, 23, 20, 15, 00, 277),"hfg","hfg","hfg","hfg","hfg","hfg",new DateTime(2023, 01, 23, 20, 15, 00, 277),56 }
        };

        [Test]
        public void GetProductCostTestRules_Returns_NotNull()
        {
            var mockData = getPctRulesMockData();
            mockProductCostTestDataLib.Setup(x=> x.GetProductCostTestRules()).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetProductCostTestRules();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);    
        }

        [Test]
        public void GetPCTProductTypeMappings_Returns_NotNull()
        {
            var mockData = getPCTProductTypeMappingsMockData();
            mockProductCostTestDataLib.Setup(x=>x.GetPCTProductTypeMappings()).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetPCTProductTypeMappings();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase(2345)]
        public void GetProductAttributeValues_Returns_NotNull(int verticalId)
        {
            var mockData = getProductAttributeValuesMockData();
            mockProductCostTestDataLib.Setup(x => x.GetProductAttributeValues(It.IsAny<int>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetProductAttributeValues(verticalId);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCaseSource("_paramList_ProductCostTestRules")]
        public void CreatePCTRule_Returns_NotNull(dynamic data)
        {
            var mockData = getPctRulesMockData();
            var inputPctRulesData = new ProductCostTestRules
            {
                CONDITION = data[0],
                COST_TEST_TYPE = data[1],
                CRITERIA = data[2],
                DEAL_PRD_TYPE = data[3],
                DEAL_PRD_TYPE_SID = data[4],
                JSON_TXT = data[5],
                PRD_CAT_NM = data[6],
                PRD_CAT_NM_SID = data[7]
            };
            mockProductCostTestDataLib.Setup(x=>x.SetPCTRules(It.IsAny<CrudModes>(),It.IsAny<ProductCostTestRules>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).CreatePCTRule(inputPctRulesData);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCaseSource("_paramList_ProductCostTestRules")]
        public void UpdatePCTRule_Returns_NotNull(dynamic data)
        {
            var mockData = getPctRulesMockData();
            var inputPctRulesData = new ProductCostTestRules
            {
                CONDITION = data[0],
                COST_TEST_TYPE = data[1],
                CRITERIA = data[2],
                DEAL_PRD_TYPE = data[3],
                DEAL_PRD_TYPE_SID = data[4],
                JSON_TXT = data[5],
                PRD_CAT_NM = data[6],
                PRD_CAT_NM_SID = data[7]
            };
            mockProductCostTestDataLib.Setup(x => x.SetPCTRules(It.IsAny<CrudModes>(), It.IsAny<ProductCostTestRules>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).UpdatePCTRule(inputPctRulesData);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test, 
            TestCaseSource("_paramList_ProductCostTestRules")]
        public void DeletePCTRule_Returns_NotNull(dynamic data)
        {
            var mockData = getPctRulesMockData();
            var inputPctRulesData = new ProductCostTestRules
            {
                CONDITION = data[0],
                COST_TEST_TYPE = data[1],
                CRITERIA = data[2],
                DEAL_PRD_TYPE = data[3],
                DEAL_PRD_TYPE_SID = data[4],
                JSON_TXT = data[5],
                PRD_CAT_NM = data[6],
                PRD_CAT_NM_SID = data[7]
            };
            mockProductCostTestDataLib.Setup(x => x.SetPCTRules(It.IsAny<CrudModes>(), It.IsAny<ProductCostTestRules>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).DeletePCTRule(inputPctRulesData);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCaseSource("_paramList_PCTLegalException")]
        public void DeleteLegalException_Returns_NotNull(dynamic input)
        {
            var mockData = getPctLegalExceptionMockData()[0];
            var inputPctLegalExceptionsData =new PCTLegalException {

                ACTV_IND = input[0],
                APRV_ATRNY = input[1],
                BUSNS_OBJ = input[2],
                CHG_DTM = input[3],
                CHG_EMP_NAME = input[4],
                CHG_EMP_WWID = input[5],
                COST = input[6],
                CRE_DTM = input[7],
                CRE_EMP_WWID = input[8],
                CUST_PRD = input[9],
                DEALS_USED_IN_EXCPT = input[10],
                DT_APRV = input[11],
                EXCPT_RSTRIC_DURN = input[12],
                FRCST_VOL_BYQTR = input[13],
                INTEL_PRD = input[14],
                IS_DSBL = input[15],
                JSTFN_PCT_EXCPT = input[16],
                MEET_COMP_PRC = input[17],
                MEET_COMP_PRD = input[18],
                MYDL_PCT_LGL_EXCPT_SID = input[19],
                OTHER = input[20],
                PCT_EXCPT_NBR = input[21],
                PCT_LGL_EXCPT_END_DT = input[22],
                PCT_LGL_EXCPT_STRT_DT = input[23],
                PRC_RQST = input[24],
                PTNTL_MKT_IMPCT = input[25],
                RQST_ATRNY = input[26],
                RQST_CLNT = input[27],
                SCPE = input[28],
                USED_IN_DL = input[29],
                VER_CRE_DTM = input[30],
                VER_NBR = input[31]
            };
            mockProductCostTestDataLib.Setup(x => x.SetPCTlegalException(It.IsAny<CrudModes>(), It.IsAny<PCTLegalException>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).DeleteLegalException(inputPctLegalExceptionsData);
            Assert.IsNotNull(result);
        }

        [Test,
             TestCaseSource("_paramList_PCTLegalException")]
        public void UpdateLegalException_Returns_NotNull(dynamic input)
        {
            var mockData = getPctLegalExceptionMockData()[0];
            var inputPctLegalExceptionsData = new PCTLegalException
            {

                ACTV_IND = input[0],
                APRV_ATRNY = input[1],
                BUSNS_OBJ = input[2],
                CHG_DTM = input[3],
                CHG_EMP_NAME = input[4],
                CHG_EMP_WWID = input[5],
                COST = input[6],
                CRE_DTM = input[7],
                CRE_EMP_WWID = input[8],
                CUST_PRD = input[9],
                DEALS_USED_IN_EXCPT = input[10],
                DT_APRV = input[11],
                EXCPT_RSTRIC_DURN = input[12],
                FRCST_VOL_BYQTR = input[13],
                INTEL_PRD = input[14],
                IS_DSBL = input[15],
                JSTFN_PCT_EXCPT = input[16],
                MEET_COMP_PRC = input[17],
                MEET_COMP_PRD = input[18],
                MYDL_PCT_LGL_EXCPT_SID = input[19],
                OTHER = input[20],
                PCT_EXCPT_NBR = input[21],
                PCT_LGL_EXCPT_END_DT = input[22],
                PCT_LGL_EXCPT_STRT_DT = input[23],
                PRC_RQST = input[24],
                PTNTL_MKT_IMPCT = input[25],
                RQST_ATRNY = input[26],
                RQST_CLNT = input[27],
                SCPE = input[28],
                USED_IN_DL = input[29],
                VER_CRE_DTM = input[30],
                VER_NBR = input[31]
            };
            mockProductCostTestDataLib.Setup(x => x.SetPCTlegalException(It.IsAny<CrudModes>(), It.IsAny<PCTLegalException>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).UpdateLegalException(inputPctLegalExceptionsData);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCaseSource("_paramList_PCTLegalException")]
        public void CreateLegalException_Returns_NotNull(dynamic input)
        {
            var mockData = getPctLegalExceptionMockData()[0];
            var inputPctLegalExceptionsData = new PCTLegalException
            {

                ACTV_IND = input[0],
                APRV_ATRNY = input[1],
                BUSNS_OBJ = input[2],
                CHG_DTM = input[3],
                CHG_EMP_NAME = input[4],
                CHG_EMP_WWID = input[5],
                COST = input[6],
                CRE_DTM = input[7],
                CRE_EMP_WWID = input[8],
                CUST_PRD = input[9],
                DEALS_USED_IN_EXCPT = input[10],
                DT_APRV = input[11],
                EXCPT_RSTRIC_DURN = input[12],
                FRCST_VOL_BYQTR = input[13],
                INTEL_PRD = input[14],
                IS_DSBL = input[15],
                JSTFN_PCT_EXCPT = input[16],
                MEET_COMP_PRC = input[17],
                MEET_COMP_PRD = input[18],
                MYDL_PCT_LGL_EXCPT_SID = input[19],
                OTHER = input[20],
                PCT_EXCPT_NBR = input[21],
                PCT_LGL_EXCPT_END_DT = input[22],
                PCT_LGL_EXCPT_STRT_DT = input[23],
                PRC_RQST = input[24],
                PTNTL_MKT_IMPCT = input[25],
                RQST_ATRNY = input[26],
                RQST_CLNT = input[27],
                SCPE = input[28],
                USED_IN_DL = input[29],
                VER_CRE_DTM = input[30],
                VER_NBR = input[31]
            };
            mockProductCostTestDataLib.Setup(x => x.SetPCTlegalException(It.IsAny<CrudModes>(), It.IsAny<PCTLegalException>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).CreateLegalException(inputPctLegalExceptionsData);
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetLegalExceptions_Returns_NotNull()
        {
            var mockData = getPctLegalExceptionMockData();
            mockProductCostTestDataLib.Setup(x=> x.GetLegalExceptions()).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetLegalExceptions();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase(234,546)]
        public void GetVersionDetailsPCTExceptions_Returns_NotNull(int PCT_LGL_EXCPT_SID, int excludeCurrVer)
        {
            var mockData = getVersionHistPCTExceptionsMockData();
            mockProductCostTestDataLib.Setup(x => x.GetVersionDetailsPCTExceptions(It.IsAny<int>(),It.IsAny<int>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetVersionDetailsPCTExceptions(PCT_LGL_EXCPT_SID,excludeCurrVer);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("123",true,false)]
        public void DownloadLegalException_Returns_NotNull(string data, bool excludeCurrVer, bool dealList)
        {
            var mockData = getLegalExceptionExportMockData();
            mockProductCostTestDataLib.Setup(x => x.DownloadLegalException(It.IsAny<string>(), It.IsAny<bool>(),It.IsAny<bool>())).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).DownloadLegalException(data, excludeCurrVer,dealList);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("01/12/2022")]
        public void GetLegalExceptions_Returns_NotNull_forSmallerEndDate(DateTime endDate)
        {
            var mockData = getPctLegalExceptionMockData();
            mockProductCostTestDataLib.Setup(x=> x.GetLegalExceptions()).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetLegalExceptions(endDate);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase("02/02/2023")]
        public void GetLegalExceptions_Returns_emptyList_forLargerEndDate(DateTime endDate)
        {
            var mockData = getPctLegalExceptionMockData();
            mockProductCostTestDataLib.Setup(x => x.GetLegalExceptions()).Returns(mockData);
            var result = new ProductCostTestLib(mockProductCostTestDataLib.Object).GetLegalExceptions(endDate);
            Assert.IsEmpty(result);
        }

        public List<ProductCostTestRules> getPctRulesMockData()
        {
            var mockData = new List<ProductCostTestRules> { new ProductCostTestRules{
            
                CONDITION = "cnd",
                COST_TEST_TYPE = "typ",
                CRITERIA = "crt",
                DEAL_PRD_TYPE  = "abc123",
                DEAL_PRD_TYPE_SID  = 123,
                JSON_TXT  = "abc123",
                PRD_CAT_NM  = "abc123",
                PRD_CAT_NM_SID  = 3
            }};
            return mockData;
        }

        public List<ProductTypeMappings> getPCTProductTypeMappingsMockData()
        {
            var mockData = new List<ProductTypeMappings> { new ProductTypeMappings
            {
                PRD_TYPE = "prd",        
                PRD_TYPE_SID = 23,
                VERTICAL = "vrt",
                VERTICAL_SID = 34
            } };
            return mockData;
        }

        public List<ProductAttributeValues> getProductAttributeValuesMockData()
        {
            var mockData = new List<ProductAttributeValues> { new ProductAttributeValues
            {
                ATRB_COL_NM = "cl_nm",
                ATRB_SID = "sid",
                DISPLAYNAME = "dsp_nm",
                VALUE = "val"
            } };
            return mockData;
        }
        public List<PCTLegalException> getPctLegalExceptionMockData()
        {
            var mockData = new List<PCTLegalException> { new PCTLegalException {

                ACTV_IND = true,
                APRV_ATRNY = "atrny",
                BUSNS_OBJ = "obj",
                CHG_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CHG_EMP_NAME = "nm",
                CHG_EMP_WWID = 345,
                COST = "cost",
                CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CRE_EMP_WWID = 3,
                CUST_PRD = "cust_prd",
                DEALS_USED_IN_EXCPT = "sjhyf",
                DT_APRV = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                EXCPT_RSTRIC_DURN = "ydgiue",
                FRCST_VOL_BYQTR = "dkud",
                INTEL_PRD = "wkdu",
                IS_DSBL = false,
                JSTFN_PCT_EXCPT = "sjygj",
                MEET_COMP_PRC = "sjygj",
                MEET_COMP_PRD = "sjygj",
                MYDL_PCT_LGL_EXCPT_SID = 3267,
                OTHER = "kuf",
                PCT_EXCPT_NBR = "kuf",
                PCT_LGL_EXCPT_END_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PCT_LGL_EXCPT_STRT_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PRC_RQST = "hfg",
                PTNTL_MKT_IMPCT = "hfg",
                RQST_ATRNY = "hfg",
                RQST_CLNT = "hfg",
                SCPE = "hfg",
                USED_IN_DL = "hfg",
                VER_CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                VER_NBR = 56
            } };
            return mockData;
        }

        public List<VersionHistPCTExceptions> getVersionHistPCTExceptionsMockData()
        {
            var mockData = new List<VersionHistPCTExceptions> { new VersionHistPCTExceptions
            {
                ACTV_IND = true,
                APRV_ATRNY = "dfg",
                BUSNS_OBJ = "obj",
                CHG_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CHG_EMP_NAME = "nm",
                CHG_EMP_WWID = 1234565,
                COST = "cpst",
                CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CRE_EMP_WWID = 34,
                CUST_PRD = "prd",
                DT_APRV = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                EXCPT_RSTRIC_DURN = "fgh",
                FRCST_VOL_BYQTR = "fgh",
                INTEL_PRD = "fgh",
                IS_DSBL = false,
                JSTFN_PCT_EXCPT = "thy",
                MEET_COMP_PRC = "thy",
                MEET_COMP_PRD = "thy",
                MYDL_PCT_LGL_EXCPT_SID = 45,
                OTHER = "othr",
                PCT_EXCPT_NBR = "othr",
                PCT_LGL_EXCPT_END_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PCT_LGL_EXCPT_STRT_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PRC_RQST = "sml",
                PTNTL_MKT_IMPCT = "sml",
                RQST_ATRNY = "sml",
                RQST_CLNT = "sml",
                SCPE = "sml",
                VER_CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                VER_NBR = 87
            } };
            return mockData;
        }

        public List<LegalExceptionExport> getLegalExceptionExportMockData()
        {
            var mockData = new List<LegalExceptionExport> { new LegalExceptionExport
            {
                ACTV_IND = true,
                APRV_ATRNY = "obj",
                BUSNS_OBJ = "obj",
                CHG_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CHG_EMP_NAME = "emp_nm",
                CHG_EMP_WWID = 345432,
                COST = "cost",
                CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                CRE_EMP_WWID = 5643232,
                CUST_PRD = "cst_prd",
                DEALS_USED_IN_EXCPT = "excpt",
                DT_APRV = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                EXCPT_RSTRIC_DURN = "prd",
                FRCST_VOL_BYQTR = "prd",
                INTEL_PRD = "prd",
                IS_DSBL = false,
                JSTFN_PCT_EXCPT = "prc",
                MEET_COMP_PRC = "prc",
                MEET_COMP_PRD = "prc",
                MYDL_PCT_LGL_EXCPT_SID = 5897,
                OTHER = "oth",
                PCT_EXCPT_NBR = "jku",
                PCT_LGL_EXCPT_END_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PCT_LGL_EXCPT_STRT_DT = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                PRC_RQST = "fdre",
                PTNTL_MKT_IMPCT = "fdre",
                RQST_ATRNY = "fdre",
                RQST_CLNT = "fdre",
                SCPE = "fdre",
                VER_CRE_DTM = new DateTime(2023, 01, 23, 20, 15, 00, 277),
                VER_NBR = 546
            } };
            return mockData;
        }
    }
}
