using System;
using NUnit.Framework;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class OtherTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Other tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Other tests.");
        }


        [TestCase]
        public void PingTest()
        {
            Dictionary<string, string> pingDetails = new DevTestDataLib().PingDbDetails();

            Assert.IsTrue(pingDetails.ContainsKey("DB Server"));
            Assert.IsTrue(!string.IsNullOrEmpty(pingDetails["DB Server"]));
        }

        [TestCase(73000,0,0, "")] // 200 years ago, no result
        [TestCase(0, 0, 0, "(Now)")] // "Now" result
        [TestCase(0, 0, 5, "(Now)")] // 5 mins ago, "Now" result
        [TestCase(0, 1, 0, "(1 Hour Ago)")] // "1 Hour Ago" result
        [TestCase(0, 3, 0, "(3 Hours Ago)")] // "1 Hours Ago" result
        [TestCase(1, 3, 0, "(1 Day Ago)")] // "1 Day Ago" result
        [TestCase(3, 3, 0, "(3 Days Ago)")] // "3 Days Ago" result
        [TestCase(32, 3, 0, "(1 Month Ago)")] // "1 Month Ago" result
        [TestCase(100, 3, 0, "(3 Months Ago)")] // "3 Months Ago" result
        [TestCase(390, 3, 0, "(1 Year Ago)")] // "1 Year Ago" result
        [TestCase(800, 3, 0, "(2 Years Ago)")] // "2 Years Ago" result
        public void GetDeltaTimeTest(int d, int h, int m, string expectedResults)
        {
            DateTime testDate = DateTime.Now;
            TimeSpan ts = new TimeSpan(d, h, m, 0); // d, h, m, s
            testDate = testDate - ts;

            string results = new DevTestDataLib().GetDeltaTime(testDate);

            Assert.IsTrue(results.Trim() == expectedResults);
        }

        [TestCase("Example Simple Exception: Database Exception")] // Normal exception
        public void ExampleSQLExceptionTest(string expectedResults)
        {
            var ex = Assert.Catch(() => new DevTestDataLib().ExampleSQLException());
            Assert.That(ex.Message.ToString() == expectedResults);
        }

    }
}