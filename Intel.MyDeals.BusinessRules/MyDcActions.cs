using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

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
            if (args.Length < 2) return;
            OpDataCollector dc = args[0] as OpDataCollector;
            MyOpRule ar = args[1] as MyOpRule;
            if (dc == null || ar == null || !dc.MeetsRuleCriteria(ar)) return;

            dc.ApplyActions(dc.MeetsRuleCondition(ar) ? ar.OpRuleActions : ar.OpRuleElseActions);
        }

        /// <summary>
        /// Sync Attribute Properties (ReadOnly, Required, Hidden) based on attribute security and rules
        /// </summary>
        /// <param name="actionCode">ATRB_READ_ONLY, ATRB_REQUIRED, ATRB_HIDDEN</param>
        /// <param name="myRulesTrigger">Trigger to invoke rule (OnReadonly, OnRequired, OnHidden)</param>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        private static void SyncAtrbPropertyItems(string actionCode, MyRulesTrigger myRulesTrigger, params object[] args)
        {
            if (args.Length < 3) return;
            OpDataCollector dc = args[0] as OpDataCollector;
            MyOpRule ar = args[1] as MyOpRule;
            Dictionary<string, bool> securityActionCache = args[2] as Dictionary<string, bool>;
            if (dc == null || ar == null || !dc.MeetsRuleCriteria(ar)) return;

            dc.ApplySecurityAttributes(actionCode, DataCollections.GetSecurityWrapper(), new string[] { }, securityActionCache);

            // Now apply all rules
            dc.ApplyRules(myRulesTrigger, securityActionCache);
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