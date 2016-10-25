using System.Collections.Generic;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.Entities.Test
{
    [TestClass]
    public class OpLogUnitTests
    {
        private string emailTo = "philip.w.eckenroth@intel.com";
        private string defaultMsg = "This is a test message from a Unit test";

        public OpLogUnitTests()
        {
            OpLog.SetToEmailList(emailTo);
            OpLog.SetDebugLevel(DebugLevel.Debug);
        }

        private void AddOpMessages(int msgCnt)
        {
            OpLog.ClearStack();

            List<OpMsg> opMsgs = new List<OpMsg>();
            for (var i = 0; i < msgCnt; i++)
            {
                opMsgs.Add(GetOpMessage(i));
            }
            OpLog.LogEvent(opMsgs);
        }

        private void AddOpMessages(OpMsg opMsg, bool isError = false, bool isAlert = false)
        {
            OpLog.ClearStack();
            List<OpMsg> opMsgs = new List<OpMsg> {opMsg};
            OpLog.LogEvent(opMsgs);
        }

        private OpMsg GetOpMessage(int uid = 0, string msg = "", bool isError = false, bool isAlert = false)
        {
            return new OpMsg
            {
                DebugMessage = string.IsNullOrEmpty(msg) ? "This is a debug message " + uid : msg,
                Message = string.IsNullOrEmpty(msg) ? "This is a debug message " + uid : msg,
                MsgType = isError ? OpMsg.MessageType.Error : isAlert ? OpMsg.MessageType.Warning : OpMsg.MessageType.Info
            };
        }

        [TestMethod]
        public void TestAddSingleMessage()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);
            OpLog.LogEvent(defaultMsg);

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

        [TestMethod]
        public void TestAddMultipleMessages()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);

            int msgCnt = 100;
            for (var i = 0; i < msgCnt; i++)
            {
                OpLog.LogEvent(defaultMsg + " " + i);
            }

            Assert.AreEqual(OpLog.GetLogStack().Count, msgCnt);
        }

        [TestMethod]
        public void TestOpMessagesApplicationMode()
        {
            int msgCnt = 100;
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Application);

            AddOpMessages(msgCnt);

            // this should not log amy values
            Assert.AreEqual(OpLog.GetLogStack().Count, 0);
        }

        [TestMethod]
        public void TestOpMessagesDebugMode()
        {
            int msgCnt = 100;
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);

            AddOpMessages(msgCnt);

            Assert.AreEqual(OpLog.GetLogStack().Count, msgCnt);
        }

        [TestMethod]
        public void TestOpMessagesWithError()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);

            AddOpMessages(GetOpMessage(0,"UT: This is a test email fired from the Unit Tests", true));

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

        [TestMethod]
        public void TestAddSingleDebugMessageApplicationMode()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Application);
            OpLog.LogDebugEvent(defaultMsg);

            Assert.AreEqual(OpLog.GetLogStack().Count, 0);
        }

        [TestMethod]
        public void TestAddSingleDebugMessageDebugMode()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);
            OpLog.LogDebugEvent(defaultMsg);

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

        [TestMethod]
        public void TestLogWithCat()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);
            OpLog.LogEvent(defaultMsg, LogCategory.Warning);

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

        [TestMethod]
        public void TestLogWithFullyQualified()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);
            OpLog.LogEvent(DebugLevel.Application, "UT Error", defaultMsg, LogCategory.Warning);

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

        [TestMethod]
        public void TestLogErrorLevelWithMail()
        {
            OpLog.ClearStack();
            OpLog.SetDebugLevel(DebugLevel.Debug);
            OpLog.LogEvent(DebugLevel.Application, "UT Error", defaultMsg, LogCategory.Error);

            Assert.AreEqual(OpLog.GetLogStack().Count, 1);
        }

    }
}
