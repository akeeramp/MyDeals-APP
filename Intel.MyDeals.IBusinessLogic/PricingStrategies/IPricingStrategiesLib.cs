using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingStrategiesLib
    {
        MyDealsData GetPricingStrategy(int id, bool inclusive = false);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList data);
        MyDealsData SavePricingStrategy(OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList wipDeals);
    }
}