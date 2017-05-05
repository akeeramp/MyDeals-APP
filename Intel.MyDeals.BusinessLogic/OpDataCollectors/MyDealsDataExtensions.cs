using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
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

            foreach (OpDataCollectorFlattenedItem items in data)
            {
                if (!items.Any()) continue;

                int id = items.GetIntAtrb(AttributeCodes.DC_ID);
                int idtype = items.GetIntAtrbFromOpDataElementType(AttributeCodes.dc_type);
                int parentid = items.GetIntAtrb(AttributeCodes.DC_PARENT_ID);
                int parentidtype = items.GetIntAtrbFromOpDataElementType(AttributeCodes.dc_parent_type);

                OpDataElementSetType objSetType = OpDataElementSetTypeConverter.FromString(items[AttributeCodes.OBJ_SET_TYPE_CD]);

                if (opType == OpDataElementType.WIP_DEAL && id == 0)
                {
                    OpDataElementTypeMapping elMapping = objSetType.OpDataElementTypeParentMapping(opType);
                    if (elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
                    {
                        string wipProd = items[AttributeCodes.PTR_USER_PRD + EN.VARIABLES.PRIMARY_DIMKEY].ToString();
                        List<OpDataCollector> myDcs = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Where(d => d.DcParentID == parentid).ToList();
                        foreach (OpDataCollector odc in myDcs)
                        {
                            if (odc.GetDataElementValue(AttributeCodes.PTR_USER_PRD) == wipProd) id = odc.DcID;
                        }
                    }
                    else
                    {
                        // TODO for all except ECAP
                    }
                }
                

                // Handle multi dim items
                if (items.ContainsKey(EN.OBJDIM._MULTIDIM))
                {
                    foreach (JObject item in (IEnumerable)items[EN.OBJDIM._MULTIDIM])
                    {
                        var values = item.ToObject<OpDataCollectorFlattenedItem>();
                        var pivot = values.ContainsKey(EN.OBJDIM.PIVOT) ? values[EN.OBJDIM.PIVOT] : "0";

                        foreach (KeyValuePair<string, object> kvp in values)
                        {
                            if (kvp.Key != EN.OBJDIM.PIVOT && kvp.Key != AttributeCodes.DC_ID)
                            {
                                items[kvp.Key + "|" + pivot] = kvp.Value;
                            }
                        }
                    }
                }

                // Get existing DC or spawn a new one
                OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(items[AttributeCodes.OBJ_SET_TYPE_CD]);
                OpDataCollector dc = myDealsData.ToOpDataCollector(id, idtype, parentid, parentidtype, opType, opDataElementSetType);

                // Layer the passed items on top of the newly filled MyDealsData
                dpDeals.Messages = dc.MergeDictionary(items);
            }

            return myDealsData;
        }

        #endregion



        #region FillInHolesFromAtrbAtrbTemplate

        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementSetType"></param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData, OpDataElementSetType opDataElementSetType)
        {
            return myDealsData.FillInHolesFromAtrbTemplate(myDealsData.Keys, opDataElementSetType);
        }


        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementTypes">Specific object collection.</param>
        /// <param name="opDataElementSetType"></param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData, IEnumerable<OpDataElementType> opDataElementTypes, OpDataElementSetType opDataElementSetType)
        {
            foreach (OpDataElementType opDataElementType in opDataElementTypes)
            {
                myDealsData.FillInHolesFromAtrbTemplate(opDataElementType, opDataElementSetType);
            }
            return myDealsData;
        }

        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementType">Specific object.</param>
        /// <param name="opDataElementSetType"></param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData, OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType)
        {
            if (!myDealsData.ContainsKey(opDataElementType)) return myDealsData;

            foreach (OpDataCollector allDataCollector in myDealsData[opDataElementType].AllDataCollectors)
            {
                allDataCollector.FillInHolesFromAtrbTemplate(opDataElementSetType);
            }

            return myDealsData;
        }

        #endregion



        #region ToOpDataCollectorFlattenedDictList

        /// <summary>
        /// Build ObjSet Flattened Object from all OpDataElementTypes in a MyDealsData collection
        /// </summary>
        /// <param name="myDealsData"></param>
        /// <param name="pivotMode"></param>
        /// <param name="security"></param>
        /// <returns>OpDataCollectorFlattenedDictList</returns>
        public static OpDataCollectorFlattenedDictList ToOpDataCollectorFlattenedDictList(this MyDealsData myDealsData, ObjSetPivotMode pivotMode, bool security = true)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            foreach (OpDataElementType opDataElementType in myDealsData.Keys)
            {
                data[opDataElementType] = myDealsData.ToOpDataCollectorFlattenedDictList(opDataElementType, pivotMode, security);
            }
            return data;
        }

        /// <summary>
        /// Build ObjSet Flattened Object from a single OpDataElementType
        /// </summary>
        /// <param name="myDealsData"></param>
        /// <param name="opType"></param>
        /// <param name="pivotMode"></param>
        /// <param name="security"></param>
        /// <returns>OpDataCollectorFlattenedList</returns>
        public static OpDataCollectorFlattenedList ToOpDataCollectorFlattenedDictList(this MyDealsData myDealsData, OpDataElementType opType, ObjSetPivotMode pivotMode, bool security = true)
        {
            // Construct return variable
            OpDataCollectorFlattenedList data = new OpDataCollectorFlattenedList();
            Dictionary<int, string> prdMaps = new Dictionary<int, string>();

            // Bail if DataPacket is null
            if (!myDealsData.ContainsKey(opType) || myDealsData[opType] == null) return data;

            // Get DataPacket
            OpDataPacket<OpDataElementType> dpObjSet = myDealsData[opType];

            if (security && dpObjSet.Actions.Any()) data.Add(new OpDataCollectorFlattenedItem {["_actions"] = dpObjSet.Actions });

            // Tag Attachments
            // TODO Inject a Rule Trigger here and the below commands should be a rules for this trigger


            // TODO make this a rule
            // Since this is a DB call, we don't want to do this for EVERY data collector individually
            if (security) myDealsData.TagWithAttachments(dpObjSet);

            //Get Products
            // TODO make this a rule
            // This is a call accross the entire OpDataPacket to get products
            // Since this is a DB call, we don't want to do this for EVERY data collector individually
            if (opType == OpDataElementType.DEAL || opType == OpDataElementType.WIP_DEAL)
                prdMaps = dpObjSet.GetProductMapping();

            // loop through deals and flatten each Data Collector
            data.AddRange(dpObjSet.AllDataCollectors.Select(dc => dc.ToOpDataCollectorFlattenedItem(opType, pivotMode, prdMaps, myDealsData, security)));

            return data;
        }

        #endregion
        


        #region Attachments

        public static List<int> GetDealIdsWithAttachments(this MyDealsData myDealsData)
        {
            // TODO needs to be revisited... this should be OpDataElementType based
            //if (!myDealsData.ContainsKey(OpDataElementType.Group)) return new List<int>();

            //DataTable dealAttachmentsTable = new DealDataLib().GetDealAttachmentsByID(null, myDealsData[OpDataElementType.Group].GroupID);
            //if (dealAttachmentsTable == null || dealAttachmentsTable.Rows.Count == 0) return new List<int>(); // pass back an empty list

            //// walk thru the datatable and load the list.
            //return (from DataRow row in dealAttachmentsTable.Rows select (int)row["DEAL_MBR_SID"]).ToList();
            return new List<int>();
        }

        public static void TagWithAttachments(this MyDealsData myDealsData, OpDataPacket<OpDataElementType> opDataPacket)
        {
            // TODO needs to be revisited... this should be OpDataElementType based
            List<int> dataCollectorsWithFiles = myDealsData.GetDealIdsWithAttachments();
            foreach (OpDataCollector dc in opDataPacket.AllDataCollectors.Where(dc => dataCollectorsWithFiles.Contains(dc.DcID)))
            {
                OpDataElement de = dc.DataElements.FirstOrDefault();
                if (de == null) continue;

                // Create FAKE UI ONLY DataElement
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



        #region Save

        /// <summary>
        /// Save MyDealsData to the Database
        /// </summary>
        /// <param name="myDealsData">MyDealsData</param>
        /// <param name="custId">Customer Id</param>
        /// <returns></returns>
        public static MyDealsData Save(this MyDealsData myDealsData, int custId)
        {
            return Save(myDealsData, custId, true);
        }

        /// <summary>
        /// Save MyDealsData to the Database
        /// </summary>
        /// <param name="myDealsData">MyDealsData</param>
        /// <param name="custId">Customer Id</param>
        /// <param name="batchMode">Run in batch mode?</param>
        /// <returns></returns>
        public static MyDealsData Save(this MyDealsData myDealsData, int custId, bool batchMode)
        {
            return new OpDataCollectorDataLib().SaveMyDealsData(myDealsData, custId, batchMode);
        }

        #endregion



        #region ToOpDataCollector

        /// <summary>
        /// Convert MyDealsData specific OpDataElementType to OpDataCollector
        /// </summary>
        /// <param name="myDealsData"></param>
        /// <param name="dcId">Data Collector Id</param>
        /// <param name="dcIdType">Data Collector Type</param>
        /// <param name="dcParentId">Data Collector Parent Id</param>
        /// <param name="dcParentIdType">Data Collector Parent type</param>
        /// <param name="opDataElementType">Data Element Type</param>
        /// <returns></returns>
        public static OpDataCollector ToOpDataCollector(this MyDealsData myDealsData, int dcId, int dcIdType, int dcParentId, int dcParentIdType, OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType)
        {
            // Save Data Cycle: Point 3
            // Save Data Cycle: Point 11

            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opDataElementType);

            // Get existing DC or spawn a new one
            OpDataCollector dc;
            if (dcId <= 0 || !dpDeals.Data.ContainsKey(dcId)) // missing
            {
                if (dcId == 0)
                {
                    dcId = EN.VARIABLES.NEW_UNIQ_ID--;
                    if (EN.VARIABLES.NEW_UNIQ_ID < -99999) EN.VARIABLES.NEW_UNIQ_ID = -1000;
                }
                dc = new OpDataCollector
                {
                    DcID = dcId,
                    DcParentID = dcParentId,
                    DcType = opDataElementType.ToString(),
                    DcParentType = dcParentIdType.IdToOpDataElementTypeString().ToString()
                };
                if (dcId < 0) dc.FillInHolesFromAtrbTemplate(opDataElementSetType);
                myDealsData[opDataElementType].Data[dcId] = dc;
            }
            else // exists
            {
                dc = dpDeals.Data[dcId];
            }

            // Ensure DC type and parent/child ids
            dc.DcType = opDataElementType.ToString();
            dc.DcID = dcId;
            dc.DcParentID = dcParentId;
            dc.DcParentType = dcParentIdType.IdToOpDataElementTypeString().ToString();

            return dc;
        }

        #endregion



        #region Rules

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

        #endregion


        #region Validation

        public static OpMsgQueue Validate(this MyDealsData myDealsData, OpUserToken opUserToken, List<OpDataElementType> opDataElementTypes)
        {
            if (!opDataElementTypes.Any())
            {
                opDataElementTypes.Add(OpDataElementType.DEAL);
            }

            var attrCollection = DataCollections.GetAttributeData();

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
                    foreach (OpDataElement de in dc.DataElements.Where(d => d.ValidationMessage != string.Empty))
                    {
                        OpMsg addMessage = new OpMsg
                        {
                            Message = de.ValidationMessage,
                            MsgType = OpMsg.MessageType.Warning,
                            ExtraDetails = de.AtrbCd,
                            KeyIdentifiers = new[] { de.DcID, de.DcType }
                        };
                        opMsgQueue.Messages.Add(addMessage);
                    }
                }
            }

            return opMsgQueue;
        }

        public static bool ValidationApplyRules(this MyDealsData myDealsData)
        {
            // Apply rules to save packets here.  If validations are hit, append them to the DC and packet message lists.
            bool dataHasValidationErrors = false;

            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                if (!myDealsData.ContainsKey(opDataElementType)) continue;
                foreach (OpDataCollector dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnSave);
                    foreach (IOpDataElement de in dc.GetDataElementsWithValidationIssues())
                    {
                        dataHasValidationErrors = true;

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
                        //dc.Message.WriteMessage(OpMsg.MessageType.Warning, de.ValidationMessage);
                        //myDealsData[opDataElementType].Messages.WriteMessage(OpMsg.MessageType.Warning, $"{dc.DcType} - {dc.DcID} : {de.ValidationMessage}");
                    }
                }
            }

            return dataHasValidationErrors;
        }

        #endregion



        #region Ensure

        public static void EnsureBatchIDs(this MyDealsData myDealsData)
        {
            foreach (OpDataPacket<OpDataElementType> packet in myDealsData.Values.Where(packet => packet.BatchID == Guid.Empty))
            {
                packet.BatchID = Guid.NewGuid();
            }
        }
        
        private static void EnsureOpTypeExists(this MyDealsData myDealsData, OpDataElementType opType)
        {
            // If opType doesn't already exist in myDealsData, add it
            if (myDealsData.ContainsKey(opType)) return;
            myDealsData[opType] = new OpDataPacket<OpDataElementType> { PacketType = opType };
        }

        private static OpDataPacket<OpDataElementType> GetOpType(this MyDealsData myDealsData, OpDataElementType opType)
        {
            myDealsData.EnsureOpTypeExists(opType);
            return myDealsData[opType];
        }

        public static void EnsureRowAndWipDcIds(this MyDealsData myDealsData)
        {
            if (!myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) || !myDealsData.ContainsKey(OpDataElementType.WIP_DEAL)) return;

            Dictionary<int, int> rowToWip = new Dictionary<int, int>();
            Dictionary<int, int> wipToRow = new Dictionary<int, int>();

            foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors)
            {
                    
            }
        }

        #endregion

    }
}
