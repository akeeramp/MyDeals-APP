using System.Collections.Generic;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{
    public class MyOpRuleCore
    {
        public MyOpRuleCore(params object[] args)
        {
            if (args.Length < 2) return;
            Dc = args[0] as OpDataCollector;
            Rule = args[1] as MyOpRule;
            Security = args.Length < 2 ? new Dictionary<string, bool>() : args[2] as Dictionary<string, bool>;
            ExtraArgs = args.Length < 3 ? new object[] { } : args[3] as object[];
        }

        public OpDataCollector Dc { get; set; }
        public MyOpRule Rule { get; set; }
        public Dictionary<string, bool> Security { get; set; }
        public object[] ExtraArgs { get; set; }

        public bool IsValid => Dc.MeetsRuleCriteria(Rule);
        public bool HasExtraArgs => ExtraArgs != null && ExtraArgs.Length > 0;
    }
}