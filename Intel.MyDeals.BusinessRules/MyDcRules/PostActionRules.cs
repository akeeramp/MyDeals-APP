using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetPostActionRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Clear out Hold Errors",
                    ActionRule = MyDcActions.ClearValidateForHold,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate}
                }
            };
        }
    }
}
