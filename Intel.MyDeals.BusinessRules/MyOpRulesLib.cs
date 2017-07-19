using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// MyDeals specific strongly typed MyOpRulesLib class
    /// This class is just to make writing rules much easier.
    /// </summary>
    public static class MyOpRulesLib
    {
        public static OpMsg RunAction(OpDataCollector target, MyOpRule ar, Dictionary<string, bool> securityActionCache = null)
        {
            return OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.RunAction(target, ar, securityActionCache);
        }

        public static OpMsgQueue ApplyRules(OpDataCollector dc, MyRulesTrigger trigger, List<MyOpRule> ars, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            var newArs = new List<OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>>(ars);
            return ApplyRules(dc, trigger, newArs, securityActionCache, args);
            //return OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.ApplyRules(dc, trigger, newArs, securityActionCache, args);
        }

        public static OpMsgQueue ApplyRules(OpDataCollector dc, MyRulesTrigger trigger, List<OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>> ars, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            if (dc == null || !ars.Any()) return new OpMsgQueue();
            if (securityActionCache == null) securityActionCache = new Dictionary<string, bool>();

            OpMsgQueue msgQueue = new OpMsgQueue();

            foreach (OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType> a in ars)
            {
                if (a.Triggers.Contains(trigger))
                {
                    msgQueue.Messages.Add(OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.RunAction(dc, a, securityActionCache, args));
                }
            }

            return msgQueue;
        }
    }
}