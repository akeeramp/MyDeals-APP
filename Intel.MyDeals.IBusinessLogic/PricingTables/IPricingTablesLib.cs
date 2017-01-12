using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingTablesLib
    {
        MyDealsData GetPricingTable(int id, bool inclusive = false);
        MyDealsData SavePricingTable(OpDataCollectorFlattenedList data);
        MyDealsData SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList wipDeals);
    }
}