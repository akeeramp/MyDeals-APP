using System.Collections.Generic;
using System.Linq;
using System;
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

                // HAS TRACKER RULES
				new MyOpRule // Set to read only if you have a TRACKER NUMBER
                {
                    Title="Readonly if Tracker Exists",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.CUST_ACCNT_DIV,
                                AttributeCodes.PRD_LEVEL,
                                AttributeCodes.REBATE_TYPE,
                                AttributeCodes.TRGT_RGN,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.QTY,
                                AttributeCodes.ON_ADD_DT,
                                AttributeCodes.QLTR_BID_GEO,
                                AttributeCodes.END_CUSTOMER_RETAIL,
                                AttributeCodes.DEAL_SOLD_TO_ID,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.PRD_EXCLDS,
                                AttributeCodes.MRKT_SEG,
                                AttributeCodes.PAYOUT_BASED_ON }
                        }
                    }
                },
				new MyOpRule // Set to read only if you have a TRACKER NUMBER (ECAP ONLY)
                {
					Title="Readonly if Tracker Exists",
					ActionRule = MyDcActions.ExecuteActions,
					InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW},
					InObjSetType = new List<string> {OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString()},
					Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
					AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
					OpRuleActions = new List<OpRuleAction<IOpDataElement>>
					{
						new OpRuleAction<IOpDataElement>
						{
							Action = BusinessLogicDeActions.SetReadOnly,
							Target = new[] {
								AttributeCodes.PROD_INCLDS,
								AttributeCodes.PTR_USER_PRD,
                                AttributeCodes.QTY,
                                AttributeCodes.DEAL_GRP_NM}
						}
					}
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
                    Title="Readonly if Not Backend and has tracker",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && String.Equals(de.AtrbValue.ToString(),"Backend", StringComparison.OrdinalIgnoreCase) && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.EXPIRE_YCS2 }
                        }
                    }
                },
                new MyOpRule // Set to read only if the deal has been cancelled (has a tracker + stage is cancelled)
                {
                    Title="Readonly if Cancelled",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.IS_CANCELLED) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.START_DT,
                                AttributeCodes.END_DT,
                                AttributeCodes.PTR_USER_PRD,
                                AttributeCodes.DEAL_DESC,
                                AttributeCodes.VOLUME,
                                AttributeCodes.ECAP_PRICE,
                                AttributeCodes.DSCNT_PER_LN,
                                AttributeCodes.QTY,
                                AttributeCodes.DEAL_COMB_TYPE,
                                AttributeCodes.DEAL_GRP_EXCLDS,
                                AttributeCodes.DEAL_GRP_CMNT,
                                AttributeCodes.ON_ADD_DT,
                                AttributeCodes.YCS2_OVERLAP_OVERRIDE,
                                AttributeCodes.REBATE_BILLING_START,
                                AttributeCodes.REBATE_BILLING_END,
                                AttributeCodes.CONSUMPTION_REASON,
                                AttributeCodes.CONSUMPTION_REASON_CMNT,
                                AttributeCodes.BACK_DATE_RSN_TXT,
                                AttributeCodes.BACK_DATE_RSN,
                                AttributeCodes.TIER_NBR,
                                AttributeCodes.STRT_VOL,
                                AttributeCodes.END_VOL,
                                AttributeCodes.TOTAL_DOLLAR_AMOUNT,
                                AttributeCodes.ADJ_ECAP_UNIT,
                                AttributeCodes.USER_AVG_RPU,
                                AttributeCodes.USER_MAX_RPU,
                                AttributeCodes.RATE,
                                AttributeCodes.TERMS }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if Deal on Hold",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.WF_STG_CD) && de.AtrbValue != null && String.Equals(de.AtrbValue.ToString(),"Hold", StringComparison.OrdinalIgnoreCase) && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] { AttributeCodes.DEAL_GRP_EXCLDS, AttributeCodes.DEAL_GRP_CMNT }
                        }
                    }
                },
                new MyOpRule
                {
                    Title="Readonly if not TENDER",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString()},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.AtrbValue != null && !String.Equals(de.AtrbValue.ToString(),"TENDER", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] { AttributeCodes.QLTR_BID_GEO, AttributeCodes.QLTR_PROJECT, AttributeCodes.END_CUSTOMER_RETAIL }
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
                    // US52971 -  If Program Payment = Front end then user need to enter the sold to ID-not mandatory (sold to ID should be pulled by system for that customer div and Geo and multi select)-if left blank then it means all 
                    Title="Readonly if Backend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && String.Equals(de.AtrbValue.ToString(), "Backend", StringComparison.OrdinalIgnoreCase)).Any(),
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
                    Title="Readonly if Frontend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.HasValue() && !String.Equals(de.AtrbValue.ToString(), "Backend", StringComparison.OrdinalIgnoreCase)).Any(),
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
                    Title="Readonly if no chipset",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PRODUCT_CATEGORIES) && de.AtrbValue != null && !de.AtrbValue.ToString().Contains("CS") && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] 
                            {
                                AttributeCodes.CS_SHIP_AHEAD_STRT_DT,
                                AttributeCodes.CS_SHIP_AHEAD_END_DT
                            } // Items to set reasonly
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
                                AttributeCodes.BID_STATUS,
                                AttributeCodes.BLLG_DT,
                                AttributeCodes.CAP,
                                AttributeCodes.CAP_END_DT,
                                AttributeCodes.CAP_STRT_DT,
                                AttributeCodes.COST_TEST_RESULT,
                                AttributeCodes.COST_TYPE_USED,
                                AttributeCodes.CUST_DIV_NM,
                                AttributeCodes.CREDIT_AMT,
                                AttributeCodes.CREDIT_VOLUME,
                                AttributeCodes.DEAL_GRP_NM,
                                AttributeCodes.DEBIT_AMT,
                                AttributeCodes.DEBIT_VOLUME,
                                AttributeCodes.DC_ID,
                                AttributeCodes.DC_PARENT_ID,
                                AttributeCodes.ECAP_FLR,
                                AttributeCodes.EXPIRE_FLG,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.HAS_SUBKIT,
                                AttributeCodes.MEETCOMP_TEST_RESULT,
                                AttributeCodes.OBJ_SET_TYPE_CD,
                                AttributeCodes.ORIG_ECAP_TRKR_NBR,
                                AttributeCodes.PAYOUT_BASED_ON,
                                AttributeCodes.PRD_EXCLDS,
                                AttributeCodes.PASSED_VALIDATION,
                                AttributeCodes.PRODUCT_FILTER,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.PTR_USER_PRD,
                                AttributeCodes.PRODUCT_CATEGORIES,
                                AttributeCodes.PROD_INCLDS,
                                AttributeCodes.TITLE,
                                AttributeCodes.TRKR_NBR,
                                AttributeCodes.TRKR_START_DT,
                                AttributeCodes.TRKR_END_DT,
                                AttributeCodes.WF_STG_CD,
                                AttributeCodes.YCS2_END_DT,
                                AttributeCodes.YCS2_PRC_IRBT,
                                AttributeCodes.YCS2_START_DT
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
                new MyOpRule
                {
                    Title="Readonly Exclude Group Based on Stage",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PS_WF_STG_CD) && (de.AtrbValue.ToString() == WorkFlowStages.Pending.ToString() || de.AtrbValue.ToString() == WorkFlowStages.Approved.ToString())).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.DEAL_GRP_EXCLDS, AttributeCodes.DEAL_GRP_CMNT}
                        }
                    }
                },
                new MyOpRule // DE30320 - Consumption Reason and Consumption Reason Comment fields should not be editable when Pay Out Based On = Billings : Error found in US53631: VOL TIER DEAL::Kendo Grid Validation + previous rule
                {
                    Title="Readonly if Not Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && String.Equals(de.AtrbValue.ToString(), "Billings", StringComparison.OrdinalIgnoreCase)).Any(),
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
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null && !String.Equals(de.AtrbValue.ToString(), "Backend", StringComparison.OrdinalIgnoreCase)).Any(),
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
                    Title="Readonly if geo is WW",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.GEO_COMBINED) && de.AtrbValue != null && (String.Equals(de.AtrbValue.ToString() , "WW", StringComparison.OrdinalIgnoreCase) || String.Equals(de.AtrbValue.ToString(), "Worldwide", StringComparison.OrdinalIgnoreCase))).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.TRGT_RGN }
                        }
                    }
                },
				// TODO: maybe have or not???
				new MyOpRule
                {
                    Title="Readonly if not Additive or Non Additive",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.DEAL_COMB_TYPE) && de.AtrbValue != null && !String.Equals(de.AtrbValue.ToString(), "Additive", StringComparison.OrdinalIgnoreCase) && !String.Equals(de.AtrbValue.ToString(), "Non Additive", StringComparison.OrdinalIgnoreCase)).Any(), // (!string.Equals(de.AtrbValue.ToString(), "Additive", StringComparison.OrdinalIgnoreCase)) && !string.Equals(de.AtrbValue.ToString(), "Non Additive", StringComparison.OrdinalIgnoreCase)).Any(),
					OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {AttributeCodes.DEAL_GRP_EXCLDS }
                        }
                    }
                }



            };
        }

    }

}
