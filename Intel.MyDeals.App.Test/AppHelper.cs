using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

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

            Dictionary<string, string> envConfig = BusinessLogic.BusinessLogic.GetEnvConfigs();
            Assert.IsNull(envConfig);

            UnitTestHelpers.SetDbConnection();

            env = BusinessLogic.BusinessLogic.GetEnvironment();
            Assert.IsFalse(string.IsNullOrEmpty(env));

            connStr = BusinessLogic.BusinessLogic.GetConnectionString();
            Assert.IsFalse(string.IsNullOrEmpty(connStr));

            envConfig = BusinessLogic.BusinessLogic.GetEnvConfigs();
            Assert.IsNotNull(envConfig);                        // Object has been created
            Assert.IsTrue(envConfig.ContainsKey("jmsQueue"));   // Object has data
        }
    }
}
