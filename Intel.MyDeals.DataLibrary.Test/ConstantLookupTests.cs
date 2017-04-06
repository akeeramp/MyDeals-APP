using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class ConstantLookupTests
    {
        public ConstantLookupTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void GetToolContants()
        {
            List<AdminConstant> constants = new ConstantLookupDataLib().GetAdminConstants();
            Assert.IsTrue(constants.Count > 0);
        }

        [TestMethod]
        public void GetToolContant()
        {
            string value = new ConstantLookupDataLib().GetAdminToolConst("DAYS_TO_EXPIRE");
            Assert.IsTrue(!string.IsNullOrEmpty(value));

            value = new ConstantLookupDataLib().GetAdminToolConst("THIS_DOES_NOT_EXIST");
            Assert.IsTrue(string.IsNullOrEmpty(value));
        }

        [TestMethod]
        public void GetToolConstInt()
        {
            int intValue = new ConstantLookupDataLib().GetAdminToolConstInt("DAYS_TO_EXPIRE");
            Assert.IsTrue(intValue > 0);

            intValue = new ConstantLookupDataLib().GetAdminToolConstInt("THIS_DOES_NOT_EXIST");
            Assert.IsTrue(intValue == 0);
        }
    }
}