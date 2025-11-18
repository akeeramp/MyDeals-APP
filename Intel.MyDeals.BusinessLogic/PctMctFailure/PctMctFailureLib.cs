using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic.PctMctFailure;
using Intel.MyDeals.IDataLibraries.PctMctFailure;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic.PctMctFailure
{
    public class PctMctFailureLib : IPctMctFailureLib
    {
        private readonly IPctMctFailureDataLib _pctMctFailureDataLib;

        public PctMctFailureLib(IPctMctFailureDataLib pctMctFailureDataLib)
        {
            _pctMctFailureDataLib = pctMctFailureDataLib;
        }

        public List<PctMctFailureException> GetFailedPctMctResults(int startYearQuarter, int endYearQuarter)
        {
            return _pctMctFailureDataLib.GetFailedPctMctResults(startYearQuarter, endYearQuarter);
        }
    }
}