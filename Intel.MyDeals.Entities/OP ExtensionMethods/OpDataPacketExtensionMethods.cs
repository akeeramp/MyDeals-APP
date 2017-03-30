using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

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
            packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.SAVE, 20)); // Set action - save it.
        }

        public static void AddDeleteActions(this OpDataPacket<OpDataElementType> packet, OpDataCollectorFlattenedList data)
        {
            foreach (OpDataCollectorFlattenedItem item in data)
            {
                if (!item.ContainsKey("_actions")) continue;
                OpDataCollectorFlattenedItem fItem = (OpDataCollectorFlattenedItem)item["_actions"];

                if (!fItem.ContainsKey("_deleteTargetIds")) continue;

                List<int> list = (List<int>)fItem["_deleteTargetIds"];
                packet.Actions.Add(new MyDealsDataAction(DealSaveActionCodes.OBJ_DELETE, list, 30));
            }
        }

    }
}
