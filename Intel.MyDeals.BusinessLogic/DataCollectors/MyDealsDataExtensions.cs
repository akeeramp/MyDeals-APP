using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class MyDealsDataExtensions
    {

        #region Merge

        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataCollectorFlattenedDictList data)
        {
            if (data == null) return myDealsData;

            foreach (KeyValuePair<OpDataElementType, OpDataCollectorFlattenedList> kvp in data)
            {
                myDealsData.Merge(kvp.Key, kvp.Value);
            }

            return myDealsData;
        }

        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataElementType opType, OpDataCollectorFlattenedList data)
        {
            if (data == null) return myDealsData;
            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opType);

            foreach (OpDataCollectorFlattenedItem items in data)
            {
                int id = !items.ContainsKey("dc_id") ? 0 : Convert.ToInt32(items["dc_id"].ToString());

                // Get existing DC or spawn a new one
                OpDataCollector dc = myDealsData.CreateDCFromData(id, opType, items);

                // Layer the passed items on top of the newly filled MyDealsData
                dpDeals.Messages = dc.MergeDictionary(items);
            }

            return myDealsData;
        }

        #endregion

        #region FillInHolesFromTemplate

        public static MyDealsData FillInHolesFromTemplate(this MyDealsData myDealsData)
        {
            return myDealsData.FillInHolesFromTemplate(myDealsData.Keys);
        }

        public static MyDealsData FillInHolesFromTemplate(this MyDealsData myDealsData, IEnumerable<OpDataElementType> opDataElementTypes)
        {
            foreach (OpDataElementType opDataElementType in opDataElementTypes)
            {
                myDealsData.FillInHolesFromTemplate(opDataElementType);
            }
            return myDealsData;
        }

        public static MyDealsData FillInHolesFromTemplate(this MyDealsData myDealsData, OpDataElementType opDataElementType)
        {
            if (!myDealsData.ContainsKey(opDataElementType)) return myDealsData;

            foreach (OpDataCollector allDataCollector in myDealsData[opDataElementType].AllDataCollectors)
            {
                allDataCollector.FillInHolesFromTemplate();
            }

            return myDealsData;
        }

        #endregion

        #region BuildObjSetContainers

        /// <summary>
        /// Build ObjSet Flattened Object from all OpDataElementTypes in a MyDealsData collection
        /// </summary>
        /// <param name="myDealsData"></param>
        /// <param name="pivotMode"></param>
        /// <returns>OpDataCollectorFlattenedDictList</returns>
        public static OpDataCollectorFlattenedDictList BuildObjSetContainers(this MyDealsData myDealsData, ObjSetPivotMode pivotMode)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.BuildObjSetContainer(opDataElementType, pivotMode);
            }
            return data;
        }

        /// <summary>
        /// Build ObjSet Flattened Object from a single OpDataElementType
        /// </summary>
        /// <param name="myDealsData"></param>
        /// <param name="opType"></param>
        /// <param name="pivotMode"></param>
        /// <returns>OpDataCollectorFlattenedList</returns>
        public static OpDataCollectorFlattenedList BuildObjSetContainer(this MyDealsData myDealsData, OpDataElementType opType, ObjSetPivotMode pivotMode)
        {
            // Construct return variable
            OpDataCollectorFlattenedList data = new OpDataCollectorFlattenedList();
            Dictionary<int, string> prdMaps = new Dictionary<int, string>();

            // Get DataPacket
            OpDataPacket<OpDataElementType> dpObjSet = myDealsData[opType];

            // Bail if DataPacket is null
            if (dpObjSet == null) return data;

            // Get Attribute Collection
            AttributeCollection attrCol = DataCollections.GetAttributeData();

            // Get a list of dc_ids
            List<int> ids = dpObjSet.AllDataCollectors.Select(dc => dc.DcID).Distinct().ToList();

            // Tag Attachments
            // TODO Inject a Rule Trigger here and the below commands should be a rules for this trigger

            // TODO make this a rule
            if (opType == OpDataElementType.Deals || opType == OpDataElementType.WipDeals)
                myDealsData.TagDealsWithAttachments(dpObjSet);

            //Get Products
            // TODO make this a rule
            if (opType == OpDataElementType.Deals || opType == OpDataElementType.WipDeals)
                prdMaps = dpObjSet.GetProductMapping(ids);

            // loop through deals
            data.AddRange(dpObjSet.AllDataCollectors
                .Where(d => !ids.Any() || ids.Contains(d.DcID))
                .Select(dc => dc.BuildObjSetForContainer(opType, pivotMode, attrCol, prdMaps, myDealsData)));

            return data;
        }

        #endregion
        
        #region Attachments

        public static List<int> GetDealIdsWithAttachments(this MyDealsData myDealsData)
        {
            //if (!myDealsData.ContainsKey(OpDataElementType.Group)) return new List<int>();

            //DataTable dealAttachmentsTable = new DealDataLib().GetDealAttachmentsByID(null, myDealsData[OpDataElementType.Group].GroupID);
            //if (dealAttachmentsTable == null || dealAttachmentsTable.Rows.Count == 0) return new List<int>(); // pass back an empty list

            //// walk thru the datatable and load the list.
            //return (from DataRow row in dealAttachmentsTable.Rows select (int)row["DEAL_MBR_SID"]).ToList();
            return new List<int>();
        }

        public static void TagDealsWithAttachments(this MyDealsData myDealsData, OpDataPacket<OpDataElementType> dpDeals)
        {
            List<int> dealsWithFiles = myDealsData.GetDealIdsWithAttachments();
            foreach (OpDataCollector dc in dpDeals.AllDataCollectors.Where(dc => dealsWithFiles.Contains(dc.DcAltID)))
            {
                OpDataElement de = dc.DataElements.FirstOrDefault();
                if (de == null) continue;

                dc.DataElements.Add(new OpDataElement
                {
                    AtrbCd = "HAS_FILE_ATTACHMENTS",
                    AtrbValue = 1,
                    AtrbID = 0,
                    DcAltID = de.DcAltID,
                    DcID = de.DcID
                });
            }
        }

        #endregion

        public static OpDataCollector CreateDCFromData(this MyDealsData myDealsData, int id, OpDataElementType opDataElementType, OpDataCollectorFlattenedItem item)
        {
            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opDataElementType);

            // Get existing DC or spawn a new one
            OpDataCollector dc;
            if (id < 0 || !dpDeals.Data.ContainsKey(id)) // missing
            {
                dc = new OpDataCollector { DcID = id, DcType = opDataElementType.ToString() };
                if (id < 0) dc.FillInHolesFromTemplate();
                myDealsData[opDataElementType].Data[id] = dc;
            }
            else // exists
            {
                dc = dpDeals.Data[id];
            }

            // Ensure DC type and parent/child ids
            dc.DcType = opDataElementType.ToString();
            dc.DcAltID = item["dc_parent_id"] == null ? 0 : Convert.ToInt32(item["dc_parent_id"].ToString());
            
            return dc;
        }


        public static MyDealsData ApplyRules(this MyDealsData myDealsData, RuleTriggerPoint ruleTriggerPoint)
        {
            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                Dictionary<string, bool> securityActionCache = new Dictionary<string, bool>();
                foreach (OpDataCollector dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    dc.ApplyRules(ruleTriggerPoint, securityActionCache);
                }
            }

            return myDealsData;
        }


        public static OpMsgQueue Validate(this MyDealsData myDealsData, OpUserToken opUserToken, List<OpDataElementType> opDataElementTypes)
        {
            if (!opDataElementTypes.Any())
            {
                opDataElementTypes.Add(OpDataElementType.Deals);
            }

            var attrCollection = DataCollections.GetAttributeData();
            Dictionary<string, bool> securityActionCache = new Dictionary<string, bool>();

            foreach (OpDataElementType opDataElementType in opDataElementTypes)
            {
                // TODO we will need to ignore deletes
                //List<int> pendingDeletes = dataPacket.Actions.Where(d => d.Action == "CANCEL").Select(d => d.TargetDcIDs).FirstOrDefault();
                List<int> pendingDeletes = new List<int>();

                foreach (OpDataCollector dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    // if this item is to be deleted, don't bother to validate.
                    if (pendingDeletes.Contains(dc.DcID)) continue;

                    // if there are not any modifications to this deal, skip validation
                    if (!dc.ModifiedDataElements.Any()) continue; 

                    dc.EnsureDcType(attrCollection, opDataElementType);
                    ////dc.ApplyRulesOnSave(dc.DcType, opUserToken.Role, securityActionCache);
                }
            }

            return myDealsData.GetValidationMessages(opDataElementTypes);
        }

        public static OpMsgQueue GetValidationMessages(this MyDealsData myDealsData, List<OpDataElementType> opDataElementTypes)
        {
            OpMsgQueue opMsgQueue = new OpMsgQueue();

            foreach (OpDataElementType opDataElementType in opDataElementTypes)
            {
                foreach (OpDataCollector dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    foreach (OpDataElement de in dc.DataElements.Where(d => d.ValidationMessage != String.Empty))
                    {
                        OpMsg addMessage = new OpMsg()
                        {
                            Message = de.ValidationMessage,
                            MsgType = OpMsg.MessageType.Warning,
                            ExtraDetails = de.AtrbCd,
                            KeyIdentifiers = new[] { de.DcID, de.DcAltID }  // Put the real deal ID in message
                        };
                        opMsgQueue.Messages.Add(addMessage);
                    }
                }
            }

            return opMsgQueue;
        }

        public static OpDataCollectorFlattenedList BuildDealContainer(this MyDealsData myDealsData, IEnumerable<int> dealIds)
        {
            OpDataElementType opType = OpDataElementType.Deals;

            Dictionary<string, bool> securityActionCache = new Dictionary<string, bool>();

            // Contruct return variable
            OpDataCollectorFlattenedList deals = new OpDataCollectorFlattenedList();

            // Get Workbook
            OpDataPacket<OpDataElementType> dpDeals = myDealsData[opType];

            // Bail if DataPacket is null
            if (dpDeals == null) return deals;

            // Tag Attachments
            myDealsData.TagDealsWithAttachments(dpDeals);

            // Get Attribute Collection
            AttributeCollection attrCol = DataCollections.GetAttributeData();

            //Get Products
            Dictionary<int, string> prdMaps = dpDeals.GetProductMapping(dealIds);

            // loop through deals
            if (dealIds == null) dealIds = new List<int>();
            deals.AddRange(dpDeals.AllDataCollectors
                .Where(d => !dealIds.Any() || dealIds.Contains(d.DcAltID))
                .Select(dc => dc.BuildDealForContainer(attrCol, prdMaps, myDealsData, securityActionCache)));

            securityActionCache.Clear();
            return deals;
        }

        public static void VerifyBatchIDs(this MyDealsData myDealsData)
        {
            foreach (OpDataPacket<OpDataElementType> packet in myDealsData.Values.Where(packet => packet.BatchID == Guid.Empty))
            {
                packet.BatchID = Guid.NewGuid();
            }
        }



    private static void EnsureOpTypeExists(this MyDealsData myDealsData, OpDataElementType opType)
        {
            // If opType doesn't already exist in myDealsData, add it
            if (!myDealsData.ContainsKey(opType))
            {
                myDealsData[opType] = new OpDataPacket<OpDataElementType> { PacketType = opType };
            }
        }

        private static OpDataPacket<OpDataElementType> GetOpType(this MyDealsData myDealsData, OpDataElementType opType)
        {
            myDealsData.EnsureOpTypeExists(opType);
            return myDealsData[opType];
        }


    }
}
