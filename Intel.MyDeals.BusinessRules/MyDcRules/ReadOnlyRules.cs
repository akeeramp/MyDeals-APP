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
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },

				new MyOpRule // Set to read only if you have a TRACKER NUMBER
                {
                    Title="Readonly if Tracker Exists",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.PRD_LEVEL,
                                AttributeCodes.REBATE_TYPE,
                                AttributeCodes.TRGT_RGN,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.DEAL_COMB_TYPE,
                                AttributeCodes.QTY,
                                AttributeCodes.ON_ADD_DT,
                                AttributeCodes.QLTR_BID_GEO,
                                AttributeCodes.QUOTE_LN_ID,
                                AttributeCodes.DEAL_SOLD_TO_ID,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.PRD_EXCLDS,
                                AttributeCodes.MRKT_SEG,
                                AttributeCodes.PAYOUT_BASED_ON
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if you have a TRACKER NUMBER (ECAP ONLY)
                {
                    Title="Readonly if Tracker Exists Table Row Only",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
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
                                AttributeCodes.DEAL_GRP_NM
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if you have a TRACKER NUMBER and the value has been populated
                {
                    Title="Readonly if Tracker Exists and Value is Populated",
                    ActionRule = MyDcActions.ReadOnlyIfValueIsPopulatedAndHasTracker,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.PERIOD_PROFILE
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if Stage is Won and value is populated",
                    ActionRule = MyDcActions.ReadOnlyIfValueIsPopulatedAndWon,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Target = new[] {
                                AttributeCodes.QLTR_PROJECT
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if you have a TRACKER NUMBER and AR_SETTLEMENT_LVL is Cash
                {
                    Title="Readonly if Tracker Exists and Value is Cash",
                    ActionRule = MyDcActions.ReadOnlyIfHasTrackerAndSettlementIsCash,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.AR_SETTLEMENT_LVL
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if you have a TRACKER NUMBER and Start Date is in the past
                {
                    Title="Readonly Start Date if Tracker Exists and Is In Past",
                    ActionRule = MyDcActions.ReadOnlyStartDateIfIsInPastAndHasTracker,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.START_DT
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if you have a TRACKER NUMBER and Start Date is in the past
                {
                    Title="Readonly End Date if Tracker Exists and Is In Past X Days",
                    ActionRule = MyDcActions.ReadOnlyEndDateIfIsTooOldAndHasTracker,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.END_DT
                            }
                        }
                    }
                },

                new MyOpRule // Allow edits only in re-deal cases
                {
                    Title="Readonly if NO Tracker Exists and Is in Re-Deal",
                    ActionRule = MyDcActions.ReadOnlyIfNotInRedeal,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.LAST_REDEAL_DT
                            }
                        }
                    }
                },

                //new MyOpRule
                //{
                //    Title="Readonly if contract # is positive",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    InObjType = new List<OpDataElementType> {OpDataElementType.CNTRCT},
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                //    AtrbCondIf = dc => dc.DcID > 0,
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetReadOnly,
                //            Target = new[] {
                //                AttributeCodes.CUST_ACCPT
                //            }
                //        }
                //    }
                //},

                new MyOpRule
                {
                    Title="Readonly for Frontend With No Tracker (Expire YCS2 Flag)",
                    ActionRule = MyDcActions.ReadOnlyFrontendWithNoTracker,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad }
                },

                new MyOpRule
                {
                    Title="Readonly for Overarching Max Volume and Dollar for Non Hybrid Deals if they don't contain any value",
                    ActionRule = MyDcActions.ReadOnlyNonHybridOverarchingFields,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad }
                },

                new MyOpRule
                {
                    Title="Readonly for Frontend With Tracker",
                    ActionRule = MyDcActions.ReadOnlyFrontendWithTracker,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.PRC_TBL_ROW },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Readonly if Not Backend and has tracker",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(),"Backend", StringComparison.OrdinalIgnoreCase) && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.EXPIRE_YCS2
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if Deal is Soft Expired",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.EXPIRE_FLG) && de.AtrbValue != null 
                        && String.Equals(de.AtrbValue.ToString(),"1", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.EXPIRE_YCS2
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if the deal has been cancelled (has a tracker + stage is cancelled)
                {
                    Title="Readonly if Cancelled",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
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
                                AttributeCodes.OEM_PLTFRM_EOL_DT,
                                AttributeCodes.OEM_PLTFRM_LNCH_DT,
                                AttributeCodes.PERIOD_PROFILE,
                                AttributeCodes.AR_SETTLEMENT_LVL,
                                AttributeCodes.CONSUMPTION_CUST_PLATFORM,
                                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                                AttributeCodes.CONSUMPTION_CUST_SEGMENT,
                                AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD,
                                AttributeCodes.TERMS
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if TENDER",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString() },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(),"TENDER", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.REBATE_TYPE,
                                AttributeCodes.PERIOD_PROFILE,
                                AttributeCodes.AR_SETTLEMENT_LVL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if Salesforce TENDER",
                    ActionRule = MyDcActions.SalesForceSetReadOnly,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString() },
                    // Looking for SFID didn't restrict like I had hoped.  Look into this down the road.
                    //AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.SALESFORCE_ID) && de.AtrbValue != null 
                    //    && de.AtrbValue.ToString() != "").Any()
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(),"TENDER", StringComparison.OrdinalIgnoreCase)).Any(),
                },

                new MyOpRule
                {
                    Title="Readonly if not TENDER",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString() },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.AtrbValue != null
                        && !String.Equals(de.AtrbValue.ToString(),"TENDER", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.QLTR_BID_GEO,
                                AttributeCodes.QLTR_PROJECT,
                                AttributeCodes.END_CUSTOMER_RETAIL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Read Only and Blank value if Rebate Type is...",
                    ActionRule = MyDcActions.DisableForActivityOrAccrual,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate},
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.VOL_TIER.ToString()},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && (de.HasValue("MDF ACTIVITY") ||
                                                                                                                 de.HasValue("MDF ACCRUAL") ||
                                                                                                                 de.HasValue("NRE ACCRUAL")) ).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.PERIOD_PROFILE
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Read Only for Vistex Hybrid Deals...",
                    ActionRule = MyDcActions.DisableForVistexHybrid,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate}
                },

                new MyOpRule
                {
                    Title="Server Deal Type Read Only if Product is not SvrWS",
                    ActionRule = MyDcActions.ShowServerDealType,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    // US52971 -  If Program Payment = Front end then user need to enter the sold to ID-not mandatory (sold to ID should be pulled by system for that customer div and Geo and multi select)-if left blank then it means all
                    Title="Readonly if Backend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(), "Backend", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.DEAL_SOLD_TO_ID
                            }
                        }
                    }
                },

                new MyOpRule // Set to read only if Frontend
                {
                    Title="Readonly if Frontend Deal",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate, MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.HasValue()
                        && !String.Equals(de.AtrbValue.ToString(), "Backend", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.ON_ADD_DT,
                                AttributeCodes.TRGT_RGN,
                                AttributeCodes.REBATE_BILLING_START,
                                AttributeCodes.REBATE_BILLING_END,
                                AttributeCodes.BACK_DATE_RSN,
                                AttributeCodes.PERIOD_PROFILE,
                                AttributeCodes.AR_SETTLEMENT_LVL
                            } // Items to set readonly
                        }
                    }
                },

                new MyOpRule // Set to read only if Expire YCS2 flag is Yes
                {
                    Title="Readonly if Expire YCS2 flag is Yes",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.EXPIRE_YCS2) && de.HasValue()
                        && string.Equals(de.AtrbValue.ToString(), "Yes", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.EXPIRE_YCS2
                            } 
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if no chipset",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PRODUCT_CATEGORIES) && de.AtrbValue != null
                        && !de.AtrbValue.ToString().Contains("CS") && dc.DcID > 0).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.CS_SHIP_AHEAD_STRT_DT,
                                AttributeCodes.CS_SHIP_AHEAD_END_DT
                            } 
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly WIP/Deal ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
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
                                AttributeCodes.DIV_APPROVED_BY,
                                AttributeCodes.ECAP_FLR,
                                AttributeCodes.EXPIRE_FLG,
                                AttributeCodes.GEO_APPROVED_BY,
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
                    Title="Readonly ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.SYS_COMMENTS
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly PTR ALWAYS",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
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
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.BACK_DATE_RSN
                            }
                        }
                    }
                },

                //new MyOpRule
                //{
                //    Title="Readonly Exclude Group Based on Stage",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnReadonly},
                //    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                //    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PS_WF_STG_CD) && (de.AtrbValue.ToString() == WorkFlowStages.Pending.ToString() || de.AtrbValue.ToString() == WorkFlowStages.Approved.ToString())).Any(),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetReadOnly,
                //            Target = new[] {AttributeCodes.DEAL_GRP_EXCLDS, AttributeCodes.DEAL_GRP_CMNT}
                //        }
                //    }
                //},

                new MyOpRule // DE30320 - Consumption Reason and Consumption Reason Comment fields should not be editable when Pay Out Based On = Billings : Error found in US53631: VOL TIER DEAL::Kendo Grid Validation + previous rule
                {
                    Title="Readonly if Not Consumption",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(), "Billings", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.REBATE_BILLING_START,
                                AttributeCodes.REBATE_BILLING_END,
                                AttributeCodes.CONSUMPTION_REASON,
                                AttributeCodes.CONSUMPTION_REASON_CMNT,
                                AttributeCodes.CONSUMPTION_CUST_PLATFORM,
                                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                                AttributeCodes.CONSUMPTION_CUST_SEGMENT,
                                AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if Not Backend (YCS2 only)", // This is being opened up for XAO3 deals, used to shut it down for all front end (DE20600)
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.AtrbValue != null
                        && String.Equals(de.AtrbValue.ToString(), "Frontend YCS2", StringComparison.OrdinalIgnoreCase)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.VOLUME
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Readonly if geo is WW",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnReadonly },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.GEO_COMBINED) && de.AtrbValue != null
                        && (String.Equals(de.AtrbValue.ToString() , "WW", StringComparison.OrdinalIgnoreCase) || String.Equals(de.AtrbValue.ToString(), "Worldwide", StringComparison.OrdinalIgnoreCase))).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetReadOnly,
                            Target = new[] {
                                AttributeCodes.TRGT_RGN
                            }
                        }
                    }
                },


            };
        }
    }
}