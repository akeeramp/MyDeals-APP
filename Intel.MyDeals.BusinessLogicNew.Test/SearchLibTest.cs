using System;
using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using Intel.MyDeals.BusinessLogic;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    internal class SearchLibTest
    {
        public Mock<ISearchDataLib> mockSearchDataLib = new Mock<ISearchDataLib>();
        public Mock<ITendersLib> mockTendersDataLib = new Mock<ITendersLib>();
        public Mock<IPricingStrategiesLib> mockPricingStrategiesDataLib = new Mock<IPricingStrategiesLib>();

        [Test, TestCase("AdvanceSearchParams")]
        public void GetAdvancedSearchResults_shouldReturnNotNull(dynamic data)
        {
            var searchCondition = "test search condition";
            var orderBy = "2";
            var searchObjTypes = "3";
            var skip = 4;
            var take = 5;

            SearchPacket mockedSearchData = GetAdvancedSearchResultsMockData();

            mockSearchDataLib.Setup(x => x.GetAdvancedSearchResults(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>())).Returns(mockedSearchData);
            var res = new SearchLib(mockSearchDataLib.Object, mockTendersDataLib.Object, mockPricingStrategiesDataLib.Object).GetAdvancedSearchResults(searchCondition, orderBy, searchObjTypes, skip, take);
            Assert.IsNotNull(res);
        }

        [Test, TestCase("SearchParams")]
        public void GetSearchResults_shouldReturnNotNull(dynamic data)
        {
            var searchCondition = "test search condition";
            var custIds = new List<int>();
            custIds.Add(1);
            custIds.Add(2);

            List<SearchResults> mockedSearchData = GetSearchResultsMockData();

            mockSearchDataLib.Setup(x => x.GetSearchResults(It.IsAny<string>(), It.IsAny<List<int>>())).Returns(mockedSearchData);
            var res = new SearchLib(mockSearchDataLib.Object, mockTendersDataLib.Object, mockPricingStrategiesDataLib.Object).GetSearchResults(searchCondition, custIds);
            Assert.IsNotNull(res);
        }

        public SearchPacket GetAdvancedSearchResultsMockData()
        {
            var searchResults = new List<AdvancedSearchResults>();
            searchResults.Add(new AdvancedSearchResults
            {
                CNTRCT_C2A_DATA_C2A_ID = "123",
                CNTRCT_OBJ_SID = 123,
                CNTRCT_TITLE = "mocked title",
                OBJ_SID = 123,
                OBJ_TYPE = "test",
                OBJ_TYPE_SID = 123,
                PRC_ST_OBJ_SID = 123,
                PRC_ST_TITLE = "test",
                SORT_ORD = 1,
                //WIP_DEAL_CHG_DTM = "30-12-11",
                WIP_DEAL_CHG_EMP_NAME = "test",
                WIP_DEAL_CHG_EMP_WWID = 123,
                //WIP_DEAL_CRE_DTM = 30-12-11,
                WIP_DEAL_CRE_EMP_NAME = "test",
                WIP_DEAL_CRE_EMP_WWID = 123,
                WIP_DEAL_DIV_APPROVED_BY = "test",
                WIP_DEAL_GEO_APPROVED_BY = "test"
            });

            var mockedData = new SearchPacket
            {
                SearchResults = searchResults,
                SearchCount = 1
            };
            return mockedData;
        }

        public List<SearchResults> GetSearchResultsMockData()
        {
            var searchResults = new List<SearchResults>();
            searchResults.Add(new SearchResults
            {
                CUST_MBR_SID = 123,
                CUSTOMER = "test",
                OBJ_HIER = "mocktest hierarchy",
                OBJ_SID = 123,
                OBJ_TYPE = "test",
                OBJ_TYPE_SID = 123,
                TITLE = "test title"
            });
            return searchResults;
        }

        [Test, TestCase("Acer", "1-1-2023", "1-1-2024")]
        public void GetTenderResultFilter_shouldReturnNotNull(string custName, string st, string en)
        {
            var dealData = GetTenderResultFilter();
            mockSearchDataLib.Setup(x => x.GetTenderResultFilter(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(dealData);
            var result = new SearchLib(mockSearchDataLib.Object, mockTendersDataLib.Object, mockPricingStrategiesDataLib.Object).GetTenderResultFilter(custName,st,en);
            Assert.NotNull(result);
        }
        private string GetTenderResultFilter()
        {
            return "[{\"CUST_MBR_SID\":\"Acer\",\"WF_STG_CD\":\"Active,Approved,Cancelled,Complete,Draft,Hold,InComplete,Lost,Offer,Pending,Requested,Submitted,Won\",\"PAYOUT_BASED_ON\":\"Consumption,Billings\",\"MRKT_SEG\":\"All Direct Market Segments,Communications,Consumer Electronics(SPD),Consumer No Pull,Consumer Retail Pull,Corp,Education,Embedded:DSS\",\"PERIOD_PROFILE\":\"Yearly,Bi-Weekly (2 weeks),Quarterly,,cha,cha,p\",\"PROGRAM_PAYMENT\":\"Backend,Frontend XOA3,Frontend YCS2\",\"AR_SETTLEMENT_LVL\":\"Issue Credit to Default Sold To by Region,,Cash\",\"COST_TEST_RESULT\":\"InComplete,NA,Pass\",\"MEETCOMP_TEST_RESULT\":\"InComplete,NA,Pass\",\"PASSED_VALIDATION\":\"Complete,Dirty\"}]";
        }
    }
}