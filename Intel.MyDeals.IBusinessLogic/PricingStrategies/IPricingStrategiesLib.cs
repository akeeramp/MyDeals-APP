using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList data, int custId);
        OpDataCollectorFlattenedDictList SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);
        OpDataCollectorFlattenedDictList SaveFullPricingStrategy(int custId, OpDataCollectorFlattenedDictList fullpricingStrategies);
        OpMsg DeletePricingStrategy(int custId, OpDataCollectorFlattenedList pricingStrategies);
        OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id);
    }
}