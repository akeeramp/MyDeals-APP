using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class OpUserTokenHelpers
    {
        private readonly OpUserToken _opUserToken = null;

        public OpUserTokenHelpers()
        {
            // UnitTester is NOT SA/Developer or Tester
            OpUserStack.EmulateUnitTester();
            _opUserToken = OpUserStack.MyOpUserToken;
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void IsSuper()
        {
            Assert.IsFalse(_opUserToken.IsSuper());
        }

        [TestMethod]
        public void IsSuperSa()
        {
            Assert.IsFalse(_opUserToken.IsSuperSa());
        }

        [TestMethod]
        public void IsDeveloper()
        {
            Assert.IsFalse(_opUserToken.IsDeveloper());
        }

        [TestMethod]
        public void IsTester()
        {
            Assert.IsFalse(_opUserToken.IsTester());
        }

    }
}