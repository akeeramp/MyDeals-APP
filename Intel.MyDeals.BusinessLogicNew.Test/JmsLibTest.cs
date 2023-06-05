using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class JmsLibTest
    {
        public Mock<IJmsDataLib> mockJmsDataLib = new Mock<IJmsDataLib>();

        [Test, TestCase("a")]
        public void CheckPreviousRunNotComplete_isVoidMethod(char jobType)
        {            
            mockJmsDataLib.Setup(x => x.CheckPreviousRunNotComplete(It.IsAny<char>())).Verifiable();
            new JmsLib(mockJmsDataLib.Object).CheckPreviousRunNotComplete(jobType);
            mockJmsDataLib.Verify();
        }
        
        [Test]
        public void DeleteUploadErrorTable_isVoidMethod()
        {            
            mockJmsDataLib.Setup(x => x.DeleteUploadErrorTable()).Verifiable();
            new JmsLib(mockJmsDataLib.Object).DeleteUploadErrorTable();
            mockJmsDataLib.Verify();
        }

        private static readonly object[] InsertUploadErrorTableParams =
        {
            new object[]{
                new Pair<int, int>[]{
                    new Pair<int, int> (1, 2)
                }
            }
        };

        [Test,
            TestCaseSource("InsertUploadErrorTableParams")]
        public void InsertUploadErrorTable_isVoidMethod(dynamic data)
        {
            mockJmsDataLib.Setup(x => x.InsertUploadErrorTable(It.IsAny<Pair<int, int>[]>())).Verifiable();
            new JmsLib(mockJmsDataLib.Object).InsertUploadErrorTable(data);
            mockJmsDataLib.Verify();
        }

        [Test,
            TestCase(1, 'a', ".txt", "errordetail")]
        public void UpdateRecordStagesAndNotifyErrors_isVoidMethod(int errorFlag, char jobType, string csvFilePath, string errorDetail)
        {
            mockJmsDataLib.Setup(x => x.UpdateRecordStagesAndNotifyErrors(It.IsAny<int>(), It.IsAny<char>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
            new JmsLib(mockJmsDataLib.Object).UpdateRecordStagesAndNotifyErrors(errorFlag, jobType, csvFilePath, errorDetail);
            mockJmsDataLib.Verify();
        }

        private static readonly object[] InsertExceptionDataParams =
        {
            new object[]{
                new DateTime(2022,1,1), "exceptionType", "exceptionMessage", "exceptionSource", "exceptionStackTrace"
            }
        };

        [Test,
            TestCaseSource("InsertExceptionDataParams")]
        public void InsertExceptionData_isVoidMethod(dynamic data)
        {
            var exceptionDatetime = data[0];
            var exceptionType = data[1];
            var exceptionMessage = data[2];
            var exceptionSource = data[3];
            var exceptionStackTrace = data[4];
            mockJmsDataLib.Setup(x => x.InsertExceptionData(It.IsAny<DateTime>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
            new JmsLib(mockJmsDataLib.Object).InsertExceptionData(exceptionDatetime, exceptionType, exceptionMessage, exceptionSource, exceptionStackTrace);
            mockJmsDataLib.Verify();
        }
        
        private static readonly object[] Publish_Params =
        {
            new object[]{
                "brokerURI", "userName", "queueName", new List<string> { "data1", "data2" }
            }
        };

        [Test,
            TestCaseSource("Publish_Params")]
        public void Publish_isVoidMethod(dynamic param)
        {
            var brokerURI = param[0];
            var userName = param[1];
            var queueName = param[2];
            var data = param[3];
            mockJmsDataLib.Setup(x => x.Publish(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<string>>())).Verifiable();
            new JmsLib(mockJmsDataLib.Object).Publish(brokerURI, userName, queueName, data);
            mockJmsDataLib.Verify();
        }

        [Test, TestCase("a")]
        public void CreatePricingRecords_ShouldReturnDataTable(char jobType)
        {
            var mockData = new DataTable();
            mockJmsDataLib.Setup(x => x.CreatePricingRecords(It.IsAny<char>())).Returns(mockData);
            var result = new JmsLib(mockJmsDataLib.Object).CreatePricingRecords(jobType);
            Assert.IsNotNull(result);
        }

        [Test, TestCase(10, 20)]
        public void GetPricingRecordsXml_ShouldReturnString(int jmsId, int groupId)
        {
            var mockData = "The pricing records xml";
            mockJmsDataLib.Setup(x => x.GetPricingRecordsXml(It.IsAny<int>(), It.IsAny<int>())).Returns(mockData);
            var result = new JmsLib(mockJmsDataLib.Object).GetPricingRecordsXml(jmsId, groupId);
            Assert.NotNull(result);
        }

        [Test]
        public void GetMaxGroupId_ShouldReturnString()
        {
            var mockData = "The Group/JMS Id Pairs";
            mockJmsDataLib.Setup(x => x.GetMaxGroupId()).Returns(mockData);
            var result = new JmsLib(mockJmsDataLib.Object).GetMaxGroupId();
            Assert.NotNull(result);
        }

        [Test, TestCase("The pricing records XML")]
        public void SendPricingRecordsToQueue_ShouldReturnErrorMsg(string pricingRecords)
        {
            var mockData = "The error message, if any";
            mockJmsDataLib.Setup(x => x.SendDataToJmsQueue(It.IsAny<string>())).Returns(mockData);
            var result = new JmsLib(mockJmsDataLib.Object).SendPricingRecordsToQueue(pricingRecords);
            Assert.NotNull(result);
        }

        [Test, TestCase(true, "brokerURI", "userName", "queueName")]
        public void TestConnection_ShouldReturnErrorMsg(bool noSAP, string brokerURI, string userName, string queueName)
        {
            var mockData = new Dictionary<string, string>();
            mockJmsDataLib.Setup(x => x.TestConnection(It.IsAny<bool>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(mockData);
            var result = new JmsLib(mockJmsDataLib.Object).TestConnection(noSAP, brokerURI, userName, queueName);
            Assert.NotNull(result);
        }
    }
}
