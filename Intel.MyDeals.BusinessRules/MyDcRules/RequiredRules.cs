using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetRequiredRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Sync Required",
                    ActionRule = MyDcActions.SyncRequiredItems,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad}
                }
            };
        }
    }

}
