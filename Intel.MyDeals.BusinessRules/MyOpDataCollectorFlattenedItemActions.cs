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
            List<string> settings = new List<string>();
            List<string> actions = new List<string>();

            // TODO revisit these setting when security and actions are ready
            if (r.Dc.DcType == OpDataElementType.WIP_DEAL.ToString() || r.Dc.DcType == OpDataElementType.DEAL.ToString())
            {
                settings = new List<string> { SecurityActns.C_UPDATE_DEAL, SecurityActns.C_VIEW_QUOTE_LETTER, SecurityActns.C_ADD_ATTACHMENTS, SecurityActns.C_VIEW_ATTACHMENTS, SecurityActns.CAN_VIEW_COST_TEST, SecurityActns.CAN_VIEW_MEET_COMP };
                actions = new List<string> { SecurityActns.C_APPROVE_, SecurityActns.C_CANCEL_DEAL, SecurityActns.C_REJECT_DEAL };
            }
            else if (r.Dc.DcType == OpDataElementType.CNTRCT.ToString() || r.Dc.DcType == OpDataElementType.PRC_ST.ToString() || r.Dc.DcType == OpDataElementType.PRC_TBL.ToString())
            {
                settings = new List<string> { SecurityActns.C_UPDATE_DEAL };
                actions = new List<string> { SecurityActns.C_APPROVE_, SecurityActns.C_CANCEL_DEAL, SecurityActns.C_REJECT_DEAL };
            }

            bool isSuperSa = opUserToken.IsSuperSa();
            bool isSuper = opUserToken.IsSuper();

            string stage = r.Dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
            string objSetType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

            MyDealsActionItem objsetActionItem = new MyDealsActionItem
            {
                ObjsetType = objSetType,
                Stage = stage,
                Role = opUserToken.Role.RoleTypeCd
            };

            // load actions
            if (opUserToken.Role.RoleTypeCd != RoleTypes.SA || isSuperSa)
            {
                foreach (string action in actions)
                {
                    objsetActionItem.Actions[action] = DataCollections.GetDealActions()
                        .Where(d => d.ObjsetType == objSetType && d.Stage == stage && d.Role == opUserToken.Role.RoleTypeCd)
                        .Select(d => d.Actions[action])
                        .FirstOrDefault();
                }
            }

            // load settings
            foreach (string setting in settings)
            {
                objsetActionItem.Settings[setting] = DataCollections.GetSecurityWrapper()
                    .ChkDealRules(opDataElementType, opDataElementSetType, stage, setting);
            }

            objsetItem["_actions"] = objsetActionItem.Actions;
            objsetItem["_settings"] = objsetActionItem.Settings;

        }


        public static void ApplyHasTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;
            OpDataCollectorFlattenedItem objsetItem = r.ExtraArgs[0] as OpDataCollectorFlattenedItem ?? new OpDataCollectorFlattenedItem();

            objsetItem["HasTracker"] = r.Dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
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
            CustomerDivision cust = r.ExtraArgs[1] as CustomerDivision;

            if (cust != null) objsetItem["Customer"] = cust;
        }

    }
}