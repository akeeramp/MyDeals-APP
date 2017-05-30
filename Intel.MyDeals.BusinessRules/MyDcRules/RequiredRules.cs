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
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    Title="Required if Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() != "Consumption").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {AttributeCodes.CONSUMPTION_REASON }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Required if Market Segment",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MRKT_SEG) && de.AtrbValue != null && (de.AtrbValue.ToString().ToUpper().Contains("ALL") || de.AtrbValue.ToString().ToUpper().Contains("RETAIL"))).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {AttributeCodes.RETAIL_CYCLE }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Req if Meet Comp is Price Performance",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MEET_COMP_PRICE_QSTN) && de.AtrbValue != null && de.AtrbValue.ToString() == "Price").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {AttributeCodes.COMP_BENCH, AttributeCodes.IA_BENCH }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Required if Backdate Needed",
                    ActionRule = MyDcActions.BackdateRequired,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL}
                }
            };
        }
    }

}
