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
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate}
                },
                
                new MyOpRule
                {
                    Title="Required if MCP or PullIn and CPU ior CS",
                    ActionRule = MyDcActions.MeetCompMandatoryCheck,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired}
                },

                new MyOpRule
                {
                    Title="Required if Backdate Needed",
                    ActionRule = MyDcActions.BackdateRequired,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL}
                },

                new MyOpRule
                {
                    Title="Forecast Volume required if L1",
                    ActionRule = MyDcActions.ForecastVolumeRequired,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString(), OpDataElementSetType.VOL_TIER.ToString()}
                },

                new MyOpRule
                {
                    // If deal type is Vol Tier and Type is MDF ACTIVITY, then ensure that user fills in VOLUME values
                    Title="Forecast Volume Required if Program Type is MDF ACTIVITY",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.VOL_TIER.ToString()},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("MDF ACTIVITY")).Any(), 
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.FRCST_VOL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Send to Vistex Flag Required if Program Type is NRE",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString()},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("NRE")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.SEND_TO_VISTEX
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Setting Vistex Required for certain Payment and Rebate Types",
                    // Stays complex rule as extra checks are needed to carry out
                    ActionRule = MyDcActions.VistexRequiredFields,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString(), OpDataElementSetType.VOL_TIER.ToString()},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.PERIOD_PROFILE
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Setting Vistex Required for certain Payments Only",
                    ActionRule = MyDcActions.VistexRequiredFieldsProgramPaymentOnly,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.AR_SETTLEMENT_LVL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    // If deal type is Program and Type is NRE, then ensure that user fills in OEM_PLTFRM_LNCH_DT, OEM_PLTFRM_EOL_DT values
                    Title="Required if Program Type is NRE",
                    ActionRule = MyDcActions.ProgramNreDateChecks,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString()},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("NRE")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.OEM_PLTFRM_LNCH_DT,
                                AttributeCodes.OEM_PLTFRM_EOL_DT
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Required if User Defined RPU",
                    ActionRule = MyDcActions.UserDefinedRpuRequired,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL}
                },

                new MyOpRule
                {
                    Title="Required if ECAP Adjustment",
                    ActionRule = MyDcActions.EcapAdjRequired,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString()}
                },

                new MyOpRule
                {
                    Title="Server Deal Type Required if Product is SvrWS and Tender Deal",
                    ActionRule = MyDcActions.RequiredServerDealType,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate}
                },

                new MyOpRule
                {
                    Title="Required Fields at WIP for Tender Deals",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL}, 
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired}, 
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("TENDER")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                AttributeCodes.END_CUSTOMER_RETAIL,
                                AttributeCodes.PRIMED_CUST_CNTRY,
                                AttributeCodes.QLTR_PROJECT
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Required Fields at PTR for Tender Deals", // Merge with above if two other fields are removed from PTR
                    ActionRule = MyDcActions.ExecuteActions, 
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW}, 
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired}, 
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("TENDER")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetRequired,
                            Target = new[] {
                                //AttributeCodes.END_CUSTOMER_RETAIL,
                                //AttributeCodes.PRIMED_CUST_CNTRY,
                                AttributeCodes.QLTR_PROJECT
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="MUST BE LAST RULE: Fix Required if readonly or hidden",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.IsRequired && (de.IsHidden || de.IsReadOnly) ).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = BusinessLogicDeActions.SetNotRequired,
                            Where = de => de.IsRequired && (de.IsHidden || de.IsReadOnly)
                        }
                    }
                }

            };
        }
    }
}