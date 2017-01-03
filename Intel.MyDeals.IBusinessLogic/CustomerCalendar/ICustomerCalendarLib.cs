using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
