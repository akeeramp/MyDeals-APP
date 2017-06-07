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
                    Title="Show Server Deal Type if Product is SvrWS",
                    ActionRule = MyDcActions.ShowServerDealType,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    // US52971 -  If Program Payment = Front end then user need to enter the sold to ID-not mandatory (sold to ID should be pulled by system for that customer div and Geo and multi select)-if left blank then it means all 
                    Title="Hidden if Backend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnHidden},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && de.AtrbValue.ToString() == "Backend").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetHidden,
                            Target = new[] {AttributeCodes.SOLD_TO_ID }
                        }
                    }
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
