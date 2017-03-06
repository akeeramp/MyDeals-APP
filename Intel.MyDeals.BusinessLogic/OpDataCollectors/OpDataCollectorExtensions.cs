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
        //public static MyDealsActionItem GetObjsetActions(this OpDataCollector dc)
        //{
        //    //return new MyDealsActionItem();
        //    OpUserToken opUserToken = OpUserStack.MyOpUserToken;
        //    List<string> settings = new List<string>();
        //    List<string> actions = new List<string>();

        //    if (dc.DcType == OpDataElementType.WipDeals.ToString() || dc.DcType == OpDataElementType.Deals.ToString())
        //    {
        //        settings = new List<string> { "C_UPDATE_DEAL", "C_VIEW_QUOTE_LETTER", "C_ADD_ATTACHMENTS", "C_VIEW_ATTACHMENTS", "CAN_VIEW_COST_TEST", "CAN_VIEW_MEET_COMP" };
        //        actions = new List<string> { "C_APPROVE", "C_CANCEL_DEAL", "C_REJECT_DEAL" };
        //    }
        //    else if (dc.DcType == OpDataElementType.Contract.ToString() || dc.DcType == OpDataElementType.PricingStrategy.ToString() || dc.DcType == OpDataElementType.PricingTable.ToString())
        //    {
        //        settings = new List<string> { "C_UPDATE_DEAL" };
        //        actions = new List<string> { "C_APPROVE", "C_CANCEL_DEAL", "C_REJECT_DEAL" };
        //    }

        //    bool isSuperSa = opUserToken.IsSuperSa();
        //    bool isSuper = opUserToken.IsSuper();

        //    CustomerDivision cust = dc.GetCustomerDivision();

        //    string stage = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
        //    string objSetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
        //    OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);
        //    OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

        //    MyDealsActionItem dealActionItem = new MyDealsActionItem
        //    {
        //        ObjsetType = objSetType,
        //        Stage = stage,
        //        Role = opUserToken.Role.RoleTypeCd
        //    };

        //    // load actions
        //    if (opUserToken.Role.RoleTypeCd != RoleTypes.SA || isSuperSa)
        //    {
        //        foreach (string action in actions)
        //        {
        //            if (cust != null && !cust.ACTV_IND)
        //                dealActionItem.Actions[action] = false;
        //            else
        //            {
        //                dealActionItem.Actions[action] = DataCollections.GetDealActions()
        //                    .Where(d => d.ObjsetType == objSetType && d.Stage == stage && d.Role == opUserToken.Role.RoleTypeCd)
        //                    .Select(d => d.Actions[action])
        //                    .FirstOrDefault();
        //            }
        //        }
        //    }

        //    // load settings
        //    foreach (string setting in settings)
        //    {
        //        dealActionItem.Settings[setting] = DataCollections.GetSecurityWrapper()
        //            .ChkDealRules(opDataElementType, opDataElementSetType, opUserToken.Role.RoleTypeCd, stage, setting);
        //    }

        //    return dealActionItem;
        //}

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

        public static void FillInHolesFromAtrbTemplate(this OpDataCollector dc, bool applyDefaults = false)
        {
            // Load Data Cycle: Point 2
            // Save Data Cycle: Point 7
            OpDataElementUITemplates templateSource = DataCollections.GetOpDataElementUiTemplates();
            if (!templateSource.ContainsKey(dc.DcType))
            {
                OpMsg opMsg = new OpMsg
                {
                    Message = "Missing Deal Type",
                    MsgType = OpMsg.MessageType.Warning, //Not sure about this warning or error ?
                    KeyIdentifiers = new[] { dc.DcID, dc.DcParentID }
                };

                // no deal type ... might be an orphan deal
                var opMsgQueue = new OpMsgQueue { Messages = new List<OpMsg>() };
                opMsgQueue.Messages.Add(opMsg);

                dc.Message = opMsgQueue;

                return;
            }

            dc.FillInHolesFromAtrbTemplate(templateSource[dc.DcType], applyDefaults);
        }

        public static void FillInHolesFromAtrbTemplate(this OpDataCollector dc, OpDataElementUITemplate templateSource, bool applyDefaults = false)
        {
            // Load Data Cycle: Point 4
            // Save Data Cycle: Point 8
            List<string> foundItems = dc.DataElements.Select(d => d.GetFullKeyWithRegNoExtras(new Regex(@"5000:[0-9]*/"), "5000:-99999/")).ToList();
            IEnumerable<OpDataElementUI> missingItems = templateSource.Where(d => !foundItems.Contains(new Regex("5000:[0-9]*/").Replace(d.GetFullKeyNoExtras(), "5000:-99999/")));

            // items in the template that are missing
            foreach (OpDataElementUI deUi in missingItems)
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
                newDe.OrigAtrbValue = String.Empty;
                newDe.PrevAtrbValue = String.Empty;

                dc.DataElements.Add(newDe);
            }

            // remove items from the source that do not exist in the template -> need to prevent bringing in unsupported items
            IEnumerable<string> allTemplateCds = templateSource.Select(t => t.AtrbCd).Distinct();
            dc.DataElements.RemoveAll(d => !allTemplateCds.Contains(d.AtrbCd));
        }

        public static OpMsgQueue MergeDictionary(this OpDataCollector dc, OpDataCollectorFlattenedItem items)
        {
            // Save Data Cycle: Point 4
            // Save Data Cycle: Point 12

            OpMsgQueue opMsgQueue = new OpMsgQueue();

            foreach (OpDataElement de in dc.DataElements)
            {
                string dimKey = de.DimKeyString;

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
                            de.AtrbValue = items[de.AtrbCd];
                        }
                    }
                    else
                    {
                        de.AtrbValue = items[de.AtrbCd];
                    }
                }
                else if (items.ContainsKey(de.AtrbCd))
                {
                    OpDataCollectorFlattenedItem dictValues = OpSerializeHelper.FromJsonString<OpDataCollectorFlattenedItem>(items[de.AtrbCd].ToString());
                    if (dictValues.ContainsKey(dimKey))
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
                else
                {
                    opMsgQueue.Messages.Add(new OpMsg(OpMsg.MessageType.Warning, "Unable to locate attrb ({0}) in deal {1}", dimKey, de.DcID));
                }
            }

            return opMsgQueue;
        }

        public static OpDataCollectorFlattenedItem ToOpDataCollectorFlattenedItem(this OpDataCollector dc,
            OpDataElementType opType,
            ObjSetPivotMode pivotMode,
            Dictionary<int, string> prdMaps,
            MyDealsData myDealsData)
        {

            // Create the collection to return
            OpDataCollectorFlattenedItem objsetItem = new OpDataCollectorFlattenedItem();

            // Call all load triggered rules
            dc.ApplyRules(MyRulesTrigger.OnLoad);

            // Customer
            CustomerDivision cust = dc.GetCustomerDivision();
            if (cust != null) objsetItem["Customer"] = cust;

            // Add DataElements to the Dictionary
            dc.DataElements.ForEach(de => objsetItem.ApplySingleAndMultiDim(de, dc, pivotMode));

            // After converting to dictionary, need to update the ids
            objsetItem.EnsureBasicIds(dc.DcID, dc.DcType, dc.DcParentID, dc.DcParentType);

            // Don't forget about multi dimensional items
            if (objsetItem.ContainsKey(EN.OBJDIM._MULTIDIM))
                objsetItem[EN.OBJDIM._MULTIDIM] = ((Dictionary<int, OpDataCollectorFlattenedItem>)objsetItem["_MultiDim"]).Values.ToList();

            // Apply rules directly to dictionary
            dc.ApplyRules(MyRulesTrigger.OnOpCollectorConvert, null, objsetItem);

            objsetItem.ApplyMessages(myDealsData);

            return objsetItem;
        }

        public static string GetDealDetailOneLine(this OpDataCollector dc, string displayDeal, CustomerDivision cust)
        {
            return string.Format("{0} / {1} / {2} / {3} / {4} / {5}",
                displayDeal,
                dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD),
                dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD),
                dc.GetDataElementValue(AttributeCodes.START_DT),
                dc.GetDataElementValue(AttributeCodes.END_DT),
                cust.CUST_DIV_NM
                );
        }

        public static string DisplayDealId(this OpDataCollector dc)
        {
            return dc.DcID.ToString();
        }
    }
}