using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic.PctMctFailure
{
    public interface IPctMctFailureLib
    {
        List<PctMctFailureException> GetFailedPctMctResults(int startYearQuarter, int endYearQuarter);
    }
}