using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IPricingTableExceptionDataLib
    {
        List<PctException> GetPctExceptions(int startYearQuarter, int endYearQuarter);
    }
}