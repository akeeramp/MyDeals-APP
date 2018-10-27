using System;
using NUnit.Framework;
using System.Threading;
using Intel.Opaque;

namespace Intel.MyDeals.Entities.Test
{
    [TestFixture]
    public class OpUserStackUnitTests
    {
        [TestFixtureSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started OpUserStackUnit tests.");
            OpUserStack.EmulateUnitTester();
        }

        [TestFixtureTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed OpUserStackUnit tests.");
        }

        [TestCase]
        public void TestEmulateAuthentication()
        {
            string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper();
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;
            Assert.AreEqual(opUserToken.Usr.Idsid.ToUpper(), authenticatedName);
        }

        [TestCase]
        public void GetMySettings()
        {
            string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper();
            UserSetting mySettings = OpUserStack.MySettings;
            OpUserToken opUserToken = mySettings.UserToken;
            Assert.AreEqual(opUserToken.Usr.Idsid.ToUpper(), authenticatedName);
        }

    }
}
