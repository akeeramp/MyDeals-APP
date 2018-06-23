using Intel.MyDeals.Entities;
using NUnit.Framework;

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



    }
}
