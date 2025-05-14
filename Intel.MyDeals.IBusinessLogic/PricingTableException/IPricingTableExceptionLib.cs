using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic.PricingTableException
{
    public interface IPricingTableExceptionLib
    {
        List<PctException> GetPctExceptions(int startYearQuarter,  int endYearQuarter);
    }
}