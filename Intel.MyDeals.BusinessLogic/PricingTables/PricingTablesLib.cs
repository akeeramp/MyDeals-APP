using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.MyDeals.DataLibrary;

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
            MyDealsData myDealsData = GetPricingTable(id, true).AddParentPS(id).FillInHolesFromAtrbTemplate();

            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, 
                    opDataElementType == OpDataElementType.PRC_TBL_ROW ? ObjSetPivotMode.UniqueKey : ObjSetPivotMode.Nested);
            }

            var prntActions = data[OpDataElementType.PRC_ST][0]["_actions"];
            foreach (OpDataCollectorFlattenedItem item in data[OpDataElementType.WIP_DEAL])
            {
                item["_actionsPS"] = prntActions;
            }

            return data;
            //return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedList GetPctDetails(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType> { OpDataElementType.WIP_DEAL };

            // Not all of these attributes will be deal attributes.  The data will have to be merged into this collection
            List<int> atrbs = new List<int>
            {
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.NOTES.ATRB_SID,
                Attributes.TRKR_NBR.ATRB_SID,
                Attributes.TITLE.ATRB_SID,
                Attributes.AVG_NET_PRC.ATRB_SID,
                Attributes.MEETCOMP_TEST_FAIL_OVERRIDE.ATRB_SID,
                Attributes.MEETCOMP_TEST_FAIL_OVERRIDE_REASON.ATRB_SID,
                Attributes.LOWEST_NET_PRC.ATRB_SID,
                Attributes.AVG_RPU.ATRB_SID,
                Attributes.MAX_RPU.ATRB_SID,
                Attributes.PRD_COST.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE.ATRB_SID,
                Attributes.COST_TEST_FAIL_OVERRIDE_REASON.ATRB_SID,
                Attributes.RETAIL_CYCLE.ATRB_SID,
                Attributes.RETAIL_PULL.ATRB_SID,
                Attributes.ECAP_FLR.ATRB_SID
            };

            OpDataCollectorFlattenedDictList data = OpDataElementType.PRC_TBL.GetByIDs(new List<int> { id }, opDataElementTypes, atrbs)
                .ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Nested, false);

            return data[OpDataElementType.WIP_DEAL];
        }

        public OpDataCollectorFlattenedDictList GetFullPricingTable(int id)
        {
            return GetPricingTable(id, true).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public MyDealsData GetPricingTableRow(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_TBL_ROW
            };

            return OpDataElementType.PRC_TBL_ROW.GetByIDs(new List<int> { id }, opDataElementTypes);
        }
        public MyDealsData GetPricingTableRowAndWip(int id)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.PRC_TBL_ROW,
                OpDataElementType.WIP_DEAL
            };

            return OpDataElementType.PRC_TBL_ROW.GetByIDs(new List<int> { id }, opDataElementTypes);
        }


        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList data, ContractToken contractToken)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PRC_TBL] = data
            }, contractToken, new List<int>(), false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SavePricingTable(OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, ContractToken contractToken)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PRC_TBL] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PRC_TBL_ROW] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WIP_DEAL] = wipDeals;

            return _dataCollectorLib.SavePackets(data, contractToken, new List<int>(), false, "").ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);
        }

        public OpDataCollectorFlattenedDictList SaveFullPricingTable(OpDataCollectorFlattenedDictList fullpricingTables, ContractToken contractToken)
        {
            return SavePricingTable(
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL) ? fullpricingTables[OpDataElementType.PRC_TBL] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.PRC_TBL_ROW) ? fullpricingTables[OpDataElementType.PRC_TBL_ROW] : new OpDataCollectorFlattenedList(),
                fullpricingTables.ContainsKey(OpDataElementType.WIP_DEAL) ? fullpricingTables[OpDataElementType.WIP_DEAL] : new OpDataCollectorFlattenedList(),
                contractToken);
        }

        public OpMsg DeletePricingTable(ContractToken contractToken, OpDataCollectorFlattenedList pricingTables)
        {
            return pricingTables.DeleteByIds(OpDataElementType.PRC_TBL, contractToken, _dataCollectorLib);
        }

        public OpMsg DeletePricingTableRowById(ContractToken contractToken, int ptrId)
        {
            OpDataCollectorFlattenedDictList opDcDict = GetPricingTableRow(ptrId).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.UniqueKey);
            OpDataCollectorFlattenedList pricingTableRows = opDcDict[OpDataElementType.PRC_TBL_ROW];
            return pricingTableRows.DeleteByIds(OpDataElementType.PRC_TBL_ROW, contractToken, _dataCollectorLib);
        }

        public OpMsg DeletePricingTableRow(ContractToken contractToken, OpDataCollectorFlattenedList pricingTableRows)
        {
            return pricingTableRows.DeleteByIds(OpDataElementType.PRC_TBL_ROW, contractToken, _dataCollectorLib);
        }

        public OpMsgQueue UnGroupPricingTableRowById(ContractToken contractToken, int ptrId)
        {
            MyDealsData myDealsData = GetPricingTableRowAndWip(ptrId);
            return myDealsData.UpGroupPricingTableRow(contractToken, _dataCollectorLib);
        }

        public OpMsgQueue ActionWipDeals(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actns)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();
            List<int> dealsOffHold = new List<int>();

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID
            };

            Dictionary<int, string> id2actnMapping = new Dictionary<int, string>();
            Dictionary<int, string> id2stageMapping = new Dictionary<int, string>();
            List<int> ids = new List<int>();
            foreach (KeyValuePair<string, List<WfActnItem>> kvp in actns)
            {
                List<int> wipIds = kvp.Value.Select(t => t.DC_ID).ToList();
                ids.AddRange(wipIds);
                foreach (int i in wipIds)
                {
                    id2actnMapping[i] = kvp.Key;
                }
                foreach (WfActnItem wfActnItem in kvp.Value)
                {
                    id2stageMapping[wfActnItem.DC_ID] = wfActnItem.WF_STG_CD;
                }
            }


            MyDealsData myDealsData = OpDataElementType.WIP_DEAL.GetByIDs(ids, opDataElementTypes, atrbs);
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                string stageInDb = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                string stageIn = id2stageMapping[dc.DcID];
                string actn = id2actnMapping[dc.DcID];

                // concurency check
                if (stageIn != stageInDb)
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = "The stage was change by another source prior to this action.  Please refresh and try again.",
                        MsgType = OpMsg.MessageType.Warning,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                    continue;
                }

                // get next stage
                string targetStage = dc.GetNextStage(actn);

                if (string.IsNullOrEmpty(targetStage))
                {
                    opMsgQueue.Messages.Add(new OpMsg
                    {
                        Message = $"You do not have permission to {actn} the Wip Deal from the {stageIn} stage.",
                        MsgType = OpMsg.MessageType.Warning,
                        ExtraDetails = dc.DcType,
                        KeyIdentifiers = new[] { dc.DcID }
                    });
                    continue;
                }

                if (stageIn == WorkFlowStages.Hold && actn == "Approve")
                {
                    dealsOffHold.Add(dc.DcID);
                }

                dc.SetAtrb(AttributeCodes.WF_STG_CD, targetStage);
                opMsgQueue.Messages.Add(new OpMsg
                {
                    Message = $"Wip Deal moved from {stageIn} to {targetStage}.",
                    ShortMessage = targetStage,
                    MsgType = OpMsg.MessageType.Info,
                    ExtraDetails = dc.DcType,
                    KeyIdentifiers = new[] { dc.DcID }
                });

                // TODO add actions to stack like TRACKER NUMBER or WIP-TO_REAL or COST TEST, etc...
                // This should probably be a rule item
            }



            myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.WIP_DEAL].GroupID = -101; // Whatever the real ID of this object is

            // Back to normal operations, clear out the messages and all.
            myDealsData[OpDataElementType.WIP_DEAL].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            myDealsData[OpDataElementType.WIP_DEAL].Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions();


            if (dealsOffHold.Any())
            {
                bool needRedeal = false;
                MyDealsData myDealsPsData = OpDataElementType.WIP_DEAL.GetByIDs(dealsOffHold
                    , new List<OpDataElementType> { OpDataElementType.PRC_ST }
                    , new List<int> { Attributes.WF_STG_CD.ATRB_SID });
                myDealsData[OpDataElementType.PRC_ST] = myDealsPsData[OpDataElementType.PRC_ST];

                foreach (OpDataCollector dc in myDealsPsData[OpDataElementType.PRC_ST].AllDataCollectors)
                {
                    var psStage = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
                    var futureStage = dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), psStage, OpDataElementType.PRC_ST);
                    if (futureStage != null)
                    {
                        needRedeal = true;
                        dc.SetDataElementValue(AttributeCodes.WF_STG_CD, futureStage);
                    }                    
                }

                if (needRedeal)
                {
                    myDealsData[OpDataElementType.PRC_ST].BatchID = Guid.NewGuid();
                    myDealsData[OpDataElementType.PRC_ST].GroupID = -102; // Whatever the real ID of this object is

                    // Back to normal operations, clear out the messages and all.
                    myDealsData[OpDataElementType.PRC_ST].Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
                    myDealsData[OpDataElementType.PRC_ST].Messages.Messages.RemoveAll(r => true);

                    // Tack on the save action call now
                    myDealsData[OpDataElementType.PRC_ST].AddSaveActions();
                }
            }

            myDealsData.EnsureBatchIDs();
            myDealsData.Save(contractToken);

            return opMsgQueue;
        }

        public List<Overlapping> GetOverlappingDeals(int PRICING_TABLES_ID)
        {
            OpDataCollectorDataLib OD = new OpDataCollectorDataLib();
            return OD.GetOverlappingDeals(PRICING_TABLES_ID);
        }

        public List<Overlapping> UpdateOverlappingDeals(int PRICING_TABLES_ID, string YCS2_OVERLAP_OVERRIDE)
        {
            OpDataCollectorDataLib OD = new OpDataCollectorDataLib();
            return OD.UpdateOverlappingDeals(PRICING_TABLES_ID, YCS2_OVERLAP_OVERRIDE);
        }
    }

}