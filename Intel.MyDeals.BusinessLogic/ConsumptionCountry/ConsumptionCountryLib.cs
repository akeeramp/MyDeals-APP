using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class ConsumptionCountryLib : IConsumptionCountryLib
    {
        private readonly IConsumptionCountryDataLib _consumptionCountryDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public ConsumptionCountryLib()
        {
            _consumptionCountryDataLib = new ConsumptionCountryDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();

        }

        public ConsumptionCountryLib(IConsumptionCountryDataLib consumptionCountryDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _consumptionCountryDataLib = consumptionCountryDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        public List<ConsumptionCountry> GetConsumptionCountry()
        {
            return _consumptionCountryDataLib.GetConsumptionCountry();

        }


        public ConsumptionCountry ManageConsumptionCountry(ConsumptionCountry CompCtry, CrudModes type)
        {
            return _consumptionCountryDataLib.ManageConsumptionCountry(CompCtry, type);
        }


    }
}
