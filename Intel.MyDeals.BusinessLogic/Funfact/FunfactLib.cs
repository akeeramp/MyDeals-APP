using Intel.MyDeals.DataLibrary;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class FunfactLib : IFunfactLib
    {
        private readonly IFunfactDataLib _funfactDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public FunfactLib(IFunfactDataLib funfactCollectorLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _funfactDataLib = funfactCollectorLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public FunfactLib()
        {
            _funfactDataLib = new FunfactDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        public List<Funfact> SetFunfacts(CrudModes mode, Funfact data)
        {
            return _funfactDataLib.SetFunfacts(mode, data);                       
        }

        public List<Funfact> GetFunfactItems()
        {
            return _dataCollectionsDataLib.GetFunfactList();         
        }     

        public List<Funfact> GetActiveFunfacts()
        {
            return _dataCollectionsDataLib.GetFunfactList().Where(ff => ff.ACTV_IND).ToList();
        }


    }
}
