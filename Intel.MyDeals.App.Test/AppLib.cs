using Intel.MyDeals.Entities;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.App.Test
{
    [TestClass]
    public class AppLib
    {
        private readonly OpUserToken _opUserToken = null;

        public AppLib()
        {
            OpUserStack.EmulateUnitTester();
            _opUserToken = OpUserStack.MyOpUserToken;
        }

        [TestMethod]
        public void Test()
        {
        }
    }

}