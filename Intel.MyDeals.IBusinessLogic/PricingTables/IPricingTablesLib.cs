using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IPricingTablesLib
    {
        MyDealsData GetPricingTable(int id, bool inclusive = false);
        OpDataCollectorFlattenedDictList GetFullPricingTable(int id);

        OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id);
        OpDataCollectorFlattenedDictList GetWipDealsByPtr(int id);
        CostTestDetail GetPctDetails(int id);
        PctOverrideReason SetPctOverrideReason(PctOverrideReason data);

        OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList data, ContractToken contractToken);
        OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken);
        OpDataCollectorFlattenedDictList SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, ContractToken contractToken);
        OpMsg DeletePricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables);
        OpMsg RollBackPricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables);
        OpMsgQueue CancelPricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables);
        OpMsg DeletePricingTableRowById(ContractToken contractToken, int ptrId);
        OpMsg DeletePricingTableRow(ContractToken contractToken, OpDataCollectorFlattenedList pricingTableRows);
        OpMsgQueue ActionWipDeals(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actns);

        OpMsgQueue UnGroupPricingTableRowById(ContractToken contractToken, int ptrId);

        List<Overlapping> GetOverlappingDeals(int PRICING_TABLES_ID);

        List<Overlapping> UpdateOverlappingDeals(int PRICING_TABLES_ID, string YCS2_OVERLAP_OVERRIDE);

    }
}