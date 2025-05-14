using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic.PricingTableException;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/PricingTableException")]
    public class PricingTableExceptionController : BaseApiController
    {
        private readonly IPricingTableExceptionLib _pricingTableExceptionLib;

        public PricingTableExceptionController(IPricingTableExceptionLib pricingTableExceptionLib)
        {
            _pricingTableExceptionLib = pricingTableExceptionLib;
        }

        [Route("GetPricingTables")]
        public List<PctException> GetPricingTables(int startYearQuarter, int endYearQuarter)
        {
            return SafeExecutor(() => _pricingTableExceptionLib.GetPctExceptions(startYearQuarter, endYearQuarter),
                $"Unable to Get Pricing Table Exceptions");
        }
    }
}