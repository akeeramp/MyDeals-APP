using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetOpCollectorToDictRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Apply Actions and Settings",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyActionsAndSettings,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.Contract, OpDataElementType.PricingStrategy }
                },
                new MyOpRule
                {
                    Title="Add key/value for having file attachments",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyHasFileAttachments,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.Contract, OpDataElementType.PricingTable, OpDataElementType.WipDeals, OpDataElementType.Deals }
                },
                new MyOpRule
                {
                    Title="Add key/value for having a tracker number",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyHasTracker,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.Contract, OpDataElementType.PricingTable, OpDataElementType.WipDeals, OpDataElementType.Deals }
                }

            };
        }

    }
}
/*


 */
