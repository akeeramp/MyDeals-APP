using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetAutomatedTestingRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Must have a positive value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnAutomatedTesting},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} must be positive"},
                            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.NUM_OF_TIERS}) && de.IsNegativeOrZero()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Does not exceed max character limit",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnAutomatedTesting},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} must be no more than 20 characters."},
                            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.TITLE}) && de.ExceedsMaxLength(20)
                        }
                    }
                }
                // Pulled out dummy rule that re-named title as part of test
                //new MyOpRule
                //{
                //    Title="Change title if in the past",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnAutomatedTesting},
                //    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.START_DT) && de.IsDateInPast() && de.HasValue()).Any(),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetAtrbValue,
                //            Args = new object[] {"New Title"},
                //            Target = new[] {AttributeCodes.TITLE}
                //        }
                //    }

                //}


            };
        }
    }
}
