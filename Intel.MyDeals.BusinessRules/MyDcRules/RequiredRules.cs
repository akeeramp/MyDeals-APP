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
                //new MyOpRule
                //{
                //    Title="Required if Consumption",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                //    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                //    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.AtrbValue != null && de.AtrbValue.ToString() != "Consumption").Any(),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetRequired,
                //            Target = new[] {AttributeCodes.CONSUMPTION_REASON }
                //        }
                //    }
                //},
                //new MyOpRule
                //{
                //    Title="Required if Market Segment",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                //    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                //    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MRKT_SEG) && de.AtrbValue != null && (de.AtrbValue.ToString().ToUpper().Contains("All Direct Market Segments") || de.AtrbValue.ToString().ToUpper().Contains("RETAIL"))).Any(),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetRequired,
                //            Target = new[] {AttributeCodes.RETAIL_CYCLE }
                //        }
                //    }
                //},
                //new MyOpRule
                //{
                //    Title="Req if Meet Comp is Price Performance",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                //    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                //    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MEET_COMP_PRICE_QSTN) && de.AtrbValue != null && de.AtrbValue.ToString() == "Price / Performance").Any(),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = BusinessLogicDeActions.SetRequired,
                //            Target = new[] {AttributeCodes.COMP_BENCH, AttributeCodes.IA_BENCH }
                //        }
                //    }
                //},

                new MyOpRule
                {
                    Title="Required if MCP or PullIn and CPU ior CS",
                    ActionRule = MyDcActions.MeetCompMandatoryCheck,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnRequired }
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
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString(), OpDataElementSetType.VOL_TIER.ToString() }
                },
                new MyOpRule
                {
                    // If deal type is Vol Tier and Type is MDF ACTIVITY, then ensure that user fills in VOLUME values
                    Title="Forecast Volume Required if Program Type is MDF ACTIVITY",
                    ActionRule = MyDcActions.VolTierMdfVolumeRequired,
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
                    Title="Setting Vistex Required for certain Payment and Rebate Types",
                    ActionRule = MyDcActions.VistexRequiredFields,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnRequired},
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString(), OpDataElementSetType.KIT.ToString(), OpDataElementSetType.VOL_TIER.ToString()},
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
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
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
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> {OpDataElementSetType.PROGRAM.ToString()}
                },
                new MyOpRule
                {
                    Title="Server Deal Type Required if Product is SvrWS and Tender Deal",
                    ActionRule = MyDcActions.RequiredServerDealType,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
                },
                new MyOpRule
                {
                    Title="End customer Required if Tender Deal",
                    ActionRule = MyDcActions.RequiredEndCustomer,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad, MyRulesTrigger.OnValidate }
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