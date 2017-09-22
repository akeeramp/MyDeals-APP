using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IEcapTrackerLib
	{
		IEnumerable<string> GetEcapTrackerList(EcapTrackerFilterData filterData);

		IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<string> trackerNumbers);

	}
}