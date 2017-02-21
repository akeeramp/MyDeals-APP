using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.Mydeals.BusinessRules.Test
{
    [TestFixture]
    public class BasicRulesTests
    {
        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            //Console.WriteLine("Started Customer Calendar Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            //Console.WriteLine("Completed Customer Calendar Library Tests.");
        }

        [TestCase]
        public void BasicRules()
        {
            OpMsgQueue opMsgQueue;
            IEnumerable<IOpDataElement> results;
            int id = 34;

            MyDealsData myDealsData = new DataCollectorDataLib()
                .GetByIDs(OpDataElementType.Contract, new List<int> {id}, new List<OpDataElementType> {OpDataElementType.Contract, OpDataElementType.PricingStrategy});

            OpDataCollector dc = myDealsData[OpDataElementType.Contract].AllDataCollectors.FirstOrDefault();


            // PASS conditions
            dc.SetDataElementValue("NUM_OF_TIERS", 5);
            dc.SetDataElementValue("TITLE", "This title passes");
            opMsgQueue = dc.ApplyRules(MyRulesTrigger.OnAutomatedTesting);
            results = dc.GetDataElementsWithValidationIssues();
            Assert.That(results.Count(), Is.EqualTo(0));

            // FAIL conditions
            dc.SetDataElementValue("NUM_OF_TIERS", -5);
            dc.SetDataElementValue("TITLE", "This title fails because it is just way too long.");
            opMsgQueue = dc.ApplyRules(MyRulesTrigger.OnAutomatedTesting);
            results = dc.GetDataElementsWithValidationIssues();
            Assert.That(results.Count(), Is.EqualTo(2));

        }
    }
}
