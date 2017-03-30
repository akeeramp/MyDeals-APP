using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingTablesLib
    {
        MyDealsData GetPricingTable(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList GetFullPricingTable(int id);
        OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id);
        OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList data, int custId);
        OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);
        OpDataCollectorFlattenedDictList SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, int custId);
        OpMsg DeletePricingTable(int custId, OpDataCollectorFlattenedList pricingTables);
        OpMsg DeletePricingTableRow(int custId, OpDataCollectorFlattenedList pricingTableRows);
    }
}