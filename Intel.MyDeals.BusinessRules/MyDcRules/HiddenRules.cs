using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetHiddenRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Sync Hidden",
                    ActionRule = MyDcActions.SyncHiddenItems,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    Title="Hidden if NOT Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() != "Consumption").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetHidden,
                            Target = new[] {AttributeCodes.CONSUMPTION_REASON, AttributeCodes.CONSUMPTION_REASON_CMNT }
                        }
                    }
                }
            };
        }
    }

}
