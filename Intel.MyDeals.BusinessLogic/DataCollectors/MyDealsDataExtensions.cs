using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public static class MyDealsDataExtensions
    {

        #region Merge

        /// <summary>
        /// Merge flattened data back into OpData Deals collections
        /// </summary>
        /// <param name="myDealsData">The unflattened deals collection to pass up to DB.</param>
        /// <param name="data">The flattened UI data format.</param>
        /// <returns></returns>
        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataCollectorFlattenedDictList data)
        {
            // Save Data Cycle: Point 6
            if (data == null) return myDealsData;

            foreach (KeyValuePair<OpDataElementType, OpDataCollectorFlattenedList> kvp in data)
            {
                myDealsData.Merge(kvp.Key, kvp.Value);
            }

            return myDealsData;
        }


        /// <summary>
        /// Merge flattened data back into OpData Deals collections for a specific collector type
        /// </summary>
        /// <param name="myDealsData">The unflattened deals collection to pass up to DB.</param>
        /// <param name="opType">Which collector type to process.</param>
        /// <param name="data">The flattened UI data format.</param>
        /// <returns></returns>
        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataElementType opType, OpDataCollectorFlattenedList data)
        {
            // Save Data Cycle: Point 5
            // Save Data Cycle: Point 13

            if (data == null) return myDealsData;
            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opType);

            //List<OpDataCollectorFlattenedItem> newItems = new List<OpDataCollectorFlattenedItem>();
            foreach (OpDataCollectorFlattenedItem items in data)
            {
                //if (!myDealsData[opType].Data.Any()) continue;

                //OpDataCollector defDc = myDealsData[opType].Data.First().Value;
                int id = !items.ContainsKey("DC_ID") || items["DC_ID"] == null ? 0 : Convert.ToInt32(items["DC_ID"].ToString());
                int idtype = !items.ContainsKey("dc_type") || items["dc_type"] == null ? 0 : OpDataElementTypeConverter.FromString(items["dc_type"]).ToId();
                int parentid = !items.ContainsKey("DC_PARENT_ID") || items["DC_PARENT_ID"] == null ? 0 : Convert.ToInt32(items["DC_PARENT_ID"].ToString());
                int parentidtype = !items.ContainsKey("dc_parent_type") || items["dc_parent_type"] == null ? 0 : OpDataElementTypeConverter.FromString(items["dc_parent_type"]).ToId();

                if (items.ContainsKey(EN.OBJDIM._MULTIDIM))
                {
                    foreach (JObject item in (IEnumerable)items[EN.OBJDIM._MULTIDIM])
                    {
                        var values = item.ToObject<OpDataCollectorFlattenedItem>();
                        var pivot = values.ContainsKey(EN.OBJDIM.PIVOT) ? values[EN.OBJDIM.PIVOT] : "0";

                        foreach (KeyValuePair<string, object> kvp in values)
                        {
                            if (kvp.Key != EN.OBJDIM.PIVOT && kvp.Key != "DC_ID")
                            {
                                items[kvp.Key + "|" + pivot] = kvp.Value;
                            }
                        }
                    }
                }

                // Get existing DC or spawn a new one
                OpDataCollector dc = myDealsData.CreateDCFromData(id, idtype, parentid, parentidtype, opType, items);

                // Layer the passed items on top of the newly filled MyDealsData
                dpDeals.Messages = dc.MergeDictionary(items);
            }

            return myDealsData;
        }

        #endregion

        #region FillInHolesFromTemplate

        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromTemplate(this MyDealsData myDealsData)
        {
            return myDealsData.FillInHolesFromTemplate(myDealsData.Keys);
        }


        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementTypes">Specific object collection.</param>
        /// <returns></returns>
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
            foreach (OpDataCollector dc in dpDeals.AllDataCollectors.Where(dc => dealsWithFiles.Contains(dc.DcID)))
            {
                OpDataElement de = dc.DataElements.FirstOrDefault();
                if (de == null) continue;

                dc.DataElements.Add(new OpDataElement
                {
                    AtrbCd = "HAS_FILE_ATTACHMENTS",
                    AtrbValue = 1,
                    AtrbID = 0,
                    DcParentID = de.DcParentID,
                    DcID = de.DcID,
                    DcType = de.DcType,
                    DcParentType = de.DcParentType
                });
            }
        }

        #endregion

        public static OpDataCollector CreateDCFromData(this MyDealsData myDealsData, int id, int idtype, int parentId, int parentidtype, OpDataElementType opDataElementType, OpDataCollectorFlattenedItem item)
        {
            // Save Data Cycle: Point 3
            // Save Data Cycle: Point 11

            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opDataElementType);

            // Get existing DC or spawn a new one
            OpDataCollector dc;
            if (id < 0 || !dpDeals.Data.ContainsKey(id)) // missing
            {
                dc = new OpDataCollector
                {
                    DcID = id,
                    DcParentID = parentId,
                    DcType = opDataElementType.ToString(),
                    DcParentType = parentidtype.IdToString().ToString()
                };
                if (id < 0) dc.FillInHolesFromTemplate();
                myDealsData[opDataElementType].Data[id] = dc;
            }
            else // exists
            {
                dc = dpDeals.Data[id];
            }

            // Ensure DC type and parent/child ids
            dc.DcType = opDataElementType.ToString();
            dc.DcID = item["DC_ID"] == null ? 0 : Convert.ToInt32(item["DC_ID"].ToString());
            dc.DcParentID = item["DC_PARENT_ID"] == null ? 0 : Convert.ToInt32(item["DC_PARENT_ID"].ToString());
            dc.DcParentType = parentidtype.IdToString().ToString();

            return dc;
        }


        public static MyDealsData ApplyRules(this MyDealsData myDealsData, MyRulesTrigger ruleTriggerPoint)
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
                            KeyIdentifiers = new[] { de.DcID, de.DcParentID }  // Put the real deal ID in message // TODO This might need to shift to internal SID
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
                .Where(d => !dealIds.Any() || dealIds.Contains(d.DcParentID)) // TODO - Likely rip out parent since this is walking through deal numbers and we don't have alt anymore.
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
