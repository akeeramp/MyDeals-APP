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
                (w.OBJ_TYPE == opDataElementType.ToDesc() || w.OBJ_TYPE == "ALL_TYPES") &&
                (w.OBJ_SET_TYPE_CD == objSetType || w.OBJ_SET_TYPE_CD == "ALL_TYPES") &&
                w.WFSTG_CD_SRC == stage &&
                w.ROLE_TIER_NM == opUserToken.Role.RoleTier).Select(w => w.WFSTG_ACTN_NM).ToList();

            List<string> possibleActions = new List<string>();
            if (objsetActionItem.Settings[SecurityActns.C_APPROVE]) possibleActions.Add("Approve");
            if (objsetActionItem.Settings[SecurityActns.C_REVISE_DEAL]) possibleActions.Add("Revise");
            if (objsetActionItem.Settings[SecurityActns.C_CANCEL_DEAL]) possibleActions.Add("Cancel");
            possibleActions.Add("Hold");

            foreach (string action in actions.Where(a => possibleActions.Contains(a)))
            {
                objsetActionItem.Actions[action] = true;

                if (opDataElementType != OpDataElementType.PRC_ST) continue;

                if ((action == "Approve" || action == "Revise") && passedValidation != PassedValidation.Complete.ToString())
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

                if (action == "Approve" && missingCap && stage == WorkFlowStages.Requested)
                {
                    objsetActionItem.Actions[action] = false;
                    objsetActionItem.ActionReasons[action] = objsetActionItem.ActionReasons.ContainsKey(action)
                        ? objsetActionItem.ActionReasons[action] += "\nCAP missing from at least one of the deals in this Pricing Strategy."
                        : "CAP missing from at least one of the deals in this Pricing Strategy.";
                }


                if (action == "Approve" && objsetActionItem.Actions[action] && hasL1)
                {
                    string reasonPctMct = "Pricing Strategy did not pass " + (pctFailed && mctFailed
                        ? "Price Cost Test and Meet Comp Test" 
                        : pctFailed 
                            ? "Price Cost Test" 
                            : mctFailed 
                                ? "Meet Comp Test" 
                                : "");

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

            }

            objsetItem["_actions"] = objsetActionItem.Actions;
            objsetItem["_actionReasons"] = objsetActionItem.ActionReasons;
            objsetItem["_settings"] = objsetActionItem.Settings;
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
                    int prodId = int.Parse(de.AtrbValue.ToString());
                    ProductEngName prod = prods.FirstOrDefault(p => p.PRD_MBR_SID == prodId);
                    if (prod != null) de.AtrbValue = prod.PRODUCT_NAME;
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

            string bidValue = r.Dc.GetDataElementValue(AttributeCodes.BID_STATUS);
            string stage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);

            // TODO need a new security action for C_BID_TENDERS
            if (bidValue == string.Empty)
            {
                bidValue = "Offer";
                r.Dc.DataElements.Add(new OpDataElement
                {
                    DcID = r.Dc.DcID,
                    AtrbID = 99999,
                    AtrbCd = "BID_STATUS",
                    DataType = "System.String",
                    AtrbValue = bidValue
                });
            }

            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

            List<string> actions = new List<string>();
            bool canBidTender = DataCollections.GetSecurityWrapper().ChkDealRules(opDataElementType, opDataElementSetType, stage, SecurityActns.C_BID_TENDERS);

            if (canBidTender)
            {
                actions = GetTenderActionList(bidValue, stage);
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

        public static List<string> GetTenderActionList(string bidValue, string stage)
        {
            List<string> actions = new List<string>();
            if (stage != WorkFlowStages.Active) return actions;

            switch (bidValue)
            {
                case "Offer":
                    actions.Add("Offer");
                    actions.Add("Won");
                    actions.Add("Lost");
                    break;

                case "Won":
                    actions.Add("Won");
                    break;

                case "Lost":
                    actions.Add("Offer");
                    actions.Add("Lost");
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