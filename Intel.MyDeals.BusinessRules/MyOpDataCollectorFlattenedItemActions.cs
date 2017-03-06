using System;
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
            if (args.Length < 4) return;
            OpDataCollector dc = args[0] as OpDataCollector;
            MyOpRule ar = args[1] as MyOpRule;
            object[] extraArgs = args[3] as object[];
            OpDataCollectorFlattenedItem objsetItem = null;
            if (extraArgs != null) objsetItem = extraArgs[0] as OpDataCollectorFlattenedItem;
            if (dc == null || ar == null || !dc.MeetsRuleCriteria(ar) || objsetItem == null) return;

            //return new MyDealsActionItem();
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;
            List<string> settings = new List<string>();
            List<string> actions = new List<string>();

            if (dc.DcType == OpDataElementType.WipDeals.ToString() || dc.DcType == OpDataElementType.Deals.ToString())
            {
                settings = new List<string> { "C_UPDATE_DEAL", "C_VIEW_QUOTE_LETTER", "C_ADD_ATTACHMENTS", "C_VIEW_ATTACHMENTS", "CAN_VIEW_COST_TEST", "CAN_VIEW_MEET_COMP" };
                actions = new List<string> { "C_APPROVE", "C_CANCEL_DEAL", "C_REJECT_DEAL" };
            }
            else if (dc.DcType == OpDataElementType.Contract.ToString() || dc.DcType == OpDataElementType.PricingStrategy.ToString() || dc.DcType == OpDataElementType.PricingTable.ToString())
            {
                settings = new List<string> { "C_UPDATE_DEAL" };
                actions = new List<string> { "C_APPROVE", "C_CANCEL_DEAL", "C_REJECT_DEAL" };
            }

            bool isSuperSa = opUserToken.IsSuperSa();
            bool isSuper = opUserToken.IsSuper();

            string stage = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
            string objSetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            OpDataElementType opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);
            OpDataElementSetType opDataElementSetType = OpDataElementSetTypeConverter.FromString(dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD));

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
                    .ChkDealRules(opDataElementType, opDataElementSetType, opUserToken.Role.RoleTypeCd, stage, setting);
            }

            objsetItem["_actions"] = objsetActionItem.Actions;
            objsetItem["_settings"] = objsetActionItem.Settings;

        }

        public static void ApplyHasTracker(params object[] args)
        {
            if (args.Length < 4) return;
            OpDataCollector dc = args[0] as OpDataCollector;
            MyOpRule ar = args[1] as MyOpRule;
            object[] extraArgs = args[3] as object[];
            OpDataCollectorFlattenedItem objsetItem = null;
            if (extraArgs != null) objsetItem = extraArgs[0] as OpDataCollectorFlattenedItem;
            if (dc == null || ar == null || !dc.MeetsRuleCriteria(ar) || objsetItem == null) return;

            objsetItem["HasTracker"] = dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
        }

        public static void ApplyHasFileAttachments(params object[] args)
        {
            if (args.Length < 4) return;
            OpDataCollector dc = args[0] as OpDataCollector;
            MyOpRule ar = args[1] as MyOpRule;
            object[] extraArgs = args[3] as object[];
            OpDataCollectorFlattenedItem objsetItem = null;
            if (extraArgs != null) objsetItem = extraArgs[0] as OpDataCollectorFlattenedItem;
            if (dc == null || ar == null || !dc.MeetsRuleCriteria(ar) || objsetItem == null) return;

            objsetItem["HasFiles"] = dc.GetDataElementsWhere("HAS_FILE_ATTACHMENTS", d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any();
        }


    }
}