using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class LoggingDataLibTests
    {
        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Logging Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Logging Library Tests.");
        }

        [TestCase]
        public void GetLogConfig()
        {
            // Arrange, Act
            LogConfig logConfig = new LoggingDataLib().GetLogConfig();

            // Assert
            Assert.IsNotNull(logConfig.MsgSrc);
        }

        [TestCase]
        public void UploadDbLogPerfLogs()
        {
            // Arrange
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

            // Act
            bool insertResult = new LoggingDataLib().UploadDbLogPerfLogs(msgList);

            // Assert
            Assert.IsTrue(
                insertResult = true
            );
        }
    }
}