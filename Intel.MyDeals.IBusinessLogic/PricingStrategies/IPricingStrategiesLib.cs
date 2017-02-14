using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList data, int custId);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList wipDeals, int custId);
    }
}