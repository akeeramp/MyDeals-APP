using Intel.MyDeals.Entities;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class CustomerCalendarDataLibTests
    {
        /// <summary>
        /// Runs before the current test fixture
        /// </summary>
        [TestFixtureSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Customer Calendar Data Library tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }


        /// <summary>
        /// Test the GetCustomerCalendar details
        /// </summary>
        /// <param name="customerMemberSid"></param>
        /// <param name="dayInQuarter"></param>
        /// <param name="year"></param>
        /// <param name="quarterNo"></param>
        [TestCase(70, null, 2017, 4, "2017-11-05 ", "2018-02-03")]
        [TestCase(70, null, 2016, 4, "2016-11-06 ", "2017-02-04")]
        public void GetCustomerQuarterDetailsWithValidParams(int customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , int? year
                                                                , int? quarterNo, DateTime quarterStart, DateTime quarterEnd)
        {
            //Arrange, ACT
            var customerQuarterDetails = new CustomerCalendarDataLib().GetCustomerQuarterDetails(customerMemberSid,
                                                                                                    dayInQuarter, (short)year, (short)quarterNo);

            //Assert
            Console.WriteLine("Compare the quarter start date");
            Assert.AreEqual(customerQuarterDetails.QTR_STRT.Date, quarterStart.Date);

            Console.WriteLine("Compare the quarter end date");
            Assert.AreEqual(customerQuarterDetails.QTR_END.Date, quarterEnd.Date);

        }
    }
}
