using System;
using NUnit.Framework;
using Intel.MyDeals.Entities.Logging;

namespace Intel.MyDeals.Entities.Test
{
	[TestFixture]
	public class LoggingClientUnitTests
	{
		/// <summary>
		/// Runs before the current test fixture
		/// </summary>
		[TestFixtureSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Starting Enity's LoggingClient Tests.");
			OpUserStack.EmulateUnitTester();
		}

		[TestFixtureTearDown]
		public void AfterTheCurrentTextFixture()
		{
			Console.WriteLine("Completed Enity's LoggingClient Tests.");
		}
		

		[TestCase]
		public void LoggingClient_InstanceOptimal()
		{
			// Arrange / Act
			var test = LoggingClient.InstanceOptimal();
			// Assert
			Assert.IsNotNull(test);
		}


		//// TODO: Figure out how to test this function. LoggingClient.UploadLogPerfLogs requires 
		//// a running server (local or otherwise) to call the API. I'm not sure how we can 
		//// unit test it right now because of this.
		//[TestCase]
		//public void LoggingClient_UploadLogPerfLogs()
		//{
			//// Arrange
			//DbLogPerfMessage first = null;

			//string testString = "UNIT TEST - UploadDbLogPerfLogs";
			//string testStringShort = "UI UNIT TEST";
			//DateTime now = DateTime.UtcNow;
			//var user = OpUserStack.MyOpUserToken.Usr;

			//DbLogPerfMessage msg = new DbLogPerfMessage
			//{
			//	STEP = 0
			//	, LOG_DTM = now
			//	, LGN_NM = user.Idsid
			//	, USR_NM = user.FullName
			//	, CLNT_MCHN_NM = testStringShort
			//	, SRVR = testStringShort
			//	, MSG_SRC = testStringShort
			//	, MTHD = testString
			//	, MSG = testString
			//	, STRT_DTM = now
			//	, END_DTM = DateTime.MaxValue
			//	, REC_CNT = 1
			//	, THRD_ID = 0
			//	, IS_ZIP = 0
			//	, ERR_MSG = false
			//	, RuntimeMs = 0
			//};

			//List<DbLogPerfMessage> msgs = new List<DbLogPerfMessage>();

			//// Act
			//OpLogPerf.Flush();
			//LoggingClient loggingClient = new LoggingClient();
			//Console.WriteLine(".............." + MyDealsWebApiUrl.ROOT_URL);// UploadLogPerfLogs);
			//bool isLogged = loggingClient.UploadLogPerfLogs(msgs);

			//// Assert
			//Assert.IsTrue(isLogged);
		//}

	}
}
