using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/EcapTracker")]
    public class EcapTrackerController : BaseApiController
	{
		private readonly IEcapTrackerLib _ecapTrackerLib;

		public EcapTrackerController(IEcapTrackerLib ecapTrackerLib)
		{
			_ecapTrackerLib = ecapTrackerLib;
		}

		[HttpPost]
		[Route("GetEcapTrackerList")]
		public IEnumerable<string> GetEcapTrackerList(EcapTrackerFilterData filterData)
		{
			var result = SafeExecutor(() => _ecapTrackerLib.GetEcapTrackerList(filterData)
				, $"Unable to get ECAP adjustment tracker list"
			);
			
			return result;
		}

		// TODO
		public IEnumerable<string> GetDealDataViaTrackerNumber(EcapTrackerFilterData filterData)
		{
			return null;
		}
	}
}
