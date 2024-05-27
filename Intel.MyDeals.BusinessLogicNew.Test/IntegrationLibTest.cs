using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
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
    public class IntegrationLibTest
    {
        public Mock<IJmsDataLib> mockJmsDataLib = new Mock<IJmsDataLib>();
        public Mock<IOpDataCollectorLib> mockDataCollectorLib = new Mock<IOpDataCollectorLib>();
        public Mock<IPrimeCustomersDataLib> mockPrimeCustomerLib = new Mock<IPrimeCustomersDataLib>();
        public Mock<IProductDataLib> mockProductDataLib = new Mock<IProductDataLib>();
        public Mock<IConstantsLookupsLib> mockConstantsLookupsLib = new Mock<IConstantsLookupsLib>();


        private static readonly object[] _IqrFetchCapData_TenderCapRequestObject_Params =
        {
            new object[] {new TenderCapRequestObject{
                    CustomerCIMId = "CustomerCIMId",
                    ProductNameEPMID = "prdEmpID",
                    RangeEndDate = "",
                    RangeStartDate = null,
                    Region = "America"
            }},
            new object[] {new TenderCapRequestObject{
                    CustomerCIMId = "",
                    ProductNameEPMID = "prdEmpID",
                    RangeEndDate = null,
                    RangeStartDate = "",
                    Region = "America"
            }}

        };
        private static readonly object[] _IqrFetchCapData_InvalidDates_Params =
        {
            new object[] {new TenderCapRequestObject{
                    CustomerCIMId = "CustomerCIMId",
                    ProductNameEPMID = "prdEmpID",
                    RangeEndDate = null,
                    RangeStartDate = null,
                    Region = "America"
            }},
            new object[] {new TenderCapRequestObject{
                    CustomerCIMId = "iuefgseouf",
                    ProductNameEPMID = "prdEmpID",
                    RangeEndDate = "",
                    RangeStartDate = "",
                    Region = "America"
            }}

        };
        private static readonly object[] MuleSoftReturnTenderStatusByGuid_params =
        {
            new object [] {Guid.Empty,"SUCCESS",123},
            new  object[] {new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482"),"Fail",456 }
        };

        [Test,
            TestCase("Demo_Xid")]
        public void ReTriggerMuleSoftByXid_ReturnsString_ContainingFailedKeyword_AndXidInputString(string xid)
        {
            var res = new IntegrationLib(mockJmsDataLib.Object,mockDataCollectorLib.Object,mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).ReTriggerMuleSoftByXid(xid);
            Assert.That(res.Contains(xid));
            Assert.That(res.Contains("FAILED"));
        }

        [Test,
            TestCaseSource("_IqrFetchCapData_TenderCapRequestObject_Params")]
        public void IqrFetchCapData_ReturnsErrorCimIdString_forEmptyCustomerCIMIdInput_orZeroCustId(dynamic data)
        {
            TenderCapRequestObject TenderCapRequestObject_input = data;
            var res = "";
            if (TenderCapRequestObject_input.CustomerCIMId == "")
            {
                mockJmsDataLib.Setup(x=>x.FetchCustFromCimId(It.IsAny<string>())).Returns(2);
                res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).IqrFetchCapData(TenderCapRequestObject_input);
            }
            else
            {
                mockJmsDataLib.Setup(x => x.FetchCustFromCimId(It.IsAny<string>())).Returns(0);
                res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).IqrFetchCapData(TenderCapRequestObject_input);
            }
            Assert.AreEqual(res, "ERROR: Failed on CIM ID Lookup");
        }

        [Test,
            TestCase("Empty_MydlPdctName"),
            TestCase("Zero_PdctNbrSid")]
        public void IqrFetchCapData_ReturnsErrorEmpIdLookupString_forEmptyMydlPdctName_orZeroPdctNbrSid(string type)
        {
            TenderCapRequestObject TenderCapRequestObject_input = new TenderCapRequestObject
            {
                CustomerCIMId = "23",
                ProductNameEPMID = "prdEmpID",
                RangeEndDate = "",
                RangeStartDate = "",
                Region = "America"
            };
            var mockData = FetchProdFromProcessorEpmMap_getMockData(type);
            mockJmsDataLib.Setup(x => x.FetchCustFromCimId(It.IsAny<string>())).Returns(2);
            mockJmsDataLib.Setup(x=>x.FetchProdFromProcessorEpmMap(It.IsAny<int>(),It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).IqrFetchCapData(TenderCapRequestObject_input);
            Assert.AreEqual(res, "ERROR: Failed on EPM ID Lookup");
        }

        [Test,
            TestCaseSource("_IqrFetchCapData_InvalidDates_Params")]
        public void IqrFetchCapData_ThrowsException_forInvalidStartOrEndDate(dynamic data)
        {
            TenderCapRequestObject TenderCapRequestObject_input = data;
            var mockData = FetchProdFromProcessorEpmMap_getMockData("mockData");
            mockJmsDataLib.Setup(x => x.FetchCustFromCimId(It.IsAny<string>())).Returns(2);
            mockJmsDataLib.Setup(x => x.FetchProdFromProcessorEpmMap(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            if(TenderCapRequestObject_input.RangeStartDate == null || TenderCapRequestObject_input.RangeEndDate == null)
            {
                Assert.Throws<ArgumentNullException>(() => new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).IqrFetchCapData(TenderCapRequestObject_input));
            }else if(TenderCapRequestObject_input.RangeStartDate == "" || TenderCapRequestObject_input.RangeEndDate == "")
            {
                Assert.Throws<FormatException>(() => new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).IqrFetchCapData(TenderCapRequestObject_input));
            }
        }

        //ProductDataLib is getting instantiated, these testcases can be used if we replace it with interface in IntegrationLib.cs file
        //[Test]
        //public void IqrFetchCapData_ReturnsNoRecordsError_forEmptyMockData_fromProductDataLib()
        //{
        //    TenderCapRequestObject TenderCapRequestObject_input = new TenderCapRequestObject
        //    {
        //        CustomerCIMId = "23",
        //        ProductNameEPMID = "prdEmpID",
        //        RangeEndDate = "2012-04-05",
        //        RangeStartDate = "2012-06-05",
        //        Region = "America"
        //    };
        //    var mockData = FetchProdFromProcessorEpmMap_getMockData("mockData");
        //    mockJmsDataLib.Setup(x => x.FetchCustFromCimId(It.IsAny<string>())).Returns(2);
        //    mockJmsDataLib.Setup(x => x.FetchProdFromProcessorEpmMap(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
        //    mockProductDataLib.Setup(x => x.GetProductCAPYCS2Data(It.IsAny<List<ProductCAPYCS2Calc>>(), It.IsAny<string>(), It.IsAny<string>())).Returns(new List<ProductCAPYCS2>());
        //    var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object).IqrFetchCapData(TenderCapRequestObject_input);
        //    Assert.AreEqual(res, "ERROR: No Records Returned");
        //}

        //[Test]
        //public void IqrFetchCapData_ReturnsNotNull_forValidInputParams()
        //{
        //    TenderCapRequestObject TenderCapRequestObject_input = new TenderCapRequestObject
        //    {
        //        CustomerCIMId = "23",
        //        ProductNameEPMID = "prdEmpID",
        //        RangeEndDate = "2012-04-05",
        //        RangeStartDate = "2012-06-05",
        //        Region = "America"
        //    };
        //    Add 2 dummy items in the list 
        //    var productCapYcs2_mockData = new List<ProductCAPYCS2>();
        //    var mockData = FetchProdFromProcessorEpmMap_getMockData("mockData");
        //    mockJmsDataLib.Setup(x => x.FetchCustFromCimId(It.IsAny<string>())).Returns(2);
        //    mockJmsDataLib.Setup(x => x.FetchProdFromProcessorEpmMap(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
        //    mockProductDataLib.Setup(x => x.GetProductCAPYCS2Data(It.IsAny<List<ProductCAPYCS2Calc>>(), It.IsAny<string>(), It.IsAny<string>())).Returns(productCapYcs2_mockData);
        //    var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object).IqrFetchCapData(TenderCapRequestObject_input);
        //    Assert.IsNotNull(res);
        //}

        [Test]
        public void ReturnSalesForceTenderResults_ReturnsStringContainingSuccessfullyReturned()
        {
            List<TenderTransferObject> mockData = ReturnSalesForceTenderResults_TenderTransferObject_getMockData();
            mockJmsDataLib.Setup(x => x.FetchTendersStagedData(It.IsAny<string>(), It.IsAny<Guid>())).Returns(mockData);
            mockJmsDataLib.Setup(x => x.PublishBackToSfTenders(It.IsAny<string>())).Returns(true);
            mockJmsDataLib.Setup(x => x.UpdateTendersStage(It.IsAny<Guid>(),It.IsAny<string>(),It.IsAny<List<int>>())).Verifiable();
            var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).ReturnSalesForceTenderResults();
            mockJmsDataLib.Verify();
            Assert.That(res.Contains("successfully returned"));
        }

        [Test,
            TestCase("123", "SUCCESS"),
            TestCase("123", "Fail")]
        public void MuleSoftReturnTenderStatus_ReturnsAppropriateStringBasedOnRetstatus(string xid, string retStatus)
        {
            if(retStatus == "SUCCESS")
            {
                var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).MuleSoftReturnTenderStatus(xid, retStatus);
                Assert.That(res.Contains($"{xid}"));
            }
            else
            {
                var mockData = new TenderXidObject { btchGuid = Guid.Empty,dealId = 1234};
                mockJmsDataLib.Setup(x=>x.FetchTendersReturnByXid(It.IsAny<string>())).Returns(mockData);
                mockJmsDataLib.Setup(x => x.UpdateTendersStage(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<List<int>>())).Verifiable();
                var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).MuleSoftReturnTenderStatus(xid, retStatus);
                mockJmsDataLib.Verify();
                string batchString = mockData.btchGuid.ToString();
                Assert.That(res.Contains(batchString));

            }
        }

        [Test,
            TestCaseSource("MuleSoftReturnTenderStatusByGuid_params")]
        public void MuleSoftReturnTenderStatusByGuid_ReturnsStringContainingBatchId_AndCallsUpdateTendersStageWithAppropriateRequeststatusBasedOnRetstatus(Guid btchId, string retStatus, int dealId)
        {   
            if(retStatus == "SUCCESS")
            {
                mockJmsDataLib.Setup(x => x.UpdateTendersStage(It.IsAny<Guid>(), It.Is<string>(r => r == "PO_Processing_Complete"), It.IsAny<List<int>>())).Verifiable();
            }
            else
            {
                mockJmsDataLib.Setup(x => x.UpdateTendersStage(It.IsAny<Guid>(), It.Is<string>(r => r == "PO_Error_Resend"), It.IsAny<List<int>>())).Verifiable();
            }
            var res = new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).MuleSoftReturnTenderStatusByGuid(btchId,retStatus,dealId );
            mockJmsDataLib.Verify();
            string batchString = btchId.ToString();
            Assert.That(res.Contains(batchString));
        }

        [Test,
            TestCase(7365,"salesFrcId","lenovo","America")]
        public void UpdateUnifiedEndCustomer_callsVoidMethodsProperly(int CntrctId, string saleForceId, string primeCustomerName, string primeCustomerCountry)
        {
            mockPrimeCustomerLib.Setup(x=>x.FetchEndCustomerMap(It.IsAny<string>(),It.IsAny<string>(), It.IsAny<string>())).Returns(new EndCustomerObject());
            mockJmsDataLib.Setup(x=>x.SaveTendersDataToStage(It.Is<string>(r=> r == "TENDER_DEALS_RESPONSE"),It.IsAny<List<int>>(),It.IsAny<string>())).Returns(Guid.NewGuid());
            mockJmsDataLib.Setup(x => x.PublishBackToSfTenders(It.IsAny<string>())).Returns(true);
            mockJmsDataLib.Setup(x => x.UpdateTendersStage(It.IsAny<Guid>(), It.Is<string>(r=> r == "PO_Processing_Complete"), It.IsAny<List<int>>())).Verifiable();
            new IntegrationLib(mockJmsDataLib.Object, mockDataCollectorLib.Object, mockPrimeCustomerLib.Object, mockConstantsLookupsLib.Object).UpdateUnifiedEndCustomer(CntrctId,saleForceId,primeCustomerName,primeCustomerCountry);
            mockJmsDataLib.Verify();
        }

        private ProductEpmObject FetchProdFromProcessorEpmMap_getMockData(string type)
        {   
            var mockData = new ProductEpmObject();
            if(type == "Empty_MydlPdctName")
            {
                mockData = new ProductEpmObject
                {
                    PrdGrpEpmId = 9,
                    PdctNbrSid = 0,
                    EdwPcsrNbr = "iugsogd",
                    MydlPdctName = ""
                };
            }
            else if(type == "Zero_PdctNbrSid")
            {
                mockData = new ProductEpmObject
                {
                    PrdGrpEpmId = 9,
                    PdctNbrSid = 0,
                    EdwPcsrNbr = "iugsogd",
                    MydlPdctName = "sougo"
                };
            }
            else
            {
                mockData = new ProductEpmObject
                {
                    PrdGrpEpmId = 9,
                    PdctNbrSid = 6,
                    EdwPcsrNbr = "iugsogd",
                    MydlPdctName = "sougo"
                };
            }
            return mockData;
        }

        private   List<TenderTransferObject> ReturnSalesForceTenderResults_TenderTransferObject_getMockData()
        {
            var mockData = new List<TenderTransferObject>() { new TenderTransferObject
            {
                RqstSid  = 234,
                DealId  = 223,
                BtchId  = Guid.Empty,
                RqstJsonData  = "{'key':'value'}",
                RqstSts  = "get",
            } };
            return mockData;
        }
    }
}
