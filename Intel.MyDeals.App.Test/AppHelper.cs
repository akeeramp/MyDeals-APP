using System;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.App.Test
{
    [TestClass]
    public class AppHelper
    {
        private readonly OpUserToken _opUserToken = null;

        public AppHelper()
        {
            OpUserStack.EmulateUnitTester();
            _opUserToken = OpUserStack.MyOpUserToken;
        }

        [TestMethod]
        public void SetupDataAccessLib()
        {
            string env = BusinessLogic.BusinessLogic.GetEnvironment();
            Assert.IsTrue(string.IsNullOrEmpty(env));

            string connStr = BusinessLogic.BusinessLogic.GetConnectionString();
            Assert.IsTrue(string.IsNullOrEmpty(connStr));

            App.AppHelper.SetupDataAccessLib();

            env = BusinessLogic.BusinessLogic.GetEnvironment();
            Assert.IsFalse(string.IsNullOrEmpty(env));

            connStr = BusinessLogic.BusinessLogic.GetConnectionString();
            Assert.IsFalse(string.IsNullOrEmpty(connStr));
        }
    }
}
