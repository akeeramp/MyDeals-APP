using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetMergeRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Sync PTR to WIP",
                    ActionRule = MyDcActions.ExecuteMerges,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnMerge}
                }

            };
        }
        
    }
}
