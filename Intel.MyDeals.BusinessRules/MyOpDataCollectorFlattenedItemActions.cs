using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// Place all MyDeals specific actions here.  
    /// Most of the actions used will come from BusinessLogicDcActions
    /// This class will let you define MyDeals specific actions that might need to be performed
    /// </summary>
    public static partial class MyOpDataCollectorFlattenedItemActions
    {
        //TWC5971-658: As part of this story,
        //defined failure messages for PCT and MCT in Variable.
        //If you're making any changes to these messages, please make sure SKIP_PCT_MCT_Failure messages are also working as expected.
        public static string PCTAndMCTFailMsg = "Pricing Strategy did not pass Price Cost Test and Meet Comp Test.";
        public static string PCTFailMsg = "Pricing Strategy did not pass Price Cost Test.";
        public static string MCTFailMsg = "Pricing Strategy did not pass Meet Comp Test.";
        public static string CAPMissingMsg = "CAP missing from at least one of the deals in this Pricing Strategy.";
        public static void ApplyActionsAndSettings(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;
            OpDataCollectorFlattenedItem objsetItem = r.ExtraArgs[0] as OpDataCollectorFlattenedItem ?? new OpDataCollectorFlattenedItem();

            //return new MyDealsActionItem();
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            bool isSuper = opUserToken.IsSuper();

            string stage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string objSetType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));
            string passedValidation = r.Dc.GetDataElementValue(AttributeCodes.PASSED_VALIDATION);
            string pct = r.Dc.GetDataElementValue(AttributeCodes.COST_TEST_RESULT);
            string mct = r.Dc.GetDataElementValue(AttributeCodes.MEETCOMP_TEST_RESULT);
            bool mctMissing = r.Dc.GetDataElementValue(AttributeCodes.COMP_MISSING_FLG) == "1";
            bool hasL1 = r.Dc.GetDataElementValue(AttributeCodes.HAS_L1) != "0";
            bool hasL2 = r.Dc.GetDataElementValue(AttributeCodes.HAS_L2) != "0";
            bool missingCap = r.Dc.GetDataElementValue(AttributeCodes.CAP_MISSING_FLG) == "1";
            string role = opUserToken.Role.RoleTypeCd;
            bool pctFailed = pct != "Pass" && pct != "NA";
            bool mctFailed = mct != "Pass" && mct != "NA";
            bool mctIncomplete = mct == "InComplete";
            bool mctNotRun = mct == "Not Run Yet" || mct == "";
            
            MyDealsActionItem objsetActionItem = new MyDealsActionItem
            {
                ObjsetType = objSetType,
                Stage = stage,
                Role = opUserToken.Role.RoleTypeCd
            };

            // load settings
            List<string> possibleSettings = new List<string>
            {
                SecurityActns.C_DEL_PRICING_STRATEGY,
                SecurityActns.C_ADD_PRICING_TABLE,
                SecurityActns.C_DEL_PRICING_TABLE,
                SecurityActns.C_VIEW_QUOTE_LETTER,
                SecurityActns.C_VIEW_ATTACHMENTS,
                SecurityActns.C_ADD_ATTACHMENTS,
                SecurityActns.C_DELETE_ATTACHMENTS,
                SecurityActns.C_EDIT_PRODUCT,
                SecurityActns.CAN_VIEW_COST_TEST,
                SecurityActns.CAN_VIEW_MEET_COMP,
                SecurityActns.C_EDIT_COST_TEST,
                SecurityActns.C_EDIT_MEET_COMP,
                SecurityActns.C_APPROVE,
                SecurityActns.C_REVISE_DEAL,
                SecurityActns.C_CANCEL_DEAL
            };
            foreach (string setting in possibleSettings)
            {
                objsetActionItem.Settings[setting] = DataCollections.GetSecurityWrapper()
                    .ChkDealRules(opDataElementType, opDataElementSetType, stage, setting);
            }

            // load actions
            List<string> actions = DataCollections.GetWorkFlowItems()
                .Where(w =>
                w.WF_NM == "General WF" &&
                (w.OBJ_TYPE == opDataElementType.ToDesc() || w.OBJ_TYPE == "ALL_TYPES" || w.OBJ_TYPE == "ALL OBJECT TYPES") &&
                (w.OBJ_SET_TYPE_CD == objSetType || w.OBJ_SET_TYPE_CD == "ALL_TYPES") &&
                w.WFSTG_CD_SRC == stage &&
                w.ROLE_TIER_NM == opUserToken.Role.RoleTier).Select(w => w.WFSTG_ACTN_NM).ToList();

            List<string> possibleActions = new List<string>();
            if (objsetActionItem.Settings[SecurityActns.C_APPROVE]) possibleActions.Add("Approve");
            if (objsetActionItem.Settings[SecurityActns.C_REVISE_DEAL]) possibleActions.Add("Revise");
            if (objsetActionItem.Settings[SecurityActns.C_CANCEL_DEAL]) possibleActions.Add("Cancel");
            possibleActions.Add("Hold");

            //Complex Stacking - Added Actions
            string isCmplxStkgRvwd = r.Dc.GetDataElementValue(AttributeCodes.IS_CS_GRP_REVIEWED);
            if (r.Dc.DcType == "PRC_ST")
            {
                actions.Add("ComplexStacking");
                possibleActions.Add("ComplexStacking");
            }

            foreach (string action in actions.Where(a => possibleActions.Contains(a)))
            {
                objsetActionItem.Actions[action] = true;

                if (opDataElementType != OpDataElementType.PRC_ST) continue;

                if ((action == "Approve") && passedValidation != PassedValidation.Complete.ToString())
                {
                    objsetActionItem.Actions[action] = false;
                    objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                        ? objsetActionItem.ActionReasons[action] += "\nPricing Strategy did not pass validation."
                        : "Pricing Strategy did not pass validation.";
                }

                if (action == "Approve" && mctMissing && stage != WorkFlowStages.Draft)
                {
                    objsetActionItem.Actions[action] = false;
                    objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                        ? objsetActionItem.ActionReasons[action] += "\nMeet Comp Data is missing.  Please go to the Meet Comp Screen to populate missing data."
                        : "Meet Comp Data is missing.  Please go to the Meet Comp Screen to populate missing data.";
                }

                if (action == "Approve" && missingCap && stage == WorkFlowStages.Submitted)
                {
                    objsetActionItem.Actions[action] = false;
                    objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                        ? objsetActionItem.ActionReasons[action] += "\nCAP missing from at least one of the deals in this Pricing Strategy."
                        : "CAP missing from at least one of the deals in this Pricing Strategy.";
                }


                if (action == "Approve" && objsetActionItem.Actions[action] && hasL1)
                {
                    string reasonPctMct = (pctFailed && mctFailed) ? PCTAndMCTFailMsg : pctFailed ? PCTFailMsg : mctFailed ? MCTFailMsg: "";

                    switch (role)
                    {
                        case RoleTypes.SA:
                        case RoleTypes.DA:
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                            {
                                objsetActionItem.Actions[action] = false;
                                objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                                    ? objsetActionItem.ActionReasons[action] += "\n" + reasonPctMct
                                    : reasonPctMct;
                            }
                            break;
                        case RoleTypes.GA:
                            // Per Meera and Vas... Allow GA to approve deals even if failing MCT by incomplete or fail... only stop for Not Run Yet
                            if (stage == WorkFlowStages.Requested && mctFailed && mctNotRun)
                            {
                                objsetActionItem.Actions[action] = false;
                                objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                                    ? objsetActionItem.ActionReasons[action] += "\n" + reasonPctMct
                                    : reasonPctMct;
                            }
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                            {
                                objsetActionItem.Actions[action] = false;
                                objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                                    ? objsetActionItem.ActionReasons[action] += "\n" + reasonPctMct
                                    : reasonPctMct;
                            }
                            break;
                        case RoleTypes.FSE:
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                            {
                                objsetActionItem.Actions[action] = false;
                                objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                                    ? objsetActionItem.ActionReasons[action] += "\n" + reasonPctMct
                                    : reasonPctMct;
                            }
                            break;
                    }
                }

                //Complex Stacking
                if (r.Dc.DcType == "PRC_ST" && action == "ComplexStacking")
                {
                    if (isCmplxStkgRvwd == "2" || isCmplxStkgRvwd == "1")
                    {
                        objsetActionItem.Actions[action] = true;
                        if (isCmplxStkgRvwd == "1" && role == RoleTypes.DA)
                        {
                            objsetActionItem.Actions[action] = false;
                            objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                            ? objsetActionItem.ActionReasons[action] += "\nComplex Stacking must be reviewed."
                            : "Complex Stacking must be reviewed.";
                        }
                    }
                    else
                    {
                        objsetActionItem.Actions[action] = false;
                        objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                            ? objsetActionItem.ActionReasons[action] += "\nComplex Stacking must be reviewed."
                            : "Complex Stacking must be reviewed.";
                    }
                }

                //Skipping PCT/MCT Failure and Incomplete for DA based on Constant Value
                string IS_PCT_MCT_FAILURE_SKIPPED = r.Dc.GetDataElementValue(AttributeCodes.IS_PCT_MCT_FAILURE_SKIPPED);
                if (role == RoleTypes.DA && r.Dc.DcType == "PRC_ST" && action == "Approve"
                    && !objsetActionItem.Actions["Approve"] && IS_PCT_MCT_FAILURE_SKIPPED == "1")
                {
                    bool skipPCT = false;
                    bool skipMCT = false;
                    var _constantLookupDataLib = new ConstantLookupDataLib();
                    var adminConstants = _constantLookupDataLib.GetAdminConstants();
                    var actionReasonStr = objsetActionItem.ActionReasons["Approve"];

                    // Check if skipping PCT or MCT is enabled in constants
                    var enablePctRun = adminConstants.FirstOrDefault(c => c.CNST_NM == "SKIP_PCT_FAILURE" && c.CNST_VAL_TXT == "1" && (pct == "Fail" || pct == "InComplete"));
                    if (enablePctRun != null)
                    {
                        skipPCT = true;
                        var message = pct == "InComplete" ? "PCT incomplete is skipped." : "PCT failure is skipped.";
                        objsetActionItem.ActionReasons["Approve"] = GetPopUpMessage(actionReasonStr, message, true, false);
                    };

                    var enableMctRun = adminConstants.FirstOrDefault(c => c.CNST_NM == "SKIP_MCT_FAILURE" && c.CNST_VAL_TXT == "1" && (mct == "Fail" || mct == "InComplete"));
                    if (enableMctRun != null)
                    {
                        skipMCT = true;
                        var message = (pct == "InComplete") ? "MCT incomplete is skipped." : "MCT failure is skipped.";
                        objsetActionItem.ActionReasons["Approve"] = GetPopUpMessage(actionReasonStr, message, false, true);
                    };

                    // If both are skipped, or one is skipped and the other did not fail, allow Approve
                    if (skipPCT && skipMCT)
                    {
                        var message = "Both PCT and MCT failures are skipped.";
                        if (pct == "InComplete" && mct == "InComplete")
                        {
                            message = "Both PCT and MCT incompletes are skipped.";
                        }
                        else if (pct == "InComplete" && mct == "Fail")
                        {
                            message = "PCT incomplete and MCT failure are skipped.";
                        }
                        else if (pct == "Fail" && mct == "InComplete")
                        {
                            message = "PCT failure and MCT incomplete are skipped.";
                        }
                        objsetActionItem.Actions["Approve"] = true;
                        objsetActionItem.ActionReasons["Approve"] = GetPopUpMessage(actionReasonStr, message, true, true);
                    }
                    else if (skipPCT && !skipMCT && !mctFailed)
                    {
                        objsetActionItem.Actions["Approve"] = true;
                    }
                    else if (!skipPCT && !pctFailed && skipMCT)
                    {
                        objsetActionItem.Actions["Approve"] = true;
                    }
                }
            }

            objsetItem["_actions"] = objsetActionItem.Actions;
            objsetItem["_actionReasons"] = objsetActionItem.ActionReasons;
            objsetItem["_settings"] = objsetActionItem.Settings;
        }

        private static string GetPopUpMessage(string str, string newStr, bool skipPCT, bool skipMCT) 
        {
            // Adjust the existing action reason message to reflect skipped tests
            if (str.Contains(PCTAndMCTFailMsg))
            {
                int newlineIndex = str.IndexOf('\n');
                if (newlineIndex != -1)
                {
                    string remaining = str.Substring(newlineIndex + 1);
                    if (skipPCT && skipMCT)
                    {
                        str = newStr + "\n";
                    }
                    else if (skipPCT || skipMCT)
                    {
                        str = $"{(skipMCT ? PCTFailMsg : MCTFailMsg)}\n";
                    }
                    else
                    {
                        str = newStr + "\n";
                    }
                    str += remaining;

                }
                else
                {
                    if (skipPCT && skipMCT)
                        return newStr;

                    if (skipMCT || skipPCT)
                        str = (skipMCT ? PCTFailMsg : MCTFailMsg);

                    str += "\n" + newStr;
                }
            }
            else if (str.Contains(PCTFailMsg) || str.Contains(MCTFailMsg) || str.Contains(CAPMissingMsg))
            {
                int newlineIndex = str.IndexOf('\n');
                if (newlineIndex != -1)
                {
                    string remaining = str.Substring(newlineIndex + 1);
                    str = newStr + "\n" + remaining;
                }
                else
                {
                    str = newStr;
                }
            }
            else
            {
                str += "\n" + newStr;
            }
            return str;
        }

        public static void TranslateProductFilter(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;

            List<ProductEngName> prods = r.ExtraArgs[0] as List<ProductEngName> ?? new List<ProductEngName>();

            foreach (IOpDataElement de in r.Dc.GetDataElements(AttributeCodes.PRODUCT_FILTER))
            {
                if (de.AtrbValue.ToString() != "")
                {
                    OpLog.Log("Atrb -> " + de.AtrbValue);

                    int prodId;
                    if (int.TryParse(de.AtrbValue.ToString(), out prodId))
                    {
                        ProductEngName prod = prods.FirstOrDefault(p => p.PRD_MBR_SID == prodId);
                        if (prod != null)
                        {
                            de.AtrbValue = prod.PRODUCT_NAME;
                            de.PrevAtrbValue = prod;
                        }
                    }
                }
            }
        }

        public static void ApplyTenderActionsAndSettings(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string rebateType = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string objType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            if (rebateType.ToUpper() != "TENDER" || (objType != "ECAP" && objType != "KIT")) return;

            string stage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);

            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

            List<string> actions = new List<string>();
            bool canBidTender = DataCollections.GetSecurityWrapper().ChkDealRules(opDataElementType, opDataElementSetType, stage, SecurityActns.C_BID_TENDERS);

            if (canBidTender)
            {
                actions = GetTenderActionList(stage);
            }

            IOpDataElement deBidActn = r.Dc.GetDataElement("BID_ACTNS");

            if (deBidActn == null)
            {
                r.Dc.DataElements.Add(new OpDataElement
                {
                    DcID = r.Dc.DcID,
                    AtrbID = 99999,
                    AtrbCd = "BID_ACTNS",
                    DataType = "System.Object",
                    AtrbValue = actions
                });
            }
            else
            {
                deBidActn.AtrbValue = actions;
            }
        }

        public static List<string> GetTenderActionList(string stage)
        {
            List<string> availTenderStages = new List<string> { WorkFlowStages.Won, WorkFlowStages.Lost, WorkFlowStages.Offer };

            List<string> actions = new List<string>();
            if (!availTenderStages.Contains(stage)) return actions;

            switch (stage)
            {
                case WorkFlowStages.Offer:
                    actions.Add(WorkFlowStages.Offer);
                    actions.Add(WorkFlowStages.Won);
                    actions.Add(WorkFlowStages.Lost);
                    break;

                case WorkFlowStages.Won:
                    actions.Add(WorkFlowStages.Won);
                    break;

                case WorkFlowStages.Lost:
                    actions.Add(WorkFlowStages.Offer);
                    actions.Add(WorkFlowStages.Lost);
                    break;
            }
            return actions;
        }

        public static void ApplyCustomerDivision(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;
            OpDataCollectorFlattenedItem objsetItem = r.ExtraArgs[0] as OpDataCollectorFlattenedItem ?? new OpDataCollectorFlattenedItem();
            List<CustomerDivision> custs = r.ExtraArgs[1] as List<CustomerDivision>;
            MyCustomersInformation cust = r.ExtraArgs[2] as MyCustomersInformation;

            objsetItem["Customer"] = cust;
            objsetItem["CustomerDivisions"] = custs;
        }

    }
}