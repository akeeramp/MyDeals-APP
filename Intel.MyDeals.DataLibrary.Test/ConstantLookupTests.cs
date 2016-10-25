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
            List<ToolConstants> constants = new ConstantLookupDataLib().GetToolConstants();
            Assert.IsTrue(constants.Count > 0);
        }
        
        [TestMethod]
        public void GetToolContant()
        {
            string value = new ConstantLookupDataLib().GetToolConst("DAYS_TO_EXPIRE");
            Assert.IsTrue(!string.IsNullOrEmpty(value));

            value = new ConstantLookupDataLib().GetToolConst("THIS_DOES_NOT_EXIST");
            Assert.IsTrue(string.IsNullOrEmpty(value));
        }

        [TestMethod]
        public void GetToolConstInt()
        {
            int intValue = new ConstantLookupDataLib().GetToolConstInt("DAYS_TO_EXPIRE");
            Assert.IsTrue(intValue > 0);

            intValue = new ConstantLookupDataLib().GetToolConstInt("THIS_DOES_NOT_EXIST");
            Assert.IsTrue(intValue == 0);
        }
    }
}
