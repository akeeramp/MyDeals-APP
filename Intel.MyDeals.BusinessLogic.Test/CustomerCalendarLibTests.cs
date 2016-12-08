using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class CustomerCalendarLibTests
    {
        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [TestFixtureSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Customer Calendar Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestFixtureTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Customer Calendar Library Tests.");
        }

        [TestCase(null, null, null, null)]
        [TestCase(70, null, null, null)]
        [TestCase(70, null, null, (short)4)]
        [TestCase(70, null, (short)2017, null)]
        public void GetCustomerQuarterDetailsWithInValidParams(int customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo)
        {
            //Arrange, ACT
            var ex = Assert.Throws<ArgumentException>(() => new CustomerCalendarLib().GetCustomerQuarterDetails(customerMemberSid
                                                                                                , dayInQuarter
                                                                                                , year
                                                                                                , quarterNo));

            //Assert
            Assert.That(ex.Message, 
                Is.EqualTo("You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates."));
        }
    }
}

