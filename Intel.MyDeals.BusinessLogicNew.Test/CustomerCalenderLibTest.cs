using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.BusinessLogicNew.Test
{
    [TestFixture]
    public class CustomerCalenderLibTest
    {
        public Mock<ICustomerCalendarDataLib> mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();

        private static readonly object[] GetCustomerQuarterDetailsParams =
        {
            new object[] { 10, null, null, (short)3 },
            new object[] { 10, new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc), null, (short)3 },
            new object[] { 10, null, (short)2023, null },
            new object[] { 10, new DateTime(1800, 1, 1, 0, 0, 0, DateTimeKind.Utc), (short)1800, null },
            new object[] { 10, null, null, null },
            new object[] { 10, new DateTime(1800, 1, 1, 0, 0, 0, DateTimeKind.Utc), null, null }
        };

        [Test,
            TestCaseSource("GetCustomerQuarterDetailsParams")]
        public void GetCustomerQuarterDetails_ShouldThrowException_withInvalidParams(dynamic data)
        {
            int? customerMemberSid = data[0];
            DateTime? dayInQuarter = data[1];
            short? year = data[2];
            short? quarterNo = data[3];            
            var ex = Assert.Throws<ArgumentException>(() => new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid, dayInQuarter, year, quarterNo));
            Assert.That(ex.Message, Is.EqualTo("You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates."));
        }

        private static readonly object[] GetCustomerQuarterDetailsWithParams =
        {
            new object[] { 10, new DateTime(2022, 1, 1, 0, 0, 0, DateTimeKind.Utc), (short)2022, (short)3 },
            new object[] { 10, new DateTime(1800, 1, 1, 0, 0, 0, DateTimeKind.Utc), (short)2022, (short)3 },
            new object[] { null, null, (short)2022, (short)3 }
        };


        [Test,
            TestCaseSource("GetCustomerQuarterDetailsWithParams")
            ]
        public void GetCustomerQuarterDetails_ShouldReturnNotNull_WithValidParams(int customerMemberSid, DateTime? dayInQuarter, short? year, short? quarterNo)
        {
            var resultCustomerCalendar = new CustomerQuarterDetails();

            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(),
                It.IsAny<short>(), It.IsAny<short>())).Returns(resultCustomerCalendar);

            var customerQuarterDetails = new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid, dayInQuarter, year, quarterNo);
            Assert.NotNull(year);
            Assert.NotNull(quarterNo);
        }
    }
}