using System.Collections.Generic;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyObjectRule> GetMeetCompRules()
        {
            return new List<MyObjectRule>
            {
                new MyObjectRule
                {
                    Title="Append Security to Meet Comp Data",
                    ActionRule = MyObjectActions.AddSecurityToMeetCompData,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoadMeetComp }
                }

            };
        }

    }
}

