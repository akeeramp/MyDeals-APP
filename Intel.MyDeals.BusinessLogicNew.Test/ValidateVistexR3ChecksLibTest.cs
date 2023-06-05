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
    public class ValidateVistexR3ChecksLibTest
    {
        public Mock<IValidateVistexR3ChecksDataLib> mockValidateVistexR3ChecksDataLib = new Mock<IValidateVistexR3ChecksDataLib> ();
        private static readonly object[] _paramList =
        {
            new object[] { "123",true,"custName",23 }
        };

        [Test,
            TestCaseSource("_paramList")]
        public void ValidateVistexR3Checks_Returns_NotNull(dynamic data)
        {
            var mockData = ValidateVistexR3ChecksMockData();
            var inputTestCaseData = new PushValidateVistexR3Data
            {
                DEAL_IDS = data[0],
                VSTX_CUST_FLAG = data[1],
                CUST = data[2],
                MODE = data[3]
            };
           mockValidateVistexR3ChecksDataLib.Setup(x=>x.ValidateVistexR3Check(It.IsAny<List<int>>(),It.IsAny<int>(),It.IsAny<string>())).Returns(mockData);
            var result = new ValidateVistexR3ChecksLib(mockValidateVistexR3ChecksDataLib.Object).ValidateVistexR3Checks(inputTestCaseData);
            Assert.IsNotNull(result);
        }

        public ValidateVistexR3Wrapper ValidateVistexR3ChecksMockData()
        {
            var CutoverResults = new List<R3CutoverResponse> { new R3CutoverResponse {
                Limit  = "str",
                Additive_Standalone  = "str" ,
                AR_Settlement_Level  = "str" ,
                Ceiling_Limit_End_Volume_for_VT  = "str" ,
                COMMENTS  = "str" ,
                Consumption_Customer_Platform  = "str" ,
                Consumption_Customer_Reported_Geo  = "str" ,
                Consumption_Customer_Segment  = "str" ,
                Consumption_Reason  = "str" ,
                Consumption_Reason_Comment  = "str" ,
                Customer_Division  = "str" ,
                Customer_Name  = "str" ,
                Deal_Description  = "str" ,
                Deal_End_Date  = "str" ,
                Deal_Id  = 23 ,
                Deal_Stage  = "str" ,
                Deal_Start_Date  = "str" ,
                Deal_Type  = "str" ,
                Division_Approved_Date  =  new DateTime(2023, 01, 23, 20, 15, 00, 277) ,
                Division_Approver  = "str" ,
                End_Customer  = "str" ,
                End_Customer_Country  = "str" ,
                End_Customer_Retailer  = "str" ,
                Expire_Deal_Flag  = "str" ,
                Geo  = "str" ,
                Geo_Approver  = "str" ,
                Is_a_Unified_Cust  = "str" ,
                Look_Back_Period_Months  = "str" ,
                Market_Segment  = "str" ,
                Payout_Based_On  = "str" ,
                Period_Profile  = "str" ,
                Pricing_Strategy_Stage  = "str" ,
                Program_Payment  = "str" ,
                Project_Name  = "str" ,
                Rebate_Type  = "str" ,
                Request_Date  =  new DateTime(2023, 01, 23, 20, 15, 00, 277) ,
                Request_Quarter  = 34 ,
                Requested_by  = "str" ,
                Reset_Per_Period  = "str" ,
                Send_To_Vistex  = "str" ,
                Settlement_Partner  = "str" ,
                System_Configuration  = "str" ,
                System_Price_Point  = "str" ,
                Unified_Customer_ID  = "str" ,
                Vertical  = "str" 
            } };

            var CutoverPassedDeals = new List<R3CutoverResponsePassedDeals> {new R3CutoverResponsePassedDeals {
                Customer_Name = "name",
                Deal_Id = 23
            } };

            return new ValidateVistexR3Wrapper(CutoverResults,CutoverPassedDeals);
        }
    }
}
