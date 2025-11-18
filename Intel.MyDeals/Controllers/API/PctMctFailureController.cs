using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic.PctMctFailure;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PctMctFailure")]
    public class PctMctFailureController : BaseApiController
    {
        private readonly IPctMctFailureLib _pctMctFailureLib;

        public PctMctFailureController(IPctMctFailureLib pctMctFailureLib)
        {
            _pctMctFailureLib = pctMctFailureLib;
        }

        [Route("GetPctMctFailedData")]
        [HttpGet]
        public List<PctMctFailureException> GetPctMctFailedData(int startYearQuarter, int endYearQuarter)
        {
            return SafeExecutor(() => _pctMctFailureLib.GetFailedPctMctResults(startYearQuarter, endYearQuarter),
                $"Unable to Get PCT/MCT Failed Data");
        }
    }
}