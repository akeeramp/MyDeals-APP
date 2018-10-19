using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public static class OpDataPacketExtensionMethods
    {
        public static bool IsValidForSave(this OpDataPacket<OpDataElementType> odp, AttributeCollection attributeCollection)
        {
            // If any element is not valid, it should fail.
            return odp != null && odp.AllDataElements.All(de => de.IsValid(attributeCollection));
        }

        public static void AddSaveActions(this OpDataPacket<OpDataElementType> packet, OpDataPacket<OpDataElementType> fullPacket = null, List<int> dealIds = null, AttributeCollection atrbMstr = null)
        {
            if (packet.Data.Count <= 0) return;
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 10)); // Set action - save it.
            if (dealIds == null || dealIds.Any()) packet.AddSyncActions(fullPacket, dealIds, atrbMstr);
        }

        public static void AddCopyActions(this OpDataPacket<OpDataElementType> packet, ContractToken contractToken) // OBJ_COPY
        {
            if (packet.Data.Count > 0) // Expected that you just created a contract to copy to, otherwise don't issue the action.
            {
                int packetId = packet.Data.Select(p => p.Value.DcID).FirstOrDefault();
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_COPY, new List<int> { contractToken.CopyFromId }, packetId, 150)); // Set action - copy it.
            }
        }

        public static void AddParentIdActions(this OpDataPacket<OpDataElementType> packet, Dictionary<int, int> data)
        {
            foreach (KeyValuePair<int, int> kvp in data)
            {
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.CHG_PARENT_KEY, kvp.Key, kvp.Value, 20));
            }
        }

        public static void AddSyncActions(this OpDataPacket<OpDataElementType> packet, OpDataPacket<OpDataElementType> fullPacket, List<int> dealIds, AttributeCollection atrbMstr = null)
        {
            // This must happen *after* the major/minor check.  Sync deals must happen only if a deal goes active or is already active.
            if (packet.PacketType != OpDataElementType.WIP_DEAL) return;
            if (dealIds == null) dealIds = new List<int>();

            OpDataPacket<OpDataElementType> testPacket = fullPacket ?? packet;
            List<int> majorDealIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && d.AtrbValue.ToString() == WorkFlowStages.Active && d.HasValueChanged && (!dealIds.Any() || dealIds.Contains(d.DcID)))
                .Select(d => d.DcID).ToList();

            // Also check Tender changes to Won
            List<int> wonTenderIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && d.AtrbValue.ToString() == WorkFlowStages.Won && d.HasValueChanged && (!dealIds.Any() || dealIds.Contains(d.DcID)))
                .Select(d => d.DcID).ToList();

            majorDealIds.AddRange(wonTenderIds);

            // US155169: Check for major change not triggering re-deal items to trigger tracker and sync major (Wrong way major changes)
            List<MyDealsAttribute> onChangeWrongWayItems = atrbMstr != null? atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_INCREASE" || a.MJR_MNR_CHG == "MAJOR_DECREASE").ToList(): new List<MyDealsAttribute>();
            List<MyDealsAttribute> onChangeQuoteOnlyItems = atrbMstr != null ? atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_QUOTEONLY").ToList() : new List<MyDealsAttribute>();

            List<int> onChangeWrongWayIds = testPacket.AllDataElements.Where(d => onChangeWrongWayItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).Select(d => d.DcID).ToList();
            List<int> majorFieldNoRedealIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && (d.AtrbValue.ToString() == WorkFlowStages.Active || d.AtrbValue.ToString() == WorkFlowStages.Won) && !d.HasValueChanged && onChangeWrongWayIds.Contains(d.DcID))
                .Select(d => d.DcID).ToList();

            // US201153: end customer should be editable even after deal is won (Make it a major change field with quote only updates)
            List<int> onChangeQuoteOnlyIds = testPacket.AllDataElements.Where(d => onChangeQuoteOnlyItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).Select(d => d.DcID).ToList();
            List<int> majorFieldQuoteOnlyIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && (d.AtrbValue.ToString() == WorkFlowStages.Active || d.AtrbValue.ToString() == WorkFlowStages.Won) && !d.HasValueChanged && onChangeQuoteOnlyIds.Contains(d.DcID))
                .Select(d => d.DcID).ToList();

            // Gather items that are minor field changes, including deal being cancelled.  Tacked on remove wrong direction IDs to this gathering.
            List<int> minorDealIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && (((d.AtrbValue.ToString() == WorkFlowStages.Active || d.AtrbValue.ToString() == WorkFlowStages.Won) && !d.HasValueChanged) || (d.AtrbValue.ToString() == WorkFlowStages.Cancelled && d.HasValueChanged)) && !wonTenderIds.Contains(d.DcID) && (!dealIds.Any() || dealIds.Contains(d.DcID)) && !majorFieldNoRedealIds.Contains(d.DcID))
                .Select(d => d.DcID).ToList();

            if (majorDealIds.Any()) 
            {
                packet.AttachAction(DealSaveActionCodes.SYNC_DEALS_MAJOR, 80, majorDealIds); // Set action - save it.
            }

            if (majorFieldNoRedealIds.Any()) // Add all actions as if this were crossing the pending/approved line, was a fast tracked re-deal.
            {
                packet.AttachAction(DealSaveActionCodes.SYNC_DEALS_MAJOR, 80, majorFieldNoRedealIds); // Set actions - save them.
                packet.AddGoingActiveActions(majorFieldNoRedealIds);
                packet.AddQuoteLetterActions(majorFieldNoRedealIds);
                //packet.AddAuditActions(majorFieldNoRedealIds); // Pulled out since Doug doesn't think that we nee to re-trigger cost testing.
            }

            if (majorFieldQuoteOnlyIds.Any())
            {
                //packet.AttachAction(DealSaveActionCodes.SYNC_DEALS_MAJOR, 80, majorFieldQuoteOnlyIds); // Set actions - save them.
                packet.AddQuoteLetterActions(majorFieldQuoteOnlyIds);
            }

            if (minorDealIds.Any() && packet.Data.Any()) // Tack on Minor Sync calls for any minor changes that happened and there was no stage change to active (was already in active)
            {
                List<int> packetIds = packet.Data.Select(p => p.Value.DcID).ToList();
                minorDealIds = minorDealIds.Where(d => packetIds.Contains(d)).ToList();
                if (minorDealIds.Any())
                {
                    packet.AttachAction(DealSaveActionCodes.SYNC_DEALS_MINOR, 90, minorDealIds); // Set action - save it.
                }
            }

        }

        public static void AttachAction(this OpDataPacket<OpDataElementType> packet, string action, int sort, List<int> targetIds = null)
        {
            // This ensures that all actions appear only once per packet and any duplicate values are removed to save on DB.  Generalized actions add code.
            // Only implemented the (string, list<int>, int) version for now.
            OpDataAction opDataAction = packet.Actions.FirstOrDefault(a => a.Action == action);
            List<int> newTargetIds = new List<int>();
            if (opDataAction != null) // This action is already there, append to it
            {
                newTargetIds.AddRange(opDataAction.TargetDcIDs.Distinct());
                newTargetIds.AddRange(targetIds.Distinct());
                opDataAction.TargetDcIDs = newTargetIds.Distinct().ToList(); // Force distinct values only
            }
            else // new action, add it
            {
                newTargetIds.AddRange(targetIds.Distinct()); // Force distinct values only
                packet.Actions.Add(new MyDealsDataAction(action, newTargetIds, sort));
            }
        }

        public static void AddDeleteActions(this OpDataPacket<OpDataElementType> packet, List<int> delIds)
        {
            if (!delIds.Any()) return;

            // Ensure that the list of deal IDs is actually correct before adding it on
            List<int> finalDeleteIds = new List<int>();
            foreach (int delId in delIds)
            {
                if (delId > 0) finalDeleteIds.Add(delId);
            }

            if (finalDeleteIds.Any())
            {
                packet.AttachAction(DealSaveActionCodes.OBJ_DELETE, 40, finalDeleteIds);
            }
        }

        public static void AddAuditActions(this OpDataPacket<OpDataElementType> packet, List<int> ids)
        {
            if (!ids.Any()) return;
            packet.AttachAction(DealSaveActionCodes.APRV_AUDIT, 75, ids);
        }

        public static void AddRollbackActions(this OpDataPacket<OpDataElementType> packet, List<int> rollbackIds)
        {
            if (!rollbackIds.Any()) return;

            // Ensure that the list of deal IDs is actually correct before adding it on
            List<int> finalRollbackIds = new List<int>();
            foreach (int rollbackId in rollbackIds)
            {
                if (rollbackId > 0) finalRollbackIds.Add(rollbackId);
            }

            if (finalRollbackIds.Any())
            {
                packet.AttachAction(DealSaveActionCodes.DEAL_ROLLBACK_TO_ACTIVE, 99, finalRollbackIds);
            }
        }

        public static void AddGoingActiveActions(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            if (!dealIds.Any()) return;

            packet.AttachAction(DealSaveActionCodes.GEN_TRACKER, 60, dealIds);
            foreach (OpDataCollector dc in packet.AllDataCollectors.Where(d => dealIds.Contains(d.DcID)))
            {
                IOpDataElement de = dc.GetDataElement(AttributeCodes.WF_STG_CD);
                if (de != null && de.State == OpDataElementState.Modified)
                {
                    dc.AddTimelineComment($"Deal state changed from {de.OrigAtrbValue} to {de.AtrbValue}");
                }
                dc.AddTimelineComment("Tracker number(s) generated");
            }

            if (packet.PacketType == OpDataElementType.WIP_DEAL) packet.ResetRedealFlagsOnActive(dealIds);
        }

        public static void ResetRedealFlagsOnActive(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            foreach (IOpDataCollector dc in packet.AllDataCollectors.Where(c => dealIds.Contains(c.DcID)))
            {
                IOpDataElement deReDeal = dc.GetDataElement(AttributeCodes.IN_REDEAL);
                if (deReDeal != null)
                {
                    deReDeal.AtrbValue = 0;
                }
            }
        }

        public static void AddQuoteLetterActions(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            if (!dealIds.Any()) return;

            packet.AttachAction(DealSaveActionCodes.GENERATE_QUOTE, 100, dealIds);
            foreach (OpDataCollector dc in packet.AllDataCollectors.Where(d => dealIds.Contains(d.DcID)))
            {
                dc.AddTimelineComment("Quote letter generated");
            }
        }

        public static void AddDeleteActions(this OpDataPacket<OpDataElementType> packet, OpDataCollectorFlattenedList data)
        {
            foreach (OpDataCollectorFlattenedItem item in data)
            {
                if (!item.ContainsKey("_actions")) continue;

                OpDataCollectorFlattenedItem fItem;
                try
                {
                    fItem = (OpDataCollectorFlattenedItem)item["_actions"];
                }
                catch (Exception)
                {
                    fItem = JsonConvert.DeserializeObject<OpDataCollectorFlattenedItem>(item["_actions"].ToString());
                }

                if (!fItem.ContainsKey("_deleteTargetIds")) continue;

                List<int> list = (List<int>)fItem["_deleteTargetIds"];
                AddDeleteActions(packet, list);
            }
        }

        public static void AddApprovalActions(this OpDataPacket<OpDataElementType> packet, OpDataCollectorFlattenedList data)
        {
            foreach (OpDataCollectorFlattenedItem item in data)
            {
                if (!item.ContainsKey("_actions")) continue;

                OpDataCollectorFlattenedItem fItem;
                try
                {
                    fItem = (OpDataCollectorFlattenedItem)item["_actions"];
                }
                catch (Exception)
                {
                    fItem = JsonConvert.DeserializeObject<OpDataCollectorFlattenedItem>(item["_actions"].ToString());
                }

                if (!fItem.ContainsKey("_deleteTargetIds")) continue;

                List<int> list = (List<int>)fItem["_deleteTargetIds"];
                AddDeleteActions(packet, list);
            }
        }


        public static bool RollupValidationMessages(this MyDealsData myDealsData, OpDataCollector dc, List<OpDataElementType> ignoreTypes, ref bool dataHasValidationErrors)
        {
            bool dcHasErrors = false;
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);

            foreach (IOpDataElement de in dc.GetDataElementsWithValidationIssues())
            {
                dcHasErrors = true;
                if (!ignoreTypes.Contains(opDataElementType))
                {
                    dataHasValidationErrors = true;
                }

                dc.Message.Messages.Add(new OpMsg
                {
                    DebugMessage = OpMsg.MessageType.Warning.ToString(),
                    KeyIdentifier = de.DcID,
                    Message = de.ValidationMessage,
                    MsgType = OpMsg.MessageType.Warning
                });

                myDealsData[opDataElementType].Messages.Messages.Add(new OpMsg
                {
                    DebugMessage = OpMsg.MessageType.Warning.ToString(),
                    KeyIdentifier = de.DcID,
                    Message = $"{dc.DcType} ({dc.DcID}) : {de.ValidationMessage}",
                    MsgType = OpMsg.MessageType.Warning
                });
            }
            return dcHasErrors;
        }

    }
}
