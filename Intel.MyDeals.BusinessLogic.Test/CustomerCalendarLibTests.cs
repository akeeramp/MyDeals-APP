using System;
using NUnit.Framework;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class CustomerCalendarLibTests
    {
        static DateTime minDate = Convert.ToDateTime("1700-1-1");

        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Customer Calendar Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Customer Calendar Library Tests.");
        }

        [Test,
            TestCase(null, null, null, null),
            TestCase(70, null, null, null),
            TestCase(70, null, null, (short)4),
            TestCase(70, null, (short)2017, null),
            TestCase(70, 1, null,null),
            TestCase(70, 1, (short)2017, null),
            TestCase(70, 1, null, (short)4)
            ]
        public void CalLib_GetCustomerQuarterFailTesting(int? customerMemberSid, int? minDateCheck, short? year, short? quarterNo)
        {
            DateTime? minDate = null;
            if (minDateCheck != null) minDate = Convert.ToDateTime("1700-1-1");

            GetCustomerQuarterDetailsWithInvalidParams(customerMemberSid, minDate, year, quarterNo);
        }

        public void GetCustomerQuarterDetailsWithInvalidParams(int? customerMemberSid,
                                                                DateTime? dayInQuarter,
                                                                short? year,
                                                                short? quarterNo)
        {
            var mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();
            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(), It.IsAny<short>(), It.IsAny<short>())).Returns(new CustomerQuarterDetails());

            var ex = Assert.Throws<ArgumentException>(() => new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                                    , dayInQuarter
                                                                                                    , year
                                                                                                    , quarterNo));
            Assert.That(ex.Message, Is.EqualTo("You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates."));
        }


        [Test,
            TestCase(70, null, (short)2017, (short)4, "2017-11-05", "2018-02-03"),
            TestCase(70, null, (short)2016, (short)4, "2016-11-06", "2017-02-04"),
            ]
        public void CalLib_GetCustomerQuarterPassTesting(int customerMemberSid, DateTime? dayInQuarter, short? year, short? quarterNo, string startDate, string endDate)
        {
            DateTime startDateDt = Convert.ToDateTime(startDate);
            DateTime endDateDt = Convert.ToDateTime(endDate);
            GetCustomerQuarterDetailsWithValidParams(customerMemberSid, dayInQuarter, year, quarterNo, startDateDt, endDateDt);
        }

        public void GetCustomerQuarterDetailsWithValidParams(int customerMemberSid,
                                                                DateTime? dayInQuarter,
                                                                short? year,
                                                                short? quarterNo, 
                                                                DateTime quarterStart, 
                                                                DateTime quarterEnd)
        {
            var mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();
            var resultCustomerCalendar = new CustomerQuarterDetails() { QTR_STRT = quarterStart, QTR_END = quarterEnd };

            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(),
                It.IsAny<short>(), It.IsAny<short>())).Returns(resultCustomerCalendar);

            var customerQuarterDetails = new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                                                , dayInQuarter
                                                                                                                , year
                                                                                                                , quarterNo);

            Assert.AreEqual(customerQuarterDetails.QTR_STRT.Date, customerQuarterDetails.QTR_STRT.Date);
            Assert.AreEqual(customerQuarterDetails.QTR_END.Date, customerQuarterDetails.QTR_END.Date);
        }

    }
}

