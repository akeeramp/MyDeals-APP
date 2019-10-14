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
        //private readonly IMyDealsManualDataLib _myDealsManualDataLib;

        //private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        //public ManualEngineLib(IMyDealsManualDataLib myDealsManualDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        //{
        //    _myDealsManualDataLib = myDealsManualDataLib;
        //    _dataCollectionsDataLib = dataCollectionsDataLib;
        //}

        ///// <summary>
        ///// TODO: This parameterless constructor is left as a reminder,
        ///// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        ///// </summary>
        //public MyDealsManualLib()
        //{
        //    _myDealsManualDataLib = new MyDealsManualDataLib();
        //    _dataCollectionsDataLib = new DataCollectionsDataLib();
        //}

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public ManualEngineLib()
        {
        }

        public List<ManualsNavItem> GetNavigationItems()
        {
            //if (!getCachedResult)
            //{
            //    _geoDataLib.GetGeoDimensions();
            //}
            //return _dataCollectionsDataLib.GetGeoData();

            List<ManualsNavItem> test = new List<ManualsNavItem>();
            test.Add(new ManualsNavItem() { Id = 1, Parent = 0, Order = 1, Title = "Dashboard", Link = "LI1" });
            test.Add(new ManualsNavItem() { Id = 2, Parent = 1, Order = 1, Title = "Filtering DashboardXX", Link = "LI-1A" });
            test.Add(new ManualsNavItem() { Id = 3, Parent = 1, Order = 2, Title = "Advanced SearchYY", Link = "LI-1B" });
            test.Add(new ManualsNavItem() { Id = 4, Parent = 0, Order = 1, Title = "Create Deals", Link = "LI2" });
            test.Add(new ManualsNavItem() { Id = 5, Parent = 4, Order = 1, Title = "Topic 2-a", Link = "LI-2A" });

            return test;
        }

    }
}
