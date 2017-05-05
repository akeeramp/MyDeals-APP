using System;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// Place all MyDeals specific actions here.  
    /// Most of the actions used will come from BusinessLogicDcActions
    /// This class will let you define MyDeals specific actions that might need to be performed
    /// </summary>
    public static partial class MyDcActions
    {
        /// <summary>
        /// Execute the appropiate action based on the condition statement
        /// </summary>
        /// <param name="args"></param>
        public static void ExecuteActions(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        public static void ExecuteMerges(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            OpDataCollectorFlattenedItem item = ((object[])args[3])[0] as OpDataCollectorFlattenedItem;
            if (item == null) return;

            // Deal Dates
            string dcStStr = r.Dc.GetDataElementValue(AttributeCodes.START_DT);
            string dcEnStr = r.Dc.GetDataElementValue(AttributeCodes.END_DT);
            string dcSt = DateTime.Parse(dcStStr == "" ? item[AttributeCodes.START_DT].ToString() : dcStStr).ToString("MM/dd/yyyy");
            string dcEn = DateTime.Parse(dcEnStr == "" ? item[AttributeCodes.END_DT].ToString() : dcEnStr).ToString("MM/dd/yyyy");
            string dcItemSt = DateTime.Parse(item[AttributeCodes.START_DT].ToString()).ToString("MM/dd/yyyy");
            string dcItemEn = DateTime.Parse(item[AttributeCodes.END_DT].ToString()).ToString("MM/dd/yyyy");

            // Billing Dates
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_START)) || dcSt != dcItemSt)
            {
                item[AttributeCodes.REBATE_BILLING_START] = dcItemSt;
            }
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_END)) || dcEn != dcItemEn)
            {
                item[AttributeCodes.REBATE_BILLING_END] = dcItemEn;
            }



            //r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        /// <summary>
        /// Sync Attribute Properties (ReadOnly, Required, Hidden) based on attribute security and rules
        /// </summary>
        /// <param name="actionCode">ATRB_READ_ONLY, ATRB_REQUIRED, ATRB_HIDDEN</param>
        /// <param name="myRulesTrigger">Trigger to invoke rule (OnReadonly, OnRequired, OnHidden)</param>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        private static void SyncAtrbPropertyItems(string actionCode, MyRulesTrigger myRulesTrigger, params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            r.Dc.ApplySecurityAttributes(actionCode, DataCollections.GetSecurityWrapper(), new string[] { }, r.Security);

            // Now apply all rules
            r.Dc.ApplyRules(myRulesTrigger, r.Security);
        }

        /// <summary>
        /// Sync ReadOnly items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncReadOnlyItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_READ_ONLY, MyRulesTrigger.OnReadonly, args);
        }

        /// <summary>
        /// Sync Required items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncRequiredItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_REQUIRED, MyRulesTrigger.OnRequired, args);
        }

        /// <summary>
        /// Sync Hidden items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncHiddenItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_HIDDEN, MyRulesTrigger.OnHidden, args);
        }



    }
}