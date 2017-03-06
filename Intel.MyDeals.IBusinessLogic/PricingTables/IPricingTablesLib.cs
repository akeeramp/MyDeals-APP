using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingTablesLib
    {
        MyDealsData GetPricingTable(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList GetFullPricingTable(int id);
        OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id);
        MyDealsData SavePricingTable(OpDataCollectorFlattenedList data, int custId);
        MyDealsData SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);
        MyDealsData SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, int custId);
        OpMsg DeletePricingTable(int id);
    }
}