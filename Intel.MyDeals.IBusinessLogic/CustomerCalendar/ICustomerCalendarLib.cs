using Intel.MyDeals.Entities;
using System;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICustomerCalendarLib
    {
        CustomerQuarterDetails GetCustomerQuarterDetails(int? customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo);

    }
}
