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
	public class EmailExLogPerfUnitTests
	{
		public EmailExLogPerf emailExLogPerf;
		private string emailTo = "josephine.a.juang@intel.com"; // TODO: this shoud be read from an environment aware constants config setup. The from email might also be from a config file or constant. Mike prefers constants

		/// <summary>
		/// Runs before the current test fixture
		/// </summary>
		[TestFixtureSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Starting Enity's EmailExLogPerf Tests.");

			emailExLogPerf = new EmailExLogPerf(emailTo); // max logStack of 3
			OpUserStack.EmulateUnitTester();
			OpLog.LogConfig = new LogConfig { MsgSrc = "UNIT TESTS", IsActive = true };
		}

		[TestFixtureTearDown]
		public void AfterTheCurrentTextFixture()
		{
			Console.WriteLine("Completed Enity's EmailExLogPerf Tests.");
		}


		[TestCase(LogCategory.Information)]
		[TestCase(LogCategory.Error)]
		public void EmailExLogPerf_Log(LogCategory category)
		{
			// Arrange
			string testString = "UNIT TEST - EmailExLogPerf Logs";
			string testStringShort = "UI UNIT TEST";
			DateTime now = DateTime.UtcNow;
			var user = OpUserStack.MyOpUserToken.Usr;

			OpLogPerfMessage msg = new OpLogPerfMessage
			{
				Step = 0
				, MessageTime = now
				, CallingMethod = testStringShort
				, Message = testString
				, PreviousMessageTime = now
				, ThreadID = 0
				, Category = category
			};

			// Act
			emailExLogPerf.Log(msg);

			// Assert
			// TODO: I'm actually not sure how to test this...
		}

		[TestCase]
		public void EmailExLogPerf_SendEmail()
		{
			// Arrange
			string testString = "UNIT TEST - UploadEmailExLogPerfLogs";
			string testStringShort = "UI UNIT TEST";

			// Act
			bool isSent = EmailExLogPerf.SendEmail(testStringShort, testString);

			// Assert
			Assert.IsTrue(isSent);
		}
				
	}
}
