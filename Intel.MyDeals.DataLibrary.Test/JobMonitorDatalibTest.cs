using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class JobMonitorDatalibTest
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Dropdown Data Library tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestCase]
        public void TestGetBatchRunHealthStatus()
        {
            List<BatchRunHealthSts> results = new JobMonitorDataLib().GetBatchRunHealthStatus();
            // ASSERT
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void TestGetBatchStepsRunHealthStatus()
        {
            List<BatchRunHealthSts> results = new JobMonitorDataLib().GetBatchStepsRunHealthStatus("idfcdudealdsa301a");
            // ASSERT
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void TestGetBatchStepRunHistory()
        {
            List<BatchRunHealthSts> results = new JobMonitorDataLib().GetBatchStepRunHistory("idfcdudealdsa301a", "PR_MYDL_LD_RPT_PRD_FACT", 10);
            // ASSERT
            Assert.IsTrue(results.Any());
        }
    }
}
