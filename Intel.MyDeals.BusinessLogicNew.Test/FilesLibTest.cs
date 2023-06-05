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
    public class FilesLibTest
    {
        public Mock<IFilesDataLib> mockFilesDataLib = new Mock<IFilesDataLib>();
        private static readonly object[] _paramList_byte =
        {
            new object[] { new byte[] {0,1,2 } }
        };
        private static readonly object[] _paramList_fileAttachment_and_byte =
        {
            new object[] { 321, new DateTime(2022), 56, "cntn_type", new DateTime(2023), 123476567, 345654, 4432, "file_nm", true, 56, 678, 09,70 , new byte[] { 00,1,11} }
        };

        [Test,
            TestCaseSource("_paramList_byte")]
        public void ExtractMeetCompFile_Returns_NotNull(byte[] data)
        {
            var mockData = getMeetCompMockData();
            mockFilesDataLib.Setup(x => x.ExtractMeetCompFile(It.IsAny<byte[]>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).ExtractMeetCompFile(data);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test]
        public void GetMeetCompTemplateFile_Returns_NotNull()
        {
            var mockData = getFileAttachmentData_MockData("file_nm");
            mockFilesDataLib.Setup(x => x.GetMeetCompTemplateFile()).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).GetMeetCompTemplateFile();
            Assert.IsNotNull(result);
        }

        [Test,
            TestCaseSource("_paramList_fileAttachment_and_byte")]
        public void SaveFileAttachment_Returns_True(dynamic data)
        {
            var inputFileAttachmentData = new FileAttachment
            {
                ATTCH_SID = data[0],
                CHG_DTM = data[1],
                CHG_EMP_WWID = data[2],
                CNTN_TYPE = data[3],
                CRE_DTM =  data[4],
                CRE_EMP_WWID = data[5],
                CUST_MBR_SID = data[6],
                FILE_DATA_SID = data[7],
                FILE_NM = data[8],
                IS_COMPRS = data[9],
                OBJ_SID = data[10],
                OBJ_TYPE_SID = data[11],
                SZ_COMPRS = data[12],
                SZ_ORIG = data[13]
            };
            var inputByteData = data[14];
            mockFilesDataLib.Setup(x => x.SaveFileAttachment(It.IsAny<FileAttachment>(), It.IsAny<byte[]>())).Returns(true);
            var result = new FilesLib(mockFilesDataLib.Object).SaveFileAttachment(inputFileAttachmentData,inputByteData);
            Assert.That(result,Is.True);
        }
        [Test,
            TestCase(987,87,05,"tgy")]
        public void GetFileAttachments_Returns_NotNull(int custMbrSid, int objTypeSid, int objSid, string includeGroup)
        {
            var mockData = getFileAttachmentsMockData();
            mockFilesDataLib.Setup(x=>x.GetFileAttachments(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).GetFileAttachments(custMbrSid,objTypeSid, objSid, includeGroup);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCase(987324)]
        public void GetFileAttachmentData_Returns_NotNull(int fileId)
        {
            var mockData = getFileAttachmentData_MockData("file_nm");
            mockFilesDataLib.Setup(x => x.GetFileAttachmentData(It.IsAny<int>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).GetFileAttachmentData(fileId);
            Assert.IsNotNull(result);
        }
        [Test,
            TestCase(78,98,09,234565,"grp")]
        public void DeleteFileAttachment_Returns_True(int custMbrSid, int objTypeSid, int objSid, int fileDataSid, string includeGroup)
        {
            mockFilesDataLib.Setup(x => x.DeleteFileAttachment(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(true);
            var result = new FilesLib(mockFilesDataLib.Object).DeleteFileAttachment(custMbrSid,objTypeSid,objSid,fileDataSid,includeGroup);
            Assert.That(result,Is.True);
        }

        [Test,
            TestCase("random_file_nm"),
            TestCase("BulkUnify"),
            TestCase("DealRecon")]
        public void GetBulkUnifyTemplateFile_Returns_NotNull_andMatchingFileName(string fileType)
        {
            var mockData = getFileAttachmentData_MockData(fileType);
            mockFilesDataLib.Setup(x => x.GetBulkUnifyTemplateFile(It.IsAny<string>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).GetBulkUnifyTemplateFile(fileType);
            Assert.IsNotNull(result);
            if (fileType == "BulkUnify")
            {
                Assert.AreEqual(result.FILE_NM, "BulkUnifyDeals.xlsx");
            }
            else if (fileType == "DealRecon")
            {
                Assert.AreEqual(result.FILE_NM, "DealRecon.xlsx");
            }
            else
            {
                Assert.AreEqual(result.FILE_NM, "BulkPriceUpdate.xlsx");
            }

        }


        [Test,
           TestCaseSource("_paramList_byte")]
        public void ExtractBulkUnifyFile_Returns_NotNull(byte[] data)
        {
            var mockData = getUnifyDealMockData();
            mockFilesDataLib.Setup(x => x.ExtractBulkUnifyFile(It.IsAny<byte[]>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).ExtractBulkUnifyFile(data);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
           TestCaseSource("_paramList_byte")]
        public void ExtractDealReconFile_Returns_NotNull(byte[] data)
        {
            var mockData = GetDealReconMockData();
            mockFilesDataLib.Setup(x => x.ExtractDealReconFile(It.IsAny<byte[]>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).ExtractDealReconFile(data);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
           TestCaseSource("_paramList_byte")]
        public void ExtractBulkPriceUpdateFile_Returns_NotNull(byte[] data)
        {
            var mockData = GetBulkPriceUpdateRecordMockData();
            mockFilesDataLib.Setup(x => x.ExtractBulkPriceUpdateFile(It.IsAny<byte[]>())).Returns(mockData);
            var result = new FilesLib(mockFilesDataLib.Object).ExtractBulkPriceUpdateFile(data);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }



        public List<MeetComp> getMeetCompMockData()
        {
            var mockData = new List<MeetComp> { new MeetComp
            {
                ACTV_IND = true,
                BRND_NM = "brnd_nm",
                CHG_DTM = new DateTime(2022),
                CHG_EMP_NM = "chg_emp_nm",
                CHG_EMP_WWID = 12073345,
                COMP_BNCH = 67543,
                CRE_DTM = new DateTime(2022),
                CRE_EMP_NM = "cre_emp_nm",
                CRE_EMP_WWID = 123456765,
                CUST_MBR_SID = 57465362,
                CUST_NM = "cust_nm",
                HIER_VAL_NM = "hier_val_nm",
                IA_BNCH = 543245,
                MEET_COMP_PRC = 567865,
                MEET_COMP_PRD = "meet_comp_prd",
                MEET_COMP_SID = 12343234,
                PRD_CAT_NM = "prd_cat_nm",
                PRD_MBR_SID = 765443

            } };
            return mockData;
        }

        public FileAttachmentData getFileAttachmentData_MockData(string fileType)
        {
            var file_nm = "";
            if (fileType == "BulkUnify")
            {
                file_nm = "BulkUnifyDeals.xlsx";
            }
            else if (fileType == "DealRecon")
            {
                file_nm = "DealRecon.xlsx";
            }
            else
            {
                file_nm = "BulkPriceUpdate.xlsx";
            }

                var mockData = new FileAttachmentData
            {
                CNTN_TYPE = "cntn_type",
                FILE_DATA = new byte[] { 0, 1, 2 },
                FILE_NM = file_nm,
                IS_COMPRS = false,
                SZ_ORIG = 12334332
            };
            return mockData;
        }

        public List<FileAttachment> getFileAttachmentsMockData()
        {
            var mockData = new List<FileAttachment> { new FileAttachment
            {
                ATTCH_SID = 2323456,
                CHG_DTM = new DateTime(2022),
                CHG_EMP_WWID = 12345654,
                CNTN_TYPE = "cntn_type",
                CRE_DTM = new DateTime(2021),
                CRE_EMP_WWID = 123476567,
                CUST_MBR_SID = 345654,
                FILE_DATA_SID = 4432,
                FILE_NM = "file_nm",
                IS_COMPRS = true,
                OBJ_SID = 456,
                OBJ_TYPE_SID = 678,
                SZ_COMPRS = 09,
                SZ_ORIG =7765
            } };
            return mockData;
        }

        public List<UnifyDeal> getUnifyDealMockData()
        {
            var mockData = new List<UnifyDeal> { new UnifyDeal
            {
                DEAL_ID = 56476,
                UCD_GLOBAL_ID = 66543,
                UCD_GLOBAL_NAME = "ucd_glbl_nm",
                UCD_COUNTRY_CUST_ID = 76,
                UCD_COUNTRY = "cntry",
                DEAL_END_CUSTOMER_RETAIL = "fdre",
                DEAL_END_CUSTOMER_COUNTRY = "cust_cntry",
                RPL_STS_CODE = "sts_code"
            } };
            return mockData;
        }

        public List<DealRecon> GetDealReconMockData()
        {
            var mockData = new List<DealRecon> { new DealRecon
            {
                Deal_ID = 45654,
                Unified_Customer_ID = 323,
                Unified_Customer_Name = "sdf_vc",
                Country_Region_Customer_ID = 87,
                Unified_Country_Region = "america",
                To_be_Unified_Customer_ID = 56,
                To_be_Unified_Customer_Name = "lenovo",
                To_be_Country_Region_Customer_ID = 23,
                To_be_Unified_Country_Region = "asia",
                Rpl_Status_Code = "code"
            } };    
            return mockData;
        }

        public List<BulkPriceUpdateRecord> GetBulkPriceUpdateRecordMockData()
        {
            var mockData = new List<BulkPriceUpdateRecord> { new BulkPriceUpdateRecord
            {
                DealId = 34546,
                DealDesc = "test_str",
                EcapPrice = "test_str",
                Volume = "test_str",
                DealStartDate = "test_str",
                DealEndDate = "test_str",
                ProjectName = "test_str",
                BillingsStartDate = "test_str",
                BillingsEndDate = "test_str",
                TrackerEffectiveStartDate = "test_str",
                AdditionalTermsAndConditions = "test_str",
                UpdateStatus = "test_str",
                DealStage = "test_str",
                ValidationMessages = "test_str"
            } };
            return mockData;
        }
    }
}
