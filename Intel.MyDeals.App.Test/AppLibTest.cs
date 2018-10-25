using System;
using NUnit.Framework;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.App;

namespace Intel.MyDeals.App.Test
{
    [TestFixture]
    public class AppLibTests
    {
        private readonly OpUserToken _opUserToken = null;

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