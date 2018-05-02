using System;
using System.Collections.Generic;
using System.Linq;
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

        public static void AddSaveActions(this OpDataPacket<OpDataElementType> packet, OpDataPacket<OpDataElementType> fullPacket = null, List<int> dealIds = null)
        {
            if (packet.Data.Count <= 0) return;
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 10)); // Set action - save it.
            if (dealIds == null || dealIds.Any()) packet.AddSyncActions(fullPacket, dealIds);
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

        public static void AddSyncActions(this OpDataPacket<OpDataElementType> packet, OpDataPacket<OpDataElementType> fullPacket, List<int> dealIds)
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
                .Where(d => d.AtrbCdIs(AttributeCodes.BID_STATUS) && d.AtrbValue.ToString() == "Won" && d.HasValueChanged && (!dealIds.Any() || dealIds.Contains(d.DcID)))
                .Select(d => d.DcID).ToList();

            majorDealIds.AddRange(wonTenderIds);

            // Gather items that are minor field changes, including deal being cancelled.
            List<int> minorDealIds = testPacket.AllDataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && ((d.AtrbValue.ToString() == WorkFlowStages.Active && !d.HasValueChanged) || (d.AtrbValue.ToString() == WorkFlowStages.Cancelled && d.HasValueChanged)) && !wonTenderIds.Contains(d.DcID) && (!dealIds.Any() || dealIds.Contains(d.DcID)))
                .Select(d => d.DcID).ToList();

            if (majorDealIds.Any()) // 
            {
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SYNC_DEALS_MAJOR, majorDealIds, 80)); // Set action - save it.
            }

            if (minorDealIds.Any() && packet.Data.Any()) // Tack on Minor Sync calls for any minor changes that happened and there was no stage change to active (was already in active)
            {
                List<int> packetIds = packet.Data.Select(p => p.Value.DcID).ToList();
                minorDealIds = minorDealIds.Where(d => packetIds.Contains(d)).ToList();
                if (minorDealIds.Any())
                {
                    packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SYNC_DEALS_MINOR, minorDealIds, 90)); // Set action - save it.
                }
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
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_DELETE, finalDeleteIds, 40));
            }
        }

        public static void AddAuditActions(this OpDataPacket<OpDataElementType> packet, List<int> ids)
        {
            if (!ids.Any()) return;
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.APRV_AUDIT, ids, 75));
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
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.DEAL_ROLLBACK_TO_ACTIVE, finalRollbackIds, 99));
            }
        }

        public static void AddGoingActiveActions(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            if (!dealIds.Any()) return;

            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.GEN_TRACKER, dealIds, 60));
            foreach (OpDataCollector dc in packet.AllDataCollectors.Where(d => dealIds.Contains(d.DcID)))
            {
                dc.AddTimelineComment("Tracker number(s) generated");
            }
        }

        public static void AddQuoteLetterActions(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            if (!dealIds.Any()) return;

            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.GENERATE_QUOTE, dealIds, 90));
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



    }
}
