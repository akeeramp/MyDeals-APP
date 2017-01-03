using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
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
            //Arrange,
            var mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();

            //Set the mock repository
            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(), It.IsAny<short>(), It.IsAny<short>())).Returns(new CustomerQuarterDetails());

            //ACT
            var ex = Assert.Throws<ArgumentException>(() => new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                                , dayInQuarter
                                                                                                , year
                                                                                                , quarterNo));

            //Assert
            Assert.That(ex.Message,
                Is.EqualTo("You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates."));
        }

        /// <summary>
        /// Test the GetCustomerCalendar details
        /// </summary>
        /// <param name="customerMemberSid"></param>
        /// <param name="dayInQuarter"></param>
        /// <param name="year"></param>
        /// <param name="quarterNo"></param>
        [TestCase(70, null, (short)2017, (short)4, "2017-11-05 ", "2018-02-03")]
        [TestCase(70, null, (short)2016, (short)4, "2016-11-06 ", "2017-02-04")]
        public void GetCustomerQuarterDetailsWithValidParams(int customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo, DateTime quarterStart, DateTime quarterEnd)
        {
            //Arrange,
            var mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();

            var resultCustomerCalendar = new CustomerQuarterDetails() { QTR_STRT = quarterStart, QTR_END = quarterEnd };

            //Set the mock repository
            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(),
                It.IsAny<short>(), It.IsAny<short>())).Returns(resultCustomerCalendar);

            var customerQuarterDetails = new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                               , dayInQuarter
                                                                                               , year
                                                                                               , quarterNo);

            //Assert
            Console.WriteLine("Compare the quarter start date");
            Assert.AreEqual(customerQuarterDetails.QTR_STRT.Date, customerQuarterDetails.QTR_STRT.Date);

            Console.WriteLine("Compare the quarter end date");
            Assert.AreEqual(customerQuarterDetails.QTR_END.Date, customerQuarterDetails.QTR_END.Date);

        }
    }
}

