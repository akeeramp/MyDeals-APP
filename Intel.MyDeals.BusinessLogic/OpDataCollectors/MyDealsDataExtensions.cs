using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
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
        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataCollectorFlattenedDictList data, bool needToCheckForDelete = true)
        {
            // Save Data Cycle: Point 6
            if (data == null) return myDealsData;

            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 1)
            {
                stopwatch.Start();
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tMerge Starting", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);
            }

            foreach (KeyValuePair<OpDataElementType, OpDataCollectorFlattenedList> kvp in data)
            {
                myDealsData.Merge(kvp.Key, kvp.Value, needToCheckForDelete);

                // Clear Passed Validation for PTR and WIP
                if (myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) && myDealsData.ContainsKey(OpDataElementType.WIP_DEAL))
                {
                    var passedAtrbs = myDealsData[kvp.Key].AllDataElements.Where(d => d.AtrbCd == AttributeCodes.PASSED_VALIDATION);
                    foreach (OpDataElement de in passedAtrbs)
                    {
                        de.AtrbValue = PassedValidation.Dirty;
                    }
                }
            }

            if (EN.GLOBAL.DEBUG >= 1) Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tMerge complete", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now);

            return myDealsData;
        }

        /// <summary>
        /// Merge flattened data back into OpData Deals collections for a specific collector type
        /// </summary>
        /// <param name="myDealsData">The unflattened deals collection to pass up to DB.</param>
        /// <param name="opType">Which collector type to process.</param>
        /// <param name="data">The flattened UI data format.</param>
        /// <returns></returns>
        public static MyDealsData Merge(this MyDealsData myDealsData, OpDataElementType opType, OpDataCollectorFlattenedList data, bool needToCheckForDelete = true)
        {
            // Save Data Cycle: Point 5
            // Save Data Cycle: Point 13

            if (data == null) return myDealsData;
            OpDataPacket<OpDataElementType> dpDeals = myDealsData.GetOpType(opType);

            List<int> foundIds = new List<int>();
            List<int> wipIds = new List<int>();

            foreach (OpDataCollectorFlattenedItem items in data)
            {
                if (!items.Any()) continue;

                int id = items.GetIntAtrb(AttributeCodes.DC_ID);
                int idtype = items.GetIntAtrbFromOpDataElementType(AttributeCodes.dc_type);
                int parentid = items.GetIntAtrb(AttributeCodes.DC_PARENT_ID);
                int parentidtype = items.GetIntAtrbFromOpDataElementType(AttributeCodes.dc_parent_type);
                OpDataElementSetType objSetType = OpDataElementSetTypeConverter.FromString(items[AttributeCodes.OBJ_SET_TYPE_CD]);

                //if (opType == OpDataElementType.WIP_DEAL && id == 0)
                //{
                //    foundIds.Add(id);
                //}
                //else
                //{
                //    foundIds.Add(id);
                //}
                foundIds.Add(id);

                // Look for WIP Deals that need to be mapped to Parent
                if (opType == OpDataElementType.WIP_DEAL && id == 0)
                {
                    OpDataElementTypeMapping elMapping = objSetType.OpDataElementTypeParentMapping(opType);
                    List<OpDataCollector> myDcs = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.Where(d => d.DcParentID == parentid).ToList();

                    if (elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
                    {
                        string wipProd = items[AttributeCodes.PTR_USER_PRD].ToString();
                        string wipProdFilter = "";

                        foreach (KeyValuePair<string, object> kvp in items)
                        {
                            if (kvp.Key.IndexOf(AttributeCodes.PRODUCT_FILTER) == 0)
                            {
                                wipProdFilter = kvp.Value.ToString();
                            }
                        }

                        foreach (OpDataCollector odc in myDcs)
                        {
                            if (odc.GetDataElementValue(AttributeCodes.PTR_USER_PRD) == wipProd
                                && odc.GetDataElementValue(AttributeCodes.PRODUCT_FILTER) == wipProdFilter
                                && odc.GetDataElementValue(AttributeCodes.GEO_COMBINED) == items[AttributeCodes.GEO_COMBINED].ToString())
                            {
                                id = odc.DcID;
                                foundIds.Add(id);
                            }
                            wipIds.Add(odc.DcID);
                        }
                    }
                    else if (elMapping.TranslationType == OpTranslationType.OneDealPerRow)
                    {
                        string wipProd = items[AttributeCodes.PTR_USER_PRD].ToString();
                        List<string> wipProdFilter = new List<string>();

                        var prds = items.Where(i => i.Key.IndexOf(AttributeCodes.PRODUCT_FILTER) == 0).ToList();
                        foreach (KeyValuePair<string, object> kvp in prds)
                        {
                            wipProdFilter.Add(kvp.Value.ToString());
                        }

                        foreach (OpDataCollector odc in myDcs)
                        {
                            if (odc.GetDataElementValue(AttributeCodes.GEO_COMBINED) == items[AttributeCodes.GEO_COMBINED].ToString())
                            {
                                id = odc.DcID;
                                foundIds.Add(id);
                            }
                            wipIds.Add(odc.DcID);
                        }
                    }
                }

                if (opType == OpDataElementType.PRC_TBL_ROW && parentid == 0)
                {
                    List<OpDataCollector> myDcs = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.Where(d => d.DcID == id).ToList();

                    foreach (OpDataCollector odc in myDcs)
                    {
                        items[AttributeCodes.DC_PARENT_ID] = odc.DcParentID;
                        items[AttributeCodes.dc_parent_type] = odc.DcParentType;
                        foundIds.Add(id);
                        //wipIds.Add(odc.DcID);
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
                dpDeals.Messages = dc.MergeDictionary(items, needToCheckForDelete);
            }

            // if WIP, check for merge complete rules
            if (opType == OpDataElementType.WIP_DEAL)
            {
                //myDealsData.InjectParentStages();
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnMergeComplete, null, myDealsData);
                }
            }

            // look for WIP deals to delete
            if (opType == OpDataElementType.WIP_DEAL)
            {
                List<int> delIds = wipIds.Where(w => !foundIds.Contains(w)).Distinct().ToList();
                AddDeleteActions(myDealsData[OpDataElementType.WIP_DEAL], delIds);
            }

            // if PRC_TBL, check for merge complete rules
            if (opType == OpDataElementType.PRC_TBL)
            {
                //myDealsData.InjectParentStages();
                foreach (OpDataCollector dc in myDealsData[OpDataElementType.PRC_TBL].AllDataCollectors)
                {
                    dc.ApplyRules(MyRulesTrigger.OnMergeComplete, null, myDealsData);
                }
            }

            // look for PTRs to delete
            if (opType == OpDataElementType.PRC_TBL_ROW && needToCheckForDelete)
            {
                List<int> ptrIds = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.Select(p => p.DcID).ToList();
                List<int> delIds = ptrIds.Where(w => !foundIds.Contains(w) && w > 0).Distinct().ToList();
                AddDeleteActions(myDealsData[OpDataElementType.PRC_TBL_ROW], delIds);
            }

            return myDealsData;
        }

        #endregion Merge

        public static MyDealsData AddParentPS(this MyDealsData myDealsData, int id)
        {
            MyDealsData myDealsUpperData = myDealsData.GetParentPS(id);
            if (myDealsUpperData != null)
            {
                myDealsData[OpDataElementType.PRC_ST] = myDealsUpperData[OpDataElementType.PRC_ST];
            }
            return myDealsData;
        }

        public static MyDealsData GetParentPS(this MyDealsData myDealsData, int id)
        {
            if (myDealsData.ContainsKey(OpDataElementType.PRC_TBL))
            {
                OpDataCollector dc = myDealsData[OpDataElementType.PRC_TBL].AllDataCollectors.FirstOrDefault(d => d.DcID == id);
                if (dc == null) return null;

                int prntId = dc.DcParentID;
                return OpDataElementType.PRC_ST.GetByIDs(new List<int> { prntId }, new List<OpDataElementType>
                {
                    OpDataElementType.PRC_ST
                });
            }

            // if here... PRC_TBL doesn't exist... lets look up in DB
            return OpDataElementType.PRC_TBL.GetByIDs(new List<int> { id }, new List<OpDataElementType>
            {
                OpDataElementType.PRC_ST
            });
        }

        #region FillInHolesFromAtrbAtrbTemplate

        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementSetType"></param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData, OpDataElementSetType opDataElementSetType)
        {
            return myDealsData.FillInHolesFromAtrbTemplate(myDealsData.Keys.ToList(), opDataElementSetType);
        }

        /// <summary>
        /// Fill in missing data slots based upon existance in the object template
        /// </summary>
        /// <param name="myDealsData">OpData Deals collection.</param>
        /// <param name="opDataElementTypes">Specific object collection.</param>
        /// <param name="opDataElementSetType"></param>
        /// <returns></returns>
        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData, List<OpDataElementType> opDataElementTypes, OpDataElementSetType opDataElementSetType)
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
                if (allDataCollector.DcType == null) allDataCollector.DcType = opDataElementType.ToString();
                allDataCollector.FillInHolesFromAtrbTemplate(opDataElementSetType);
            }

            return myDealsData;
        }

        public static MyDealsData FillInHolesFromAtrbTemplate(this MyDealsData myDealsData)
        {
            foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> item in myDealsData)
            {
                foreach (OpDataCollector dc in item.Value.AllDataCollectors)
                {
                    dc.FillInHolesFromAtrbTemplate(OpDataElementSetTypeConverter.FromString(dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD)));
                }
            }

            return myDealsData;
        }

        #endregion FillInHolesFromAtrbAtrbTemplate

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
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            if (EN.GLOBAL.DEBUG >= 1) Debug.WriteLine("{1:HH:mm:ss:fff}\t ToOpDataCollectorFlattenedDictList [{0}] - Started", opType, DateTime.Now);

            // Construct return variable
            OpDataCollectorFlattenedList data = new OpDataCollectorFlattenedList();
            Dictionary<int, string> prdMaps = new Dictionary<int, string>();

            // Bail if DataPacket is null
            if (!myDealsData.ContainsKey(opType) || myDealsData[opType] == null) return data;

            // Get DataPacket
            OpDataPacket<OpDataElementType> dpObjSet = myDealsData[opType];

            //if (security || opType == OpDataElementType.WIP_DEAL)
            //{
            //    myDealsData.InjectParentStages();
            //}

            if (security)
            {
                if (dpObjSet.Actions.Any())
                    data.Add(new OpDataCollectorFlattenedItem { ["_actions"] = dpObjSet.Actions });

                // TODO make this a rule
                // Since this is a DB call, we don't want to do this for EVERY data collector individually
                //if (opType == OpDataElementType.CNTRCT || opType == OpDataElementType.WIP_DEAL) myDealsData.TagWithAttachments(dpObjSet, opType);
            }

            //Get Products
            // TODO make this a rule
            // This is a call accross the entire OpDataPacket to get products
            // Since this is a DB call, we don't want to do this for EVERY data collector individually
            //if (opType == OpDataElementType.DEAL || opType == OpDataElementType.WIP_DEAL)
            //    prdMaps = dpObjSet.GetProductMapping();

            var dataCollectors = dpObjSet.AllDataCollectors;
            if (opType == OpDataElementType.WIP_DEAL)
                dataCollectors = dpObjSet.AllDataCollectors.OrderByDescending(i => i.Message.Count);

            // loop through deals and flatten each Data Collector
            data.AddRange(dataCollectors.Select(dc => dc.ToOpDataCollectorFlattenedItem(opType, pivotMode, prdMaps, myDealsData, security)));

            if (EN.GLOBAL.DEBUG >= 1) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t ToOpDataCollectorFlattenedDictList [{1}]", stopwatch.Elapsed.TotalMilliseconds, opType, DateTime.Now);

            return data;
        }

        #endregion ToOpDataCollectorFlattenedDictList

        #region Save

        /// <summary>
        /// Save MyDealsData to the Database
        /// </summary>
        /// <param name="myDealsData">MyDealsData</param>
        /// <param name="contractToken"></param>
        /// <returns></returns>
        public static MyDealsData Save(this MyDealsData myDealsData, ContractToken contractToken)
        {
            OpLog.Log("MyDealsData.Save - Start.");
            MyDealsData newMyDealsData = myDealsData.Save(contractToken, true);
            OpLog.Log("MyDealsData.Save - complete.");
            return newMyDealsData;
        }

        /// <summary>
        /// Save MyDealsData to the Database
        /// </summary>
        /// <param name="myDealsData">MyDealsData</param>
        /// <param name="custId">Customer Id</param>
        /// <param name="batchMode">Run in batch mode?</param>
        /// <returns></returns>
        public static MyDealsData Save(this MyDealsData myDealsData, ContractToken contractToken, bool batchMode)
        {
            return new OpDataCollectorDataLib().SaveMyDealsData(myDealsData, contractToken, batchMode);
        }

        #endregion Save

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

        #endregion ToOpDataCollector

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

        #endregion Rules

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

        public static bool ValidationApplyRules(this MyDealsData myDealsData, SavePacket savePacket)
        {
            // Apply rules to save packets here.  If validations are hit, append them to the DC and packet message lists.
            bool dataHasValidationErrors = false;
            bool tblModifiedTrigger = false;
            List<OpDataElementType> ignoreTypes = new List<OpDataElementType>();
            if (savePacket.SourceEvent == OpDataElementType.PRC_TBL.ToString()) ignoreTypes.Add(OpDataElementType.WIP_DEAL);
            if (savePacket.SourceEvent == OpDataElementType.WIP_DEAL.ToString()) ignoreTypes.Add(OpDataElementType.PRC_TBL);

            if (myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) && myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataElements.Any(d => d.State == OpDataElementState.Modified && d.AtrbCd != AttributeCodes.PASSED_VALIDATION && d.AtrbCd != AttributeCodes.WF_STG_CD))
            {
                tblModifiedTrigger = true;
            }

            List<int> dirtyPtrs = new List<int>();
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                //// If Pricing table row has errors, do not save WIP_DEALS, even if we do save, it will be corrupted data.
                //if (dataHasValidationErrors && myDealsData.ContainsKey(opDataElementType) && savePacket.SourceEvent != "WIP_DEAL" &&
                //    opDataElementType == OpDataElementType.WIP_DEAL && myDealsData[OpDataElementType.PRC_TBL_ROW].Messages.Messages.Any())
                //{
                //    myDealsData.Remove(opDataElementType);
                //}

                if (!myDealsData.ContainsKey(opDataElementType)) continue;
                foreach (OpDataCollector dc in myDealsData[opDataElementType].AllDataCollectors)
                {
                    var dcHasErrors = false;

                    OpMsgQueue opMsgQueue = dc.ApplyRules(MyRulesTrigger.OnSave);
                    if (savePacket.ValidateIds.Any())
                    {
                        dc.ApplyRules(MyRulesTrigger.OnValidate, null, savePacket.MyContractToken.CustId);
                        dc.ApplyRules(MyRulesTrigger.OnPostValidate);
                    }

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

                    if (savePacket.ValidateIds.Any() && !dcHasErrors && (opDataElementType == OpDataElementType.PRC_TBL_ROW || opDataElementType == OpDataElementType.WIP_DEAL))
                    {
                        // only force publish to PTR
                        PassedValidation passedValidation = opDataElementType == OpDataElementType.WIP_DEAL
                            ? PassedValidation.Complete
                            : savePacket.ForcePublish
                                ? PassedValidation.Finalizing
                                : PassedValidation.Valid;

                        // Check overlapping
                        if (dc.GetAtrbValue(AttributeCodes.OVERLAP_RESULT).ToString() == "Fail")
                        {
                            passedValidation = PassedValidation.Dirty;
                        }

                        if (opDataElementType == OpDataElementType.PRC_TBL_ROW && passedValidation != PassedValidation.Finalizing)
                        {
                            dirtyPtrs.Add(dc.DcID);
                        }

                        // if WIP and PTR is NOT finalizing... set WIP to dirty
                        if (opDataElementType == OpDataElementType.WIP_DEAL && dirtyPtrs.Contains(dc.DcParentID))
                        {
                            if (tblModifiedTrigger)
                                dc.SetAtrb(AttributeCodes.PASSED_VALIDATION, PassedValidation.Dirty.ToString());
                        }
                        else
                        {
                            dc.SetAtrb(AttributeCodes.PASSED_VALIDATION, passedValidation.ToString());
                        }
                    }
                    else if (dc.IsModified || !dc.IsModified && dcHasErrors && dc.GetDataElementValue(AttributeCodes.PASSED_VALIDATION) != PassedValidation.Dirty.ToString())
                    {
                        if (opDataElementType == OpDataElementType.PRC_TBL_ROW) dirtyPtrs.Add(dc.DcID);
                        dc.SetAtrb(AttributeCodes.PASSED_VALIDATION, PassedValidation.Dirty);
                    }

                    if (savePacket.ValidateIds.Any() && !dcHasErrors && opDataElementType == OpDataElementType.WIP_DEAL)
                    {
                        // apply finalize save rules (things like major change checks)
                        dc.ApplyRules(MyRulesTrigger.OnFinalizeSave, null, myDealsData);
                    }
                }
            }

            return dataHasValidationErrors;
        }

        #endregion Validation

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

        #endregion Ensure

        public static OpMsgQueue UpGroupPricingTableRow(this MyDealsData myDealsData, ContractToken contractToken, IOpDataCollectorLib dataCollectorLib)
        {
            //   1) Get DC_ID
            //   2) Get all WIP with the parent of DC_ID
            //   3) For each deal
            //       1) Get Product
            //       2) Copy PTR matching deal
            //       3) Split JSON to be ONLY the product

            OpMsgQueue opMsgQueue = new OpMsgQueue();
            int newId = -100;
            Dictionary<int, int> childToParentIdMapping = new Dictionary<int, int>();
            Dictionary<int, int> childToOrigParentIdMapping = new Dictionary<int, int>();

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) || !myDealsData.ContainsKey(OpDataElementType.WIP_DEAL)) return opMsgQueue;

            List<OpDataCollector> allPtrs = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.ToList();
            List<OpDataCollector> allWips = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.ToList();

            OpDataElementTypeMapping elMapping = null;

            // look at each PTR seperately
            foreach (OpDataCollector dcPtr in allPtrs)
            {
                ProdMappings items = null;
                int ptrId = dcPtr.DcID;

                if (elMapping == null)
                {
                    string strObjSetType = dcPtr.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
                    OpDataElementSetType objSetType = OpDataElementSetTypeConverter.FromString(strObjSetType);
                    elMapping = objSetType.OpDataElementTypeParentMapping(OpDataElementType.WIP_DEAL);
                }

                if (elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
                {
                    string ptrJson = dcPtr.GetDataElementValue(AttributeCodes.PTR_SYS_PRD);

                    if (string.IsNullOrEmpty(ptrJson)) continue;

                    try
                    {
                        items = JsonConvert.DeserializeObject<ProdMappings>(ptrJson);
                    }
                    catch (Exception)
                    {
                        opMsgQueue.Messages.Add(new OpMsg
                        {
                            Message = $"Unable to parse Product Json for {ptrId}"
                        });
                        continue;
                    }
                }

                // find all children wip deals and start splitting PTR
                foreach (OpDataCollector dcWip in allWips.Where(w => w.DcParentID == ptrId))
                {
                    OpDataCollector dcSplit = dcPtr.Clone(newId);
                    childToParentIdMapping[dcWip.DcID] = newId--;
                    childToOrigParentIdMapping[dcWip.DcID] = dcWip.DcParentID;

                    string prodTitle = dcWip.GetDataElementValue(AttributeCodes.TITLE);
                    dcSplit.SetAtrb(AttributeCodes.PTR_USER_PRD, prodTitle);
                    dcSplit.GetDataElement(AttributeCodes.PTR_USER_PRD).State = OpDataElementState.Modified;

                    if (elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
                    {
                        var ttl = dcWip.GetDataElementValue(AttributeCodes.TITLE);
                        // manage products
                        if (items.ContainsKey(ttl))
                        {
                            List<ProdMapping> prdMappings = items[dcWip.GetDataElementValue(AttributeCodes.TITLE)].ToList();
                            string strPrdMappings = JsonConvert.SerializeObject(new Dictionary<string, List<ProdMapping>>
                            {
                                [prodTitle] = prdMappings
                            });
                            dcSplit.SetAtrb(AttributeCodes.PTR_SYS_PRD, strPrdMappings);
                        }
                        else
                        {
                            var foundIt = false;
                            foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                            {
                                List<ProdMapping> pMaps = kvp.Value.ToList();
                                foreach (ProdMapping item in pMaps)
                                {
                                    if (item.HIER_VAL_NM != ttl || foundIt) continue;

                                    string strPrdMappings = JsonConvert.SerializeObject(new Dictionary<string, List<ProdMapping>>
                                    {
                                        [prodTitle] = pMaps
                                    });
                                    dcSplit.SetAtrb(AttributeCodes.PTR_SYS_PRD, strPrdMappings);
                                    foundIt = true;
                                }
                            }
                        }
                    }

                    // manage Geos
                    string strGeos = dcWip.GetDataElementValue(AttributeCodes.GEO_COMBINED);
                    if (strGeos.IndexOf(',') >= 0) strGeos = "[" + strGeos + "]";
                    dcSplit.SetAtrb(AttributeCodes.GEO_COMBINED, strGeos);
                    dcSplit.SetModified(AttributeCodes.GEO_COMBINED);

                    myDealsData[OpDataElementType.PRC_TBL_ROW].Data.Add(dcSplit);
                }
            }

            myDealsData[OpDataElementType.PRC_TBL_ROW].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.PRC_TBL_ROW].GroupID = -101; // Whatever the real ID of this object is
            myDealsData[OpDataElementType.PRC_TBL_ROW].AddSaveActions();
            myDealsData.EnsureBatchIDs();
            var res = myDealsData.Save(contractToken);

            foreach (var actn in res[OpDataElementType.PRC_TBL_ROW].Actions)
            {
                if (actn.Action != "ID_CHANGE" || actn.DcID == null || actn.AltID == null) continue;
                int id = childToParentIdMapping.Where(c => c.Value == (int)actn.DcID).Select(c => c.Key).FirstOrDefault();
                childToParentIdMapping[id] = (int)actn.AltID;
            }

            // Now map the WIP parents to the new PTR numbers
            foreach (OpDataCollector dcPtr in allPtrs)
            {
                int ptrId = dcPtr.DcID;
                foreach (OpDataCollector dcWip in allWips.Where(w => w.DcParentID == ptrId))
                {
                    foreach (OpDataElement de in dcWip.DataElements)
                    {
                        de.DcParentID = childToParentIdMapping[dcWip.DcID];
                        de.State = OpDataElementState.Modified;
                    }
                    dcWip.DcParentID = childToParentIdMapping[dcWip.DcID];

                    if (elMapping != null && elMapping.TranslationType == OpTranslationType.OneDealPerProduct)
                    {
                        dcWip.SetAtrb(AttributeCodes.PTR_USER_PRD, dcWip.GetDataElementValue(AttributeCodes.TITLE));
                    }
                }
            }

            //myDealsData.Remove(OpDataElementType.PRC_TBL_ROW);
            myDealsData[OpDataElementType.WIP_DEAL].BatchID = Guid.NewGuid();
            myDealsData[OpDataElementType.WIP_DEAL].GroupID = -101; // Whatever the real ID of this object is
            myDealsData[OpDataElementType.WIP_DEAL].AddSaveActions();
            myDealsData[OpDataElementType.WIP_DEAL].AddParentIdActions(childToParentIdMapping);

            myDealsData[OpDataElementType.PRC_TBL_ROW].Data = new OpDataCollectorDict();
            myDealsData[OpDataElementType.PRC_TBL_ROW].Actions.Clear();
            myDealsData[OpDataElementType.PRC_TBL_ROW].AddDeleteActions(allPtrs.Select(x => x.DcID).ToList());

            myDealsData.EnsureBatchIDs();
            var res2 = myDealsData.Save(contractToken);

            foreach (KeyValuePair<int, int> kvp in childToParentIdMapping)
            {
                string usrPrdTitle = res2[OpDataElementType.WIP_DEAL].AllDataCollectors.Where(c => c.DcID == kvp.Key && c.DcParentID == kvp.Value).Select(c => c.GetDataElementValue(AttributeCodes.PTR_USER_PRD)).FirstOrDefault();

                opMsgQueue.Messages.Add(new OpMsg
                {
                    Message = $"Parent ID Changed from {childToOrigParentIdMapping[kvp.Key]} to {kvp.Value}",
                    MsgType = OpMsg.MessageType.Info,
                    ExtraDetails = usrPrdTitle,
                    KeyIdentifiers = new[] { kvp.Key, kvp.Value, childToOrigParentIdMapping[kvp.Key] }
                });
            }

            return opMsgQueue;
        }

        public static MyDealsData SavePacketsBase(this MyDealsData myDealsData, OpDataCollectorFlattenedDictList data, SavePacket savePacket)
        {
            OpLog.Log("SavePacketsBase - Start.");

            // Save Data Cycle: Point 9

            // How this should work:
            // Step 1 - get all of the related DEs for each object given a set of object levels (OpDataElementType) and IDs
            // Step 2 - For each OpDataElementType, Merge changes, then validate

            // RUN RULES HERE - If there are validation errors... stop... but we need to save the validation status
            MyDealsData myDealsDataWithErrors = null;
            bool hasErrors = myDealsData.ValidationApplyRules(savePacket);
            if (hasErrors)
            {
                // "Clone" to object...
                string json = JsonConvert.SerializeObject(myDealsData);
                myDealsDataWithErrors = JsonConvert.DeserializeObject<MyDealsData>(json);
            }

            // Note to self..  This does take order values into account.
            foreach (OpDataElementType opDataElementType in Enum.GetValues(typeof(OpDataElementType)))
            {
                if (!data.ContainsKey(opDataElementType) && !myDealsData.ContainsKey(opDataElementType)) continue;
                myDealsData.SavePacketByDictionary(data.ContainsKey(opDataElementType) ? data[opDataElementType] : null, opDataElementType, Guid.NewGuid(), savePacket.MyContractToken);
            }

            MyDealsData myDealsDataResults = myDealsData.PerformTasks(OpActionType.Save, savePacket.MyContractToken);  // execute all save perform task items now

            if (hasErrors) TransferActions(myDealsDataResults, myDealsDataWithErrors);

            OpLog.Log("SavePacketsBase - Complete.");
            return hasErrors ? myDealsDataWithErrors : myDealsDataResults;
        }

        private static void TransferActions(this MyDealsData myDealsDataResults, MyDealsData myDealsDataWithErrors)
        {
            foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in myDealsDataResults)
            {
                if (myDealsDataResults[kvp.Key].Actions == null || !myDealsDataResults[kvp.Key].Actions.Any()) continue;
                if (!myDealsDataWithErrors.ContainsKey(kvp.Key)) myDealsDataWithErrors[kvp.Key] = new OpDataPacket<OpDataElementType>();
                myDealsDataWithErrors[kvp.Key].Actions = myDealsDataResults[kvp.Key].Actions;
            }
        }

        public static OpMsgQueue GatherWipStages(this MyDealsData myDealsData, IOpDataCollectorLib dataCollectorLib, ContractToken contractToken, string setStage)
        {
            Dictionary<string, List<WfActnItem>> actnWIP = new Dictionary<string, List<WfActnItem>>
            {
                [setStage] = new List<WfActnItem>()
            };
            foreach (OpDataCollector dc in myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors)
            {
                actnWIP[setStage].Add(new WfActnItem
                {
                    DC_ID = dc.DcID,
                    WF_STG_CD = dc.GetDataElementValue(AttributeCodes.WF_STG_CD).ToString()
                });
            }

            return new PricingTablesLib(dataCollectorLib).ActionWipDeals(contractToken, actnWIP);
        }

        public static void SavePacketByDictionary(this MyDealsData myDealsData, OpDataCollectorFlattenedList data, OpDataElementType opDataElementType, Guid myWbBatchId, ContractToken contractToken)
        {
            // All save packet calls go through here.  This is the one point where we sift for changes.
            // Save Data Cycle: Point 10
            if (!myDealsData.ContainsKey(opDataElementType)) return;

            //myDealsData.Merge(opDataElementType, data);
            OpDataPacket<OpDataElementType> newPacket = myDealsData[opDataElementType].GetChanges(); // Goes through the collection and passes only changes after rules.

            newPacket.BatchID = myWbBatchId;
            newPacket.GroupID = -101; // Whatever the real ID of this object is
            newPacket.PacketType = opDataElementType; // Why wasn't this set in constructor??

            if (data != null) newPacket.AddDeleteActions(data);

            if (!(newPacket.Data.Any() || newPacket.Actions.Any())) return;

            // Back to normal operations, clear out the messages and all.
            //newPacket.Actions.RemoveAll(r => r.ActionDirection == OpActionDirection.Inbound);
            //newPacket.Messages.Messages.RemoveAll(r => true);

            // Tack on the save action call now
            newPacket.AddSaveActions(myDealsData[opDataElementType]);

            if (opDataElementType == contractToken.CopyFromObjType && contractToken.CopyFromId > 0)
            {
                newPacket.AddCopyActions(contractToken);
            }

            myDealsData[opDataElementType] = newPacket;
        }

        private static MyDealsData PerformTasks(this MyDealsData myDealsData, OpActionType? actionToRun, ContractToken contractToken)
        {
            OpLog.Log("PerformTasks - Start.");
            // Save Data Cycle: Point 14

            //return new MyDealsData();
            MyDealsData saveResponseSet = new MyDealsData();
            myDealsData.EnsureBatchIDs();

            switch (actionToRun)
            {
                case OpActionType.Save:
                    saveResponseSet = myDealsData.Save(contractToken);
                    // Save Data Cycle: Point 21 (END)
                    break;

                case OpActionType.SyncDeal:
                    ////        LimitRecords(myDealsData, new List<string> { "PREP2DEAL" }); // SYNCDEAL
                    ////        saveResponseSet = new DealDataLib().SaveDeals(myDealsData, OpUserStack.MyOpUserToken);
                    break;

                case OpActionType.Action:
                    ////        LimitRecords(myDealsData, new List<string> { "PREP2DEAL", "CALC_MSP", "GEN_TRACKER", "DEAL_ROLLBACK_TO_ACTIVE", "SNAPSHOT" }); // SYNCDEAL - DEAL_DELETE is not here, remove those elements since they might cause ghost deals
                    ////        saveResponseSet = new DealDataLib().SaveDeals(myDealsData, opUserToken);
                    break;
            }

            OpLog.Log("PerformTasks - Complete.");
            return saveResponseSet;
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
    }
}