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
            foreach (OpDataCollectorFlattenedItem item in opFlatList)
            {
                retFlatList.AddRange(item.TranslateToPrcTbl());
            }
            return retFlatList;
        }


        public static OpMsg DeleteByIds(this OpDataCollectorFlattenedList opFlatList, OpDataElementType opDataElementType, int custId, IOpDataCollectorLib dataCollectorLib)
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
                .SavePackets(data, custId, false, false, "")
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
