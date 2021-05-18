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
                    if (mydealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) && mydealsData[OpDataElementType.PRC_TBL_ROW].Data[dcId] != null
                        && !string.IsNullOrEmpty(mydealsData[OpDataElementType.PRC_TBL_ROW].Data[dcId].DcParentID.ToString()))
                    {
                        UpdatePassedValidationOnRollback(mydealsData[OpDataElementType.PRC_TBL_ROW].Data[dcId].DcParentID, contractToken);
                    }
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

        /// <summary>
        /// This method is to check if hybrid deals rollback action generates any validation error and to update 'Passed_validation' value accordingly
        /// </summary>
        /// <param name="PRC_TBL_ID"></param>
        /// <param name="contractToken"></param>
        private static void UpdatePassedValidationOnRollback(int PRC_TBL_ID, ContractToken contractToken)
        {
            List<int> dealIdlist = new List<int>() { PRC_TBL_ID };
            var isError = false;
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL,
                 OpDataElementType.PRC_TBL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.IS_HYBRID_PRC_STRAT.ATRB_SID,
                Attributes.OBJ_PATH_HASH.ATRB_SID,
                Attributes.REBATE_OA_MAX_AMT.ATRB_SID,
                Attributes.REBATE_OA_MAX_VOL.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.AR_SETTLEMENT_LVL.ATRB_SID
            };

            MyDealsData mydealsdata = OpDataElementType.PRC_TBL.GetByIDs(dealIdlist, opDataElementTypes, atrbs);

            //variable 'ptidList' contains hybrid pricing strategy Pricing Table Ids
            var ptidList = mydealsdata[OpDataElementType.PRC_TBL].AllDataCollectors
                   .Where(x => x.DataElements.GetAtrb(AttributeCodes.IS_HYBRID_PRC_STRAT) != null
                   && x.DataElements.GetAtrb(AttributeCodes.IS_HYBRID_PRC_STRAT).AtrbValue.ToString().Equals("1"))
                   .Select(x => new { x.DcID }).ToList();
            if (ptidList != null && ptidList.Count > 0)
            {
                foreach (var ptId in ptidList)
                {
                    //variable 'deals' contains deals of the corresponding Pricing table ID
                    var deals = mydealsdata[OpDataElementType.WIP_DEAL].AllDataCollectors.
                            Where(x => x.DataElementDict.Count > 1).ToList().
                            Where(x => x.DataElements.GetAtrb(AttributeCodes.OBJ_PATH_HASH).AtrbValue.ToString().
                            Contains(ptId.DcID.ToString())).ToList();

                    if (deals != null && deals.Count > 1)
                    {
                        var oaMaxVol = new List<string>();
                        var oaMaxAmt = new List<string>();

                        //'oaDealsList' variable contains deals list whatever having 'REBATE_OA_MAX_VOL' column and 'oaMaxVol' contains deals REBATE_OA_MAX_VOL column values
                        var oaDealsList = deals.Select(x => x.GetDataElement(AttributeCodes.REBATE_OA_MAX_VOL)).Where(x => x != null).ToList();
                        if (oaDealsList.Count() > 0)
                        {
                            oaMaxVol = oaDealsList.Select(d => d.AtrbValue.ToString()).ToList(); 
                        }
                        //'oaDealsList' variable contains deals list whatever having 'REBATE_OA_MAX_AMT' column and 'oaMaxAmt' contains deals REBATE_OA_MAX_AMT column values
                        oaDealsList = deals.Select(x => x.GetDataElement(AttributeCodes.REBATE_OA_MAX_AMT)).Where(x => x != null).ToList();
                        if (oaDealsList.Count() > 0)
                        {
                            oaMaxAmt = oaDealsList.Select(d => d.AtrbValue.ToString()).ToList();
                        }
                        //'settlementLvl' contains all the deals 'Settlement_Level' column values
                        var settlementLvl = deals.Where(d => d.DataElements.GetAtrb(AttributeCodes.AR_SETTLEMENT_LVL) != null
                            && d.DataElements.GetAtrb(AttributeCodes.AR_SETTLEMENT_LVL).AtrbValue.ToString() != string.Empty)
                               .Select(x => x.DataElements.GetAtrb(AttributeCodes.AR_SETTLEMENT_LVL).AtrbValue.ToString()).ToList();

                        //Condition to check either value of OverArching Max volume is not same for deals or OverArching Max Dollar value is not same for all deals
                        if (oaMaxAmt.Distinct().ToList().Count > 1 || oaMaxVol.Distinct().ToList().Count > 1)
                        {
                            isError = true;
                        }
                        //Condition to check whether all deals picked any one of the OverArching Max volume and OverArching Max Dollar column 
                        else if (oaMaxAmt != null && oaMaxAmt.Count > 0 && oaMaxAmt.Count < deals.Count
                            && oaMaxVol != null && oaMaxVol.Count > 0 && oaMaxVol.Count < deals.Count)
                        {
                            isError = true;
                        }
                        //Condition to check whether all deals having same Settlement Level value
                        else if (settlementLvl != null && settlementLvl.Distinct().ToList().Count > 1)
                        {
                            isError = true;
                        }
                    }
                }
            }
            foreach (OpDataCollector wip in mydealsdata[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                //condition to set passed validation as 'Dirty' if any of the OverArching Max Volume/OverArching Max Dollar/Settlement Level column conditions sets error flag
                if (isError)
                {
                    wip.DataElements.GetAtrb(AttributeCodes.PASSED_VALIDATION).AtrbValue = PassedValidation.Dirty.ToString();
                }
                //condition to set passed validation as 'Complete' if all of the OverArching Max Volumme/OverArching Max Dollar/Settlement Level column conditions failed to set error flag
                else
                {
                    wip.DataElements.GetAtrb(AttributeCodes.PASSED_VALIDATION).AtrbValue = PassedValidation.Complete.ToString();
                }
            }
            //Invoke the save method to save the updated 'PASSED_VALIDATION' column in the DB
            mydealsdata[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
            mydealsdata[OpDataElementType.WIP_DEAL].GroupID = -101;
            mydealsdata[OpDataElementType.WIP_DEAL].AddSaveActions();
            mydealsdata.EnsureBatchIDs();
            MyDealsData responseData = mydealsdata.Save(contractToken);
        }
    }
}
