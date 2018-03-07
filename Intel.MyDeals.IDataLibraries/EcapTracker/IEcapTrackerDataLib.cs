using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IEcapTrackerDataLib
	{
        ////DEV_REBUILD_REMOVALS
        //IEnumerable<EcapTrackerResult> GetEcapTrackerList(EcapTrackerFilterData filterData);

        IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<string> trackerNumbers, int custId);
	}
}
