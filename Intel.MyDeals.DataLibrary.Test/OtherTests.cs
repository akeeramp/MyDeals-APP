using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class OtherTests
    {

        public OtherTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void Ping()
        {
            Dictionary<string, string> pingDetails = new DevTestDataLib().PingDbDetails();

            Assert.IsTrue(pingDetails.ContainsKey("DB Server"));
            Assert.IsTrue(!string.IsNullOrEmpty(pingDetails["DB Server"]));
        }
    }
}