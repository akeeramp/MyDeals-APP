using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Data;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class PrimeCustomersLibTest
    {
        public Mock<IPrimeCustomersDataLib> mockIPrimeCustomersDataLib = new Mock<IPrimeCustomersDataLib>();
        public Mock<IDataCollectionsDataLib> mockIDataCollectionsDataLib = new Mock<IDataCollectionsDataLib>();
        public Mock<IIntegrationLib> mockIIntegrationLib = new Mock<IIntegrationLib>();
        public Mock<IJmsDataLib> mockIJmsDataLib = new Mock<IJmsDataLib>();

        [Test]
        public void GetPrimeCustomerDetails_ShouldReturnNotNull()
        {
            var mockData = new List<PrimeCustomers>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetPrimeCustomerDetails()).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetPrimeCustomerDetails();
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetCountries_ShouldReturnNotNull()
        {
            var mockData = new List<Countires>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetCountries()).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetCountries();
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetPrimeCustomers_ShouldReturnNotNull()
        {
            var mockData = new List<PrimeCustomers>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetPrimeCustomers()).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetPrimeCustomers();
            Assert.IsNotNull(result);
        }

        [Test]
        public void GetUnPrimeDeals_ShouldReturnNotNull()
        {
            var mockData = new List<UnPrimeDeals>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetUnPrimeDeals()).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetUnPrimeDeals();
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("Lenovo", "India")]
        public void GetEndCustomerData_ShouldReturnNotNull(string endCustomerName, string endCustomerCountry)
        {
            var mockData = new List<PrimeCustomerDetails>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetEndCustomerData(It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetEndCustomerData(endCustomerName, endCustomerCountry);
            Assert.IsNotNull(result);
        }
        
        [Test,
            TestCase("End Customer Object")]
        public void ValidateEndCustomer_ShouldReturnNotNull(string endCustObj)
        {
            var mockData = new List<EndCustomer>();
            mockIPrimeCustomersDataLib.Setup(x => x.ValidateEndCustomer(It.IsAny<string>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).ValidateEndCustomer(endCustObj);
            Assert.IsNotNull(result);
        }

        private static readonly object[] UploadBulkUnifyDealsParams =
        {
            new object[] { new List<UnifyDeal>() }
        };

        [Test,
            TestCaseSource("UploadBulkUnifyDealsParams")]
        public void UploadBulkUnifyDeals_ShouldReturnNotNull(dynamic unifyDeals)
        {
            var mockData = new List<UnifiedDealsSummary>();
            mockIPrimeCustomersDataLib.Setup(x => x.UploadBulkUnifyDeals(It.IsAny<List<UnifyDeal>>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).UploadBulkUnifyDeals(unifyDeals);
            Assert.IsNotNull(result);
        }
        
        private static readonly object[] ValidateBulkUnifyDealParams =
        {
            new object[] { new List<UnifyDeal>() }
        };

        [Test,
            TestCaseSource("ValidateBulkUnifyDealParams")]
        public void ValidateBulkUnifyDeals_ShouldReturnNotNull(dynamic unifyDeals)
        {
            var mockData = new List<DealsUnificationValidationSummary>();
            mockIPrimeCustomersDataLib.Setup(x => x.ValidateBulkUnifyDeals(It.IsAny<List<UnifyDeal>>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).ValidateBulkUnifyDeals(unifyDeals);
            Assert.IsNotNull(result);
        }
        
        [Test]
        public void GetRplStatusCodes_ShouldReturnNotNull()
        {
            var mockData = new List<RplStatusCode>();
            mockIPrimeCustomersDataLib.Setup(x => x.GetRplStatusCodes()).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).GetRplStatusCodes();
            Assert.IsNotNull(result);
        }

        private static readonly object[] updateDealReconParams =
        {
            new object[] { new List<DealRecon>() }
        };

        [Test,
            TestCaseSource("updateDealReconParams")]
        public void UpdateDealRecon_ShouldReturnNotNull(dynamic lstDealRecons)
        {
            var mockData = new List<DealReconInvalidRecords>();
            mockIPrimeCustomersDataLib.Setup(x => x.updateDealRecon(It.IsAny<List<DealRecon>>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).updateDealRecon(lstDealRecons);
            Assert.IsNotNull(result);
        }

        private static readonly object[] RetryUCDRequestParams =
        {
            new object[] { new List<UCDRetry>() },
            new object[] { 
                new List<UCDRetry>()
                {
                    new UCDRetry()
                    {
                        END_CUST_OBJ = "",
                        OBJ_SID = 0
                    } 
                }
            }
        };

        [Test,
            TestCaseSource("RetryUCDRequestParams")]
        public void RetryUCDRequest_ShouldReturnFalse(dynamic data)
        {
            List<UCDRetry> mockdata = data;
            mockIPrimeCustomersDataLib.Setup(x => x.RetryUCDRequest(It.IsAny<bool>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockdata);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).RetryUCDRequest();
            Assert.IsFalse(result);
        }//RetryUCDRequest() - this is internally calling UnPrimeDealsLogs() fxn for return True testcase, will pick that TC later
        [Test,
           TestCase("Deal Id", "End Customer Object")]
        public void ResubmissionDeals_ShouldReturnNotNull(string dealId, string endCustObj)
        {
            DataTable mockData = new DataTable();
            mockIPrimeCustomersDataLib.Setup(x => x.ResubmissionDeals(It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new PrimeCustomersLib(mockIPrimeCustomersDataLib.Object, mockIDataCollectionsDataLib.Object, mockIIntegrationLib.Object, mockIJmsDataLib.Object).ResubmissionDeals(dealId, endCustObj);
            Assert.IsNotNull(result);
        }
    }
}