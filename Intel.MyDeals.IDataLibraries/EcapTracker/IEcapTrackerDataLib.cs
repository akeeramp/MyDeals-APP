using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IEcapTrackerDataLib
	{
		IEnumerable<string> GetEcapTrackerList(EcapTrackerFilterData filterData);

		IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<string> trackerNumbers, int custId);
	}
}
