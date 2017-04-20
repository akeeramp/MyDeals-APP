using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// MyOpRules Configuration.  Single source for all rules.  The actual rules will be stored and pulled from
    /// the AllRules class.  This is just the interface to pull and apply the rules.
    /// </summary>
    public static class MyRulesConfiguration
    {
        /// <summary>
        /// Container for ALL MYOPRULES.  It would be nice if this came from the DB, cached and managed via an admin page, but for now
        /// it will pull from static files.
        /// </summary>
        public static List<MyOpRule> AttrbRules
        {
            get
            {
                if (_attrbRules != null && _attrbRules.Any()) return _attrbRules;

                _attrbRules = new List<MyOpRule>();
                _attrbRules.AddRange(AllRules.GetReadOnlyRules());
                _attrbRules.AddRange(AllRules.GetBasicValidationRules());
                _attrbRules.AddRange(AllRules.GetAutomatedTestingRules());
                _attrbRules.AddRange(AllRules.GetOpCollectorToDictRules());

                return _attrbRules;
            }
        }
        private static List<MyOpRule> _attrbRules;

        /// <summary>
        /// Apply rules based on a trigger.  Based on the OpDataCollector and the trigger, the appropriate rules will be run
        /// </summary>
        /// <param name="dc">OpDataCollector</param>
        /// <param name="ruleTriggerPoint">Rules Trigger used to find the correct rules to fire</param>
        /// <param name="securityActionCache">Used for performance optimization when dealing with security attributes.</param>
        /// <param name="args">Any extra arguments to pass</param>
        /// <returns></returns>
        public static OpMsgQueue ApplyRules(this OpDataCollector dc, MyRulesTrigger ruleTriggerPoint, Dictionary<string, bool> securityActionCache = null, params object[] args)
        {
            OpDataElementType dcType = (OpDataElementType)Enum.Parse(typeof(OpDataElementType), dc.DcType);
            string objsetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            IEnumerable<MyOpRule> attrbRules = AttrbRules;
            attrbRules = attrbRules.Where(a => !a.InObjType.Any() || a.InObjType.Contains(dcType));
            attrbRules = attrbRules.Where(a => !a.InObjSetType.Any() || a.InObjSetType.Contains(objsetType));

            return MyOpRulesLib.ApplyRules(dc, ruleTriggerPoint, attrbRules.ToList(), securityActionCache, args);
        }

        

        // THESE ARE DCS RULES AND NOT TO BE BROUGHT IN.  THESE ARE USED AS REFERENCES TO ENSURE THE ENGINE CAN HANDLE THEM
        // TODO REMOVE THESE AFTER THE ENGINE IS PROVEN OUT

        //public static void PopulateDealTypeRules()
        //{
        //    attrbRules = new List<AttributeRule>();

        //    #region VolTier

        //    //VOL TIER

        //    #region Atrb Rules

        //    List<AttributeRule> atrbRules = new List<AttributeRule>();

        //    // READONLY
        //    atrbRules.Add(new AttributeRule
        //    {
        //        ActionRule = AttributeRules.RunSyncReadOnlyItems,
        //        Triggers = new List<RuleTriggerPoint> {RuleTriggerPoint.OnSave, RuleTriggerPoint.OnLoad}
        //    });
        //    atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere,
        //        Triggers = new List<RuleTriggerPoint> { RuleTriggerPoint.OnReadonly },
        //        AtrbAction = BusinessLogicDataElementActions.SetReadOnly,
        //        AtrbActionTarget = new[] { "TRGT_RGN_CHK", "TRGT_RGN", "RETAIL_CYCLE" },
        //        WithTracker = true
        //    });
        //    atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere,
        //        Triggers = new List<RuleTriggerPoint> { RuleTriggerPoint.OnReadonly },
        //        AtrbAction = BusinessLogicDataElementActions.SetReadOnly,
        //        AtrbActionTarget = new[] { "PROGRAM_TYPE" }
        //    });
        //    atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere,
        //        Triggers = new List<RuleTriggerPoint> { RuleTriggerPoint.OnReadonly },
        //        AtrbAction = BusinessLogicDataElementActions.SetReadOnly,
        //        NotInStages = new[] { "Created" },
        //        AtrbActionTarget = new[] { "PRODUCT_TITLE", "START_DT", "END_VOL", "STRT_VOL", "RATE" },
        //        AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.END_DT) && de.IsDateInPast()
        //    });

        //    //// REQUIRED
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncRequiredItems, OnSaveTrigger = true, OnLoadTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnRequiredTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetRequired, AtrbActionTarget = new[] { AttributeCodes.PROGRAM_TYPE }, AtrbWhere = de => de.AtrbHasNoValue(AttributeCodes.PROGRAM_TYPE) && (de.DcID < 0) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnRequiredTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetRequired, AtrbActionTarget = new[] { AttributeCodes.LEGAL_COMMENTS }, AtrbWhere = de => de.AtrbHasValue(AttributeCodes.COST_TEST_OVERRIDE, "Yes") });

        //    //// HIDDEN
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncHiddenItems, OnSaveTrigger = true, OnLoadTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast() && de.State != OpDataElementState.Modified });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.PROGRAM_TYPE }, AtrbWhere = de => de.AtrbHasValue(AttributeCodes.PROGRAM_TYPE) && (de.DcID > 0) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.REBATE_BILLING_START, AttributeCodes.REBATE_BILLING_END }, AtrbCondIf = de => de.AtrbHasValue(AttributeCodes.PAYOUT_BASED_ON, EN.VALUES.BILLINGS) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN_TXT }, AtrbCondIf = de => de.AtrbHasNoValue(AttributeCodes.BACK_DATE_RSN, EN.VALUES.OTHER) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { "BUFFER_PCT", "COST_DELTA", "COST_FORMULA", "COST_TEST_INCOMPLETE_REASON", "COST_TEST_OVERRIDE", "COST_TEST_RESULT", "COST_TYPE_USED", "CPU_COST_TYPE_USED", "CPU_PULL_DLR", "CPU_PULL_DLR_SDM", "CST_CPU_COST", "CST_CPU_FINAL_COST", "CST_CPU_SA", "CST_CPU_SA_MAX", "CST_CPU_SA_MIN", "CST_CS_COST", "CST_CS_FINAL_COST", "CST_CS_SA", "CST_CS_SA_MAX", "CST_CS_SA_MIN", "CST_ECAP_PRICE", "CST_KIT_ECAP", "CST_KIT_ECAP_MAX", "CST_KIT_ECAP_MIN", "CS_COST_TYPE_USED", "L4_PRODUCT_NAME", "LEGAL_COMMENTS", "MEETCOMP_TEST_RESULT", "PLI_NET_PRICE_CONCATE", "PRD_COST_FINAL", "PRD_CST", "SA_COST_TEST_RESULTS" }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.PLI_LOCATOR) && de.HasNotValue(int.MaxValue.ToString()) && de.HasValue() });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.TRGT_RGN_CHK }, AtrbWhere = de => de.HasValueIn(new[] { "0", "N", "n", null, "" }) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.PNL_SPLIT }, AtrbCondIf = de => de.AtrbHasValue(AttributeCodes.KIT_CHK, "N") });


        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositive, OnSaveTrigger = true, StringArrayVal1 = new[] { "STRT_VOL", "END_VOL", "PORTFOLIO" }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositiveOrZero, OnSaveTrigger = true, StringArrayVal1 = new[] { EN.ATRB.REBATE_OA_MAX_VOL, EN.ATRB.REBATE_OA_MAX_AMT }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.BACKDATE_REASON_TXT, IntVal1 = 25 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.C2A_DATA_C2A_ID, IntVal1 = 100 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMinDealReqs, OnSaveTrigger = true, StringArrayVal1 = new[] { "PRODUCT_FILTER", "PRODUCT_TITLE", "NUM_OF_TIERS", AttributeCodes.PROGRAM_PAYMENT, "STRT_VOL", "END_VOL", "RATE", "START_DT", "END_DT", "DEAL_STG_CD", "PRD_NM_COMBINED", "MRKT_SEG", "TRGT_RGN_CHK", "PRD_LEVEL", "DEAL_TYPE_CD_SID", "CUST_MBR_SID" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "REBATE_DISTI", IntVal1 = 50 });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunClearMessage, OnLoadTrigger = true });

        //    atrbRules.Add(new AttributeRule
        //    {
        //        ActionRule = AttributeRules.RunValidateRequiredFields,
        //        Triggers = new List<RuleTriggerPoint> { RuleTriggerPoint.OnSave}
        //    });

        //    if (atrbRules.Any()) attrbRules.AddRange(atrbRules);

        //    #endregion

        //    #endregion

        //    #region CAPBand

        //    //CAP BAND

        //    #region Atrb Rules

        //    atrbRules = new List<AttributeRule>();

        //    //// READONLY
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncReadOnlyItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { AttributeCodes.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, AtrbActionTarget = new[] { AttributeCodes.TRGT_RGN_CHK, AttributeCodes.TRGT_RGN, AttributeCodes.RETAIL_CYCLE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, AtrbActionTarget = new[] { "PROGRAM_TYPE" } });  // 5.2 release requirement

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, NotInStages = new[] { DcsWorkflowStage.Created.ToString() }, AtrbActionTarget = new[] { AttributeCodes.PRODUCT_TITLE, AttributeCodes.START_DT, AttributeCodes.END_CAP, AttributeCodes.STRT_CAP, AttributeCodes.RATE }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.END_DT) && de.IsDateInPast() });

        //    //// REQUIRED
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncRequiredItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { AttributeCodes.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnRequiredTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetRequired, AtrbActionTarget = new[] { "PROGRAM_TYPE" }, AtrbWhere = de => de.AtrbHasNoValue(AttributeCodes.PROGRAM_TYPE) && (de.DcID < 0) });  // 5.2 release requirement

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceRequiredBasedOnValue, OnRequiredTrigger = true, StringVal1 = "COST_TEST_OVERRIDE", StringArrayVal1 = new[] { "Yes" }, StringArrayVal2 = new[] { "LEGAL_COMMENTS" } });

        //    //// HIDDEN
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncHiddenItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { AttributeCodes.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast() && de.State != OpDataElementState.Modified });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { "PROGRAM_TYPE" }, AtrbWhere = de => de.AtrbHasNoValue(AttributeCodes.PROGRAM_TYPE) && (de.DcID > 0) });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN_TXT }, AtrbCondIf = de => de.AtrbHasNoValue(AttributeCodes.BACK_DATE_RSN, EN.VALUES.OTHER) });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideBasedOnAtrbValue, OnHiddenTrigger = true, StringVal1 = EN.ATRB.PAYOUT_BASED_ON, StringArrayVal1 = new[] { EN.VALUES.BILLINGS }, StringArrayVal2 = new[] { EN.ATRB.REBATE_BILLING_START, EN.ATRB.REBATE_BILLING_END } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideUnusedTiers, OnHiddenTrigger = true, StringVal1 = EN.ATRB.NUM_OF_TIERS, IntVal1 = 5005 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceHiddenBasedOnStartDateAndDealType, OnHiddenTrigger = true, StringArrayVal1 = new[] { EN.ATRB.BACKDATE_REASON, EN.ATRB.BACKDATE_REASON_TXT }, StringArrayVal2 = new[] { EN.VALUES.NONE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositive, OnSaveTrigger = true, StringArrayVal1 = new[] { "STRT_CAP", "END_CAP", "PORTFOLIO" }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositiveOrZero, OnSaveTrigger = true, StringArrayVal1 = new[] { AttributeCodes.REBATE_OA_MAX_VOL, EN.ATRB.REBATE_OA_MAX_AMT }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.BACKDATE_REASON_TXT, IntVal1 = 25 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.C2A_DATA_C2A_ID, IntVal1 = 100 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunClearMessage, OnLoadTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMinDealReqs, OnSaveTrigger = true, StringArrayVal1 = new[] { "PRODUCT_FILTER", "PRODUCT_TITLE", "DEAL_TYPE_CD", "START_DT", "END_DT", "DEAL_STG_CD", "PRD_NM_COMBINED", "NUM_OF_TIERS", "PAYOUT_BASED_ON", AttributeCodes.PROGRAM_PAYMENT, "MRKT_SEG", "TRGT_RGN_CHK", "RATE", "STRT_CAP", "END_CAP", "DEAL_TYPE_CD_SID", "CUST_MBR_SID" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "REBATE_DISTI", IntVal1 = 50 });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunValidateRequiredFields, OnSaveTrigger = true });

        //    //if (atrbRules.Any()) attrbRules[EN.DEALTYPE.CAP_BAND] = atrbRules;

        //    #endregion

        //    #endregion

        //    #region Program

        //    //Program

        //    #region Atrb Rules

        //    atrbRules = new List<AttributeRule>();

        //    //// READONLY
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncReadOnlyItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, AtrbActionTarget = new[] { AttributeCodes.TRGT_RGN_CHK, AttributeCodes.TRGT_RGN, AttributeCodes.RETAIL_CYCLE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, NotInStages = new[] { DcsWorkflowStage.Created.ToString() }, AtrbActionTarget = new[] { AttributeCodes.PRODUCT_TITLE, AttributeCodes.START_DT, AttributeCodes.TOTAL_DOLLAR_AMOUNT }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.END_DT) && de.IsDateInPast() });

        //    //// REQUIRED
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncRequiredItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });

        //    //// HIDDEN
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncHiddenItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast() && de.State != OpDataElementState.Modified });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN_TXT }, AtrbCondIf = de => de.AtrbHasNoValue(AttributeCodes.BACK_DATE_RSN, EN.VALUES.OTHER) });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideBasedOnAtrbValue, OnHiddenTrigger = true, StringVal1 = EN.ATRB.PAYOUT_BASED_ON, StringArrayVal1 = new[] { EN.VALUES.BILLINGS }, StringArrayVal2 = new[] { EN.ATRB.REBATE_BILLING_START, EN.ATRB.REBATE_BILLING_END } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceHiddenBasedOnStartDateAndDealType, OnHiddenTrigger = true, StringArrayVal1 = new[] { EN.ATRB.BACKDATE_REASON, EN.ATRB.BACKDATE_REASON_TXT }, StringArrayVal2 = new[] { EN.PROGRAMTYPE.DEBIT_MEMO, EN.PROGRAMTYPE.ECAP_ADJ } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideBasedOnAtrbValue, OnHiddenTrigger = true, StringVal1 = EN.ATRB.DEAL_PGM_TYPE, StringArrayVal1 = new[] { "Debit Memo", "OTHER" }, StringArrayVal2 = new[] { "ORIG_ECAP_TRKR_NBR", "ADJ_ECAP_UNIT" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositiveOrZero, OnSaveTrigger = true, StringArrayVal1 = new[] { EN.ATRB.REBATE_OA_MAX_VOL, EN.ATRB.REBATE_OA_MAX_AMT }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.BACKDATE_REASON_TXT, IntVal1 = 25 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.C2A_DATA_C2A_ID, IntVal1 = 100 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPositiveNegativeBasedOnValue, OnSaveTrigger = true, StringVal1 = "DEAL_PGM_TYPE", StringVal2 = "Debit Memo", StringArrayVal1 = new[] { "TOTAL_DOLLAR_AMOUNT" } }); // StringVal1 might go to PROGRAM_TYPE is UI can not split values for dropdown
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunClearMessage, OnLoadTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositive, OnSaveTrigger = true, StringArrayVal1 = new[] { "ADJ_ECAP_UNIT" }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "ORIG_ECAP_TRKR_NBR", IntVal1 = 20 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMinDealReqs, OnSaveTrigger = true, StringArrayVal1 = new[] { "PRODUCT_FILTER", "DEAL_TYPE_CD", "START_DT", "END_DT", "DEAL_STG_CD", "PRD_NM_COMBINED", "MRKT_SEG", "DEAL_PGM_TYPE", "TOTAL_DOLLAR_AMOUNT", "PRODUCT_TITLE", "PGM_TYPE_CHK", "PRD_LEVEL", "DEAL_TYPE_CD_SID", "CUST_MBR_SID", AttributeCodes.DEAL_PGM_TYPE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "REBATE_DISTI", IntVal1 = 50 });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunValidateRequiredFields, OnSaveTrigger = true });

        //   // if (atrbRules.Any()) attrbRules[EN.DEALTYPE.PROGRAM] = atrbRules;

        //    #endregion

        //    #endregion

        //    #region ECAP

        //    //ECAP

        //    #region Atrb Rules

        //    atrbRules = new List<AttributeRule>();

        //    //// READONLY
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncReadOnlyItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, AtrbActionTarget = new[] { AttributeCodes.TRGT_RGN_CHK, AttributeCodes.TRGT_RGN, AttributeCodes.RETAIL_CYCLE, AttributeCodes.DEAL_SOLD_TO_ID } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnReadonlyTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetReadOnly, NotInStages = new[] { DcsWorkflowStage.Created.ToString() }, AtrbActionTarget = new[] { AttributeCodes.PRODUCT_TITLE, AttributeCodes.START_DT, AttributeCodes.VOLUME, AttributeCodes.ECAP_PRICE, AttributeCodes.DIVISION_APPROVED_LIMIT }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.END_DT) && de.IsDateInPast() });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunReadOnlyBasedOnValueAndVerts, OnReadonlyTrigger = true, StringVal1 = EN.ATRB.ECAP_TYPE, StringArrayVal1 = new[] { EN.VALUES.TENDER }, StringArrayVal2 = new[] { EN.VALUES.SVRWS }, StringArrayVal3 = new[] { EN.ATRB.SERVER_DEAL_TYPE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunReadOnlyPNLSplit, OnReadonlyTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunReadOnlyBasedOnHasTracker, OnReadonlyTrigger = true, StringArrayVal1 = new[] { EN.ATRB.TRGT_RGN_CHK } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunAtrbMakeReadOnlyBasedOnAtrbValue, OnReadonlyTrigger = true, StringVal1 = "PROGRAM_PAYMENT", StringArrayVal1 = new[] { "Frontend YCS2", "Frontend XOA3" }, StringArrayVal2 = new[] { "DIVISION_APPROVED_LIMIT", "VOLUME" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunActionBasedOnValue, OnReadonlyTrigger = true, StringVal1 = "PROGRAM_PAYMENT", StringVal2 = ValidationAtributeFunctions.MakeReadOnly.ToString(), StringArrayVal1 = new[] { "Backend" }, StringArrayVal2 = new[] { "YCS2_OVERLAP_OVERRIDE", "EXPIRE_YCS2" } });

        //    //// REQUIRED
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncRequiredItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceRequiredBasedOnValue, OnRequiredTrigger = true, StringVal1 = "COST_TEST_OVERRIDE", StringArrayVal1 = new[] { "Yes" }, StringArrayVal2 = new[] { "LEGAL_COMMENTS" } });

        //    //// HIDDEN
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncHiddenItems, OnSaveTrigger = true, OnLoadTrigger = true, StringArrayVal1 = new[] { EN.ATRB.WF_STG_CD } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN }, AtrbCondIf = de => de.AtrbCdIs(AttributeCodes.START_DT) && !de.IsDateInPast() && de.State != OpDataElementState.Modified });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunPerformActionForEachAtrbInWhere, OnHiddenTrigger = true, AtrbAction = BusinessLogicDataElementActions.SetHidden, AtrbActionTarget = new[] { AttributeCodes.BACK_DATE_RSN_TXT }, AtrbCondIf = de => de.AtrbHasNoValue(AttributeCodes.BACK_DATE_RSN, EN.VALUES.OTHER) });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideRowBasedOnAtrbValueAndVerts, OnHiddenTrigger = true, StringVal1 = EN.ATRB.MRKT_SEG, StringArrayVal1 = new[] { EN.VALUES.CONSUMER_RETAIL_PULL }, StringArrayVal2 = new[] { "DT", "Mb" }, StringArrayVal3 = new[] { EN.ATRB.CPU_PULL_DLR, EN.ATRB.CPU_PULL_DLR_SDM } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunHideBasedOnValueAndVerts, OnHiddenTrigger = true, StringVal1 = EN.ATRB.ECAP_TYPE, StringArrayVal1 = new[] { EN.VALUES.TENDER }, StringArrayVal2 = new[] { EN.VALUES.SVRWS }, StringArrayVal3 = new[] { EN.ATRB.SERVER_DEAL_TYPE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceHiddenBasedOnStartDateAndDealType, OnHiddenTrigger = true, StringArrayVal1 = new[] { EN.ATRB.BACKDATE_REASON, EN.ATRB.BACKDATE_REASON_TXT }, StringArrayVal2 = new[] { EN.VALUES.NONE } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceHiddenBasedOnValue, OnHiddenTrigger = true, StringVal1 = AttributeCodes.PROGRAM_PAYMENT, StringArrayVal1 = new[] { "Backend" }, StringVal2 = AttributeCodes.DEAL_SOLD_TO_ID });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunActionBasedOnValue, OnHiddenTrigger = true, OnLoadTrigger = true, OnSaveTrigger = true, StringVal1 = AttributeCodes.PROGRAM_PAYMENT, StringVal2 = ValidationAtributeFunctions.MakeVisible.ToString(), StringArrayVal1 = new[] { "Frontend YCS2" }, StringArrayVal2 = new[] { "YCS2_OVERLAP_OVERRIDE", "EXPIRE_YCS2" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunActionBasedOnValue, OnLoadTrigger = true, OnSaveTrigger = true, StringVal1 = "ECAP_TYPE", StringVal2 = ValidationAtributeFunctions.MustBePositive.ToString(), StringArrayVal1 = new[] { "Seed" }, StringArrayVal2 = new[] { "ECAP_PRICE" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunActionBasedOnValue, OnSaveTrigger = true, StringVal1 = EN.ATRB.CAP, StringVal2 = ValidationAtributeFunctions.Contains.ToString(), StringArrayVal1 = new[] { " - ", EN.VALUES.NO_CAP, EN.VALUES.NO_CAP_EN, string.Empty }, StringVal3 = "Cannot save a deal with a CAP Range or No Cap.\n" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositive, OnSaveTrigger = true, StringArrayVal1 = new[] { "COMP_LIST_PRICE", "COMP_TARGET_SYSTEM_PRICE", "COMPETITIVE_PRICE", "COMP_PRICE_CPU", "COMP_PRICE_CS", AttributeCodes.VOLUME }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMustBePositiveOrZero, OnSaveTrigger = true, StringArrayVal1 = new[] { "CS_SPLIT", "NORTHBRIDGE_SPLIT", "SOUTHBRIDGE_SPLIT", "CPU_SPLIT", EN.ATRB.REBATE_OA_MAX_VOL, EN.ATRB.REBATE_OA_MAX_AMT, "VOLUME", EN.ATRB.CPU_PULL_DLR }, StringVal2 = ">" });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunSyncMarketSegs, OnSaveTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxLimit, OnSaveTrigger = true, StringVal1 = "VOLUME", IntVal1 = 1000000000 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunForceCheckVolumeToCreditDebit, OnSaveTrigger = true, StringVal1 = "VOLUME", StringVal2 = "CREDIT_VOLUME", StringVal3 = "DEBIT_VOLUME", StringVal4 = "Global Ceiling Volume cannot be less than Credit Memo - Debit Volume", StringVal5 = "BLLG_DT", StringVal6 = EN.ATRB.END_DT, StringVal7 = "The End Date cannot be prior to the last Credit/Debit Date." });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunCanActionBasedOnAttributes, PriorToActionTrigger = true, StringVal4 = "Cancel", StringVal1 = AttributeCodes.PROGRAM_PAYMENT, StringVal2 = EN.ATRB.DEAL_STG_CD, StringVal3 = "Cannot {2} {0} / {1} deal\n", StringArrayVal1 = new[] { "Frontend YCS2" }, StringArrayVal2 = new[] { "Active", "Expired" } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.BACKDATE_REASON_TXT, IntVal1 = 25 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = EN.ATRB.C2A_DATA_C2A_ID, IntVal1 = 100 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunClearMessage, OnLoadTrigger = true });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "REBATE_DISTI", IntVal1 = 50 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "QLTR_PROJECT", IntVal1 = 150 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMaxCharLimit, OnSaveTrigger = true, StringVal1 = "QLTR_TERMS", IntVal1 = 500 });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunMinDealReqs, OnSaveTrigger = true, StringArrayVal1 = new[] { "PRODUCT_FILTER", "START_DT", "END_DT", "VOLUME", "DEAL_STG_CD", "DIVISION_APPROVED_LIMIT", "PRD_NM_COMBINED", "KIT_CHK", "PROGRAM_PAYMENT", "PAYOUT_BASED_ON", "MRKT_SEG", AttributeCodes.ECAP_TYPE, "ECAP_PRICE", "TRGT_RGN_CHK", "PRD_LEVEL", "CAP", "PRD_BUCKET_CHK", "DEAL_TYPE_CD_SID", "CUST_MBR_SID" } });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunValidateRequiredFields, OnSaveTrigger = true });

        //    //if (atrbRules.Any()) attrbRules[EN.DEALTYPE.ECAP] = atrbRules;

        //    #endregion

        //    #endregion

        //    #region All

        //    atrbRules = new List<AttributeRule>();

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.UpdateStage, OnPreActionDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.Action }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Secondary, OpDataElementType.Primary } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.ProcessDelete, OnPreActionDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.Action }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Secondary, OpDataElementType.Primary, OpDataElementType.Tertiary } });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.UpdateApproveBy, OnChangeIntoStageTrigger = new List<DcsWorkflowStage> { DcsWorkflowStage.Submitted, DcsWorkflowStage.Final_Approval, DcsWorkflowStage.Hold_Waiting } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.UpdateApprovePrice, OnChangeIntoStageTrigger = new List<DcsWorkflowStage> { DcsWorkflowStage.Active, DcsWorkflowStage.Final_Approval, DcsWorkflowStage.Hold_Waiting } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.CreateTrackerNumber, OnChangeIntoStageTrigger = new List<DcsWorkflowStage> { DcsWorkflowStage.Active } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.UpdateSnapShot, OnChangeIntoStageTrigger = new List<DcsWorkflowStage> { DcsWorkflowStage.Active } });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.WorkbookCheckoutTest, OnPreSavePrepDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.Save }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Secondary, OpDataElementType.Primary } });
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.WorkbookSaveMerge, OnPostSavePrepDealTrigger = true, OnPostSyncDealTrigger = true, OnPostActionDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.Save, OpActionType.SyncDeal, OpActionType.Action }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Group, OpDataElementType.Secondary, OpDataElementType.Tertiary, OpDataElementType.Primary } });

        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.DealValidation, OnPreSyncDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.SyncDeal }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Secondary } }); // EN.ATRB.PRICE_AGREEMENT_GRP

        //    //// Moved post validation since validation might remove additional actions in pre-sync
        //    //atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.Redeal, OnPreSyncDealTrigger = true, ActionTypes = new List<OpActionType> { OpActionType.SyncDeal, OpActionType.Action }, DataElementTypes = new List<OpDataElementType> { OpDataElementType.Secondary, OpDataElementType.Primary } });

        //    ////OnChangeIntoStageTrigger
        //    //if (atrbRules.Any()) attrbRules["All"] = atrbRules;

        //    #endregion

        //}
    }
}
