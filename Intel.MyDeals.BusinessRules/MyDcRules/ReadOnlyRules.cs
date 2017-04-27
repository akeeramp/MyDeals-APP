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
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad}
                },
                new MyOpRule // Set to read only if yuo have a TRACKER NUMBER
                {
                    Title="Readonly if Tracker Exists",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL, OpDataElementType.DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.TRKR_NBR) && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.TRGT_RGN, AttributeCodes.GEO_COMBINED, AttributeCodes.SOLD_TO_ID}
                        }
                    }
                },
                new MyOpRule // Set to read only if yuo have a DEAL NUMBER
                {
                    Title="Readonly if Has Positive Deal number",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.DC_ID) && de.IsPositive()).Any(), // If it has a deal number and it is positive
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.TRGT_RGN, AttributeCodes.GEO_COMBINED, AttributeCodes.SOLD_TO_ID} // Items to set readonly
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL, OpDataElementType.DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] { AttributeCodes.DC_ID, AttributeCodes.OBJ_SET_TYPE_CD, AttributeCodes.START_DT, AttributeCodes.END_DT, AttributeCodes.CUST_MBR_SID, AttributeCodes.ECAP_PRICE, AttributeCodes.WF_STG_CD, AttributeCodes.CREDIT_VOLUME, AttributeCodes.DEBIT_VOLUME, AttributeCodes.PTR_USER_PRD }
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
                            Target = new[] {AttributeCodes.START_DT, AttributeCodes.END_DT}
                        }
                    }

                },
                new MyOpRule
                {
                    Title="Readonly if in past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.START_DT) && de.IsDateInPast() && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] { AttributeCodes.CUST_MBR_SID }
                        }
                    },
                    OpRuleElseActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetNotReadOnly,
                            Target = new[] { AttributeCodes.CUST_MBR_SID }
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
                            Target = new[] { AttributeCodes.CUST_MBR_SID }
                        }
                    },
                    OpRuleElseActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] { AttributeCodes.CUST_MBR_SID }
                        }
                    }
                }
            };
        }
    }

}
