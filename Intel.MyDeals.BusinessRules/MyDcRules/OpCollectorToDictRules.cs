using System.Collections.Generic;
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
                    Title="Apply Actions [Customer]",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyCustomerDivision,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL}
                },
                new MyOpRule
                {
                    Title="Apply Actions [_actions] and Settings [_settings]",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyActionsAndSettings,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL }
                },
                new MyOpRule
                {
                    Title="Add key/value [HasFiles] for having file attachments",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyHasFileAttachments,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_TBL, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL }
                },
                new MyOpRule
                {
                    Title="Add key/value [HasTracker] for having a tracker number",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyHasTracker,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnOpCollectorConvert },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_TBL, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL }
                }

            };
        }

    }
}
/*


 */
