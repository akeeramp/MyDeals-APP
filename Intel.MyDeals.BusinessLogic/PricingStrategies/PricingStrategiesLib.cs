using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingStrategiesLib : IPricingStrategiesLib
    {
        private readonly IDataCollectorLib _dataCollectorLib;

        public PricingStrategiesLib(IDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        public MyDealsData GetPricingStrategy(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.PricingStrategy,
                    OpDataElementType.PricingTable,
                    OpDataElementType.WipDeals
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PricingStrategy
                };

            return new DataCollectorDataLib()
                .GetByIDs(OpDataElementType.PricingStrategy, new List<int> { id }, opDataElementTypes)
                .FillInHolesFromTemplate();
        }

        public MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList data, int custId)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PricingStrategy] = data
            }, custId);
        }

        public MyDealsData SavePricingStrategy(
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList wipDeals,
            int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PricingStrategy] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId);
        }

    }
}