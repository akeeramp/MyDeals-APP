using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;

namespace Intel.MyDeals.BusinessRules
{
    public static partial class AllRules
    {
        public static List<MyOpRule> GetReadOnlyRules()
        {
            return new List<MyOpRule>
            {
                new MyOpRule
                {
                    Title="Sync Read Only",
                    ActionRule = MyDcActions.SyncReadOnlyItems,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WipDeals, OpDataElementType.Deals},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave, MyRulesTrigger.OnLoad}
                },
                new MyOpRule
                {
                    Title="Readonly if Tracker Exists",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WipDeals, OpDataElementType.Deals},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    WithTracker = true,
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {"TRGT_RGN_CHK", "TRGT_RGN", "RETAIL_CYCLE"}
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {"PROGRAM_TYPE"}
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if in the past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    NotInStages = new List<string>{"Created"},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.END_DT) && de.IsDateInPast()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {"PRODUCT_TITLE", "START_DT", "END_VOL", "STRT_VOL", "RATE"}
                        }
                    }

                },
                new MyOpRule
                {
                    Title="Readonly if in past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs("START_DT") && de.IsDateInPast() && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {"CUST_MBR_SID"}
                        }
                    },
                    OpRuleElseActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetNotReadOnly,
                            Target = new[] {"CUST_MBR_SID"}
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Not Required if in the past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs("START_DT") && !de.IsDateInPast() && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetNotRequired,
                            Target = new[] {"CUST_MBR_SID"}
                        }
                    },
                    OpRuleElseActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {"CUST_MBR_SID"}
                        }
                    }
                }
            };
        }
    }

}
