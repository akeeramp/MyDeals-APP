using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    class CostTestLib: ICostTestLib
    {
        private readonly ICostTestDataLib _costTestDataLib;

        public CostTestLib(ICostTestDataLib geoDataLib)
        {
            _costTestDataLib = geoDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public CostTestLib()
        {
            _costTestDataLib = new CostTestDataLib();
        }

        public List<CostTestDetailItem> GetCostTestDetails(int prcTblId)
        {
            return _costTestDataLib.GetCostTestDetails(prcTblId);
        }

//        List<CostTestDetailItem> GetCostTestDetails();
    }
}
