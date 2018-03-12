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

        [HttpGet]
		[Route("GetDealDataViaTrackerNumber/{trackerNumber}/{custId}")]
		public EcapTrackerData GetDealDataViaTrackerNumber(string trackerNumber, int custId)
		{
			List<string> numbers = new List<string>();
			numbers.Add(trackerNumber);
			IEnumerable<EcapTrackerData> result = SafeExecutor(() => _ecapTrackerLib.GetDealDetailsBasedOnTrackerNumbers(numbers, custId)
				, $"Unable to get ECAP deal data from tracker number"
			);
			
			return (result != null) ? result.FirstOrDefault() : null;
		}
	}
}
