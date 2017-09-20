using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
	public class EcapTrackerLib : IEcapTrackerLib
	{
		private readonly IEcapTrackerDataLib _ecapTrackerDataLib;

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public EcapTrackerLib()
		{
			_ecapTrackerDataLib = new EcapTrackerDataLib();
		}

		public EcapTrackerLib(IEcapTrackerDataLib ecapTrackerDataLib)
		{            
			_ecapTrackerDataLib = ecapTrackerDataLib;
		}

		/// <summary>
		/// Get a list of possible ECAP Adjustment Tracker Numbers that match filterData parameter
		/// </summary>
		/// <returns>list of ECAP Adjustment Tracker Numbers</returns>
		public IEnumerable<string> GetEcapTrackerList(EcapTrackerFilterData filterData)
		{
			return _ecapTrackerDataLib.GetEcapTrackerList(filterData);
		}

		/// <summary>
		/// Get a list of existing deal details based on ECAP Adjustment Tracker Numbers
		/// </summary>
		/// <returns>list of EcapTrackerData</returns>
		public IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<int> trackerNumbers)
		{
			return _ecapTrackerDataLib.GetDealDetailsBasedOnTrackerNumbers(trackerNumbers);
		}

	}
}