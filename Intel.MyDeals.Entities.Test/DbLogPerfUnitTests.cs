using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.Entities.Test
{
	[TestFixture]
	public class DbLogPerfUnitTests
	{
		public DbLogPerf dbLogPerf;
		private static int maxLogStackSize = 3;

		/// <summary>
		/// Runs before the current test fixture
		/// </summary>
		[TestFixtureSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Starting Enity's DbLogPerf Tests.");
			dbLogPerf = new DbLogPerf("UNIT TESTS", maxLogStackSize); // max logStack of 3
			OpUserStack.EmulateUnitTester();
			OpLog.LogConfig = new LogConfig { MsgSrc = "UNIT TESTS", IsActive = true };
			//UnitTestHelpers.SetDbConnection();
		}

		[TestFixtureTearDown]
		public void AfterTheCurrentTextFixture()
		{
			Console.WriteLine("Completed Enity's DbLogPerf Tests.");
		}

		#region helper functions

		private DbLogPerfMessage MakeNewMessage(int stepNumber = 0)
		{
			string testString = "UNIT TEST - UploadDbLogPerfLogs";
			string testStringShort = "UI UNIT TEST";
			DateTime now = DateTime.UtcNow;
			var user = OpUserStack.MyOpUserToken.Usr;
			
			return new DbLogPerfMessage
			{
				STEP = stepNumber
				, LOG_DTM = now
				, LGN_NM = user.Idsid
				, USR_NM = user.FullName
				, CLNT_MCHN_NM = testStringShort
				, SRVR = testStringShort
				, MSG_SRC = testStringShort
				, MTHD = testString
				, MSG = testString
				, STRT_DTM = now
				, END_DTM = DateTime.MaxValue
				, REC_CNT = 1
				, THRD_ID = 0
				, IS_ZIP = 0
				, ERR_MSG = false
				, RuntimeMs = 0
			};
		}


		private List<DbLogPerfMessage> MakeMulitpleNewMessages(int count)
		{
			List<DbLogPerfMessage> list = new List<DbLogPerfMessage>();
			for (var i=0; i < count; i++)
			{
				list.Add(MakeNewMessage(i));
			}
			return list;
		}

		#endregion

		[TestCase]
		public void DbLogPerf_Flush()
		{
			// Arrange
			dbLogPerf.Clear();
			dbLogPerf.Log(MakeNewMessage());
			// Act
			dbLogPerf.Flush();
			// Assert
			Assert.IsTrue(!dbLogPerf.LogStack.Any());
		}


		// Note: don't put paramenters that are greater than maxLogStackSize 
		// or the log will flush and this test will fail.
		// The test for > maxLogStackSize flush is in another function.
		[TestCase(1)] 
		[TestCase(3)]
		public void DbLogPerf_AddLogMessage(int msgCount)
		{
			// Arrange
			DbLogPerfMessage first = null;
			DbLogPerfMessage msg = null;
			List<DbLogPerfMessage> msgList = MakeMulitpleNewMessages(msgCount);

			// Act
			dbLogPerf.Flush();
			for (var i = 0; i < msgCount; i++)
			{
				msg = msgList[i];
				dbLogPerf.Log(msg);

				first = dbLogPerf.LogStack[i];

				Assert.IsTrue(dbLogPerf.LogStack.Any());
				Assert.IsTrue(
					first.STEP == msg.STEP
					&& first.LOG_DTM == msg.LOG_DTM
					&& first.LGN_NM == msg.LGN_NM
					&& first.USR_NM == msg.USR_NM
					&& first.CLNT_MCHN_NM == msg.CLNT_MCHN_NM
					&& first.SRVR == msg.SRVR
					&& first.MSG_SRC == msg.MSG_SRC
					&& first.MTHD == msg.MTHD
					&& first.MSG == msg.MSG
					&& first.STRT_DTM == msg.STRT_DTM
					&& first.END_DTM == msg.END_DTM
					&& first.REC_CNT == msg.REC_CNT
					&& first.THRD_ID == msg.THRD_ID
					&& first.IS_ZIP == msg.IS_ZIP
					&& first.ERR_MSG == msg.ERR_MSG
					&& first.RuntimeMs == msg.RuntimeMs
				);
			}
		}

		[TestCase]
		public void DbLogPerf_TestAddOpLogPerfMessage()
		{
			// Arrange
			string testString = "UNIT TEST - DbLogPerf Logs";
			string testStringShort = "UI UNIT TEST";
			DateTime now = DateTime.UtcNow;
			var user = OpUserStack.MyOpUserToken.Usr;

			OpLogPerfMessage opLogPerfMsg = new OpLogPerfMessage
			{
				Step = 0
				, MessageTime = now
				, CallingMethod = testStringShort
				, Message = testString
				, PreviousMessageTime = now
				, ThreadID = 0
			};

			// Act
			dbLogPerf.Flush();
			dbLogPerf.Log(opLogPerfMsg);
			DbLogPerfMessage first = dbLogPerf.LogStack.FirstOrDefault();

			// Assert
			Assert.IsTrue(
				first.STEP == opLogPerfMsg.Step
				&& first.LOG_DTM == opLogPerfMsg.MessageTime
				&& first.MTHD == opLogPerfMsg.CallingMethod
				&& first.MSG == opLogPerfMsg.Message
				&& first.STRT_DTM == opLogPerfMsg.PreviousMessageTime
				&& first.END_DTM == opLogPerfMsg.MessageTime.ToUniversalTime()
				&& first.THRD_ID == opLogPerfMsg.ThreadID
				&& first.ERR_MSG == opLogPerfMsg.IsError
				&& first.MTHD == opLogPerfMsg.CallingMethod
			);
		}
				
		[TestCase]
		public void DbLogPerf_TestAddMultipleMessagesWithFlush()
		{
			// Arrange
			int msgCount = maxLogStackSize + 1;
			DbLogPerfMessage msg = null;
			List<DbLogPerfMessage> msgList = MakeMulitpleNewMessages(msgCount);
			
			// Act
			dbLogPerf.Flush();

			for (var i = 0; i < msgCount; i++)
			{
				msg = msgList[i];
				dbLogPerf.Log(msg);
			}
			Console.WriteLine("LogSack count: " + dbLogPerf.LogStack.Count);
			// Assert
			Assert.IsTrue(!dbLogPerf.LogStack.Any());
		}
	}
}
