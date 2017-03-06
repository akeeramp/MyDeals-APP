using System;
using Intel.MyDeals.Entities;
using Intel.Opaque.Tools;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    /// <summary>
    /// Library to hold customer calendar read operation functions
    /// </summary>
    public class CustomerCalendarLib : ICustomerCalendarLib
    {
        private readonly ICustomerCalendarDataLib _customerCalendarDataLib;

        public CustomerCalendarLib(ICustomerCalendarDataLib customerCalendarDataLib)
        {
            _customerCalendarDataLib = customerCalendarDataLib;
        }

        /// <summary>
        /// Get customer calendar quarter details
        /// When customerMemberSid is null returns Intel Calendar details,
        /// provided dayInQuarter is present or (year and quarterNo) is not null
        /// </summary>
        /// <param name="customerMemberSid"></param>
        /// <param name="dayInQuarter"></param>
        /// <param name="year">Year eg:2017</param>
        /// <param name="quarterNo">Quarter No eg:4</param>
        /// <returns>CustomerQuarterDetails</returns>
        public CustomerQuarterDetails GetCustomerQuarterDetails(int? customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo)
        {

            if((dayInQuarter == null || dayInQuarter > OpaqueConst.SQL_MIN_DATE) && (year == null || quarterNo == null))
            {
                throw new ArgumentException("You must pass a valid DayInQuarter or a valid QuarterNo and Year to resolve quarter dates.");
            }

            return _customerCalendarDataLib.GetCustomerQuarterDetails(customerMemberSid, dayInQuarter, year, quarterNo);
        }
    }
}
