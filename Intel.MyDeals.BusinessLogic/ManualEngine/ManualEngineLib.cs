using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class ManualEngineLib : IManualEngineLib
    {
        private readonly IMyDealsManualDataLib _manualEngineLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public ManualEngineLib(IMyDealsManualDataLib manualEngineCollectionsLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            //IMyDealsManualDataLib
            _manualEngineLib = manualEngineCollectionsLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public ManualEngineLib()
        {
            _manualEngineLib = new MyDealsManualDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public List<RefManualsNavItem> GetNavigationItems(string refType)
        {
            List<RefManualsNavItem> navData = _manualEngineLib.GetNavigationItems(refType);
            return navData;
        }

        public string GetManualPageData(string pageLink)
        {
            string retVal = _manualEngineLib.GetManualPageData(pageLink);
            return retVal;
        }

    }
}
