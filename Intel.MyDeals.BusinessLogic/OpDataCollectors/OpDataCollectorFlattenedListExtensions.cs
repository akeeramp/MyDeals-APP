using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataCollectorFlattenedListExtensions
    {
        public static OpDataCollectorFlattenedList TranslateToWip(this OpDataCollectorFlattenedList opFlatList)
        {
            OpDataCollectorFlattenedList retFlatList = new OpDataCollectorFlattenedList();
            foreach (OpDataCollectorFlattenedItem item in opFlatList)
            {
                retFlatList.AddRange(item.TranslateToWip());
            }
            return retFlatList;
        }
        
        public static OpDataCollectorFlattenedList TranslateToPrcTbl(this OpDataCollectorFlattenedList opFlatList)
        {
            OpDataCollectorFlattenedList retFlatList = new OpDataCollectorFlattenedList();


            //// need to look for DC_PARENT_ID and see if they are duplicates that need to be merged
            //List<string> parentIds = opFlatList.Select(d => d[AttributeCodes.DC_PARENT_ID].ToString()).Distinct().ToList();
            //foreach (string parentId in parentIds)
            //{

            //    List<OpDataCollectorFlattenedItem> items = opFlatList.Where(d => d[AttributeCodes.DC_PARENT_ID].ToString() == parentId).ToList();
            //    if (items.Count == 1)
            //    {
            //        retFlatList.AddRange(items);
            //    }
            //    else
            //    {
            //        OpDataElementType opType = OpDataElementTypeConverter.FromString(items.First()[AttributeCodes.dc_type]);
            //        OpDataElementSetType opSetType = OpDataElementSetTypeConverter.FromString(items.First()[AttributeCodes.OBJ_SET_TYPE_CD]);

            //        // merge items based on product and geo
            //        string geo = string.Join(",", items.Select(d => d[AttributeCodes.GEO_COMBINED]));
            //        string prodsSys = "";
            //        string prodsUsr = "";

            //        OpDataElementTypeMapping elMapping = opSetType.OpDataElementTypeParentMapping(opType);
            //        switch (elMapping.TranslationType)
            //        {
            //            case OpTranslationType.OneDealPerProduct:
            //                int i = 0;
            //                //prodsSys = string.Join(",", items.Select(d => d[AttributeCodes.PTR_SYS_PRD]));
            //                //prodsUsr = string.Join(",", items.Select(d => d[AttributeCodes.PTR_USER_PRD]));
            //                break;

            //            case OpTranslationType.OneDealPerRow:
            //                prodsSys = items.First()[AttributeCodes.PTR_SYS_PRD].ToString();
            //                prodsUsr = items.First()[AttributeCodes.PTR_USER_PRD].ToString();
            //                break;
            //        }

            //    }
            //}

            //retFlatList.AddRange(opFlatList.Select(item => item.TranslateToPrcTbl()));

            retFlatList.AddRange(opFlatList.Select(item => item.TranslateToPrcTbl()));


            return retFlatList;
        }


        public static OpMsg DeleteByIds(this OpDataCollectorFlattenedList opFlatList, OpDataElementType opDataElementType, ContractToken contractToken, IOpDataCollectorLib dataCollectorLib)
        {
            List<int> deleteIds = new List<int>();
            List<int> deletedIds = new List<int>();

            foreach (OpDataCollectorFlattenedItem item in opFlatList)
            {
                var ids = new List<int> { int.Parse(item[AttributeCodes.DC_ID].ToString()) };
                item["_actions"] = new OpDataCollectorFlattenedItem
                {
                    ["_deleteTargetIds"] = ids
                };
                deleteIds.AddRange(ids);
            }

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_ST] = opDataElementType == OpDataElementType.PRC_ST ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.PRC_TBL] = opDataElementType == OpDataElementType.PRC_TBL ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.PRC_TBL_ROW] = opDataElementType == OpDataElementType.PRC_TBL_ROW ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.WIP_DEAL] = opDataElementType == OpDataElementType.WIP_DEAL ? opFlatList : new OpDataCollectorFlattenedList()
            };

            OpDataCollectorFlattenedDictList opFlatDictList = dataCollectorLib
                .SavePackets(data, contractToken, new List<int>(), false, "")
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);

            foreach (OpDataCollectorFlattenedItem item in opFlatDictList[opDataElementType])
            {
                foreach (OpDataAction opDataAction in (List<OpDataAction>)item["_actions"])
                {
                    int id = opDataAction.DcID ?? 0;
                    if (opDataAction.Action != "OBJ_DELETED" || !deleteIds.Contains(id)) continue;

                    deleteIds.Remove(id);
                    deletedIds.Add(id);
                }
            }

            // TODO replace with Delete call
            return deleteIds.Any()
                ? new OpMsg(OpMsg.MessageType.Warning, "Unable to delete Ids {0}.", string.Join(",", deleteIds))
                : new OpMsg(OpMsg.MessageType.Info, "Deleted Ids {0}.", string.Join(",", deletedIds));

        }
    }
}
