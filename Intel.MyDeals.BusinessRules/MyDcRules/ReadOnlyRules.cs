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
                new MyOpRule // Set to read only if you have a DEAL NUMBER
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
                            Target = new[] {AttributeCodes.GEO_COMBINED, AttributeCodes.SOLD_TO_ID} // Items to set readonly
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
                            Target = new[]
                            {
                                AttributeCodes.CAP,
                                AttributeCodes.COST_TEST_RESULT,
                                AttributeCodes.COST_TYPE_USED,
                                AttributeCodes.ECAP_FLR,
                                AttributeCodes.ECAP_PRICE,
                                AttributeCodes.ECAP_TYPE,
                                AttributeCodes.END_DT,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.MEETCOMP_TEST_RESULT,
                                AttributeCodes.MEET_COMP_PRICE_QSTN,
                                AttributeCodes.MRKT_SEG,
                                AttributeCodes.OBJ_SET_TYPE_CD,
                                AttributeCodes.PAYOUT_BASED_ON,
                                AttributeCodes.PRD_COST,
                                AttributeCodes.PRODUCT_FILTER,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.PTR_USER_PRD,
                                AttributeCodes.RETAIL_PULL,
                                AttributeCodes.START_DT,
                                AttributeCodes.WF_STG_CD,
                                AttributeCodes.YCS2_PRC_IRBT,
                                AttributeCodes.CREDIT_VOLUME,
                                AttributeCodes.DEBIT_VOLUME,
                                AttributeCodes.BLLG_DT,
                                AttributeCodes.YCS2_START_DT,
                                AttributeCodes.YCS2_END_DT,
                                AttributeCodes.CAP_STRT_DT,
                                AttributeCodes.CAP_END_DT
                            }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if in the past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.END_DT) && !de.IsDateInPast()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.BACK_DATE_RSN, AttributeCodes.BACK_DATE_RSN_TXT}
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() != "Consumption").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.REBATE_BILLING_START, AttributeCodes.REBATE_BILLING_END }
                        }
                    }                
                },
                new MyOpRule
                {
                    Title="Readonly if Not Backend",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && de.AtrbValue.ToString() != "Backend").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.VOLUME }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if Not Backend and has tracker",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && de.AtrbValue.ToString() == "Backend" && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.EXPIRE_YCS2 }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if geo is WW",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.GEO_COMBINED) && de.AtrbValue != null && (de.AtrbValue.ToString() == "WW" || de.AtrbValue.ToString() == "Worldwide")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.TRGT_RGN }
                        }
                    }
                }
            };
        }

    }

}
