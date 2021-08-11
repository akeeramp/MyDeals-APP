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
                //new MyOpRule
                //{
                //    Title="Compress Product Json",
                //    ActionRule = MyDcActions.CompressJson,
                //    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW},
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnSave}
                //},
                //new MyOpRule
                //{
                //    Title="UnCompress Product Json",
                //    ActionRule = MyDcActions.UnCompressJson,
                //    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW},
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnLoad}
                //},

                new MyOpRule
                {
                    Title="Must have a positive Num Tiers value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive" },
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.NUM_OF_TIERS 
                            }) && de.IsNegativeOrZero()
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Enforce Required Fields",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} is required" },
                            Where = de => de.IsRequired && de.HasNoValue()
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Must have a positive value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive" },
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.VOLUME 
                            }) && de.HasValue() && de.IsNegativeOrZero()
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Forecast Volume must have a positive or zero value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive" },
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.FRCST_VOL 
                            }) && de.HasValue() && de.IsNegativeOrZero()
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Value cannot be negative",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive or zero" },
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.USER_AVG_RPU, 
                                AttributeCodes.USER_MAX_RPU 
                            }) && de.HasValue() && de.IsNegative()
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Rate must have a positive value",
					//ActionRule = MyDcActions.ExecuteActions,
                    ActionRule = MyDcActions.ValidateTierRate,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegative(AttributeCodes.RATE)
                },

                new MyOpRule
                {
                    Title="Must be greater than 0 Start Vol",
                    ActionRule = MyDcActions.ValidateTierStartVol,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.STRT_VOL)
                },

                new MyOpRule
                {
                    Title="Must be greater than 0 End Vol",
                    ActionRule = MyDcActions.ValidateTierEndVol,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.END_VOL)
                },

                new MyOpRule
                {
                    Title="Rollup Error Message",
                    ActionRule = MyDcActions.RollUpErrorMessage,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnPostValidate },
                },

                new MyOpRule
                {
                    Title="Quantity must be greater than 0",
                    ActionRule = MyDcActions.ValidateTierQty,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.QTY)
                },

                new MyOpRule
                {
                    Title="Tiered ECAP value check",
                    ActionRule = MyDcActions.ValidateTierEcap,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.ECAP_PRICE)
                },

                new MyOpRule
                {
                    Title="Qty must be a whole number",
					//ActionRule = MyDcActions.ExecuteActions,
                    ActionRule = MyDcActions.ValidateTieredQty,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                },

                new MyOpRule
                {
                    Title="End Vol must be greater than start vol",
                    ActionRule = MyDcActions.CompareStartEndVol,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Tier Numbers must match Tier Level",
                    ActionRule = MyDcActions.ValidateTierNumber,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Clear SYS_COMMENTS field upon load", // This rule is to clear out original SYS_COMMENT that gets pre-pended to re-deal messages
                    ActionRule = MyDcActions.ClearSysComments,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad }
                },

                new MyOpRule
                {
                    Title="Check for Atrb Changes for TimeLine",
                    ActionRule = MyDcActions.TimelineAtrbChangeCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Check for Product changes in WIP",
                    ActionRule = MyDcActions.ModifiedProductCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnMergeComplete }
                },

                new MyOpRule
                {
                    Title="Check for Expire Flag",
                    ActionRule = MyDcActions.CheckExpireFlag,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Validate ECAP Price",
                    ActionRule = MyDcActions.ValidateEcapPrice,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Does not exceed max character limit",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be no more than 80 characters." },
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.TITLE 
                            }) && de.ExceedsMaxLength(80)
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Contract Title Does not exceed max character limit",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be no more than 250 characters." },
                            Where = de => de.AtrbCdIn(new List<string> {
                                AttributeCodes.TITLE
                            }) && de.ExceedsMaxLength(255)
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate Field String Length",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckAtrbLength,
                            Args = new object[] { new Dictionary<string, int> { 
                                { AttributeCodes.QLTR_PROJECT, 65 }, 
                                { AttributeCodes.END_CUSTOMER_RETAIL, 100 } 
                            } },
                            Target = new[] {
                                AttributeCodes.QLTR_PROJECT,
                                AttributeCodes.END_CUSTOMER_RETAIL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate that FLEX deal is Billings Based",
                    ActionRule = MyDcActions.ValidateFlexIsBillings,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    //US 53204 - 8 - On add date-If Market segment is Consumer retail or ALL, then default to current quarter first date, other wise Blank. user can edit.
                    Title="On Ad Validation Set Default",
                    ActionRule = MyDcActions.ExecuteOnAd,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Title already exists check",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.TITLE) && de.HasValueChanged && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckDuplicateObjectTitle,
                            Args = new object[] { "Title already exists in system" },
                            Target = new[] {
                                AttributeCodes.TITLE
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Make sure End Date is later than Start Date",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsDateBefore(AttributeCodes.END_DT, AttributeCodes.START_DT),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "End date must be after the start date." },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.END_DT })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Deal End Date should be earlier than OEM EOL Platform Date",
                    ActionRule = MyDcActions.ProgramNreDateChecks,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("NRE")).Any()
                        && dc.IsDateBefore(AttributeCodes.OEM_PLTFRM_EOL_DT, AttributeCodes.END_DT),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "Deal End Date should be earlier than OEM EOL Platform Date." },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.OEM_PLTFRM_EOL_DT })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Make sure OEM Platform EOL Date is later than OEM Platform Launch Date",
                    ActionRule = MyDcActions.ProgramNreDateChecks,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.REBATE_TYPE) && de.HasValue("NRE")).Any()
                        && dc.IsDateBefore(AttributeCodes.OEM_PLTFRM_EOL_DT, AttributeCodes.OEM_PLTFRM_LNCH_DT),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "OEM Platform EOL Date must be after the OEM Platform Launch Date." },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.OEM_PLTFRM_EOL_DT })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="End Date in Past can only Extend",
                    ActionRule = MyDcActions.PastEndDateExtendOnly,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.END_DT) && !de.IsDateInPast()).Any()
                    // Change to this is Jyoti asks for Tracker only implement of this:
                    //AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.HAS_TRACKER) && de.HasValue("1")).Any(),
                },

                new MyOpRule
                {
                    Title="User Set Re-Deal cannot be before Previous Re-deal Date",
                    ActionRule = MyDcActions.RedealNoEarlierThenPrevious,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Blank Profile Values for Hybrid Deals",
                    ActionRule = MyDcActions.VistexBlankFields,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Default Workflow on Save",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.DC_ID),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckInitialWorkFlow,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.WF_STG_CD })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Default Salesforce Workflow on Save",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.DC_ID) && dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.SALESFORCE_ID) && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckSalesForceInitialWorkFlow,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.WF_STG_CD })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Set Creation Messages for SalesForce Deals",
                    ActionRule = MyDcActions.SetSalesForceCreationMessages,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_ST, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.DC_ID),
                },

                //CheckForIntegerValues
                new MyOpRule
                {
                    Title="Volume Validation",
                    ActionRule = MyDcActions.CheckVolume,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Tier and Forecast Max Volume Checks",
                    ActionRule = MyDcActions.CheckTierAndMaxVolumes,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.PROGRAM.ToString(), OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Target = new[] {
                                AttributeCodes.FRCST_VOL,
                                AttributeCodes.STRT_VOL, 
                                AttributeCodes.END_VOL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Frontend can't be consumption",
                    ActionRule = MyDcActions.CheckFrontendConsumption,
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.HasValue()).Any(),
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Tender rebate must be consumption",
                    ActionRule = MyDcActions.CheckTenderConsumption,
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.HasValue()).Any(),
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.PROGRAM.ToString() },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },
                
                new MyOpRule
                {
                    Title="Deal End Date can't be greater than twenty years from Start Date",
                    ActionRule = MyDcActions.CheckMaxDealEndDate,
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW,OpDataElementType.WIP_DEAL},
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate}
                },

                new MyOpRule
                {
                    Title="Restrict Long Term VT deals to 1 year",
                    ActionRule = MyDcActions.LongTermVolTierDates,
                    InObjType = new List<OpDataElementType> {OpDataElementType.PRC_TBL_ROW,OpDataElementType.WIP_DEAL},
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString() },
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate}
                },

                new MyOpRule
                {
                    Title="Restrict FLEX deals dates based on row type",
                    ActionRule = MyDcActions.FlexDateRange,
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL, OpDataElementType.PRC_TBL_ROW},
                    InObjSetType = new List<string> { OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate}
                },

                new MyOpRule
                {
                    Title="Ceiling Volume Tender Validation",
                    ActionRule = MyDcActions.CheckCeilingVolume,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Flex Draining Tier Must Start at 1",
                    ActionRule = MyDcActions.FlexDrainingTierCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="End Volume can only be raised if object has a tracker",
                    ActionRule = MyDcActions.LastTierEndVolumeCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString(), OpDataElementSetType.FLEX.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Frontend can't be created without Sold To and Price Grp Code",
                    ActionRule = MyDcActions.CheckFrontendSoldPrcGrpCd,
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PROGRAM_PAYMENT) && de.HasValue()).Any(),
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Billing Date Validations",
                    ActionRule = MyDcActions.CheckBillingDates,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Overarching Validation",
                    ActionRule = MyDcActions.ValidateOverarching,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Overarching Validation in PTR",
                    ActionRule = MyDcActions.ValidateOverarchingInPTR,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Server Deal Type Validation",
                    ActionRule = MyDcActions.ValidateServerDealType,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="DropDown Value Validations",
                    ActionRule = MyDcActions.CheckDropDownValues,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave, MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Settlement Level Validation for Active Deals",
                    ActionRule = MyDcActions.ValidateArSettlementLevelForActiveDeal,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave, MyRulesTrigger.OnValidate },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Target = new[] {
                                AttributeCodes.AR_SETTLEMENT_LVL
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Customer Division Value Validations",
                    ActionRule = MyDcActions.CheckCustDivValues,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Update Consumption Lookback Period Date on Change",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD) && de.HasValueChanged).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.UpdateConsumptionLookbackPeriodDate,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.CNSMPTN_LKBACK_PERD_DT })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate Market Segments",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.MRKT_SEG) && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckMarketSegment,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.MRKT_SEG })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Clear when payout based on is billings",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.HasValue("Billings") && de.HasValueChanged).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.ClearNewDefaultValues,
                            Where = de => de.AtrbCdIn(new List<string> { 
                                AttributeCodes.CONSUMPTION_CUST_PLATFORM, 
                                AttributeCodes.CONSUMPTION_CUST_SEGMENT, 
                                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                                AttributeCodes.CONSUMPTION_COUNTRY,
                                AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD,
                                AttributeCodes.CONSUMPTION_REASON,
                                AttributeCodes.CONSUMPTION_REASON_CMNT
                            })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Reset customer level defaults on payout based on consumption",
                    ActionRule = MyDcActions.SetCustDefaultValues,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PAYOUT_BASED_ON) && de.HasValue("Consumption")).Any() // Check if this triggers rule
                },

                new MyOpRule
                {
                    Title="Validate Geos",
                    ActionRule = MyDcActions.CheckGeos,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Validate Consumption Reason",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.CONSUMPTION_REASON)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckConsumptionReason,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.CONSUMPTION_REASON })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate Consumption Reason Comments for Other",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.CONSUMPTION_REASON) && de.HasValue("Other")).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckConsumptionReasonCmnt,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.CONSUMPTION_REASON_CMNT })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Trigger field validation message if present value is left blank, WIP only",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                    InObjType = new List<OpDataElementType> {OpDataElementType.WIP_DEAL},
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.ConsumptionLookbackPeriodCheck,
                            //Args = new object[] { "{0} must be populated with a positive value" }, // Used if there was more then one atrb matching, backed out since this because a single purpose rule
                            Where = de => de.AtrbCdIn(new List<string> {
                                AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD
                            }) && !(de.IsHidden || de.IsReadOnly) // Safety check to not enforce if read only or hidden
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Clear un-needed values for new WIP attributes",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.ClearNewDefaultValues,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD }) && de.AtrbValue.ToString() == "-1" && de.DcID < 0 && (de.IsHidden || de.IsReadOnly)
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate Group Type",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.DEAL_COMB_TYPE)).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckDealCombType,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.DEAL_COMB_TYPE })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Validate Target Regions",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.TRGT_RGN) && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckTargetRegions,
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.TRGT_RGN })
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Check Tender Settings",
                    ActionRule = MyDcActions.CheckTenderSettings,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW }
                },

                new MyOpRule
                {
                    Title="Validate Product Json",
                    ActionRule = MyDcActions.CheckProductJson,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW }
                },

                new MyOpRule
                {
                    Title="Program NRE/MDF Deals default to Additive",
                    ActionRule = MyDcActions.DefaultProgramAdditive,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.PROGRAM.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Total dollar amount must be positive for non-debit memos but negative for debit memos",
                    ActionRule = MyDcActions.CheckTotalDollarAmount,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.PROGRAM.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Adjusted ECAP Units must have a positive value",
                    ActionRule = MyDcActions.CheckEcapAdjUnit,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="KIT Product Spreadsheet validations",
                    ActionRule = MyDcActions.ValidateKITSpreadsheetProducts,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Frontend XOA3 L1/L2 product validation",
                    ActionRule = MyDcActions.ValidateFrontendXOA3Products,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString(), OpDataElementSetType.ECAP.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                },

                new MyOpRule
                {
                    Title="Improperly removed CAP value check",
                    ActionRule = MyDcActions.CheckForBadCapRemoval,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString(), OpDataElementSetType.ECAP.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title="Incorrect CAP dates check",
                    ActionRule = MyDcActions.CheckForBadCapDates,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL, OpDataElementType.DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString(), OpDataElementSetType.ECAP.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

				//new MyOpRule
				//{
				//	Title="Qty cannot be negative",
				//	ActionRule = MyDcActions.ExecuteActions,
				//	Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
				//	InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL},
				//	InObjSetType = new List<string> {OpDataElementSetType.KIT.ToString()},
				//	OpRuleActions = new List<OpRuleAction<IOpDataElement>>
				//	{
				//		new OpRuleAction<IOpDataElement>
				//		{
				//			Action = MyDeActions.AddMessage,
				//			Args = new object[] {"{0} must be positive or zero"},
				//			Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.QTY }) && de.HasValue() && de.IsNegative()
				//		}
				//	}
				//},

                new MyOpRule
                {
                    Title="Translate PRODUCT_FILTER to English",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.TranslateProductFilter,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnDealListLoad },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL }
                },

                new MyOpRule
                {
                    Title="Apply Tender Bid Actions ",
                    ActionRule = MyOpDataCollectorFlattenedItemActions.ApplyTenderActionsAndSettings,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnDealListLoad },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.ECAP.ToString() , OpDataElementSetType.KIT.ToString() }
                },

                new MyOpRule
                {
                    Title="KIT ECAP equal to total discounts per line check",
                    ActionRule = MyDcActions.ValidateKitRebateBundleDiscount,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate, MyRulesTrigger.OnLoad }
                },

                new MyOpRule
                {
                    Title="SUB-KIT ECAP equal to total discounts per line check",
                    ActionRule = MyDcActions.ValidateSubKitRebateBundleDiscount,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate, MyRulesTrigger.OnLoad }
                },

                new MyOpRule
                {
                    Title="End Customer has been Unified",
                    ActionRule = MyDcActions.ValidatePrimeCust,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="End Customer country has been selected",
                    ActionRule = MyDcActions.ValidatePrimeCountry,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },

                new MyOpRule
                {
                    Title="Pull Values From Save Stack",
                    ActionRule = MyDcActions.ExecuteActions,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave, MyRulesTrigger.OnValidate },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.PullValuesFromSaveStack,
                            Target = new[] {
                                AttributeCodes.TRKR_START_DT,
                                AttributeCodes.TRKR_END_DT
                            }
                        }
                    }
                },

                new MyOpRule
                {
                    Title="Add Timeline Comments for New Items",
                    ActionRule = MyDcActions.NewObjTimeLineComment,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },

                new MyOpRule
                {
                    Title = "Billings based KIT cannot be created for Vistex Customer",
                    ActionRule = MyDcActions.ValidateVistexKITPayoutBasedOn,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave, MyRulesTrigger.OnValidate }
                },

                #region Must be last Validation rules

                new MyOpRule
                {
                    Title="Check for Major Change by adding Pricing Table",
                    ActionRule = MyDcActions.MajorChangeAddPtCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnMergeComplete }
                },

                new MyOpRule
                {
                    Title="Check for Major Changes",
                    ActionRule = MyDcActions.MajorChangeCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnFinalizeSave, MyRulesTrigger.OnMergeComplete }
                },

                new MyOpRule
                {
                    Title="Check for Major Wrong Way Changes to Update Tracker",
                    ActionRule = MyDcActions.MajorWrongWayChangeCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnFinalizeSave, MyRulesTrigger.OnMergeComplete }
                },

                new MyOpRule
                {
                    Title="Add history message for changed fields",
                    ActionRule = MyDcActions.AddHistoryMessagesForChanges,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Target = new[] {
                                AttributeCodes.CONSUMPTION_CUST_PLATFORM,
                                AttributeCodes.CONSUMPTION_CUST_SEGMENT,
                                AttributeCodes.CONSUMPTION_CUST_RPT_GEO,
                                AttributeCodes.CONSUMPTION_COUNTRY,
                                AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD,
                                AttributeCodes.CONSUMPTION_REASON,
                                AttributeCodes.CONSUMPTION_REASON_CMNT,
                                AttributeCodes.START_DT,
                                AttributeCodes.END_DT,
                                AttributeCodes.REBATE_BILLING_START,
                                AttributeCodes.REBATE_BILLING_END,
                                AttributeCodes.AR_SETTLEMENT_LVL,
                                AttributeCodes.CUST_ACCNT_DIV,
                                AttributeCodes.GEO_COMBINED,
                                AttributeCodes.PRD_EXCLDS,
                                AttributeCodes.MRKT_SEG,
                                AttributeCodes.PAYOUT_BASED_ON,
                                AttributeCodes.PERIOD_PROFILE,
                                AttributeCodes.PROGRAM_PAYMENT,
                                AttributeCodes.REBATE_TYPE,
                                AttributeCodes.QTY,
                                AttributeCodes.SOLD_TO_ID,
                                AttributeCodes.DEAL_SOLD_TO_ID,
                                AttributeCodes.VOLUME,
                                AttributeCodes.TOTAL_DOLLAR_AMOUNT,
                                AttributeCodes.END_VOL,
                                AttributeCodes.RATE,
                                AttributeCodes.TITLE // Product Title at Deal Level
                            }
                        }
                    }
                }
                #endregion

            };
        }
    }
}