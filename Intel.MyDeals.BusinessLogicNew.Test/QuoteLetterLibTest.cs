using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.deal;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Core;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Runtime.CompilerServices;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class QuoteLetterLibTest
    {
        public Mock<IQuoteLetterDataLib> mockQuoteLetterDataLib = new Mock<IQuoteLetterDataLib>();

        [Test]
        public void AdminGetTemplates_should_return_notNull()
        {
            var data = AdminGetTemplatesMockData();
            mockQuoteLetterDataLib.Setup(x => x.AdminGetTemplates()).Returns(data);
            var result = new QuoteLetterLib(mockQuoteLetterDataLib.Object).AdminGetTemplates();
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        private static readonly object[] AdminSaveTemplateParams =
        {
            new object[] { "BodyInfo", "HdrInfo", "ObjSetTypeCd", "ProgramPayment", 2}
        };

        [Test,
            TestCaseSource("AdminSaveTemplateParams")]
        public void AdminSaveTemplate_ShouldReturnNotNull(dynamic template)
        {
            AdminQuoteLetter templateData = new AdminQuoteLetter
            {
                BODY_INFO = template[0],
                HDR_INFO = template[1],
                OBJ_SET_TYPE_CD = template[2],
                PROGRAM_PAYMENT = template[3],
                TMPLT_SID = template[4]
            };
            mockQuoteLetterDataLib.Setup(x => x.AdminSaveTemplate(It.IsAny<AdminQuoteLetter>())).Returns(templateData);
            var result = new QuoteLetterLib(mockQuoteLetterDataLib.Object).AdminSaveTemplate(templateData);
            Assert.IsNotNull(result);
        }

        private static readonly object[] quoteLetterParams =
        {
            new object[] { new QuoteLetterData {
                CustomerId = "customerID",
                ObjectTypeId = "objectTypeId",
                ObjectSid = "objectSid",
                ContentInfo = new QuoteLetterContentInfo
                {
                    CONTRACT_PRODUCT = "product",
                    CUST_NM = "name",
                    EMAIL_ADDR = "email",
                    END_CUSTOMER = "customer",
                    OBJ_SET_TYPE_CD = "type",
                    OBJ_SID = 1,
                    PDF_FILE = new byte[] {10, 20},
                    PROGRAM_PAYMENT = "payment",
                    QUOTE_LETTER = "letter",
                    REBATE_TYPE = "",
                    TRKR_NBR = "120",
                    WF_STG_CD = "cd"
                },
                TemplateInfo = new QuoteLetterTemplateInfo
                {
                    BODY_INFO = "info",
                    CHG_DTM = new DateTime(),
                    CHG_EMP_WWID = 120,
                    CRE_DTM = new DateTime(),
                    CRE_EMP_WWID = 130,
                    HDR_INFO = "",
                    OBJ_SET_TYPE_CD = "cd",
                    PROGRAM_PAYMENT = "payment",
                    RLSE_ID = "id",
                    TMPLT_SID = 2
                }
            }, "headerInfo", "bodyInfo", false, new ContractToken
            {
                BulkTenderUpdate = true,
                ContractId = 0,
                ContractIdList  =null,
                CopyFromId = 0,
                CopyFromObjType = 0,
                CustAccpt = null,
                CustId = 0,
                DeleteAllPTR = true,
                NeedToCheckForDelete = true,
                TimeFlow    = {}                
            }
        }
    };

        [Test,
            TestCaseSource("quoteLetterParams")]
        public void GetDealQuoteLetter_ShouldReturnNotNull(dynamic data)
        {
            var quoteLetterDealData = data[0];
            var headerInfo = data[1];
            var bodyInfo = data[2];
            var forceRegenerateQuoteLetter = data[3];
            var contractToken = data[4];
            //not able to access the datalibrary logic directly into TCs as GenerateQuoteLetterPDF() function is private.
            //For now adding basic TC, more TCs needs to be added in future.

            QuoteLetterFile quoteLetterPdfBytes = GetDealQuoteLetterMockData(quoteLetterDealData);

            mockQuoteLetterDataLib.Setup(x => x.GetDealQuoteLetter(It.IsAny<QuoteLetterData>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<ContractToken>())).Returns(quoteLetterPdfBytes);
            var result = new QuoteLetterLib(mockQuoteLetterDataLib.Object).GetDealQuoteLetter(quoteLetterDealData, headerInfo, bodyInfo, forceRegenerateQuoteLetter, contractToken);
            Assert.IsNotNull(result);
        }

        public List<AdminQuoteLetter> AdminGetTemplatesMockData()
        {
            var data = new List<AdminQuoteLetter>()
            {
                new AdminQuoteLetter
                {
                    BODY_INFO = "quoteLetterBodyInfo",
                    HDR_INFO = "quoteLetterHdrInfo",
                    OBJ_SET_TYPE_CD = "quoteLetterSetType",
                    PROGRAM_PAYMENT = "quoteLetterProgramPayment",
                    TMPLT_SID = 1
                }
            };
            return data;
        }
        
        public QuoteLetterFile GetDealQuoteLetterMockData(QuoteLetterData mockData)
        {
            string fileName = "QuoteLetter_Preview.pdf";
            //not able to access the datalibrary logic directly into TCs as GenerateQuoteLetterPDF() function is private.
            //For now adding basic TC, more TCs needs to be added in future.
            var data = new QuoteLetterFile
            {
                Content = mockData.ContentInfo.PDF_FILE,
                Name = fileName
            };
            return data;
        }
    }
}