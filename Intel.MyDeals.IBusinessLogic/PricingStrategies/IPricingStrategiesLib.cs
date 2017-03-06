using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList data, int custId);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);
        MyDealsData SaveFullPricingStrategy(int custId, OpDataCollectorFlattenedDictList fullpricingStrategies);
        OpMsg DeletePricingStrategy(int id);
        OpDataCollectorFlattenedDictList GetFullPricingStrategy(int id);
    }
}