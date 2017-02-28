using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic.DataCollectors
{
    public static class OpDataCollectorFlattenedDictListExtensions
    {
        public static MyDealsData ToMyDealsData(this OpDataCollectorFlattenedDictList data, 
            OpDataElementType searchByOpDEType, IEnumerable<int> searchByIds)
        {
            MyDealsData myDealsData = new DataCollectorDataLib()
                .GetByIDs(searchByOpDEType, searchByIds, new List<OpDataElementType> { searchByOpDEType })
                .Merge(data)
                .FillInHolesFromTemplate();

            return myDealsData;
        }

        public static MyDealsData ToMyDealsData(this OpDataCollectorFlattenedDictList data, 
            OpDataElementType searchByOpDEType, IEnumerable<int> searchByIds, List<OpDataElementType> returnOpDETypes)
        {
            MyDealsData myDealsData = new DataCollectorDataLib()
                .GetByIDs(searchByOpDEType, searchByIds, returnOpDETypes)
                .Merge(data)
                .FillInHolesFromTemplate();

            return myDealsData;
        }

        public static void PredictIdsAndLevels(this OpDataCollectorFlattenedDictList data, out List<int> ids, out List<OpDataElementType> opDataElementTypes, out OpDataElementType opTypeGrp)
        {
            ids = new List<int>();
            opDataElementTypes = new List<OpDataElementType>();
            opTypeGrp = OpDataElementType.Unknown;

            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                if (!data.ContainsKey(opDataElementType)) continue;

                if (!ids.Any())
                {
                    ids = data[opDataElementType].Where(items => items.ContainsKey("DC_ID"))
                        .Select(items => int.Parse(items["DC_ID"].ToString()))
                        .ToList();

                    opTypeGrp = opDataElementType;
                }

                opDataElementTypes.Add(opDataElementType);
            }
        }

        public static OpDataCollectorFlattenedList ToHierarchialList(this OpDataCollectorFlattenedDictList data, OpDataElementType opDataElementType)
        {
            if (data.Count == 0) return new OpDataCollectorFlattenedList();

            var decoderDict = new Dictionary<OpDataElementType, Dictionary<int, OpDataCollectorFlattenedList>>();
            foreach (OpDataElementType odt in Enum.GetValues(typeof(OpDataElementType)))
            {
                decoderDict[odt] = data.ToDictionaryByDcParentId(odt);
            }

            return data[opDataElementType].RecurFlattenedItems(opDataElementType, decoderDict);
        }

        private static OpDataCollectorFlattenedList RecurFlattenedItems(this OpDataCollectorFlattenedList data, OpDataElementType opDataElementType,
            Dictionary<OpDataElementType, Dictionary<int, OpDataCollectorFlattenedList>> decoderDict)
        {
            OpDataCollectorFlattenedList rtn = new OpDataCollectorFlattenedList();

            foreach (OpDataCollectorFlattenedItem item in data)
            {
                int key = int.Parse(item["DC_ID"].ToString());
                Dictionary<int, OpDataCollectorFlattenedList> dictItems = decoderDict[opDataElementType];
                if (dictItems.Count > 0 && dictItems.ContainsKey(key))
                {                    
                    item[opDataElementType.GetFirstChild().ToString()] = dictItems[key].RecurFlattenedItems(opDataElementType.GetFirstChild(), decoderDict);
                }
                rtn.Add(item);
            }

            return rtn;
        }

        private static Dictionary<int, OpDataCollectorFlattenedList> ToDictionaryByDcParentId(this OpDataCollectorFlattenedDictList data, OpDataElementType parentOpDataElementType)
        {
            Dictionary<int, OpDataCollectorFlattenedList> rtn = new Dictionary<int, OpDataCollectorFlattenedList>();
            OpDataElementType opDataElementType = parentOpDataElementType.GetFirstChild();
            if (opDataElementType == OpDataElementType.Unknown || !data.ContainsKey(opDataElementType)) return rtn;

            foreach (OpDataCollectorFlattenedItem opDataCollectorFlattenedItem in data[opDataElementType])
            {
                int key = int.Parse(opDataCollectorFlattenedItem["DC_PARENT_ID"].ToString());
                if (!rtn.ContainsKey(key)) rtn[key] = new OpDataCollectorFlattenedList();
                rtn[key].Add(opDataCollectorFlattenedItem);
            }
            return rtn;
        }

        //private static OpDataCollectorFlattenedList recur(this OpDataCollectorFlattenedDictList data, 
        //    OpDataElementType opDataElementType, 
        //    OpDataCollectorFlattenedList opDataCollectorFlattenedList,
        //    Dictionary<OpDataElementType, Dictionary<int, List<OpDataCollectorFlattenedItem>>> decoderDict)
        //{
        //    Dictionary<OpDataElementType, OpDataElementType> decoder =
        //        new Dictionary<OpDataElementType, OpDataElementType>
        //        {
        //            [OpDataElementType.Contract] = OpDataElementType.PricingStrategy,
        //            [OpDataElementType.PricingStrategy] = OpDataElementType.PricingTable,
        //            [OpDataElementType.PricingTable] = OpDataElementType.WipDeals
        //        };

        //    int key = int.Parse(opDataCollectorFlattenedItem["dc_parent_id"].ToString());

        //    return new OpDataCollectorFlattenedList();
        //}

    }
}