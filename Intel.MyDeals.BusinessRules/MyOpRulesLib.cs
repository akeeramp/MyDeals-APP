using System;
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
            Stopwatch stopwatch = new Stopwatch();

            foreach (OpRule<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType> a in ars)
            {
                if (!a.Triggers.Contains(trigger)) continue;

                if (EN.GLOBAL.DEBUG >= 4)
                {
                    stopwatch.Stop();
                    stopwatch.Reset();
                    stopwatch.Start();
                }

                msgQueue.Messages.Add(OpRulesLib<OpDataCollector, IOpDataElement, MyRulesTrigger, OpDataElementType>.RunAction(dc, a, securityActionCache, args));

                if (EN.GLOBAL.DEBUG >= 4)
                    Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\t\tRule {3}: [{4} #{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now, a, dc.DcType);
            }

            return msgQueue;
        }
    }
}