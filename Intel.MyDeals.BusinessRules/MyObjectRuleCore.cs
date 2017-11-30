using System.Collections.Generic;

namespace Intel.MyDeals.BusinessRules
{
    public class MyObjectRuleCore
    {
        public MyObjectRuleCore(params object[] args)
        {
            if (args.Length < 2) return;
            Data = args[0] as dynamic[];
            Rule = args[1] as MyObjectRule;
            Security = args.Length < 2 ? new Dictionary<string, bool>() : args[2] as Dictionary<string, bool>;
            ExtraArgs = args.Length < 3 ? new object[] { } : args[3] as object[];
        }

        public dynamic[] Data { get; set; }
        public MyObjectRule Rule { get; set; }
        public Dictionary<string, bool> Security { get; set; }
        public object[] ExtraArgs { get; set; }

        //public bool IsValid => Data.MeetsRuleCriteria(Rule);
        public bool IsValid => true;
        public bool HasExtraArgs => ExtraArgs != null && ExtraArgs.Length > 0;
    }
}