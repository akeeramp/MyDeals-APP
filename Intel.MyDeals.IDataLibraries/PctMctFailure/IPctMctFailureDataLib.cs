using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibraries.PctMctFailure
{
    public interface IPctMctFailureDataLib
    {
        List<PctMctFailureException> GetFailedPctMctResults(int startYearQuarter, int endYearQuarter, bool includeCurrentResult);
    }
}