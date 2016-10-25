using System.Threading;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.Entities.Test
{
    [TestClass]
    public class OpUserStackUnitTests
    {

        public OpUserStackUnitTests()
        {
            OpUserStack.EmulateUnitTester();
        }

        [TestMethod]
        public void TestEmulateAuthentication()
        {
            string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper();
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;
            Assert.AreEqual(opUserToken.Usr.Idsid.ToUpper(), authenticatedName);
        }

        [TestMethod]
        public void GetMySettings()
        {
            string authenticatedName = Thread.CurrentPrincipal.Identity.Name.ToUpper();
            UserSetting mySettings = OpUserStack.MySettings;
            OpUserToken opUserToken = mySettings.UserToken;
            Assert.AreEqual(opUserToken.Usr.Idsid.ToUpper(), authenticatedName);
        }

    }
}
