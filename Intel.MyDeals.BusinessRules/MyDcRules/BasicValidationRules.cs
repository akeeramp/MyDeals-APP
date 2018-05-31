using System.Collections.Generic;
using System;
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
                    Title="Must have a positive value",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive" },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.NUM_OF_TIERS }) && de.IsNegativeOrZero()
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
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.VOLUME }) && de.HasValue() && de.IsNegativeOrZero()
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
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.FRCST_VOL }) && de.HasValue() && de.IsNegativeOrZero()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="User Defined AVG RPU cannot be negative",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive or zero" },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.USER_AVG_RPU }) && de.HasValue() && de.IsNegative()
                        }
                    }
                },
                new MyOpRule
                {
                    Title="User Defined MAX RPU cannot be negative",
                    ActionRule = MyDcActions.ExecuteActions,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be positive or zero" },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.USER_MAX_RPU }) && de.HasValue() && de.IsNegative()
                        }
                    }
                },
				new MyOpRule
				{
					Title="Rate must have a positive value",
					//ActionRule = MyDcActions.ExecuteActions,
                    ActionRule = MyDcActions.ValidateTierRate,
					InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
					InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString() },
					Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
					AtrbCondIf = dc => dc.IsNegative(AttributeCodes.RATE)
				},
                new MyOpRule
                {
                    Title="Check for Modified or deleted Products",
                    ActionRule = MyDcActions.CheckForModifiedProducts,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
                    InObjSetType = new List<string> { OpDataElementSetType.PROGRAM.ToString(), OpDataElementSetType.VOL_TIER.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                },
                new MyOpRule
				{
					Title="Must be greater than 0",
					ActionRule = MyDcActions.ValidateTierStartVol,
					InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
					InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString() },
					Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate },
					AtrbCondIf = dc => dc.IsNegativeOrZero(AttributeCodes.STRT_VOL)
				},
				new MyOpRule
				{
					Title="Must be greater than 0",
					ActionRule = MyDcActions.ValidateTierEndVol,
					InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
					InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString() },
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
					InObjSetType = new List<string> { OpDataElementSetType.VOL_TIER.ToString() },
					Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
				},
                new MyOpRule
                {
                    Title="Clear SYS_COMMENTS field upon load", // This rule is to clear out original SYS_COMMENT that gets pre-pended to redeal messages
                    ActionRule = MyDcActions.ClearSysComments,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnLoad }
                },
				//new MyOpRule
				//{
				//	Title="End Volume must be greater than Start volume",
				//	ActionRule = MyDcActions.ExecuteActions,
				//	Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
    //                AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.END_VOL) && de.HasValue()).Any(),
				//	OpRuleActions = new List<OpRuleAction<IOpDataElement>>
				//	{
				//		new OpRuleAction<IOpDataElement>
				//		{
				//			Action = MyDeActions.IsGreaterThan,
				//			Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.END_VOL}) || de.AtrbCdIn(new List<string> {AttributeCodes.STRT_VOL}),
				//			Args = new object[] {"{0} must be positive"},
				//		}
				//	}
				//}, 
				new MyOpRule
                {
                    Title="Check for Atrb Changes for TimeLine",
                    ActionRule = MyDcActions.TimelineAtrbChangeCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
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
                    Title="Check for Major Change by adding Pricing Table",
                    ActionRule = MyDcActions.MajorChangeAddPtCheck,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnMergeComplete }
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
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST, OpDataElementType.PRC_TBL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.AddMessage,
                            Args = new object[] { "{0} must be no more than 80 characters." },
                            Where = de => de.AtrbCdIn(new List<string> { AttributeCodes.TITLE }) && de.ExceedsMaxLength(80)
                        }
                    }
                },

				new MyOpRule
				{
                    //US 53204 - 8 - On add date-If Market segment is Consumer retail or ALL, then default to current quarter first date, other wise Blank. user can edit.
                    Title="On Ad Validation Set Default",
					ActionRule = MyDcActions.ExecuteOnAd,
					InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
					Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
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
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave },
                    InObjType = new List<OpDataElementType> { OpDataElementType.CNTRCT, OpDataElementType.PRC_ST },
                    AtrbCondIf = dc => dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.TITLE) && de.HasValueChanged && de.HasValue()).Any(),
                    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                    {
                        new OpRuleAction<IOpDataElement>
                        {
                            Action = MyDeActions.CheckDuplicateObjectTitle,
                            Args = new object[] { "Title already exists in system" },
                            Target = new[] { AttributeCodes.TITLE }
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
                //new MyOpRule
                //{
                //    Title="Make sure End Date is later than Credit Date",
                //    ActionRule = MyDcActions.ExecuteActions,
                //    Triggers = new List<MyRulesTrigger> {MyRulesTrigger.OnValidate},
                //    AtrbCondIf = dc => dc.IsDateBefore(AttributeCodes.END_DT, AttributeCodes.BLLG_DT),
                //    OpRuleActions = new List<OpRuleAction<IOpDataElement>>
                //    {
                //        new OpRuleAction<IOpDataElement>
                //        {
                //            Action = MyDeActions.AddMessage,
                //            Args = new object[] {"End date must be greater than any Credit date."},
                //            Where = de => de.AtrbCdIn(new List<string> {AttributeCodes.END_DT})
                //        }
                //    }
                //},
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
                    Title="Volume Validation",
                    ActionRule = MyDcActions.CheckVolume,
                    InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
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
                    Title="Server Deal Type Validation",
                    ActionRule = MyDcActions.ValidateServerDealType,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
                },
                new MyOpRule
				{
					Title="DropDown Value Validations",
					ActionRule = MyDcActions.CheckDropDownValues,
					InObjType = new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW },
					Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave, MyRulesTrigger.OnValidate }
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
                    Title="KIT Product Grid validations",
                    ActionRule = MyDcActions.ValidateKITGridProducts,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate }
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
                    Title="SUBKIT ECAP equal to total discounts per line check",
                    ActionRule = MyDcActions.ValidateSubKitRebateBundleDiscount,
                    InObjType = new List<OpDataElementType> { OpDataElementType.WIP_DEAL },
                    InObjSetType = new List<string> { OpDataElementSetType.KIT.ToString() },
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnValidate, MyRulesTrigger.OnLoad }
                },
                new MyOpRule
                {
                    Title="Add Timeline Comments for New Items",
                    ActionRule = MyDcActions.NewObjTimeLineComment,
                    Triggers = new List<MyRulesTrigger> { MyRulesTrigger.OnSave }
                }

            };
        }
    }
}