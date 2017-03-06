using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingStrategiesLib : IPricingStrategiesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public PricingStrategiesLib(IOpDataCollectorLib dataCollectorLib)
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
                    OpDataElementType.PricingTableRow,
                    OpDataElementType.WipDeals
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PricingStrategy
                };

            return OpDataElementType.PricingStrategy.GetByIDs(new List<int> {id}, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id)
        {
            return GetPricingStrategy(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
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
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PricingStrategy] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PricingTableRow] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId);
        }

        public MyDealsData SaveFullPricingStrategy(int custId, OpDataCollectorFlattenedDictList fullpricingStrategies)
        {
            return SavePricingStrategy(
                fullpricingStrategies.ContainsKey(OpDataElementType.PricingStrategy) ? fullpricingStrategies[OpDataElementType.PricingStrategy] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PricingTable) ? fullpricingStrategies[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.PricingTableRow) ? fullpricingStrategies[OpDataElementType.PricingTableRow] : new OpDataCollectorFlattenedList(),
                fullpricingStrategies.ContainsKey(OpDataElementType.WipDeals) ? fullpricingStrategies[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList(),
                custId);
        }


        public OpMsg DeletePricingStrategy(int id)
        {
            // TODO replace with Delete call
            return new OpMsg();
        }
    }
}