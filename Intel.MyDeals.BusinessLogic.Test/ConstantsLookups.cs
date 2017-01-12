//using System.Collections.Generic;
//using System.Linq;
//using Intel.MyDeals.BusinessLogic;
//using Intel.MyDeals.DataLibrary.Test;
//using Intel.MyDeals.Entities;
//using Microsoft.VisualStudio.TestTools.UnitTesting;

//namespace Intel.MyDeals.BusinessLogic.Test
//{
//    [TestClass]
//    public class ConstantsLookups
//    {
//        public ConstantsLookups()
//        {
//            OpUserStack.EmulateUnitTester();
//            UnitTestHelpers.SetDbConnection();
//        }

//        [TestMethod]
//        public void GetToolConstants()
//        {
//            List<ToolConstants> results = new ConstantsLookupsLib().GetToolConstants();

//            Assert.IsTrue(results.Any());
//        }

//        [TestMethod]
//        public void GetToolConstant()
//        {
//            ToolConstants toolConstant = new ConstantsLookupsLib().GetToolConstant("DAYS_TO_EXPIRE");
//            Assert.IsNotNull(toolConstant);

//            toolConstant = new ConstantsLookupsLib().GetToolConstant("THIS_DOES_NOT_EXIST");
//            Assert.IsNull(toolConstant);

//            string value = new ConstantsLookupsLib().GetToolConstantValue("DAYS_TO_EXPIRE");
//            Assert.IsTrue(!string.IsNullOrEmpty(value));

//            value = new ConstantsLookupsLib().GetToolConstantValue("THIS_DOES_NOT_EXIST");
//            Assert.IsTrue(string.IsNullOrEmpty(value));
//        }
//    }
//}
