using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Tools;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/CustomerCalendar")]
    public class CustomerCalendarController : BaseApiController
    {
        private readonly ICustomerCalendarLib _customerCalendarLib;

        public CustomerCalendarController(ICustomerCalendarLib _customerCalendarLib)
        {
            this._customerCalendarLib = _customerCalendarLib;
        }

        /// <summary>
        /// Get customer quarter start date and end date details
        /// </summary>
        /// <param name="input"></param>
        /// <returns>CustomerQuarterDetails</returns>
        [Route("GetCustomerQuarterDetails")]
        [HttpPost]
        public CustomerQuarterDetails GetCustomerQuarterDetails([FromBody]dynamic input)
        {
            return this._customerCalendarLib.GetCustomerQuarterDetails((int?)input.CustomerMemberSid
                                                                      , (DateTime?)input.DayInQuarter
                                                                      , (short?)input.Year
                                                                      , (short?)input.QuarterNo);
        }

        /// <summary>
        /// Get the customer quarters, (CurrentQuarter - 1) to (CurrentQuarter + 6) i.e., 8 quarters
        /// Ex. CurrentQuarter = 2016Q2 then quarters displayed are 2016Q1, 2016Q2, 2016Q3, 2016Q4, 2017Q1, 2017Q2, 2017Q3, 2017Q4
        /// </summary>
        /// <param name="input">CustomerMemberSid, QuarterNo, Year, DateTime</param>
        /// <returns>Customer Quarters</returns>
        [Route("GetCustomerQuarters")]
        public HttpResponseMessage GetCustomerQuarters([FromBody]dynamic input)
        {
            //TODO : Need to check if we want to show current -1 to current + 6 quarters, depends upon deal creation PSI acceptance criteria
            throw new NotImplementedException("Will be implemented as part of deal creation");
        }
    }
}