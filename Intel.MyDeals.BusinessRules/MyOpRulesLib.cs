using System.Collections.Generic;
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

        public static OpMsgQueue ApplyRules(OpDataCollector dc, MyRulesTrigger trigger, List<MyOpRule> ars, Dictionary<string, bool> securityActionCache = null)
        {
            var newArs = new List<OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>>(ars);
            return OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.ApplyRules(dc, trigger, newArs, securityActionCache);
        }
    }
}