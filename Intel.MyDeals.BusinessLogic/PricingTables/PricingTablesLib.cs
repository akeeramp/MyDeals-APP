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
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW,
                    OpDataElementType.WIP_DEAL
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PRC_TBL,
                    OpDataElementType.PRC_TBL_ROW
                };

            return OpDataElementType.PRC_TBL.GetByIDs(new List<int> {id}, opDataElementTypes);
        }

        public OpDataCollectorFlattenedDictList GetFullNestedPricingTable(int id)
        {
            MyDealsData myDealsData = GetPricingTable(id, true);

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, 
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested);
            }

            return data;
            //return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }


        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList data, int custId)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_TBL] = data
            }, custId, new List<int>(), false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId, new List<int>(), false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, int custId)
        {
            return SavePricingTable(
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL) ? fullpricingTables[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullpricingTables[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.WIP_DEAL) ? fullpricingTables[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                custId);
        }

        public OpMsg DeletePricingTable(int custId, OpDataCollectorFlattenedList pricingTables)
        {
            return pricingTables.DeleteByIds(OpDataElementType.PRC_TBL, custId, _dataCollectorLib);
        }

        public OpMsg DeletePricingTableRow(int custId, OpDataCollectorFlattenedList pricingTableRows)
        {
            return pricingTableRows.DeleteByIds(OpDataElementType.PRC_TBL_ROW, custId, _dataCollectorLib);
        }

    }

}