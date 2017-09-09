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

        public static void AddSaveActions(this OpDataPacket<OpDataElementType> packet)
        {
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 10)); // Set action - save it.
            packet.AddSyncActions();
        }

        public static void AddParentIdActions(this OpDataPacket<OpDataElementType> packet, Dictionary<int, int> data)
        {
            foreach (KeyValuePair<int, int> kvp in data)
            {
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.CHG_PARENT_KEY, kvp.Key, kvp.Value, 20));
            }
        }

        public static void AddSyncActions(this OpDataPacket<OpDataElementType> packet)
        {
            // This must happen *after* the major/minor check.  Sync deals must happen only if a deal goes active or is already active.
            if (packet.PacketType != OpDataElementType.WIP_DEAL) return;

            List<int> dealIds = packet.AllDataElements.Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && d.AtrbHasValue(WorkFlowStages.Active)).Select(d => d.DcID).ToList();
            if (dealIds.Any())
            {
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SYNC_DEALS, dealIds, 80)); // Set action - save it.
            }
        }

        public static void AddDeleteActions(this OpDataPacket<OpDataElementType> packet, List<int> delIds)
        {
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_DELETE, delIds, 40));
        }

        public static void AddGoingActiveActions(this OpDataPacket<OpDataElementType> packet, List<int> dealIds)
        {
            if (!dealIds.Any()) return;

            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.GEN_TRACKER, dealIds, 60));
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SYNC_DEALS, dealIds, 80));
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SNAPSHOT, dealIds, 100));
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.GENERATE_QUOTE, dealIds, 90));
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
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_DELETE, list, 40));
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
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_DELETE, list, 40));
            }
        }



    }
}
