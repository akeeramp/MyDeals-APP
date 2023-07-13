using System;
using NUnit.Framework;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.App.Test
{
    [TestFixture]
    public class AppLibTests
    {
        //private readonly OpUserToken _opUserToken = null;

        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started App Lib tests.");
            OpUserStack.EmulateUnitTester();
            //UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed App Lib tests.");
        }

        // TO DO: Fill it tests, problems are that AppLib is static and difficult to write tests against

    }
}