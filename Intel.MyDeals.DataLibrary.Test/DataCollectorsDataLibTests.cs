using Intel.MyDeals.Entities;
using System.Collections.Generic;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.DataLibrary.OpDataCollectors;
using NUnit.Framework;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class DataCollectorsDataLibTests
    {
        [OneTimeSetUp]
        public void DataCollectorsDataLibTestsInit()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestCase]
        public void GeosDealsAll()
        {
            MyDealsData results = OpDataElementType.CNTRCT.GetByIDs(new List<int> {123});
            Assert.IsTrue(results.ContainsKey(OpDataElementType.PRC_ST));
        }

        [TestCase]
        public void DuplicateTitleTest()
        {
            //IsDuplicateContractTitle
            bool testResults = new OpDataCollectorValidationDataLib().IsDuplicateTitle(OpDataElementType.CNTRCT, 86, 0, "Some Nonexistant Title");
            Assert.IsFalse(testResults); // The title doesn't exist in DB already

            testResults = new OpDataCollectorValidationDataLib().IsDuplicateTitle(OpDataElementType.CNTRCT, 86, 0, "Intel-HP Worldwide Commercial DT and NB Agreement FQ2’16 to FQ1’17");
            Assert.IsTrue(testResults); // The title doesn't exist in DB already
        }


    }
}
