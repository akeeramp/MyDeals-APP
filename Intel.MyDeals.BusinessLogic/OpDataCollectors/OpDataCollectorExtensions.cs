using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataCollectorExtensions
    {

        /// <summary>
        /// Get the customer division based on the customer defined in the data collector
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <returns></returns>
        public static CustomerDivision GetCustomerDivision(this OpDataCollector dc)
        {
            string val = dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID);
            if (string.IsNullOrEmpty(val))
            {
                // TODO throw an error
                val = "0";
            }
            return new CustomerLib().GetCustomerDivision(Convert.ToInt32(val));
        }

        /// <summary>
        /// Fill in the holes from the attribute template
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="opDataElementSetType"></param>
        /// <param name="applyDefaults">When adding the missing apptribute, should we assign the default values?</param>
        public static void FillInHolesFromAtrbTemplate(this OpDataCollector dc, OpDataElementSetType opDataElementSetType, bool applyDefaults = false)
        {
            // Load Data Cycle: Point 2
            // Save Data Cycle: Point 7
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);
            if (opDataElementSetType == OpDataElementSetType.Unknown)
                opDataElementSetType = OpDataElementSetTypeConverter.FromString(dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

            OpDataElementAtrbTemplate template = OpDataElementUiExtensions.GetAtrbTemplate(opDataElementType, opDataElementSetType);

            if (!template.Any())
            {
                OpMsg opMsg = new OpMsg
                {
                    Message = $"Missing ObjSet ({opDataElementType}) or ObjSetType ({opDataElementSetType})",
                    MsgType = OpMsg.MessageType.Warning, //Not sure about this warning or error ?
                    KeyIdentifiers = new[] { dc.DcID, dc.DcParentID }
                };

                // no deal type ... might be an orphan deal
                var opMsgQueue = new OpMsgQueue { Messages = new List<OpMsg>() };
                opMsgQueue.Messages.Add(opMsg);

                dc.Message = opMsgQueue;

                return;
            }

            dc.FillInHolesFromAtrbTemplate(template, applyDefaults);
        }


        /// <summary>
        /// Fill in the holes from the attribute template
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="templateSource">Attribute template collection</param>
        /// <param name="applyDefaults">When adding the missing apptribute, should we assign the default values?</param>
        public static void FillInHolesFromAtrbTemplate(this OpDataCollector dc, OpDataElementAtrbTemplate templateSource, bool applyDefaults = false)
        {
            // Load Data Cycle: Point 4
            // Save Data Cycle: Point 8
            List<string> foundItems = dc.DataElements.Select(d => d.GetFullKeyWithRegNoExtras(new Regex(@"7:[0-9]*/"), "7:-99999/")).ToList(); // Product Dimension moved from 5000: to 7:
            IEnumerable<OpDataElement> missingItems = templateSource.Where(d => !foundItems.Contains(new Regex("7:[0-9]*/").Replace(d.GetFullKeyNoExtras(), "7:-99999/")));

            // items in the template that are missing
            foreach (OpDataElement deUi in missingItems)
            {
                OpDataElement newDe = deUi.Clone();
                newDe.DcID = dc.DcID;
                newDe.DcParentID = dc.DcParentID;
                newDe.DcType = OpDataElementTypeConverter.StringToId(dc.DcType);
                newDe.DcParentType = OpDataElementTypeConverter.StringToId(dc.DcParentType);

                // if the template has a value... then it is a default value.  Apply it if necessary
                if (applyDefaults && deUi.AtrbValue != null && deUi.AtrbValue.ToString() != "")
                {
                    newDe.AtrbValue = deUi.AtrbValue;
                    newDe.State = OpDataElementState.Modified;
                }
                else
                {
                    newDe.AtrbValue = "";
                    newDe.State = OpDataElementState.Unchanged;
                }
                newDe.OrigAtrbValue = string.Empty;
                newDe.PrevAtrbValue = string.Empty;

                dc.DataElements.Add(newDe);
            }

            // remove items from the source that do not exist in the template -> need to prevent bringing in unsupported items
            IEnumerable<string> allTemplateCds = templateSource.Select(t => t.AtrbCd).Distinct();
            dc.DataElements.RemoveAll(d => !allTemplateCds.Contains(d.AtrbCd));
        }

        /// <summary>
        /// Merge OpDataCollector Flattened Items into the OpDataCollector dictionary
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="items">Flattened Items to merge into dictionary</param>
        /// <returns></returns>
        public static OpMsgQueue MergeDictionary(this OpDataCollector dc, OpDataCollectorFlattenedItem items)
        {
            // Save Data Cycle: Point 4
            // Save Data Cycle: Point 12

            OpMsgQueue opMsgQueue = new OpMsgQueue();

            // Apply merge rules before overlaying the changes to the source in order to capture modification flags
            dc.ApplyRules(MyRulesTrigger.OnMerge, null, items);

            foreach (OpDataElement de in dc.DataElements)
            {
                string dimKey = de.DimKeyString;
                string uniqDimKey = dimKey.AtrbCdDimKeySafe();

                if (string.IsNullOrEmpty(dimKey))
                {
                    if (!items.ContainsKey(de.AtrbCd)) continue;

                    if (de.DataType == "System.DateTime" && items[de.AtrbCd] != null &&
                        !string.IsNullOrEmpty(items[de.AtrbCd].ToString().Replace("Invalid date", "")))
                    {
                        DateTime date = Convert.ToDateTime(items[de.AtrbCd]);
                        items[de.AtrbCd] = date;
                        if (date.Year < 2000)
                        {
                            de.State = OpDataElementState.Deleted;
                        }
                        else
                        {
                            if (de.AtrbValue == null)
                            {
                                de.AtrbValue = items[de.AtrbCd];
                            }
                            else
                            {
                                string atrbdate = string.IsNullOrEmpty(de.AtrbValue.ToString()) ? "" : DateTime.Parse(de.AtrbValue.ToString()).ToString("MM/dd/yyyy");
                                if (atrbdate != date.ToString("MM/dd/yyyy"))
                                    de.AtrbValue = items[de.AtrbCd];

                            }
                        }
                    }
                    else
                    {
                        de.AtrbValue = items[de.AtrbCd];
                        if (de.AtrbID <= 2) de.State = OpDataElementState.Unchanged;
                    }
                }
                else if (items.ContainsKey(de.AtrbCd) && items[de.AtrbCd] != null)
                {
                    OpDataCollectorFlattenedItem dictValues = OpSerializeHelper.FromJsonString<OpDataCollectorFlattenedItem>(items[de.AtrbCd].ToString());
                    if (dictValues != null && dictValues.ContainsKey(dimKey))
                    {
                        if (dictValues.ContainsKey(dimKey))
                        {
                            if (de.DataType == "System.DateTime" &&
                                !String.IsNullOrEmpty(dictValues[dimKey].ToString().Replace("Invalid date", "")))
                                dictValues[dimKey] = Convert.ToDateTime(dictValues[dimKey]);
                            de.AtrbValue = dictValues[dimKey];
                        }
                    }
                    else
                    {
                        opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Warning, "Unable to locate attrb ({0}) in deal {1}", dimKey, de.DcID));
                    }
                }
                else if (items.ContainsKey(de.AtrbCd + uniqDimKey) && items[de.AtrbCd + uniqDimKey] != null)
                {
                    //OpDataCollectorFlattenedItem dictValues = OpSerializeHelper.FromJsonString<OpDataCollectorFlattenedItem>(items[de.AtrbCd].ToString());

                    if (de.DimKeyString == dimKey)
                    {
                        de.AtrbValue = items[de.AtrbCd + uniqDimKey];
                    }



                    //if (dictValues.ContainsKey(dimKey))
                    //{
                    //    if (dictValues.ContainsKey(dimKey))
                    //    {
                    //        if (de.DataType == "System.DateTime" &&
                    //            !String.IsNullOrEmpty(dictValues[dimKey].ToString().Replace("Invalid date", "")))
                    //            dictValues[dimKey] = Convert.ToDateTime(dictValues[dimKey]);
                    //        de.AtrbValue = dictValues[dimKey];
                    //    }
                    //}
                    //else
                    //{
                    //    opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Warning, "Unable to locate attrb ({0}) in deal {1}", dimKey, de.DcID));
                    //}
                }
                else
                {
                    opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Warning, "Unable to locate attrb ({0}) in deal {1}", dimKey, de.DcID));
                }
            }

            // Now check for changes to see if the PASSED_VALIDATION flag needs to be reset
            IOpDataElement dePassValid = dc.GetDataElement(AttributeCodes.PASSED_VALIDATION);
            if (dePassValid != null && dc.ModifiedDataElements.Any())
            {
                dePassValid.AtrbValue = PassedValidation.Dirty;
            }

            return opMsgQueue;
        }

        /// <summary>
        /// Convert the OpDataCollector into a Flattened structure
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="opType">OpDataElementType</param>
        /// <param name="pivotMode">Mode to pivote data: ex. Pivoted, Nested</param>
        /// <param name="prdMaps">Product Mapping collection</param>
        /// <param name="myDealsData">MyDealsData source</param>
        /// <param name="security"></param>
        /// <returns></returns>
        public static OpDataCollectorFlattenedItem ToOpDataCollectorFlattenedItem(this OpDataCollector dc,
            OpDataElementType opType,
            ObjSetPivotMode pivotMode,
            Dictionary<int, string> prdMaps,
            MyDealsData myDealsData,
            bool security = true)
        {

            // Call all load triggered rules
            if (security) dc.ApplyRules(MyRulesTrigger.OnLoad);

            // Create the collection to return
            OpDataCollectorFlattenedItem objsetItem = new OpDataCollectorFlattenedItem();

            // Add DataElements to the Dictionary
            dc.DataElements.ForEach(de => objsetItem.ApplySingleAndMultiDim(de, dc, pivotMode));

            // After converting to dictionary, need to update the ids
            objsetItem.EnsureBasicIds(dc.DcID, dc.DcType, dc.DcParentID, dc.DcParentType);

            // Don't forget about multi dimensional items
            objsetItem.MapMultiDim();

            // Apply rules directly to dictionary
            if (security) dc.ApplyRules(MyRulesTrigger.OnOpCollectorConvert, null, objsetItem, dc.GetCustomerDivision());

            // assign all messages
            if (security) objsetItem.ApplyMessages(myDealsData);

            return objsetItem;
        }

        /// <summary>
        /// UI safe way of displaying the DataCollector Number
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <returns></returns>
        public static string DisplayDealId(this OpDataCollector dc)
        {
            return dc.DcID.ToString();
        }

        public static string GetNextStage(this OpDataCollector dc, string actn)
        {
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            string stage = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string objSetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);

            // load actions
            return DataCollections.GetWorkFlowItems()
                .Where(w =>
                w.WF_NM == "General WF" &&
                w.OBJ_TYPE == opDataElementType.ToDesc() &&
                w.OBJ_SET_TYPE_CD == objSetType &&
                w.WFSTG_CD_SRC == stage &&
                w.WFSTG_ACTN_NM == actn &&
                w.ROLE_TIER_NM == opUserToken.Role.RoleTier)
                .Select(w => w.WFSTG_CD_DEST).FirstOrDefault();
        }
    }
}