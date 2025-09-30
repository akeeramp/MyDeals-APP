using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class VistexServiceLibTest
    {
        public Mock<IVistexServiceDataLib> mockVistexServiceDataLib = new Mock<IVistexServiceDataLib>();
        public Mock<IJmsDataLib> mockJmsDataLib = new Mock<IJmsDataLib>();
        private static readonly object[] ConnectSAPPOandResponse_OkStatus_Params =
        {
            new object[] {"jsonData",  "M",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"ok" },
            new object[] {"jsonData",  "C",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"accepted" },
            new object[] {"jsonData",  "V",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"ok" },
            new object[] {"jsonData",  "P",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"accepted" },
            new object[] {"jsonData",  "M",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"ok" },
            new object[] {"jsonData",  "D",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"accepted" },
            new object[] {"jsonData",  "Z",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"accepted" }
        };
        private static readonly object[] ConnectSAPPOandResponse_NonOkStatus_Params =
       {
            new object[] {"jsonData",  "V",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"random_status" },
            new object[] {"jsonData",  "P",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"random_status" },
            new object[] {"jsonData",  "E",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"random_status" },
            new object[] {"jsonData",  "D",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()}, "random_status" },
            new object[] {"jsonData",  "Z",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"not_accepted" }
        };
        private static readonly object[] ConnectSAPPOandResponse_Exception_Params =
       {
            new object[] {"jsonData",  "V",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"random_status" },
            new object[] {"jsonData",  "P",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"random_status" },
            new object[] {"jsonData",  "Z",  "BatchId", new VistexDFDataResponseObject{ MessageLog = new List<string>()},"not_accepted" }
        };
        private static readonly object[] SaveVistexResponseData_ValidParams =
        {
            new object[] { new VistexResponseMsg {vistexResponseHeader = new VistexResponseMsg.VistexResponseHeader { BatchId = "9245fe4a-d402-451c-b9ed-9c1a04247482", DealResponses = new List<VistexResponseMsg.VistexResponseHeader.DealResponse>{ new VistexResponseMsg.VistexResponseHeader.DealResponse {DealId = 234,Status = "dummy_status",ErrMessage = "dummy_errMsg"} } } } }
        };
        private static readonly object[] SaveVistexResponseData_InvalidParams =
        {
            new object[] { new VistexResponseMsg() },
            new object[] { null }
        };
        private static readonly object[] UpdateVistexDFStageData_params =
        {
            new object[]{new VistexDFDataResponseObject()}
        };
        private static readonly object[] SetVistexDealOutBoundStageD_params =
        {
            new object[] { new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482"), "rqst_ststus",new List<VistexQueueObject>()}
        };
        private static readonly object[] GetVistexStageData_runMode_params =
        {
            new object[] {"V", new VistexDFDataResponseObject { MessageLog = new List<string>() } ,0},
            new object[] {"C", new VistexDFDataResponseObject { MessageLog = new List<string>() } ,0},
            new object[] {"P", new VistexDFDataResponseObject { MessageLog = new List<string>() } ,0},
            new object[] {"E", new VistexDFDataResponseObject { MessageLog = new List<string>() } ,1}
        };
        private static readonly object[] GetVistexStageData_exception_params =
        {
            new object[] {"V", new VistexDFDataResponseObject { MessageLog = new List<string>() }},
            new object[] {"C", new VistexDFDataResponseObject { MessageLog = new List<string>() }},
            new object[] {"P", new VistexDFDataResponseObject { MessageLog = new List<string>() }}
        }; 
        private static readonly object[] GetVistexDataOutBound_params =
        {
            new object[] {"V", new VistexDFDataResponseObject { MessageLog = new List<string>() },0},
            new object[] {"C", new VistexDFDataResponseObject { MessageLog = new List<string>() },1}       
        };
        private static readonly object[] sendDataToIQR_params =
        {
            new object[] {"{'key':'value'}", new VistexDFDataResponseObject { MessageLog = new List<string>() } , new List<VistexQueueObject> { new VistexQueueObject { BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } } ,"V"}
        };
        private static readonly object[] sendDataToIQR_Exception_params =
        {
            new object[] {"{'key':'value'}", new VistexDFDataResponseObject { } , new List<VistexQueueObject> { new VistexQueueObject { BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } } ,"V"},
            new object[] {"{'key':'value'}", new VistexDFDataResponseObject { MessageLog = new List<string>() } , new List<VistexQueueObject> {  } ,"V"}
        };
        private static readonly object[] GetVistexDealOutBoundData_params =
        {
            new object[] {"pkt_type","M", new VistexDFDataResponseObject { MessageLog = new List<string>() },0,"NA"},
            new object[] { "pkt_type","L", new VistexDFDataResponseObject { MessageLog = new List<string>() },0,"NA"},
            new object[] { "pkt_type","Z", new VistexDFDataResponseObject { MessageLog = new List<string>() },0, "NA" },
            new object[] {"pkt_type","M", new VistexDFDataResponseObject { MessageLog = new List<string>() },1 ,"NA"},
            new object[] { "pkt_type","L", new VistexDFDataResponseObject { MessageLog = new List<string>() },1,"BatchStatus_PROCESSED"},
            new object[] { "pkt_type","L", new VistexDFDataResponseObject { MessageLog = new List<string>() },1,"BatchStatus_Not_PROCESSED"},
            new object[] { "pkt_type","Z", new VistexDFDataResponseObject { MessageLog = new List<string>() },1, "NA" }
        };
        private static readonly object[] GetVistexDealOutBoundData_exceptionHandling_params =
        {
            new object[] { "pkt_type", "L", new VistexDFDataResponseObject { MessageLog = new List<string>() }},
            new object[] { "pkt_type", "M", new VistexDFDataResponseObject { MessageLog = new List<string>() }},
            new object[] { "pkt_type", "P", new VistexDFDataResponseObject { MessageLog = new List<string>() }}
        };
        private static readonly object[] sendDealdataToSapPo_params =
        {
             new object[] {"{'key':'value'}",new VistexDFDataResponseObject { MessageLog = new List<string>() },new List<VistexQueueObject> { new VistexQueueObject { BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } },"M" },
             new object[] {"{'key':'value'}",new VistexDFDataResponseObject { MessageLog = new List<string>() },new List<VistexQueueObject> { new VistexQueueObject { BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } },"L" },

        };
        private static readonly object[] sendDealdataToSapPo_Exception_params =
        {
            new object[] {"{'key':'value'}", new VistexDFDataResponseObject { } , new List<VistexQueueObject> { new VistexQueueObject { BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } } ,"V"},
            new object[] {"{'key':'value'}", new VistexDFDataResponseObject { MessageLog = new List<string>() } , new List<VistexQueueObject> {  } ,"V"}
        };

        [Test,
            TestCase("L")]
        public void GetVistexDFStageData_ReturnsNotNull(string runMode)
        {
            var mockData = new VistexDFDataLoadObject();
            mockVistexServiceDataLib.Setup(x=>x.GetVistexDFStageData(It.IsAny<string>())).Returns(mockData);
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDFStageData(runMode);
            Assert.IsNotNull(res);
        }

        [Test,
           TestCaseSource("ConnectSAPPOandResponse_OkStatus_Params")]
        public void ConnectSAPPOandResponse_ReturnsProcessedBatchStatusAndValidVistexDFDataResponseObject_forOkOrAcceptedMockDataStatusAndValidInput(dynamic input)
        {
            string jsonData = input[0];
            string runMode = input[1];
            string BatchId = input[2];
            VistexDFDataResponseObject responseObj = input[3];
            Dictionary<string,string> mockData = VistexDFDataLoadObject_getMockData(input[4]);
            mockVistexServiceDataLib.Setup(x=>x.PublishToSapPoDCPV(It.IsAny<string>(),It.IsAny<string>(),It.IsAny<VistexDFDataResponseObject>())).Returns(mockData);
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).ConnectSAPPOandResponse(jsonData, runMode,BatchId,responseObj);
            VistexDFResponse visResponse = JsonConvert.DeserializeObject<VistexDFResponse>(mockData["Data"]);
            responseObj.BatchMessage = runMode == "D" ? "PO_Send_Complete" : runMode == "V" ? visResponse.Status + ": " + visResponse.Message ?? string.Empty : visResponse.Message ?? string.Empty;
            responseObj.BatchName = runMode == "D" ? "VISTEX_DEAL" : runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : runMode == "C" ? "CUSTOMER_BRD" : runMode == "M" ? "CNSMPTN_LD" : "";
            Assert.AreEqual(res.BatchStatus, "PROCESSED");
            Assert.AreEqual(res.RunMode, runMode);
            Assert.AreEqual(res.BatchId, BatchId);
            Assert.AreEqual(res.BatchName, responseObj.BatchName);
            Assert.AreEqual(res.BatchMessage, responseObj.BatchMessage);
        }

        [Test,
           TestCaseSource("ConnectSAPPOandResponse_NonOkStatus_Params")]
        public void ConnectSAPPOandResponse_ReturnsErrorBatchStatusAndValidVistexDFDataResponseObject_forValidInput(dynamic input)
        {
            string jsonData = input[0];
            string runMode = input[1];
            string BatchId = input[2];
            VistexDFDataResponseObject responseObj = input[3];
            Dictionary<string, string> mockData = VistexDFDataLoadObject_getMockData(input[4]);
            mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>())).Returns(mockData);
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).ConnectSAPPOandResponse(jsonData, runMode, BatchId, responseObj);
            responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : runMode == "D" || runMode == "E" ? "VISTEX_DEAL" : "CUSTOMER_BRD";
            Assert.AreEqual(res.BatchStatus, "ERROR");
            Assert.AreEqual(res.RunMode, runMode);
            Assert.AreEqual(res.BatchId, BatchId);
            Assert.AreEqual(res.BatchName, responseObj.BatchName);
            Assert.AreEqual(res.BatchMessage, mockData["Message"]);
        }

        [Test,
           TestCaseSource("ConnectSAPPOandResponse_Exception_Params")]
        public void ConnectSAPPOandResponse_ReturnsExceptionBatchStatusAndValidVistexDFDataResponseObject_whileExceptionHandling(dynamic input)
        {
            string jsonData = input[0];
            string runMode = input[1];
            string BatchId = input[2];
            VistexDFDataResponseObject responseObj = input[3];
            mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>())).Returns(new Dictionary<string, string>());
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).ConnectSAPPOandResponse(jsonData, runMode, BatchId, responseObj);
            responseObj.BatchName = runMode == "P" ? "PRODUCT_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "CUSTOMER_BRD";
            Assert.AreEqual(res.BatchStatus, "Exception");
            Assert.AreEqual(res.RunMode, runMode);
            Assert.AreEqual(res.BatchId, "-1");
            Assert.AreEqual(res.BatchName, responseObj.BatchName);
        }

        [Test,
            TestCaseSource("SaveVistexResponseData_ValidParams")]
        public void SaveVistexResponseData_ReturnsTrue_withValidParams(dynamic input)
        {
            VistexResponseMsg jsonDataPacket = input;
            mockVistexServiceDataLib.Setup(x => x.SaveVistexResponseData(It.IsAny<Guid>(), It.IsAny<Dictionary<int,string>>())).Returns(true);
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).SaveVistexResponseData(jsonDataPacket);
            Assert.IsTrue(res);
        }

        [Test,
            TestCaseSource("SaveVistexResponseData_InvalidParams")]
        public void SaveVistexResponseData_ThrowsException_withInvalidParams(dynamic input)
        {
            VistexResponseMsg jsonDataPacket = input;
            Assert.Throws<NullReferenceException>(() => new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).SaveVistexResponseData(jsonDataPacket));
        }

        [Test,
            TestCase("url", "jsonData")]
        public void PublishSapPo_ReturnsNotNull(string url, string jsonDatab)
        {
            mockVistexServiceDataLib.Setup(x => x.PublishSapPo(It.IsAny<string>(), It.IsAny<string>())).Returns(new Dictionary<string, string>());
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).PublishSapPo(url, jsonDatab);
            Assert.IsNotNull(res);
        }

        [Test,
            TestCase("custNm",true)]
        public void CallProfiseeApi_ReturnsTrue(string CustNM, Boolean ACTV_IND)
        {
            mockVistexServiceDataLib.Setup(x=>x.CallProfiseeApi(It.IsAny<string>(),It.IsAny<Boolean>())).Returns(true);
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).CallProfiseeApi(CustNM, ACTV_IND);
            Assert.IsTrue(res);
        }

        [Test,
            TestCaseSource("UpdateVistexDFStageData_params")]
        public void UpdateVistexDFStageData_callsVoidMethodProperly(dynamic input)
        {
            VistexDFDataResponseObject data = input;
            mockVistexServiceDataLib.Setup(x=>x.UpdateVistexDFStageData(It.IsAny<VistexDFDataResponseObject>())).Verifiable();
            new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).UpdateVistexDFStageData(data);
            mockVistexServiceDataLib.Verify();
        }

        [Test,
            TestCase("9245fe4a-d402-451c-b9ed-9c1a04247482", "status","Msg")]
        public void SetVistexDealOutBoundStageV_callsVoidMethodProperly(Guid btchId, string rqstStatus, string BatchMessage)
        {
            mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.IsAny<Guid>(),It.IsAny<string>(),It.IsAny<string>())).Verifiable();
            new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).SetVistexDealOutBoundStageV(btchId,rqstStatus,BatchMessage);
            mockVistexServiceDataLib.Verify();
        }

        [Test,
            TestCaseSource("SetVistexDealOutBoundStageD_params")]
        public void SetVistexDealOutBoundStageD_callsVoidMethodProperly(Guid btchId, string rqstStatus, List<VistexQueueObject> dataRecords)
        {
            mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageD(It.IsAny<Guid>(), It.IsAny<string>(),It.IsAny<List<VistexQueueObject>>())).Verifiable();
            new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).SetVistexDealOutBoundStageD(btchId,rqstStatus,dataRecords);
            mockVistexServiceDataLib.Verify();
        }

        [Test,
            TestCaseSource("GetVistexStageData_runMode_params")]
        public void GetVistexStageData_ReturnsVistexDFDataResponseObjectWithAppropriateMessageLogStrings_forDifferentRunMode(dynamic input)
        {
            string runMode = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            int dataRecordBatchId = input[2];
            if (runMode == "V")
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDataOutBound(It.Is<string>(r => r == "PROD_VERT_RULES"))).Returns(new List<VistexQueueObject>());
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexStageData(runMode, responseObj);
                Assert.Greater(res.MessageLog.Count, 0);
                var msgLogString = res.MessageLog.Last();
                Assert.That(msgLogString.Contains("Business Layer - GetVistexStageData: GetVistexDataOutBound - PROD_VERT_RULES: Done"));
            }
            else
            {   
                VistexDFDataLoadObject mockVistexDFDataLoadObject = new VistexDFDataLoadObject();
                if (dataRecordBatchId <= 0)
                {
                    mockVistexServiceDataLib.Setup(x => x.GetVistexDFStageData(It.IsAny<string>())).Returns(mockVistexDFDataLoadObject);
                    var result = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexStageData(runMode, responseObj);
                    var BatchName = runMode == "C" ? "CUSTOMER_BRD" : "PRODUCT_BRD";
                    Assert.AreEqual(result.BatchName, BatchName);
                    Assert.AreEqual(result.BatchId, "0");
                    Assert.AreEqual(result.BatchMessage, "No data to be Uploaded");
                    Assert.AreEqual(result.BatchStatus, "PROCESSED");
                    Assert.Greater(result.MessageLog.Count, 3);
                    var msgLogString = result.MessageLog.Last();
                    Assert.That(msgLogString.Contains("Business Layer - GetVistexStageData: Status - Done"));
                }
                else
                {
                    mockVistexDFDataLoadObject.BatchId = 1;
                    mockVistexDFDataLoadObject.JsonData = "{'key':'value'}";
                    mockVistexServiceDataLib.Setup(x => x.GetVistexDFStageData(It.IsAny<string>())).Returns(mockVistexDFDataLoadObject);
                    mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>())).Returns(VistexDFDataLoadObject_getMockData("random"));
                    mockVistexServiceDataLib.Setup(x => x.UpdateVistexDFStageData(It.IsAny<VistexDFDataResponseObject>())).Verifiable();
                    var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexStageData(runMode,responseObj);
                    mockVistexServiceDataLib.Verify();
                    var msgLogString = res.MessageLog.Last();
                    Assert.That(msgLogString.Contains("Business Layer - GetVistexStageData: Status - Done"));
                }
            }
        }

        [Test,
            TestCaseSource("GetVistexStageData_exception_params")]
        public void GetVistexStageData_returnsExceptionBatchStatusAndValidVistexDFDataResponseObject_whileExceptionHandling(dynamic input)
        {
            string runMode = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            if(runMode == "V")
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDataOutBound(It.Is<string>(r => r == "PROD_VERT_RULES"))).Throws<Exception>();
            }
            else
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDFStageData(It.IsAny<string>())).Throws<Exception>();
            }
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexStageData(runMode, responseObj);
            var BatchName = runMode == "C" ? "CUSTOMER_BRD" : runMode == "V" ? "PRODUCT_VERTICAL" : "PRODUCT_BRD";
            var msgLogString = res.MessageLog.Last();
            Assert.AreEqual(res.BatchName, BatchName);
            Assert.AreEqual(res.BatchId, "-1");
            Assert.AreEqual(res.BatchStatus, "Exception");
            Assert.That(msgLogString.Contains("Business Layer - GetVistexStageData: Exception Details -- "));
        }

        [Test,
            TestCaseSource("GetVistexDataOutBound_params")]
        public void GetVistexDataOutBound_ReturnsValidVistexDFDataResponseObject(dynamic input)
        {
            string packetType = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            var recordCount = input[2];
            if (recordCount == 0)
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDataOutBound(It.Is<string>(r => r == packetType))).Returns(new List<VistexQueueObject>());
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDataOutBound(packetType,responseObj);
                Assert.AreEqual(res.BatchName , "PRODUCT_VERTICAL");
                Assert.AreEqual( res.BatchId , "0");
                Assert.AreEqual( res.BatchMessage , "No Vertical to be Uploaded");
                Assert.AreEqual( res.BatchStatus , "PROCESSED");
            }
            else
            {
                List<VistexQueueObject> GetVistexDataOutBound_mockData = new List<VistexQueueObject> { new VistexQueueObject() };
                mockVistexServiceDataLib.Setup(x => x.GetVistexDataOutBound(It.Is<string>(r => r == packetType))).Returns(GetVistexDataOutBound_mockData);
                mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.Is<string>(r=> r=="V"), It.IsAny<VistexDFDataResponseObject>())).Returns(VistexDFDataLoadObject_getMockData("random"));
                mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDataOutBound(packetType, responseObj);
                mockVistexServiceDataLib.Verify();
                Assert.AreEqual(res.BatchName, "PRODUCT_VERTICAL");
            }
        }

        [Test,
            TestCaseSource("sendDataToIQR_params")]
        public void sendDataToIQR_ReturnsValidVistexDFDataResponseObject(dynamic input)
        {
            string jsonData = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            List<VistexQueueObject> dataRecords = input[2];
            string runMode = input[3];
            Guid batchId = dataRecords[0].BatchId;
            mockJmsDataLib.Setup(x => x.PublishClaimDataToSfTenders(It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>(), It.Is<string>(r=> r == runMode))).Returns(new VistexDFDataResponseObject { MessageLog = new List<string>() });
            mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.Is<Guid>(r=> r == batchId), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDataToIQR(jsonData, responseObj, dataRecords,runMode);
            mockVistexServiceDataLib.Verify();
            var msgLogString = res.MessageLog.Last();
            Assert.That(msgLogString.Contains("Business Layer - GetVistexDealOutBoundData: ConnectSAPPOandResponse - Success"));
            Assert.AreEqual(res.BatchId, batchId.ToString());
        }

        [Test,
            TestCaseSource("sendDataToIQR_Exception_params")]
        public void sendDataToIQR_ThrowsAndHandlesException_forInvalidParams(dynamic input)
        {
            string jsonData = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            List<VistexQueueObject> dataRecords = input[2];
            string runMode = input[3];
            if(dataRecords.Count > 0) {
                Assert.Throws<NullReferenceException>(() => new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDataToIQR(jsonData, responseObj, dataRecords, runMode));
            }
            else
            {
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDataToIQR(jsonData, responseObj, dataRecords, runMode);
                var msgLogString = res.MessageLog.Last();
                Assert.That(msgLogString.Contains("Business Layer - sendDataToIQR: Exception Details -- "));
            }
        }

        [Test,
            TestCaseSource("GetVistexDealOutBoundData_params")]
        public void GetVistexDealOutBoundData_ReturnsValidVistexDFDataResponseObject(dynamic input)
        {
            string packetType = input[0];
            string runMode = input[1];
            VistexDFDataResponseObject responseObj = input[2];
            var dataRecordsCount = input[3];
            var batchStatus = input[4];
            if(dataRecordsCount > 0)
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDealOutBoundData(It.Is<string>(r => r == packetType), It.Is<string>(r => r == runMode))).Returns(new List<VistexQueueObject> { new VistexQueueObject { RqstJsonData = "{'key':'value'}",BatchId = new Guid("9245fe4a-d402-451c-b9ed-9c1a04247482") } });
                if(runMode == "L")
                {
                    var msgLogString = "";
                    if(batchStatus == "BatchStatus_PROCESSED")
                    {
                        mockJmsDataLib.Setup(x => x.PublishClaimDataToSfTenders(It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>(), It.Is<string>(r => r == runMode))).Returns(new VistexDFDataResponseObject { MessageLog = new List<string>(),BatchStatus= "PROCESSED" });
                        msgLogString = "Business Layer - GetVistexDealOutBoundData: PublishClaimDataToSfTenders - Success ";
                    }
                    else
                    {
                        mockJmsDataLib.Setup(x => x.PublishClaimDataToSfTenders(It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>(), It.Is<string>(r => r == runMode))).Returns(new VistexDFDataResponseObject { MessageLog = new List<string>(), BatchStatus = "random" });
                        msgLogString = "Business Layer - GetVistexDealOutBoundData: PublishClaimDataToSfTenders - Failed while publishing Claim Data to APIGEE ";
                    }
                    mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
                    var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDealOutBoundData(packetType, runMode, responseObj);
                    var resMsgLogString = res.MessageLog.Last();
                    mockVistexServiceDataLib.Verify();
                    Assert.That(resMsgLogString.Contains(msgLogString));
                }
                else
                {
                    var msgLogString = "";
                    mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>())).Returns(VistexDFDataLoadObject_getMockData("random"));
                    if (runMode == "M")
                    {
                        mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
                    }
                    else
                    {
                        mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageD(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<List<VistexQueueObject>>())).Verifiable();
                    }
                    var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDealOutBoundData(packetType, runMode, responseObj);
                    mockVistexServiceDataLib.Verify();
                    msgLogString = res.MessageLog.Last();
                    Assert.That(msgLogString.Contains("Business Layer - GetVistexDealOutBoundData: sendDealdataToSapPo - Success "));
                }
            }
            else
            {
                mockVistexServiceDataLib.Setup(x => x.GetVistexDealOutBoundData(It.Is<string>(r => r == packetType), It.Is<string>(r => r == runMode))).Returns(new List<VistexQueueObject> { });
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDealOutBoundData(packetType, runMode,responseObj);
                var BatchName = runMode == "M" ? "CNSMPTN_LD" : runMode == "L" ? "IQR_CLAIM_DATA" : "VISTEX_DEALS";
                Assert.AreEqual(res.BatchName, BatchName);
                Assert.AreEqual(res.BatchId, "0");
                Assert.AreEqual(res.BatchMessage, "No data to be Uploaded");
                Assert.AreEqual(res.BatchStatus, "PROCESSED");
            }
        }

        [Test,
            TestCaseSource("GetVistexDealOutBoundData_exceptionHandling_params")]
        public void GetVistexDealOutBoundData_ReturnsExceptionBatchStatus_whileExceptionHandling(dynamic input)
        {
            string packetType = input[0];
            string runMode = input[1];
            VistexDFDataResponseObject responseObj = input[2];
            mockVistexServiceDataLib.Setup(x => x.GetVistexDealOutBoundData(It.Is<string>(r => r == packetType), It.Is<string>(r => r == runMode))).Throws<Exception>();
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).GetVistexDealOutBoundData(packetType, runMode, responseObj);
            var BatchName = runMode == "M" ? "CNSMPTN_LD" : runMode == "L" ? "IQR_CLAIM_DATA" : "DEALS";
            var resMsgLogString = res.MessageLog.Last();
            Assert.AreEqual(res.BatchName, BatchName);
            Assert.AreEqual(res.BatchId, "-1");
            Assert.That(res.BatchMessage.Contains("Exception:"));
            Assert.AreEqual(res.BatchStatus, "Exception");
            Assert.That(resMsgLogString.Contains("Business Layer - GetVistexStageData: Exception Details -- "));
        }

        [Test,
            TestCaseSource("sendDealdataToSapPo_params")]
        public void sendDealdataToSapPo_ReturnsValidVistexDFDataResponseObject(dynamic input)
        {
            string jsonData = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            List<VistexQueueObject> dataRecords = input[2];
            string runMode = input[3];
            mockVistexServiceDataLib.Setup(x => x.PublishToSapPoDCPV(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<VistexDFDataResponseObject>())).Returns(VistexDFDataLoadObject_getMockData("random"));
            if (runMode == "M") 
            {
                mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageV(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();
            }
            else
            {
                mockVistexServiceDataLib.Setup(x => x.SetVistexDealOutBoundStageD(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<List<VistexQueueObject>>())).Verifiable();
            }
            var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDealdataToSapPo(jsonData,responseObj,dataRecords,runMode);
            mockVistexServiceDataLib.Verify();
            Assert.GreaterOrEqual(res.MessageLog.Count, 2);
            var resMsgLogLastString = res.MessageLog.Last();
            Assert.That(resMsgLogLastString.Contains("Business Layer - SetVistexDealOutBoundStage - Status Update Successful"));
        }

        [Test,
           TestCaseSource("sendDealdataToSapPo_Exception_params")]
        public void sendDealdataToSapPo_ThrowsAndHandlesException_forInvalidParams(dynamic input)
        {
            string jsonData = input[0];
            VistexDFDataResponseObject responseObj = input[1];
            List<VistexQueueObject> dataRecords = input[2];
            string runMode = input[3];
            if (dataRecords.Count > 0)
            {
                Assert.Throws<NullReferenceException>(() => new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDealdataToSapPo(jsonData, responseObj, dataRecords, runMode));
            }
            else
            {
                var res = new VistexServiceLib(mockVistexServiceDataLib.Object, mockJmsDataLib.Object).sendDealdataToSapPo(jsonData, responseObj, dataRecords, runMode);
                var msgLogString = res.MessageLog.Last();
                Assert.That(msgLogString.Contains("Business Layer - sendDealdataToSapPo: Exception Details -- "));
            }
        }

        private Dictionary<string, string> VistexDFDataLoadObject_getMockData(string status)
        {
            var mockData = new Dictionary<string, string>();
            if(status == "ok" || status == "accepted")
            {
                mockData.Add("Status", status);
                mockData.Add("Data", @"{'Status':'status','Message':'msg'}");
            }else
            {
                mockData.Add("Status", "randomStatus");
                mockData.Add("Message", "sample_message");
            }
            return mockData;
        }
    }
}
