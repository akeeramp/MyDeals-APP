using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public static class OpDataPacketExtensionMethods
    {
        public static bool IsValidForSave(this OpDataPacket<OpDataElementType> odp, AttributeCollection attributeCollection)
        {
            if (odp == null) { return false; }

            // If any element is not valid, it should fail.
            return odp.AllDataElements.All(de => de.IsValid(attributeCollection));
        }

        public static void Merge(this OpDataPacket<OpDataElementType> dataPacket, OpDataPacket<OpDataElementType> responseDataPacket, List<WorkFlowQueueItem> workFlowQueue)
        {
            OpLogPerf.Log("OpDataPacket.Merge -- Start");

            // Step 1 - Change all -Ids to +Ids in the original data set
            foreach (OpDataAction dataAction in responseDataPacket.Actions)
            {
                OpDataCollector dcData = dataPacket.AllDataCollectors.Where(d => d.DcID == dataAction.DcID).ToList().SingleOrDefault();
                if (dcData == null) continue;

                //if (dataAction.Value != "DEAL")
                int altId = dataAction.AltID ?? 0;
                int dcId = dataAction.DcID ?? 0;
                if (altId > 0 && dcId > 0) continue; // if both are positive, done to a rename...
                if (dataPacket.Data.ContainsKey(dcId)) dataPacket.RenameKey(dataPacket.Data, dcId, altId);

                int newDcId = dataAction.AltID ?? 0;
                dcData.DcID = newDcId;
                foreach (OpDataElement opEle in dcData.DataElements)
                {
                    opEle.DcID = newDcId;
                }

                // And the workflow queue update - if 
                if (dataPacket.PacketType == OpDataElementType.Secondary ||
                    dataPacket.PacketType == OpDataElementType.Deals)
                {
                    foreach (
                        WorkFlowQueueItem queueItem in
                            workFlowQueue.Where(queueItem => queueItem.DcsAction?.TargetDcIDs != null && queueItem.DcsAction.TargetDcIDs.Contains(dcId)))
                    {
                        queueItem.DcsAction.TargetDcIDs.Remove(dcId);
                        queueItem.DcsAction.TargetDcIDs.Add(altId);
                    }
                }
            }

            OpLogPerf.Log("OpDataPacket.Merge -- End Step 1");

            // Step 2 - Copy over returned actions and set as outbound actions for UI
            foreach (OpDataAction action in responseDataPacket.Actions)
            {
                action.ActionDirection = OpActionDirection.Outbound;
            }
            dataPacket.Actions.AddRange(responseDataPacket.Actions.ToArray());

            dataPacket.Messages.Write(responseDataPacket.Messages.Messages.ToArray());

            OpLogPerf.Log("OpDataPacket.Merge -- End Step 2");

            bool syncByGuid = dataPacket.PacketType == OpDataElementType.Tertiary;
            
            // Step 3 - Copy over returned data back into original dataset
            // BJ 12/3/14: Work the data by data collector vs by element, much faster (from > 50 minutes to 3 seconds for large workbooks)
            foreach (OpDataCollector odcResponse in responseDataPacket.AllDataCollectors)
            {
                // Get the existing packet that maps to the packet sent by the response, or create new if necessary.
                OpDataCollector odcPacket;

                if (!dataPacket.Data.TryGetValue(odcResponse.DcID, out odcPacket))
                {
                    odcPacket = new OpDataCollector
                    {
                        DcID = odcResponse.DcID,
                        DcAltID = odcResponse.DcAltID
                    };

                    dataPacket.Data.Add(odcPacket);
                }

                // Process all the elements in the response packet looking for corrospoinding elements in existing packet
                foreach (OpDataElement dataElement in odcResponse.DataElements)
                {
                    // Find existing element
                    OpDataElement originalDataElement = odcPacket.DataElements.FirstOrDefault(d => dataElement.IsKeyMatch(d, syncByGuid));

                    if (originalDataElement == null)
                    {
                        // If not found, copy the response element into the existing elements
                        odcPacket.DataElements.Add(dataElement.CopyDataElement(dataElement.DcID, OpDataElementState.Modified));
                    }
                    else
                    {
                        // Else, update the values
                        originalDataElement.AtrbValue = dataElement.AtrbValue;
                        originalDataElement.ElementID = dataElement.ElementID;
                    }
                }
            }

            OpLogPerf.Log("OpDataPacket.Merge -- End Step 3");

            // Step 4 - Apply large-scale deletions
            // Concern - on rollback, is it possible to have a field dropped?  How do we detect that?
            foreach (OpDataAction dataAction in dataPacket.Actions.Where(a => a.Action == "DEAL_DELETED"))
            {
                //foreach (int dcID in dataAction.TargetDcIDs)
                //{
                if (dataPacket.PacketType == OpDataElementType.Tertiary) // This is PLI tab, do element by element
                {
                    List<OpDataElement> removeElements = dataPacket.AllDataElements.Where(d => dataAction.TargetDcIDs.Contains(d.DcID)).ToList();
                    foreach (OpDataElement de in removeElements)
                    {
                        dataPacket.Data[de.DcID].DataElements.Remove(de);
                    }
                }
                else if (dataPacket.PacketType == OpDataElementType.Secondary ||
                            dataPacket.PacketType == OpDataElementType.Deals) // Deal tabs are collector by collector
                {
                    List<OpDataCollector> removeCollectors = dataPacket.AllDataCollectors.Where(d => dataAction.TargetDcIDs.Contains(d.DcID)).ToList();
                    foreach (OpDataCollector dc in removeCollectors)
                    {
                        dataPacket.Data.Remove(dc.DcID);
                    }
                }
            }

            OpLogPerf.Log("OpDataPacket.Merge -- End Step 4 -- Done");

        }
    }
}
