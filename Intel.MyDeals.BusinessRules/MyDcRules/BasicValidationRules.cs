using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetBasicValidationRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Must have a positive value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} must be positive"},
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.NUM_OF_TIERS }) && de.IsNegativeOrZero()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Enforce Required Fields",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} is required"},
                            Where = de => de.IsRequired && de.HasNoValue()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Must have a positive or zero value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} must be positive"},
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.VOLUME }) && de.HasValue() && de.IsNegative()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Does not exceed max character limit",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"{0} must be no more than 80 characters."},
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.TITLE }) && de.ExceedsMaxLength(80)
                        }
                    }
                },
                // Removed since it was a dummy test for date in past check.  Will bring back when real rule is needed.
                //new MyOpRule
                //{
                //    Title="Change title if in the past",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave},
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

                //},
                new MyOpRule
                {
                    Title="Title already exists check",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave},
                    InObjType = new List<OpDataElementType> {OpDataElementType.CNTRCT, OpDataElementType.PRC_ST}, 
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.TITLE) && de.HasValueChanged && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckDuplicateObjectTitle,
                            Args = new object[] {"Title already exists in system"},
                            Target = new[] {AttributeCodes.TITLE}
                        }
                    }

                },
                new MyOpRule
                {
                    Title="Make sure End Date is later than Credit Date",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                    AtrbCondIf = dc => dc.IsDateBefore(AttributeCodes.END_DT, "BLLG_DT"),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.AddValidationMessage,
                            Args = new object[] {"End date must be greater than any Credit date."},
                            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.END_DT})
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Default Workflow on Save",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave},
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.DC_ID),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckInitialWorkFlow,
                            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.WF_STG_CD})
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Validate Market Segments",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MRKT_SEG) && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckMarketSegment,
                            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.MRKT_SEG})
                        }
                    }
                }
            };
        }
    }
}
