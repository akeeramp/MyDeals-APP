using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class LoggingLibTest
    {

        public Mock<ILoggingDataLib> mockLoggingDataLib = new Mock<ILoggingDataLib> ();
        private static readonly object[] _paramList_DbLogPerfMessage =
        {
            new object[] {2,new DateTime(2023),"lgn_nm","usr_nm", "CLNT_MCHN_NM", "SRVR", "MSG_SRC", "MTHD", "MSG",new DateTime(2022),new DateTime(2021),567,33,0,false,7654,23 }

        };
        private static readonly object[] _paramList_LogPerformanceTime =
        {
            new object[] { "uid", "title", 56, new DateTime(2022), new DateTime(2023), "mode", "task", 67}
        };

        [Test]
        public void GetLogConfig_Returns_NotNull()
        {
            var mockData =getLogConfigMockData();
            mockLoggingDataLib.Setup(x=>x.GetLogConfig()).Returns(mockData);
            var result = new LoggingLib(mockLoggingDataLib.Object).GetLogConfig();
            Assert.IsNotNull(result);
        }

        [Test,
            TestCaseSource("_paramList_DbLogPerfMessage"),
            TestCase(null)]
        public void UploadDbLogPerfLogs_Returns_True(dynamic data)
        {
            var inputData = data;
            if(data!= null)
            {
                inputData = new List<DbLogPerfMessage> { new DbLogPerfMessage
                {
                    STEP = data[0],
                    LOG_DTM = data[1],
                    LGN_NM = data[2],
                    USR_NM = data[3],
                    CLNT_MCHN_NM = data[4],
                    SRVR = data[5],
                    MSG_SRC = data[6],
                    MTHD = data[7],
                    MSG = data[8],
                    STRT_DTM = data[9],
                    END_DTM = data[10],
                    REC_CNT = data[11],
                    THRD_ID = data[12],
                    IS_ZIP = data[13],
                    ERR_MSG = data[14],
                    RuntimeMs = data[15]
                } };
            }
            
            mockLoggingDataLib.Setup(x=>x.UploadDbLogPerfLogs(It.IsAny<IEnumerable<DbLogPerfMessage>>())).ReturnsAsync(true);
            var result = new LoggingLib(mockLoggingDataLib.Object).UploadDbLogPerfLogs(inputData);
            Assert.That(result, Is.True);
            Assert.IsNotNull(result);
        }

        [Test,
            TestCase("logString")]
        public void getBatchJobTiming_Returns_NotNull(string logType)
        {
            var mockData = getbatchJobTimingMockData();
            mockLoggingDataLib.Setup(x=>x.getBatchJobTiming(It.IsAny<string>())).Returns(mockData);
            var result = new LoggingLib(mockLoggingDataLib.Object).getBatchJobTiming(logType);
            Assert.IsNotNull(result);
            Assert.Greater(result.Count, 0);
        }

        [Test,
            TestCaseSource("_paramList_LogPerformanceTime")]
        public void UploadUiPerfLogs_Returns_True_forNonEmptyList(dynamic logPerformanceTimes)
        {
            var inputData = new List<LogPerformanceTime> { new LogPerformanceTime
            {
                UID = logPerformanceTimes[0],
                Title = logPerformanceTimes[1],
                ExecutionMs = logPerformanceTimes[2], 
                Start = logPerformanceTimes[3],
                End = logPerformanceTimes[4],
                Mode = logPerformanceTimes[5],
                Task = logPerformanceTimes[6],
                TaskMs = logPerformanceTimes[7]
            } };
            mockLoggingDataLib.Setup(x => x.UploadUiPerfLogs(It.IsAny<IEnumerable<LogPerformanceTime>>())).ReturnsAsync(true);
            var result = new LoggingLib(mockLoggingDataLib.Object).UploadUiPerfLogs(inputData); 
            Assert.IsNotNull(result);
            Assert.That(result, Is.True);
        }

        [Test,
           TestCase(null)]
        public void UploadUiPerfLogs_Returns_false_forEmptyList(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            var inputData = new List<LogPerformanceTime> { new LogPerformanceTime()};
            if(logPerformanceTimes != null)
            {
                inputData = logPerformanceTimes.ToList();
            }
            mockLoggingDataLib.Setup(x => x.UploadUiPerfLogs(It.IsAny<IEnumerable<LogPerformanceTime>>())).ReturnsAsync(false);
            var result = new LoggingLib(mockLoggingDataLib.Object).UploadUiPerfLogs(inputData);
            Assert.That(result, Is.False);
        }

        [Test,
           TestCaseSource("_paramList_LogPerformanceTime")]
        public void UploadUiPerfLogsSync_Returns_True_forNonEmptyList(dynamic logPerformanceTimes)
        {
            var inputData = new List<LogPerformanceTime> { new LogPerformanceTime
            {
                UID = logPerformanceTimes[0],
                Title = logPerformanceTimes[1],
                ExecutionMs = logPerformanceTimes[2],
                Start = logPerformanceTimes[3],
                End = logPerformanceTimes[4],
                Mode = logPerformanceTimes[5],
                Task = logPerformanceTimes[6],
                TaskMs = logPerformanceTimes[7]
            } };
            mockLoggingDataLib.Setup(x => x.UploadUiPerfLogsSync(It.IsAny<IEnumerable<LogPerformanceTime>>())).Returns(true);
            var result = new LoggingLib(mockLoggingDataLib.Object).UploadUiPerfLogsSync(inputData);
            Assert.IsNotNull(result);
            Assert.That(result, Is.True);
        }

        [Test,
           TestCase(null)]
        public void UploadUiPerfLogsSync_Returns_false_forEmptyList(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            var inputData = new List<LogPerformanceTime> { new LogPerformanceTime() };
            if (logPerformanceTimes != null)
            {
                inputData = logPerformanceTimes.ToList();
            }
            mockLoggingDataLib.Setup(x => x.UploadUiPerfLogsSync(It.IsAny<IEnumerable<LogPerformanceTime>>())).Returns(false);
            var result = new LoggingLib(mockLoggingDataLib.Object).UploadUiPerfLogsSync(inputData);
            Assert.That(result, Is.False);
        }


        public LogConfig getLogConfigMockData()
        {
            var mockData = new LogConfig
            {
                IsActive = true,
                MsgSrc = "Unit Testing"
            };
            return mockData;
        }

        public List<batchJobTiming> getbatchJobTimingMockData()
        {
            var mockData = new List<batchJobTiming>{ new batchJobTiming
            {
                BTCH_JOB_EXEC_DTM = "test",
                BTCH_JOB_NM = "test_str",
                BTCH_JOB_SCH_TM = "ut",
                BTCH_JOB_STS = "bhgytr",
                BTCH_TYPE = "type",
                ERR_MSG = "err"
            }  };
            return mockData;
        }
    }
}
