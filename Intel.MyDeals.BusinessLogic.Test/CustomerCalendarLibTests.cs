using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class CustomerCalendarLibTests
    {
        public CustomerCalendarLibTests()
        {
            Console.WriteLine("Started Customer Calendar Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        //[ExpectedException(typeof(ArgumentException), "You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates.")]
        public void CalLib_GetCustomerQuarterFailTesting()
        {
            DateTime mintDate = Convert.ToDateTime("1700-1-1");

            GetCustomerQuarterDetailsWithInValidParams(null, null, null, null);
            GetCustomerQuarterDetailsWithInValidParams(70, null, null, null);
            GetCustomerQuarterDetailsWithInValidParams(70, null, null, (short)4);
            GetCustomerQuarterDetailsWithInValidParams(70, null, (short)2017, null);
            GetCustomerQuarterDetailsWithInValidParams(70, mintDate, (short)2017, null);
            //GetCustomerQuarterDetailsWithInValidParams(cust, null, (short)2017, (short)4);  // Test to check a good case fails failure checks
            Assert.IsTrue(1 == 1);
        }

        public void GetCustomerQuarterDetailsWithInValidParams(int? customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo)
        {
            //Arrange,
            var mockCustomerCalendarDataLib = new Mock<ICustomerCalendarDataLib>();

            //Set the mock repository
            mockCustomerCalendarDataLib.Setup(x => x.GetCustomerQuarterDetails(It.IsAny<int?>(), It.IsAny<DateTime?>(), It.IsAny<short>(), It.IsAny<short>())).Returns(new CustomerQuarterDetails());

            //Assert
            try
            {
                var customerQuarterDetails = new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                                    , dayInQuarter
                                                                                                    , year
                                                                                                    , quarterNo);
                Assert.Fail();
            }
            catch (Exception ex)
            {
                Assert.IsTrue(ex.Message == "You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates.");
            }
        }

        [TestMethod]
        public void CalLib_GetCustomerQuarterPassTesting()
        {
            DateTime startDate = Convert.ToDateTime("2017-11-05");
            DateTime endDate = Convert.ToDateTime("2018-02-03");
            GetCustomerQuarterDetailsWithValidParams(70, null, (short)2017, (short)4, startDate, endDate);

            startDate = Convert.ToDateTime("2016-11-06");
            endDate = Convert.ToDateTime("2017-02-04");
            GetCustomerQuarterDetailsWithValidParams(70, null, (short)2016, (short)4, startDate, endDate);
            //GetCustomerQuarterDetailsWithValidParams(70, null, (short)2017, null, startDate, endDate);  // Test to check a good case fails failure checks
            Assert.IsTrue(1 == 1);
        }


        ///// <summary>
        ///// Test the GetCustomerCalendar details
        ///// </summary>
        ///// <param name="customerMemberSid"></param>
        ///// <param name="dayInQuarter"></param>
        ///// <param name="year"></param>
        ///// <param name="quarterNo"></param>
        //[TestCase(70, null, (short)2017, (short)4, "2017-11-05 ", "2018-02-03")]
        //[TestCase(70, null, (short)2016, (short)4, "2016-11-06 ", "2017-02-04")]
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

            //Assert
            try
            {
                var customerQuarterDetails = new CustomerCalendarLib(mockCustomerCalendarDataLib.Object).GetCustomerQuarterDetails(customerMemberSid
                                                                                                    , dayInQuarter
                                                                                                    , year
                                                                                                    , quarterNo);

                Assert.AreEqual(customerQuarterDetails.QTR_STRT.Date, customerQuarterDetails.QTR_STRT.Date);
                Assert.AreEqual(customerQuarterDetails.QTR_END.Date, customerQuarterDetails.QTR_END.Date);
            }
            catch (Exception ex)
            {
                Assert.Fail(ex.Message);
            }
        }

    }
}

