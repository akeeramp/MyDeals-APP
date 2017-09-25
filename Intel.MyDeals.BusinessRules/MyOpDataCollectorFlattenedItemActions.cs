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

            bool isSuperSa = opUserToken.IsSuperSa();
            bool isSuper = opUserToken.IsSuper();

            string stage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string objSetType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));
            string passedValidation = r.Dc.GetDataElementValue(AttributeCodes.PASSED_VALIDATION);
            string pct = r.Dc.GetDataElementValue(AttributeCodes.COST_TEST_RESULT);
            string mct = r.Dc.GetDataElementValue(AttributeCodes.MEETCOMP_TEST_RESULT);
            string role = opUserToken.Role.RoleTypeCd;
            bool pctFailed = pct != "PASS" && pct != "NA";
            bool mctFailed = mct != "PASS" && mct != "NA";

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
                SecurityActns.C_ADD_ATTACHMENTS,
                SecurityActns.C_VIEW_ATTACHMENTS,
                SecurityActns.C_EDIT_PRODUCT,
                SecurityActns.CAN_VIEW_COST_TEST,
                SecurityActns.CAN_VIEW_MEET_COMP,
                SecurityActns.C_EDIT_COST_TEST,
                SecurityActns.C_EDIT_MEET_COMP
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

            foreach (string action in actions)
            {
                objsetActionItem.Actions[action] = true;

                if (opDataElementType != OpDataElementType.PRC_ST) continue;

                if (action == "Approve" || action == "Revise") { }
                    if ((action == "Approve" || action == "Revise") && passedValidation != "Complete")
                    objsetActionItem.Actions[action] = false;

                if (action == "Approve" && objsetActionItem.Actions[action])
                {
                    switch (role)
                    {
                        case RoleTypes.SA:
                        case RoleTypes.DA:
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                                objsetActionItem.Actions[action] = false;
                            break;
                        case RoleTypes.GA:
                            if (stage == WorkFlowStages.Requested && (pctFailed || mctFailed))
                                objsetActionItem.Actions[action] = false;
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                                objsetActionItem.Actions[action] = false;
                            break;
                        case RoleTypes.FSE:
                            if ((stage == WorkFlowStages.Submitted || stage == WorkFlowStages.Pending) && (pctFailed || mctFailed))
                                objsetActionItem.Actions[action] = false;
                            break;
                    }
                }

            }


            objsetItem["_actions"] = objsetActionItem.Actions;
            objsetItem["_settings"] = objsetActionItem.Settings;

        }



        public static void ApplyHasFileAttachments(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;
            OpDataCollectorFlattenedItem objsetItem = r.ExtraArgs[0] as OpDataCollectorFlattenedItem ?? new OpDataCollectorFlattenedItem();

            objsetItem["HasFiles"] = r.Dc.GetDataElementsWhere("HAS_FILE_ATTACHMENTS", d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
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