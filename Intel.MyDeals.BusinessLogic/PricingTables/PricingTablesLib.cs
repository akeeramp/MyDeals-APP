using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingTablesLib : IPricingTablesLib
    {
        private readonly IOpDataCollectorLib _dataCollectorLib;

        public PricingTablesLib(IOpDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        public MyDealsData GetPricingTable(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.PricingTable,
                    OpDataElementType.PricingTableRow,
                    OpDataElementType.WipDeals
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PricingTable,
                    OpDataElementType.PricingTableRow
                };

            return OpDataElementType.PricingTable.GetByIDs(new List<int> {id}, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id)
        {
            return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }


        public MyDealsData SavePricingTable(OpDataCollectorFlattenedList data, int custId)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PricingTable] = data
            }, custId);
        }

        public MyDealsData SavePricingTable(
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PricingTableRow] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId);
        }

        public MyDealsData SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, int custId)
        {
            return SavePricingTable(
                fullpricingTables.ContainsKey(OpDataElementType.PricingTable) ? fullpricingTables[OpDataElementType.PricingTable] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.PricingTableRow) ? fullpricingTables[OpDataElementType.PricingTableRow] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.WipDeals) ? fullpricingTables[OpDataElementType.WipDeals] : new OpDataCollectorFlattenedList(),
                custId);
        }

        public OpMsg DeletePricingTable(int id)
        {
            // TODO replace with Delete call
            return new OpMsg();
        }

        public OpMsg DeletePricingTableRow(int id)
        {
            // TODO replace with Delete call
            return new OpMsg();
        }

    }

}