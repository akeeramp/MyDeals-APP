using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using System;

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
        
        public static OpDataCollectorFlattenedList TranslateToPrcTbl(this OpDataCollectorFlattenedList opFlatList, OpDataCollectorFlattenedItem pricingTable)
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

            retFlatList.AddRange(opFlatList.Select(item => item.TranslateToPrcTbl(pricingTable)));


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
                [OpDataElementType.CNTRCT] = opDataElementType == OpDataElementType.CNTRCT ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.PRC_ST] = opDataElementType == OpDataElementType.PRC_ST ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.PRC_TBL] = opDataElementType == OpDataElementType.PRC_TBL ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.PRC_TBL_ROW] = opDataElementType == OpDataElementType.PRC_TBL_ROW ? opFlatList : new OpDataCollectorFlattenedList(),
                [OpDataElementType.WIP_DEAL] = opDataElementType == OpDataElementType.WIP_DEAL ? opFlatList : new OpDataCollectorFlattenedList()
            };

            OpDataCollectorFlattenedDictList opFlatDictList = dataCollectorLib
                .SavePackets(data, new SavePacket(contractToken))
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);

            if (opFlatDictList.ContainsKey(opDataElementType))
            {
                foreach (OpDataCollectorFlattenedItem item in opFlatDictList[opDataElementType])
                {
                    if (item.ContainsKey("_actions"))
                    {
                        try
                        {
                            foreach (OpDataAction opDataAction in (List<OpDataAction>)item["_actions"])
                            {
                                int id = opDataAction.DcID ?? 0;
                                if (opDataAction.Action != "OBJ_DELETED" || !deleteIds.Contains(id)) continue;

                                deleteIds.Remove(id);
                                deletedIds.Add(id);
                            }
                        }
                        catch (Exception)
                        {
                            // _actions are not actually valid delete events... we can ignore these
                        }
                    }
                }
            }

            return deleteIds.Any()
                ? new OpMsg(OpMsg.MessageType.Warning, "Unable to delete Ids {0}.", string.Join(",", deleteIds))
                : new OpMsg(OpMsg.MessageType.Info, "Deleted Ids {0}.", string.Join(",", deletedIds));

        }

        public static OpMsg RollbackOperations(this OpDataElementType opDataElementType, int dcId, ContractToken contractToken, IOpDataCollectorLib dataCollectorLib)
        {
            List<int> deleteIds = new List<int>();
            List<int> deletedIds = new List<int>();
            List<int> rollbackIds = new List<int>();
            List<int> rolledbackIds = new List<int>();

            MyDealsData mydealsData = opDataElementType.GetByIDs(
                new List<int> { dcId }, 
                new List<OpDataElementType> { OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL }, 
                new List<int> { Attributes.WF_STG_CD.ATRB_SID,  Attributes.HAS_TRACKER.ATRB_SID });

            if (opDataElementType == OpDataElementType.PRC_ST) // set the strategy stage back to approved
            {
                mydealsData[OpDataElementType.PRC_ST].AllDataCollectors.FirstOrDefault().SetAtrb(AttributeCodes.WF_STG_CD, WorkFlowStages.Approved);

                mydealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
                mydealsData[OpDataElementType.PRC_ST].GroupID = -101; // Whatever the real ID of this object is
                mydealsData[OpDataElementType.PRC_ST].AddSaveActions();
            }

            // For each WIP deal, if it has a tracker, add it to rollback list, if it is in play, add parent PTR to delete
            rollbackIds = mydealsData[OpDataElementType.WIP_DEAL].AllDataCollectors
                .Where(d => d.GetDataElementValue(AttributeCodes.HAS_TRACKER) == "1" 
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Active 
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Hold 
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Cancelled).Select(d => d.DcID).ToList();

            // Send up PTR parents for delete object calls - remove those lines that have never gone active before.
            deleteIds = mydealsData[OpDataElementType.WIP_DEAL].AllDataCollectors
                .Where(d => d.GetDataElementValue(AttributeCodes.HAS_TRACKER) != "1"
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Active
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Hold
                    && d.GetDataElementValue(AttributeCodes.WF_STG_CD) != WorkFlowStages.Cancelled).Select(d => d.DcParentID).ToList();

            mydealsData[OpDataElementType.PRC_TBL_ROW].BatchID = Guid.NewGuid();
            mydealsData[OpDataElementType.PRC_TBL_ROW].GroupID = -101; // Whatever the real ID of this object is
            mydealsData[OpDataElementType.PRC_TBL_ROW].AddDeleteActions(deleteIds);

            mydealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
            mydealsData[OpDataElementType.WIP_DEAL].GroupID = -101; // Whatever the real ID of this object is
            mydealsData[OpDataElementType.WIP_DEAL].AddRollbackActions(rollbackIds);

            mydealsData.EnsureBatchIDs();
            MyDealsData responseData = mydealsData.Save(contractToken);

            // Removed because DB no longer passes back response data for rollbacks.  When did this change??
            //if (!responseData.Keys.Any())
            //{
            //    return new OpMsg(OpMsg.MessageType.Info, "No Items needed to be Rolled Back.");
            //}

            // now assume that a rollback is successful so long as no thrown errors, but if not objects are passed back, give generic success message because users/testers don't care otherwise.
            // Strategy level is just a save, PT is not detectable save, the rest are combination of DELETED_OBJ IDs at PTR or rollback IDs at WIP.  
            // Assume success unless things crashed, then outer messages will trigger instead.
            string retMsg = "Rollback Successful";
            foreach (OpDataAction action in mydealsData[OpDataElementType.WIP_DEAL].Actions)
            {
                if (action.Action == "DEAL_ROLLBACK_TO_ACTIVE") // action.Value has the wrong info in it, use Action instead
                {
                    rolledbackIds.AddRange(action.TargetDcIDs);
                }
            }
            if (responseData.ContainsKey(OpDataElementType.PRC_TBL_ROW))
            {
                foreach (OpDataAction action in responseData[OpDataElementType.PRC_TBL_ROW].Actions)
                {
                    if (action.Action == "OBJ_DELETED")
                    {
                        deletedIds.Add(action.DcID ?? 0);
                    }
                }
            }
            if (opDataElementType == OpDataElementType.PRC_ST)
            {
                retMsg += Environment.NewLine + "Strategy rolled back to Approved state.";
            }
            else if (opDataElementType == OpDataElementType.PRC_TBL)
            {
                retMsg += Environment.NewLine + "Price Table was rolled back.  Strategy stays at current stage.";
            }
            if (deletedIds.Any())
            {
                retMsg += Environment.NewLine + "Deals deleted: " + string.Join(", ", deletedIds);
            }
            if (rollbackIds.Any())
            {
                retMsg += Environment.NewLine + "Deals returned to active: " + string.Join(", ", rolledbackIds);
            }

            return new OpMsg(OpMsg.MessageType.Info, retMsg);
        }

    }
}
