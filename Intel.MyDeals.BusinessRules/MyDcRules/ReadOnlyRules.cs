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
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule // Set to read only if you have a TRACKER NUMBER
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
                            Target = new[] {AttributeCodes.TRGT_RGN, AttributeCodes.GEO_COMBINED, AttributeCodes.DEAL_SOLD_TO_ID }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Server Deal Type Read Only if Product is not SvrWS",
                    ActionRule = MyDcActions.ShowServerDealType,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    Title="Readonly for Frontend With Tracker",
                    ActionRule = MyDcActions.ReadOnlyFrontendWithTracker,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL, OpDataElementType.PRC_TBL_ROW},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    // US52971 -  If Program Payment = Front end then user need to enter the sold to ID-not mandatory (sold to ID should be pulled by system for that customer div and Geo and multi select)-if left blank then it means all 
                    Title="Hidden if Backend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && de.AtrbValue.ToString() == "Backend").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.DEAL_SOLD_TO_ID }
                        }
                    }
                },
                new MyOpRule // Set to read only if Frontend
                {
                    Title="Readonly if Frontend",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.HasValue() && de.AtrbValue.ToString() != "Backend").Any(), 
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[]
                            {
                                AttributeCodes.ON_ADD_DT,
                                AttributeCodes.TRGT_RGN,
                                AttributeCodes.REBATE_BILLING_START,
                                AttributeCodes.REBATE_BILLING_END,
                                AttributeCodes.BACK_DATE_RSN
                            } // Items to set readonly
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly WIP/Deal ALWAYS",
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
                                AttributeCodes.BLLG_DT,
                                AttributeCodes.CAP_END_DT,
                                AttributeCodes.CAP_STRT_DT,
                                AttributeCodes.COST_TEST_RESULT,
                                AttributeCodes.COST_TYPE_USED,
                                AttributeCodes.CUST_DIV_NM,
                                AttributeCodes.CREDIT_VOLUME,
                                AttributeCodes.DEBIT_VOLUME,
                                AttributeCodes.ECAP_FLR,
                                AttributeCodes.DC_ID,
                                AttributeCodes.DC_PARENT_ID,
                                AttributeCodes.EXPIRE_FLG,
                                AttributeCodes.PRD_EXCLDS,
                                AttributeCodes.PASSED_VALIDATION,
                                //AttributeCodes.ECAP_PRICE,
                                //AttributeCodes.END_DT,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.MEETCOMP_TEST_RESULT,
                                //AttributeCodes.MEET_COMP_PRICE_QSTN,
                                //AttributeCodes.MRKT_SEG,
                                AttributeCodes.OBJ_SET_TYPE_CD,
                                AttributeCodes.PAYOUT_BASED_ON,
                                //AttributeCodes.PRD_COST,
                                AttributeCodes.PRODUCT_FILTER,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.PTR_USER_PRD,
                                //AttributeCodes.REBATE_TYPE,
                                //AttributeCodes.START_DT,
                                //AttributeCodes.TERMS,
                                AttributeCodes.TITLE,
                                //AttributeCodes.VOLUME,
                                AttributeCodes.WF_STG_CD,
                                AttributeCodes.YCS2_END_DT,
                                AttributeCodes.YCS2_PRC_IRBT,
                                AttributeCodes.YCS2_START_DT,
                                AttributeCodes.CAP
                            }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly PTR ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[]
                            {
                                AttributeCodes.DC_ID,
                                AttributeCodes.TIER_NBR
                            }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly backdate if in the past",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.BACK_DATE_RSN}
                        }
                    }
                },
                new MyOpRule // DE30320 - Consumption Reason and Consumption Reason Comment fields should not be editable when Pay Out Based On = Billings : Error found in US53631: VOL TIER DEAL::Kendo Grid Validation + previous rule
                {
                    Title="Readonly if Not Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() == "Billings").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.REBATE_BILLING_START, AttributeCodes.REBATE_BILLING_END, AttributeCodes.CONSUMPTION_REASON, AttributeCodes.CONSUMPTION_REASON_CMNT }
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
                },
                new MyOpRule
                {
                    Title="Readonly if Meet Comp is Price Performance",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MEET_COMP_PRICE_QSTN) && de.AtrbValue != null && de.AtrbValue.ToString() != "Price / Performance").Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.COMP_BENCH, AttributeCodes.IA_BENCH }
                        }
                    }
                }
            };
        }

    }

}
