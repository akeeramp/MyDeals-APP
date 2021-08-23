using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// MyOpRules Configuration.  Single source for all rules.  The actual rules will be stored and pulled from
    /// the AllRules class.  This is just the interface to pull and apply the rules.
    /// </summary>
    public static class MyRulesConfiguration
    {
        /// <summary>
        /// Container for ALL MYOPRULES.  It would be nice if this came from the DB, cached and managed via an admin page, but for now
        /// it will pull from static files.
        /// </summary>
        public static List<MyOpRule> AttrbRules
        {
            get
            {
                if (_attrbRules != null && _attrbRules.Any()) return _attrbRules;

                _attrbRules = new List<MyOpRule>();
                _attrbRules.AddRange(AllRules.GetHiddenRules());
                _attrbRules.AddRange(AllRules.GetReadOnlyRules());
                _attrbRules.AddRange(AllRules.GetRequiredRules());
                _attrbRules.AddRange(AllRules.GetBasicValidationRules());
                _attrbRules.AddRange(AllRules.GetAutomatedTestingRules());
                _attrbRules.AddRange(AllRules.GetOpCollectorToDictRules());
                _attrbRules.AddRange(AllRules.GetMergeRules());

                _attrbRules.AddRange(AllRules.GetPostActionRules());

                return _attrbRules;
            }
        }
        private static List<MyOpRule> _attrbRules;

        public static List<MyObjectRule> ObjectRules
        {
            get
            {
                if (_objectRules != null && _objectRules.Any()) return _objectRules;

                _objectRules = new List<MyObjectRule>();
                _objectRules.AddRange(AllRules.GetMeetCompRules());

                return _objectRules;
            }
        }
        private static List<MyObjectRule> _objectRules;
        /// <summary>
        /// Apply rules based on a trigger.  Based on the OpDataCollector and the trigger, the appropriate rules will be run
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="ruleTriggerPoint">Rules Trigger used to find the correct rules to fire</param>
        /// <param name="securityActionCache">Used for performance optimization when dealing with security attributes.</param>
        /// <param name="args">Any extra arguments to pass</param>
        /// <returns></returns>
        public static OpMsgQueue ApplyRules(this OpDataCollector dc, MyRulesTrigger ruleTriggerPoint, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            Stopwatch stopwatch = new Stopwatch();
            if (EN.GLOBAL.DEBUG >= 3) stopwatch.Start();

            if (dc.DcType == null) return new OpMsgQueue(); // Put this is because we found "Missing ObjSet (ALL_OBJ_TYPE) or ObjSetType (Unknown)" passing a no typed DC
            OpDataElementType dcType = (OpDataElementType)Enum.Parse(typeof(OpDataElementType), dc.DcType);
            string objsetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            IEnumerable<MyOpRule> attrbRules = AttrbRules;
            attrbRules = attrbRules.Where(a => !a.InObjType.Any() || a.InObjType.Contains(dcType));
            attrbRules = attrbRules.Where(a => !a.InObjSetType.Any() || a.InObjSetType.Contains(objsetType));

            OpMsgQueue msg = MyOpRulesLib.ApplyRules(dc, ruleTriggerPoint, attrbRules.ToList(), securityActionCache, args);

            if (EN.GLOBAL.DEBUG >= 3)
                Debug.WriteLine("{2:HH:mm:ss:fff}\t{0,10} (ms)\t\tApplyRules {3}: [{4} #{1}]", stopwatch.Elapsed.TotalMilliseconds, dc.DcID, DateTime.Now, ruleTriggerPoint, dc.DcType);

            return msg;
        }


        public static OpMsgQueue ApplyRules(this dynamic[] data, MyRulesTrigger ruleTriggerPoint, params object[] args)
        {
            OpMsgQueue msg = MyOpRulesLib.ApplyRules(data, ruleTriggerPoint, ObjectRules, args);
            return msg;
        }

    }
}
