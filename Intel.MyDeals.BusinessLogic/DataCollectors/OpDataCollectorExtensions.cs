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
        public static MyDealsActionItem GetObjsetActions(this OpDataCollector dc)
        {
            return new MyDealsActionItem();
            ////OpUserToken opUserToken = OpUserStack.MyOpUserToken;
            ////string[] settings = { "C_UPDATE_DEAL", "C_VIEW_QUOTE_LETTER", "C_ADD_ATTACHMENTS", "C_VIEW_ATTACHMENTS", "CAN_VIEW_COST_TEST", "CAN_VIEW_MEET_COMP" };
            ////string[] actions = { "C_APPROVE", "C_CANCEL_DEAL", "C_REJECT_DEAL" };
            ////string[] kitException = { "E" }; // Mixed quotes are now in, so removed "M"

            //////bool isSuperSa = CommonLib.IsSuperSa(userToken.Usr);
            //////bool isSuper = CommonLib.IsSuperUser(userToken.Usr);
            ////bool isSuperSa = true;
            ////bool isSuper = true;

            ////CustomerDivision cust = dc.GetCustomerDivision();

            ////string stage = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
            ////string dealTypeSid = dc.GetDataElementValue(AttributeCodes.DEAL_TYPE_CD_SID);

            ////string dealType = DataCollections.GetAttributeData().MasterDataLookups
            ////    .Where(m => m.AtrbCd == AttributeCodes.DEAL_TYPE_CD_SID && m.AtrbItemId.ToString() == dealTypeSid)
            ////    .Select(m => m.AtrbItemValue).FirstOrDefault();

            ////MyDealsActionItem dealActionItem = new MyDealsActionItem
            ////{
            ////    ObjsetType = dealType,
            ////    Stage = stage,
            ////    Role = userToken.Role.RoleTypeCd
            ////};

            ////// load actions
            ////if (userToken.Role.RoleTypeCd != "SA" || isSuperSa)
            ////{
            ////    foreach (string action in actions)
            ////    {
            ////        if (cust != null && !cust.ACTV_IND)
            ////            dealActionItem.Actions[action] = false;
            ////        else
            ////        {
            ////            dealActionItem.Actions[action] = DataCollections.GetDealActions()
            ////                .Where(
            ////                    d => d.ObjsetType == dealType && d.Stage == stage && d.Role == userToken.Role.RoleTypeCd)
            ////                .Select(d => d.Actions[action])
            ////                .FirstOrDefault();
            ////        }
            ////    }
            ////}

            ////// load settings
            ////foreach (string setting in settings)
            ////{
            ////    if (setting == "C_VIEW_QUOTE_LETTER" && kitException.Contains(dc.GetDataElementValue(AttributeCodes.KIT_CHK)))
            ////    {
            ////        // Do NOT add the action
            ////    }
            ////    else if (setting == "C_UPDATE_DEAL" && userToken.Role.RoleTypeCd == "SA" && !isSuperSa)
            ////    {
            ////        dealActionItem.Settings[setting] = false;
            ////    }
            ////    else
            ////    {
            ////        dealActionItem.Settings[setting] = DataCollections.GetSecurityWrapper().ChkDealRules(dealType, userToken.Role.RoleTypeCd, stage, setting);
            ////    }
            ////}

            ////// && dc.CostTestLockCheck(userToken.Role.RoleTypeCd)
            ////if (dealActionItem.Actions.ContainsKey("C_APPROVE") && dealActionItem.Actions["C_APPROVE"])
            ////{
            ////    if (userToken.Role.RoleTypeCd != "GA" || !isSuper) // If this is a Super GA, don't override the value to false.
            ////    {
            ////        dealActionItem.Actions["C_APPROVE"] = false;
            ////    }
            ////}

            ////// Super GA can see cost test
            ////if (userToken.Role.RoleTypeCd == "GA" && isSuper)
            ////{
            ////    dealActionItem.Settings["CAN_VIEW_COST_TEST"] = true;
            ////}

            ////return dealActionItem;
        }

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

        public static OpDataCollector ApplyRules(this OpDataCollector dc, MyRulesTrigger ruleTriggerPoint, Dictionary<string, bool> securityActionCache = null)
        {
            // TODO add calls to rules here

            return dc;
        }

        public static void FillInHolesFromTemplate(this OpDataCollector dc, bool applyDefaults = false)
        {
            // Load Data Cycle: Point 2
            // Save Data Cycle: Point 7
            OpDataElementUITemplates templateSource = DataCollections.GetOpDataElementUITemplates();
            if (!templateSource.ContainsKey(dc.DcType))
            {
                OpMsg opMsg = new OpMsg()
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

            dc.FillInHolesFromTemplate(templateSource[dc.DcType], applyDefaults);
        }

        public static void FillInHolesFromTemplate(this OpDataCollector dc, OpDataElementUITemplate templateSource, bool applyDefaults = false)
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
                if (dimKey == "5000:1/5001:1/5002:1/5003:0/5004:0/5005:0/5006:0/5007:0") dimKey = "";

                if (String.IsNullOrEmpty(dimKey))
                {
                    if (items.ContainsKey(de.AtrbCd))
                    {
                        if (de.DataType == "System.DateTime" && items[de.AtrbCd] != null &&
                            !string.IsNullOrEmpty(items[de.AtrbCd].ToString().Replace("Invalid date", "")))
                            items[de.AtrbCd] = Convert.ToDateTime(items[de.AtrbCd]);

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

        public static OpDataCollectorFlattenedItem BuildObjSetForContainer(this OpDataCollector dc,
            OpDataElementType opType,
            ObjSetPivotMode pivotMode,
            AttributeCollection attrCol,
            Dictionary<int, string> prdMaps,
            MyDealsData myDealsData)
        {
            //dc.EnsureDcType(attrCol, opType);

            // TODO see if we can get rid of this
            ////dc.EnsureObjSetIdAtrb(attrCol);

            // get Template
            // TODO see if we can get rid of this
            //dc.FillInHolesFromTemplate();

            //get actions
            MyDealsActionItem objsetActionItem = dc.GetObjsetActions();

            // Call all load triggered rules
            dc.ApplyRules(MyRulesTrigger.OnLoad);

            OpDataCollectorFlattenedItem objsetItem = new OpDataCollectorFlattenedItem();

            // Customer
            CustomerDivision cust = dc.GetCustomerDivision();
            if (cust != null) objsetItem["Customer"] = cust;

            foreach (OpDataElement de in dc.DataElements)
            {
                objsetItem.ApplySingleAndMultiDim(cust, de, dc, pivotMode);
            }

            if (objsetItem.ContainsKey(EN.OBJDIM._MULTIDIM))
                objsetItem[EN.OBJDIM._MULTIDIM] = ((Dictionary<int, OpDataCollectorFlattenedItem>)objsetItem["_MultiDim"]).Values.ToList();

            objsetItem["DC_ID"] = dc.DcID;
            objsetItem["dc_type"] = dc.DcType;
            objsetItem["DC_PARENT_ID"] = dc.DcParentID;
            objsetItem["dc_parent_type"] = dc.DcParentType;

            // TODO Inject Rule Trigger here

            // TODO Make this a rule
            if (opType == OpDataElementType.PricingTable)
            {
            }

            // TODO Make this a rule
            if (opType == OpDataElementType.Deals)
            {
                // Check Security to see if user can view Cost Items
                bool canViewCostTest = objsetActionItem.Settings["CAN_VIEW_COST_TEST"];
                bool canViewMeetComp = objsetActionItem.Settings["CAN_VIEW_MEET_COMP"];

                bool hasFiles = dc.GetDataElementsWhere("HAS_FILE_ATTACHMENTS", d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
                string strNumTiers = dc.GetDataElementValue(AttributeCodes.NUM_OF_TIERS);

                string costTestDetails = ""; //TODO need to update this one -> dc.GetCostTestDetailJson(prdMaps, canViewCostTest);
                string displayDeal = dc.DisplayDealId();

                objsetItem["DealId"] = displayDeal;
                objsetItem["HasFiles"] = hasFiles;
                objsetItem["DealDetails"] = dc.GetDealDetailOneLine(displayDeal, cust);
                objsetItem["_actions"] = objsetActionItem.Actions;
                objsetItem["_settings"] = objsetActionItem.Settings;
                objsetItem["HasTracker"] = dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => !String.IsNullOrEmpty(d.AtrbValue.ToString())).Any();

                //Cost Test - override loaded values based on security
                objsetItem["CostTestDetails"] = costTestDetails;
            }

            objsetItem.ApplyMessages(myDealsData);

            return objsetItem;
        }

        public static string GetDealDetailOneLine(this OpDataCollector dc, string displayDeal, CustomerDivision cust)
        {
            return String.Format("{0} / {1} / {2} / {3} / {4} / {5}",
                displayDeal,
                dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD),
                dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD),
                dc.GetDataElementValue(AttributeCodes.START_DT),
                dc.GetDataElementValue(AttributeCodes.END_DT),
                cust.CUST_DIV_NM
                );
        }

        public static OpDataCollectorFlattenedItem BuildDealForContainer(
            this OpDataCollector dc,
            AttributeCollection attrCol,
            Dictionary<int, string> prdMaps,
            MyDealsData myDealsData,
            Dictionary<string, bool> securityActionCache = null)
        {
            //dc.EnsureDcType(attrCol);
            dc.EnsureObjSetIdAtrb(attrCol);
            dc.FillInHolesFromTemplate();

            ////dc.ApplyRulesOnLoad(dc.DcType, OpUserStack.MyOpUserToken.Role, securityActionCache);

            //get actions
            MyDealsActionItem dealActionItem = dc.GetObjsetActions();
            // Check Security to see if user can view Cost Items
            bool canViewCostTest = dealActionItem.Settings["CAN_VIEW_COST_TEST"];
            bool canViewMeetComp = dealActionItem.Settings["CAN_VIEW_MEET_COMP"];

            string costTestDetails = ""; //TODO need to update this one -> dc.GetCostTestDetailJson(prdMaps, canViewCostTest);

            string displayDeal = dc.DisplayDealId();

            // Custom
            CustomerDivision cust = dc.GetCustomerDivision();
            bool forceReadOnly = !cust.ACTV_IND;

            OpDataCollectorFlattenedItem dealItem = dc.DataElements.Flattened();

            dealItem["DEAL_SID"] = dc.DcID;
            dealItem["DealId"] = displayDeal;
            dealItem["CUSTOMER"] = cust;
            dealItem["HasFiles"] = dc.GetDataElementsWhere("HAS_FILE_ATTACHMENTS", d => !String.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
            dealItem["DealDetails"] = dc.GetDealDetailOneLine(displayDeal, cust);
            dealItem["_actions"] = dealActionItem.Actions;
            dealItem["_settings"] = dealActionItem.Settings;
            dealItem["HasTracker"] = dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => !String.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
            dealItem["CostTestDetails"] = costTestDetails;

            dealItem["_readonly"] = dc.DataElements.Where(d => d.IsReadOnly || forceReadOnly).Select(d => d.AtrbCd).Distinct().OrderBy(d => d);
            dealItem["_required"] = dc.DataElements.Where(d => d.IsRequired).Select(d => d.AtrbCd).Distinct().OrderBy(d => d);
            dealItem["_hidden"] = dc.DataElements.Where(d => d.IsHidden).Select(d => d.AtrbCd).Distinct().OrderBy(d => d);

            dealItem.ApplyMessages(myDealsData);

            return dealItem;
        }

        public static string DisplayDealId(this OpDataCollector dc)
        {
            return DealHelperFunctions.DisplayDealId(dc.DcParentID, dc.DcID);
        }
    }
}