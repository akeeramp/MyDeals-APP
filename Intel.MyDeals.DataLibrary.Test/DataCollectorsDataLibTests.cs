using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Intel.MyDeals.BusinessLogic;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class DataCollectorsDataLibTests
    {
        public DataCollectorsDataLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
        
        [TestMethod]
        public void GeosDealsAll()
        {
            MyDealsData results = OpDataElementType.CNTRCT.GetByIDs(new List<int> {123});
            Assert.IsTrue(results.ContainsKey(OpDataElementType.PRC_ST));
        }

        [TestMethod]
        public void GetAtrbMstrs()
        {
            List<AtrbMstr> y = new AtrbMapDataLib().GetAtrbMstrs();
//            Assert.IsTrue(results.ContainsKey(OpDataElementType.PRC_ST));\
            int i = 0;
        }
    }
}
