using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        public static List<CustomerDivision> GetCustomerDivisions(this OpDataCollector dc)
        {
            string val = dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID);
            return string.IsNullOrEmpty(val) 
                ? new List<CustomerDivision>() 
                : new CustomerLib().GetCustomerDivisionsByCustNmId(Convert.ToInt32(val));
        }

        public static MyCustomersInformation GetMyCustomer(this OpDataCollector dc)
        {
            string val = dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID);
            return string.IsNullOrEmpty(val) 
                ? new MyCustomersInformation() 
                : new CustomerLib().GetMyCustomerNames().FirstOrDefault(c => c.CUST_SID == Convert.ToInt32(val));
        }

        /// <summary>
        /// Fill in the holes from the attribute template
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="opDataElementSetType"></param>
        /// <param name="applyDefaults">When adding the missing apptribute, should we assign the default values?</param>
        public static void FillInHolesFromAtrbTemplate(this OpDataCollector dc, OpDataElementSetType opDataElementSetType, bool applyDefaults = false)
        {
            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 1) stopwatch.Start();

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

            if (EN.GLOBAL.DEBUG >= 1)
            {
                Debug.WriteLine("{1:HH:mm:ss:fff}\t{0,10} (ms)\tFillInHolesFromAtrbTemplate Finished [{2} #{3}]", stopwatch.Elapsed.TotalMilliseconds, DateTime.Now, dc.DcType, dc.DcID);
            }
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
        public static OpMsgQueue MergeDictionary(this OpDataCollector dc, OpDataCollectorFlattenedItem items, bool needToCheckForDelete)
        {
            // Save Data Cycle: Point 4
            // Save Data Cycle: Point 12

            OpMsgQueue opMsgQueue = new OpMsgQueue();

            // Apply merge rules before overlaying the changes to the source in order to capture modification flags
            dc.ApplyRules(MyRulesTrigger.OnMerge, null, items);

            // for products, we will take the base dataelement and create new products that need to ba added to the
            List<OpDataElement> deProds = dc.DataElements.Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER).ToList();
            if (deProds.Any())
            {
                var incomingPrds = items.Where(p => p.Key.IndexOf(AttributeCodes.PRODUCT_FILTER) == 0).ToList();
                foreach (KeyValuePair<string, object> kvp in incomingPrds)
                {
                    OpDataElement deProd = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && d.AtrbCd + d.DimKeyString.AtrbCdDimKeySafe() == kvp.Key);
                    if (deProd == null)
                    {
                        int prdId = 0;
                        if (int.TryParse(kvp.Value.ToString(), out prdId))
                        {
                            OpDataElement deBaseProd = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER && (d.DimKey[7].ToString() == "7:1" || d.DimKey[7].ToString() == "7:" + deProds.First().AtrbValue));
                            if (deBaseProd != null)
                            {
                                OpDataElement newDe = deBaseProd.Clone();

                                newDe.SetDimKey("7:" + prdId + "/20:" + kvp.Key.Substring(kvp.Key.Length - 1));
                                newDe.AtrbKey = newDe.AtrbCd + "|" + newDe.DimKeyString;
                                newDe.AtrbValue = prdId;
                                newDe.State = OpDataElementState.Modified;

                                dc.DataElements.Add(newDe);
                            }
                        }
                    }
                }

                if (needToCheckForDelete) // If true - came from PTR, false is from deals tab
                {
                    // Delete existing products in DB that are not there in the incoming product list - VN
                    foreach (OpDataElement dePrd in deProds)
                    {
                        bool exists = incomingPrds.Exists(prd => prd.Key == dePrd.AtrbCd + dePrd.DimKeyString.AtrbCdDimKeySafe());
                        if (!exists && dePrd.AtrbValue.ToString() != string.Empty)
                        {
                            if (dc.HasTracker())
                            {
                                opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Error, EN.MESSAGES.CANNOT_MODIFY_PRODUCTS));
                                dc.Message.Messages.Add(new OpMsg(OpMsg.MessageType.Error, EN.MESSAGES.CANNOT_MODIFY_PRODUCTS));
                            }
                            else
                            {
                                dePrd.AtrbValue = string.Empty;
                            }
                        }
                    }
                }
            }

            foreach (OpDataElement de in dc.DataElements.Where(d => d.AtrbCd != AttributeCodes.PRODUCT_FILTER))
            {
                if (de.AtrbCd == AttributeCodes.WF_STG_CD) continue; // bail out if this is a stage

                string dimKey = de.DimKeyString;
                string uniqDimKey = dimKey.AtrbCdDimKeySafe();
                string uniqDimBaseKey = dimKey.DimKeySafe();

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
                                string atrbdate = string.IsNullOrEmpty(de.AtrbValue.ToString().Replace("Invalid date", "")) ? "" : DateTime.Parse(de.AtrbValue.ToString().Replace("Invalid date", "")).ToString("MM/dd/yyyy");
                                if (atrbdate != date.ToString("MM/dd/yyyy"))
                                    de.AtrbValue = DateTime.Parse(items[de.AtrbCd].ToString().Replace("Invalid date", "")).ToString("MM/dd/yyyy");
                            }
                        }
                    }
                    else
                    {
                        if (de.AtrbCd != AttributeCodes.BACK_DATE_RSN_TXT) // Prevent backdate reason needed from being flushed out.
                        {
                            de.AtrbValue = items[de.AtrbCd];
                            if (de.AtrbID <= 2 || de.AtrbCd == AttributeCodes.COST_TEST_RESULT || de.AtrbCd == AttributeCodes.MEETCOMP_TEST_RESULT)
                            {
                                de.State = OpDataElementState.Unchanged;
                            }
                        }
                    }
                }
                else if (items.ContainsKey(de.AtrbCd) && items[de.AtrbCd] != null)
                {
                    OpDataCollectorFlattenedItem dictValues = OpSerializeHelper.FromJsonString<OpDataCollectorFlattenedItem>(items[de.AtrbCd].ToString().Replace("\r", "").Replace("\n", "").Replace(" 12:00:00 AM", ""));
                    if (dictValues != null && dictValues.ContainsKey(uniqDimBaseKey))
                    {
                        if (dictValues.ContainsKey(uniqDimBaseKey))
                        {
                            if (de.DataType == "System.DateTime" &&
                                !String.IsNullOrEmpty(dictValues[uniqDimBaseKey].ToString().Replace("Invalid date", "")))
                                dictValues[uniqDimBaseKey] = DateTime.Parse(dictValues[uniqDimBaseKey].ToString().Replace("Invalid date", "")).ToString("MM/dd/yyyy");
                            de.AtrbValue = dictValues[uniqDimBaseKey];
                        }
                    }
                    else
                    {
                        opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Info, "Unable to locate attrb {0} ({1} : {2}) in deal {3}", de.AtrbCd.ToString(), de.AtrbID, dimKey, de.DcID));
                    }
                }
                else if (items.ContainsKey(de.AtrbCd + uniqDimKey) /*&& items[de.AtrbCd + uniqDimKey] != null*/) // NOTE: Commented out because in PT spreadsheet, if a user deletes a cell value of an existing product then the
                                                                                                                 // spreadsheet will turn the value to NULL. We need the user-nulled out value to exec the inside of the if condition
                                                                                                                 // to properly validate our DC rules against, else a user-cleared out value will validate against the old db value.
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
                    opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Info, "Unable to locate attrb {0} ({1} : {2}) in deal {3}", de.AtrbCd.ToString(), de.AtrbID, dimKey, de.DcID));
                }
            }

            // Now check for changes to see if the PASSED_VALIDATION flag needs to be reset
            IOpDataElement dePassValid = dc.GetDataElement(AttributeCodes.PASSED_VALIDATION);
            if (dePassValid != null && dc.ModifiedDataElements.Any(d => d.AtrbCd != AttributeCodes.PASSED_VALIDATION))
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
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            if (EN.GLOBAL.DEBUG >= 2) Debug.WriteLine("{1:HH:mm:ss:fff}\t ToOpDataCollectorFlattenedItem [{2} {0}] - Started", dc.DcID, DateTime.Now, dc.DcType);

            // Call all load triggered rules
            if (security)
            {
                dc.ApplyRules(MyRulesTrigger.OnLoad);
                if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t Rules OnLoad [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);
                if (opType == OpDataElementType.WIP_DEAL)
                {
                    dc.ApplyRules(MyRulesTrigger.OnValidate);
                    dc.ApplyRules(MyRulesTrigger.OnPostValidate);
                    if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t Rules OnValidate [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);
                }
            }
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t Rules [{1}]{0}", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            // Create the collection to return
            OpDataCollectorFlattenedItem objsetItem = new OpDataCollectorFlattenedItem();

            // Add DataElements to the Dictionary
            dc.DataElements.ForEach(de => objsetItem.ApplySingleAndMultiDim(de, dc, pivotMode));
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\tForEach [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            // After converting to dictionary, need to update the ids
            objsetItem.EnsureBasicIds(dc.DcID, dc.DcType, dc.DcParentID, dc.DcParentType);
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t EnsureBasicIds [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            // Don't forget about multi dimensional items
            objsetItem.MapMultiDim();
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t MapMultiDim [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            // Apply rules directly to dictionary
            if (security) dc.ApplyRules(MyRulesTrigger.OnOpCollectorConvert, null, objsetItem, dc.GetCustomerDivisions(), dc.GetMyCustomer());
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t ApplyRules [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            // assign all messages
            if (security) objsetItem.ApplyMessages(myDealsData);
            if (EN.GLOBAL.DEBUG >= 3) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t ApplyMessages [{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now);

            stopwatch.Stop();
            if (EN.GLOBAL.DEBUG >= 2) Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t ToOpDataCollectorFlattenedItem [{3} {1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now, dc.DcType);

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
            return dc.GetNextStage(actn, DataCollections.GetWorkFlowItems());
        }
    }
}