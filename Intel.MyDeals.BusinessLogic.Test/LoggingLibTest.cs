using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System;
using System.Collections.Generic;
using Intel.MyDeals.IDataLibrary;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class LoggingLibTest
    {
        public LoggingLibTest()
        {
            Console.WriteLine("Started Logging Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void LogLib_GetLogConfig()
        {
            var mockLoggingDataLib = new Mock<ILoggingDataLib>();
            LogConfig result = new LogConfig();

            // Set the mock repository
            mockLoggingDataLib.Setup(
                x => x.GetLogConfig()
            ).Returns(() => result);

            Console.WriteLine("---------------LoggingLibtest");
            // Act
            LogConfig logConfig = new LoggingLib(mockLoggingDataLib.Object).GetLogConfig();
            //LogConfig testing = new LoggingLib().GetLogConfig();

            Console.WriteLine("---------------LoggingLib: " + result.MsgSrc);

            Assert.IsNotNull(logConfig);
            if (logConfig.IsActive)
            {
                Assert.IsNotNull(logConfig.MsgSrc);
            }
        }

        [TestMethod]
        public void LogLib_UploadDbLogPerfLogs()
        {
            var mockLoggingDataLib = new Mock<ILoggingDataLib>();

            // Set the mock repository
            mockLoggingDataLib.Setup(
                x => x.UploadDbLogPerfLogs(
                    It.IsAny<List<DbLogPerfMessage>>()
                    ).Result
            ).Returns(new bool());

            string testString = "UNIT TEST - UploadDbLogPerfLogs";
            string testStringShort = "UI UNIT TEST";
            DateTime now = DateTime.UtcNow;
            var user = OpUserStack.MyOpUserToken.Usr;

            DbLogPerfMessage msg = new DbLogPerfMessage
            {
                STEP = 0,
                LOG_DTM = now,
                LGN_NM = user.Idsid,
                USR_NM = user.FullName,
                CLNT_MCHN_NM = testStringShort,
                SRVR = testStringShort,
                MSG_SRC = testStringShort,
                MTHD = testString,
                MSG = testString,
                STRT_DTM = now,
                END_DTM = DateTime.MaxValue,
                REC_CNT = 1,
                THRD_ID = 0,
                IS_ZIP = 0,
                ERR_MSG = false,
                RuntimeMs = 0
            };
            List<DbLogPerfMessage> msgList = new List<DbLogPerfMessage>();
            msgList.Add(msg);

            bool insertResult = new LoggingLib(mockLoggingDataLib.Object).UploadDbLogPerfLogs(msgList);

            Assert.IsTrue(insertResult = true);
        }

    }
}