using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{

    public static partial class AttributeRules
    {



        #region ActionRules

        



        //public static void DisableApprovalActionBasedOnValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    OpRule<IOpDataElement, MyRulesTrigger> ar = args[1] as OpRule<IOpDataElement, MyRulesTrigger>;
        //    if (deal == null || ar == null) return;

        //    // TODO This rule does nothing, but it is used in unit testing... not sure why.  Need to ask Brad
        //    //string actnCD = ar.StringVal2;

        //    //IOpDataElement deSource = deal.GetDataElementWhere(ar.StringVal1, el => ar.StringArrayVal1.Contains(el.AtrbValue.ToString()));
        //    //deal.PassedAction = deSource != null && ar.StringArrayVal2.Contains(actnCD);
        //}


        //public static void RunCanActionBasedOnAttributes(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (deal == null || ar == null) return;

        //    string atrb1Name = ar.StringVal1; //"PROGRAM_PAYMENT";
        //    string[] atrb1Values = ar.StringArrayVal1; //new[] {"Frontend YCS2"};
        //    string atrb2Name = ar.StringVal2; //EN.ATRB.DEAL_STG_CD;
        //    string[] atrb2Values = ar.StringArrayVal2; //new[] {"Active"};
        //    string errMsg = ar.StringVal3; //"Cannot {2} {0} / {1} deal";

        //    Dictionary<string, object> variables = new Dictionary<string, object>();
        //    //            variables[atrb1Name] = deal.GetDataElement(atrb1Name, "CONTAINS", atrb1Values);
        //    variables[atrb1Name] = deal.GetDataElementWhere(atrb1Name, d => atrb1Values.Contains(d.AtrbValue.ToString()));
        //    variables[atrb2Name] = deal.GetDataElementWhere(atrb2Name, d => atrb2Values.Contains(d.AtrbValue.ToString()));
        //    if (BusinessLogicConditions.IsNull(variables[atrb1Name]) ||
        //        BusinessLogicConditions.IsNull(variables[atrb2Name]))
        //    {
        //        deal.Message += "RULE: RunCanActionBasedOnAttributes missing variables" + Environment.NewLine;
        //        return;
        //    }

        //    //we have an invalid deal to action
        //    string msg = BusinessLogicFunctions.BuildString(
        //        errMsg,
        //        deal.GetDataElementValueWhere(atrb1Name, d => atrb1Values.Contains(d.AtrbValue.ToString())),
        //        deal.GetDataElementValueWhere(atrb2Name, d => atrb2Values.Contains(d.AtrbValue.ToString())),
        //        ar.StringVal8);

        //    BusinessLogicDcActions.UpdateMessage(deal, msg, EN.DC_MESSAGE_TYPES.ACTION);
        //    BusinessLogicDcActions.UpdateMessage(deal, msg, EN.DC_MESSAGE_TYPES.WORKFLOW);

        //}


        //public static void RunActionBasedOnValue(params object[] args)
        //{
        //    if (args.Count() < 3) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    OpRoleType roleType = args[2] as OpRoleType;
        //    if (deal == null || ar == null) return;

        //    string dealType = deal.GetDataElementValue(EN.ATRB.DEAL_TYPE_CD);

        //    if (ar.StringVal2 == ValidationAtributeFunctions.SetAtribValue.ToString())  //??DTS??
        //    {
        //        foreach (IOpDataElement deSource in deal.GetDataElements(ar.StringVal1))
        //        {
        //            //foreach (DataElement deTarget in (deal.DataDict.Items.Values.Where(d => ar.StringArrayVal2.Contains(d.AtrbName))))
        //            foreach (IOpDataElement deTarget in (deal.GetDataElementsInWhere(ar.StringArrayVal2, d => ar.StringArrayVal2.Contains(d.AtrbCd)))) //??DTS??
        //            {
        //                if (ar.StringArrayVal1.Contains(deSource.AtrbValue.ToString()))
        //                {
        //                    if (deTarget.AtrbValue.ToString() != ar.StringVal3)
        //                    {
        //                        deTarget.AtrbValue = ar.StringVal3;
        //                    }
        //                    deTarget.IsReadOnly = true;
        //                    //deTarget.NotifyDataChanged();
        //                }
        //                else
        //                {
        //                    bool setReadyOnly = OpSecurityViewModel.Instance.ChkAtrbRules(dealType, roleType.RoleTypeCd, deal.GetDataElementValue(EN.ATRB.DEAL_STG_CD), "ATRB_READ_ONLY", deTarget.AtrbCd);
        //                    IOpDataElement deProgram = deal.GetDataElement(ar.StringVal4);
        //                    if (deProgram != null && ar.StringArrayVal3.Contains(deProgram.AtrbValue.ToString()))
        //                    {
        //                        if (deal.GetDataElementsWhere(EN.ATRB.TRKR_NBR, d => !string.IsNullOrEmpty(d.AtrbValue.ToString())).Any()) setReadyOnly = true;
        //                    }
        //                    deTarget.IsReadOnly = setReadyOnly;
        //                    //deTarget.IsForcedReadonly = setReadyOnly;
        //                }
        //                //dvm.SyncDataElementFromColumnSet(deTarget);
        //            }
        //        }
        //    }
        //    else if (ar.StringVal2 == ValidationAtributeFunctions.MustBePositive.ToString())
        //    {
        //        bool canBeZero = false;
        //        foreach (OpDataElement deSource in deal.GetDataElementsWhere(ar.StringVal1, d => ar.StringArrayVal1.Contains(d.AtrbValue.ToString())))
        //        {
        //            canBeZero = true;
        //        }

        //        foreach (OpDataElement deTarget in (deal.GetDataElementsIn(ar.StringArrayVal2)))
        //        {
        //            try
        //            {
        //                if (deTarget.AtrbValue.ToString() == "") continue;

        //                double atrbVal = OpConvertSafe.ToDouble(deTarget.AtrbValue.ToString().Replace("$", ""));
        //                if (atrbVal < 0 && canBeZero)
        //                    deTarget.ValidationMessage = deTarget.AtrbCd + " must be a positive Number" + Environment.NewLine;
        //                else if (atrbVal <= 0 && !canBeZero)
        //                    deTarget.ValidationMessage = deTarget.AtrbCd + " must be greater than Zero" + Environment.NewLine;
        //                else
        //                    deTarget.ValidationMessage = "";
        //            }
        //            catch
        //            {
        //            }
        //        }

        //    }
        //    else if (ar.StringVal2 == ValidationAtributeFunctions.MakeVisible.ToString())
        //    {
        //        foreach (OpDataElement deTarget in deal.GetDataElementsIn(ar.StringArrayVal2))
        //        {
        //            bool hideElement = true;
        //            foreach (OpDataElement deSource in (deal.GetDataElementsWhere(ar.StringVal1, el => ar.StringArrayVal1.Contains(el.AtrbValue.ToString()))))
        //            {
        //                hideElement = false;
        //            }
        //            if (hideElement)
        //            {
        //                deTarget.IsHidden = true;
        //                //dvm.SyncDataElementFromColumnSet(deTarget);
        //            }
        //        }
        //    }
        //    else if (ar.StringVal2 == ValidationAtributeFunctions.MakeReadOnly.ToString())
        //    {
        //        foreach (OpDataElement deTarget in deal.GetDataElementsIn(ar.StringArrayVal2))
        //        {
        //            bool readOnlyElement = false;
        //            foreach (OpDataElement deSource in (deal.GetDataElementsWhere(ar.StringVal1, el => ar.StringArrayVal1.Contains(el.AtrbValue.ToString()))))
        //            {
        //                readOnlyElement = true;
        //            }
        //            if (readOnlyElement)
        //            {
        //                deTarget.IsReadOnly = true;
        //            }
        //        }
        //    }
        //    else if (ar.StringVal2 == ValidationAtributeFunctions.Contains.ToString())
        //    {
        //        if (ar.StringVal1 == AttributeCodes.CAP)
        //        {
        //            foreach (OpDataElement dePrdChk in deal.GetDataElementsWhere("PRD_BKT_CHK", d => d.AtrbValue.ToString() == "1"))
        //            {
        //                var dimKey = dePrdChk.DimKey.ToString();
        //                foreach (OpDataElement deTarget in deal.GetDataElementsWhere(ar.StringVal1, d => !d.IsHidden && ar.StringArrayVal1.Contains(d.AtrbValue.ToString().Trim()) && d.DimKey.ToString() == dimKey))
        //                {
        //                    if (!deTarget.ValidationMessage.Contains(ar.StringVal3))
        //                        deTarget.ValidationMessage += ar.StringVal3;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            foreach (OpDataElement deTarget in deal.GetDataElementsWhere(ar.StringVal1, d => !d.IsHidden && ar.StringArrayVal1.Contains(d.AtrbValue.ToString().Trim())))
        //            {
        //                if (!deTarget.ValidationMessage.Contains(ar.StringVal3))
        //                    deTarget.ValidationMessage += ar.StringVal3;
        //            }
        //        }
        //    }

        //}



        #endregion

        //#region CreditDebitRules

        //public static void RunForceCheckVolumeToCreditDebit(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    const NumberStyles style = NumberStyles.AllowDecimalPoint | NumberStyles.AllowThousands | NumberStyles.AllowLeadingSign | NumberStyles.AllowParentheses;

        //    IOpDataElement deVolume = dc.GetDataElement(ar.StringVal1);
        //    IOpDataElement deCredit = dc.GetDataElement(ar.StringVal2);
        //    IOpDataElement deDebit = dc.GetDataElement(ar.StringVal3);
        //    IOpDataElement deCreditDt = dc.GetDataElement(ar.StringVal5);
        //    IOpDataElement deEndDt = dc.GetDataElement(ar.StringVal6);

        //    if (deVolume == null || deCredit == null || deDebit == null)
        //    {
        //        dc.Message += "RULE: RunForceCheckVolumeToCreditDebit missing deVolume, deCredit, or deDebit." + Environment.NewLine;
        //        return;
        //    }

        //    if (!deVolume.IsReadOnly)
        //    {
        //        double numVolume = (double.TryParse(deVolume.AtrbValue.ToString(), style, new CultureInfo("en-US"), out numVolume)) ? numVolume : 999999999;
        //        double numCredit = (double.TryParse(deCredit.AtrbValue.ToString(), style, new CultureInfo("en-US"), out numCredit)) ? numCredit : 0;
        //        double numDebit = (double.TryParse(deDebit.AtrbValue.ToString(), style, new CultureInfo("en-US"), out numDebit)) ? numDebit : 0;

        //        if (numVolume < numCredit - numDebit)
        //        {
        //            deVolume.ValidationMessage += ar.StringVal4 + Environment.NewLine;
        //        }
        //    }

        //    if (deCreditDt == null || deEndDt == null)
        //    {
        //        dc.Message += "RULE: RunForceCheckVolumeToCreditDebit missing deCreditDt or deEndDt." + Environment.NewLine;
        //        return;
        //    }

        //    if (deEndDt.OrigAtrbValue == null) deEndDt.OrigAtrbValue = DateTime.MaxValue;  // Should have an original value, but sometimes it may not

        //    DateTime dtCreditDt = (DateTime.TryParse(deCreditDt.AtrbValue.ToString(), out dtCreditDt)) ? dtCreditDt : OpaqueConst.SQL_MIN_DATE;
        //    DateTime dtEndDt = (DateTime.TryParse(deEndDt.AtrbValue.ToString(), out dtEndDt)) ? dtEndDt : OpaqueConst.SQL_MIN_DATE;
        //    DateTime dtOrigEndDt = (DateTime.TryParse(deEndDt.OrigAtrbValue.ToString(), out dtOrigEndDt)) ? dtOrigEndDt : OpaqueConst.SQL_MIN_DATE;

        //    if (dtCreditDt > OpaqueConst.SQL_MIN_DATE && dtCreditDt > dtEndDt && dtEndDt < dtOrigEndDt)
        //    {
        //        deEndDt.ValidationMessage += ar.StringVal7 + Environment.NewLine;
        //    }
        //}

        //#endregion

        //#region GeneralPurposeRules


        //public static void RunClearAtrbValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    BusinessLogicDcActions.ForEachDataElementIn(dc, ar.StringArrayVal1, BusinessLogicDataElementActions.ClearAtrbValue);
        //}


        //public static void RunClearAttributeOnChange(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    if (ar.StringArrayVal1 == null || !ar.StringArrayVal1.Any())
        //    {
        //        dc.Message += "RULE: RunClearAttributeOnChange missing StringArrayVals." + Environment.NewLine;
        //        return;
        //    }

        //    foreach (IOpDataElement dealRow in dc.GetDataElementsIn(ar.StringArrayVal1))
        //    {
        //        dealRow.AtrbValue = string.Empty;
        //    }
        //}


        //public static void RunClearMessage(params object[] args)
        //{
        //    if (!args.Any()) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    if (dc == null) return;
        //    dc.Message = string.Empty;
        //}


        //public static void RunMaxCharLimit(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    foreach (OpDataElement deSource in dc.GetDataElements(ar.StringVal1))
        //    {
        //        if (deSource.AtrbValue.ToString().Length > ar.IntVal1)
        //        {
        //            deSource.ValidationMessage += deSource.AtrbCd + " must be no more than " + ar.IntVal1 + " characters." + Environment.NewLine;
        //        }
        //    }
        //}


        //public static void RunMaxLimit(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    const NumberStyles style = NumberStyles.AllowDecimalPoint | NumberStyles.AllowThousands | NumberStyles.AllowLeadingSign | NumberStyles.AllowParentheses;
        //    foreach (OpDataElement deSource in dc.GetDataElements(ar.StringVal1))
        //    {
        //        double numVal = (double.TryParse(deSource.AtrbValue.ToString(), style, new CultureInfo("en-US"), out numVal)) ? numVal : 0;
        //        if (numVal > ar.IntVal1)
        //        {
        //            deSource.ValidationMessage += deSource.AtrbCd + " must be no more than " + ar.IntVal1 + Environment.NewLine;
        //        }
        //    }
        //}


        //public static void RunMustBePositive(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    foreach (IOpDataElement deSource in dc.GetDataElementsInWhere(ar.StringArrayVal1, el => !el.IsHidden))
        //    {
        //        if (deSource.AtrbValue.ToString() == string.Empty) continue;

        //        double atrbVal = OpConvertSafe.ToDouble(deSource.AtrbValue.ToString().Replace("$", ""));
        //        if (!(atrbVal <= 0)) continue;

        //        if (deSource.ValidationMessage.IndexOf(deSource.AtrbCd + " must be a positive Number") < 0)
        //            deSource.ValidationMessage += deSource.AtrbCd + " must be a positive Number." + Environment.NewLine;
        //    }

        //}


        //public static void RunPositiveNegativeBasedOnValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    const NumberStyles style = NumberStyles.AllowDecimalPoint | NumberStyles.AllowThousands | NumberStyles.AllowLeadingSign | NumberStyles.AllowParentheses;

        //    IOpDataElement deSource = dc.GetDataElement(ar.StringVal1);
        //    if (deSource == null)
        //    {
        //        dc.Message += "RULE: RunPositiveNegativeBasedOnValue missing source." + Environment.NewLine;
        //        return;
        //    }

        //    foreach (IOpDataElement deTarget in dc.GetDataElementsIn(ar.StringArrayVal1))
        //    {
        //        if (deTarget.IsHidden) continue;  // This is to bypass hidden multidimensinal fields like TOTAL_DOLLAR_AMOUNT that are likely not set.
        //        double numElement = (double.TryParse(deTarget.AtrbValue.ToString(), style, new CultureInfo("en-US"), out numElement)) ? numElement : 0;

        //        if (deSource.AtrbValue.ToString() == ar.StringVal2)
        //        {
        //            if (numElement >= 0)
        //                if (deTarget.ValidationMessage.IndexOf(deTarget.AtrbCd + " must be a negative Number") < 0)
        //                    deTarget.ValidationMessage += deTarget.AtrbCd + " must be a negative Number." + Environment.NewLine;
        //        }
        //        else
        //        {
        //            if (numElement <= 0)
        //                if (deTarget.ValidationMessage.IndexOf(deTarget.AtrbCd + " must be a positive Number") < 0)
        //                    deTarget.ValidationMessage += deTarget.AtrbCd + " must be a positive Number." + Environment.NewLine;
        //        }
        //    }
        //}


        //public static void RunMustBePositiveOrZero(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    foreach (IOpDataElement deSource in dc.GetDataElementsInWhere(ar.StringArrayVal1, el => !el.IsHidden))
        //    {
        //        if (deSource.AtrbValue.ToString() == string.Empty) continue;

        //        double atrbVal = OpConvertSafe.ToDouble(deSource.AtrbValue.ToString().Replace("$", ""));
        //        if (atrbVal < 0)
        //            if (deSource.ValidationMessage.IndexOf(deSource.AtrbCd + " must be a positive Number") < 0)
        //                deSource.ValidationMessage += deSource.AtrbCd + " must be a positive Number." + Environment.NewLine;
        //    }

        //}



        //#endregion

        //#region HideRules

        //// Added by David for v5.1
        //public static void RunForceHiddenBasedOnCustomerCategory(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    // Have to get the Customer Name from the selected deal so that we can determine the Customer Category
        //    //IOpDataElement deCust = dc.GetDataElement(EN.ATRB.CUST_NM);
        //    //if (deCust == null)
        //    //{
        //    //    dc.Message += "RULE: RunForceHiddenBasedOnCustomerCategory missing deCust [EN.ATRB.CUST_NM]";
        //    //    return;
        //    //}

        //    //Customers curCust = ApplicationViewModel.Instance.AppConfig.AllCustomers.FirstOrDefault(c => c.CustName == deCust.AtrbValue.ToString());
        //    CustomerDivision curCust = dc.GetCustomerDivision();

        //    if (curCust == null)
        //    {
        //        dc.Message += "RULE: RunForceHiddenBasedOnCustomerCategory missing curCust [dc.GetCustomerDivision()]." + Environment.NewLine;
        //        return;
        //    }

        //    // Hide the data element if this is the Customer Category we care about
        //    if (curCust.CUST_CATGRY != ar.StringVal1) return;

        //    foreach (IOpDataElement de in dc.GetDataElementsIn(ar.StringArrayVal1))
        //    {
        //        de.IsHidden = true;
        //    }
        //}


        ////// Rel 5.3  Req 3.3:  Hide Backdate_Reason if deal is not backdated or if the deal type is in StringArrayVal2.  -David
        //public static void RunForceHiddenBasedOnStartDateAndDealType(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    //StringArrayVal1 = new[] { EN.ATRB.BACKDATE_REASON, EN.ATRB.BACKDATE_REASON_TXT }, StringArrayVal2 = new[] { EN.VALUES.NONE } });

        //    // see if deal type is one for which to hide the backdate reason
        //    List<string> dealTypes = new List<string>(ar.StringArrayVal2);
        //    bool hideForThisDealType = dealTypes.Any(d => d == dc.GetDataElementValue(EN.ATRB.DEAL_PGM_TYPE));

        //    if (!hideForThisDealType)
        //    {
        //        bool hasReasonValue =
        //            dc.GetDataElementsIn(ar.StringArrayVal1).Any(r => r.AtrbValue.ToString() != string.Empty);
        //        if (hasReasonValue)
        //        {
        //            dc.Message += "RULE: RunForceHiddenBasedOnStartDateAndDealType missing hasReasonValue." + Environment.NewLine;
        //            return;
        //        }
        //        bool isBackdated = RulesHelperFunctions.IsBackdated(dc);
        //        string strDealID = dc.GetDataElementValue(EN.ATRB.DEAL_NBR);

        //        if (string.IsNullOrEmpty(strDealID))
        //        {
        //            dc.Message += "RULE: RunForceHiddenBasedOnStartDateAndDealType - strDealID is null (EN.ATRB.DEAL_NBR)." + Environment.NewLine;
        //            return;
        //        }

        //        int dealID = OpConvertSafe.ToInt(strDealID);

        //        if (isBackdated && dealID < 0) return;  // backdating a new deal

        //        if (dc.IsModified && (dealID > 0) && isBackdated) return;  // modified existing deal (which was backdated prior to the 5.3 release)
        //    }

        //    foreach (OpDataElement el in dc.GetDataElementsIn(ar.StringArrayVal1))
        //    {
        //        el.IsHidden = true;
        //    }
        //}

        //public static void RunForceHiddenBasedOnValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    OpDataElement de = ar.ObjVal1 as OpDataElement;
        //    if (de == null)
        //    {
        //        dc.Message += "RULE: RunForceHiddenBasedOnValue missing de." + Environment.NewLine;
        //        return;
        //    }

        //    string[] aValList = ar.StringArrayVal1;
        //    string colName = ar.StringVal1;
        //    string colToHideColName = ar.StringVal2;
        //    if (colToHideColName != de.AtrbCd)
        //    {
        //        //dc.Message += "RULE: RunForceHiddenBasedOnValue missing colToHideColName - " + colToHideColName + " != " + de.AtrbCd + Environment.NewLine;
        //        return;
        //    }

        //    IOpDataElement col = dc.GetDataElementWhere(colName, el => aValList.Contains(el.AtrbValue.ToString()));
        //    if (col == null)
        //    {
        //        dc.Message += "RULE: RunForceHiddenBasedOnValue missing col " + colName + Environment.NewLine;
        //        return;
        //    }

        //    IOpDataElement colToHide = dc.GetDataElement(colToHideColName);
        //    if (colToHide != null) colToHide.SetHidden();
        //}


        //public static void RunHideBasedOnAtrbValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    // StringVal1 = name of atrb = PAYOUT_BASED_ON
        //    // StringArrayVal1 = value of atrbs = "Billings",""
        //    // StringArrayVal2 - fields to hide = "REBATE_BILLING_START", "REBATE_BILLING_END"
        //    IOpDataElement deSource = dc.GetDataElement(ar.StringVal1);
        //    if (deSource == null)
        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValue missing deSource." + Environment.NewLine;
        //        return;
        //    }

        //    List<IOpDataElement> deTarget = dc.GetDataElementsIn(ar.StringArrayVal2).ToList();
        //    if (!deTarget.Any())
        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValue deTarget not matching " + ar.StringArrayVal2 + Environment.NewLine;
        //        return;
        //    }

        //    if (!ar.StringArrayVal1.Contains(deSource.AtrbValue.ToString()))
        //    {
        //        //dc.Message += "RULE: RunHideBasedOnAtrbValue missing !ar.StringArrayVal1";
        //        return;
        //    }

        //    foreach (IOpDataElement i in deTarget)
        //    {
        //        i.IsHidden = true;
        //    }
        //}


        //public static void RunHideBasedOnAtrbValueAndCustType(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    // StringVal1 = name of atrb = DEAL_PGM_TYPE
        //    // StringVal2 = name of cust type = Direct
        //    // StringArrayVal1 = value of atrbs = "Debit Memo", "Other"
        //    // StringArrayVal2 - fields to hide = "", ""
        //    IOpDataElement deSource = dc.GetDataElement(ar.StringVal1);
        //    if (deSource == null)
        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValueAndCustType missing deSource." + Environment.NewLine;
        //        return;
        //    }

        //    List<IOpDataElement> deTarget = dc.GetDataElementsIn(ar.StringArrayVal2).ToList();
        //    if (!deTarget.Any())
        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValueAndCustType missing deTarget." + Environment.NewLine;
        //        return;
        //    }

        //    CustomerDivision curCust = dc.GetCustomerDivision();
        //    if (curCust == null)
        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValueAndCustType missing curCust." + Environment.NewLine;
        //        return;
        //    }

        //    //if Not direct hide
        //    // or if direct and frontend... hide
        //    if ((curCust.CUST_TYPE == ar.StringVal2) &&
        //        (curCust.CUST_TYPE != ar.StringVal2 || !ar.StringArrayVal1.Contains(deSource.AtrbValue.ToString())))

        //    {
        //        dc.Message += "RULE: RunHideBasedOnAtrbValueAndCustType missing curCust and some." + Environment.NewLine;
        //        return;
        //    }

        //    foreach (IOpDataElement i in deTarget)
        //    {
        //        i.IsHidden = true;
        //    }
        //}


        //// Added by David for v5.1
        //public static void RunHideBasedOnEffectiveDate(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    // StringVal1 = EN.ATRB.REQ_DT, 
        //    // StringVal2 = EN.ATRB.DEAL_COMB_TYPE_EFFECTIVE_DATE, 
        //    // StringVal3 = EN.ATRB.DEAL_COMB_TYPE });

        //    IOpDataElement deEventDate = dc.GetDataElement(ar.StringVal1);
        //    if (deEventDate == null || string.IsNullOrEmpty(deEventDate.AtrbValue.ToString()))
        //    {
        //        dc.Message += "RULE: RunHideBasedOnEffectiveDate - deEventDate " + (deEventDate == null ? "Missing" : "Value is empty") + " [" + ar.StringVal1 + "]." + Environment.NewLine;
        //        return;
        //    }

        //    // Get Constant collection (from cache if available)
        //    List<ToolConstants> constants = DcsDataClient.InstanceOptimal().GetConstantsItems();
        //    string strEffDate = constants.GetToolConst(EN.ATRB.DEAL_COMB_TYPE_EFFECTIVE_DATE, "No Date Found");

        //    // strEffDate = ApplicationViewModel.Instance.AppConfig.AllConstants.Where(c => c.ConstantName == ar.StringVal2).Select(c => c.ConstantValue).FirstOrDefault();
        //    if (string.IsNullOrEmpty(strEffDate))
        //    {
        //        dc.Message += "RULE: RunHideBasedOnEffectiveDate - strEffDate Value is null." + Environment.NewLine;
        //        return;
        //    }

        //    IOpDataElement deTarget = dc.GetDataElement(ar.StringVal3);
        //    if (deTarget == null)
        //    {
        //        dc.Message += "RULE: RunHideBasedOnEffectiveDate - deTarget does not contain [" + ar.StringVal3 + "]." + Environment.NewLine;
        //        return;
        //    }

        //    DateTime eventDate;
        //    if (!DateTime.TryParse(deEventDate.AtrbValue.ToString(), out eventDate))
        //    {
        //        MessageWindow.Instance.Show("Invalid " + ar.StringVal1 + " date: " + deEventDate.AtrbValue + " may result in exposing " + ar.StringVal3);
        //        return;
        //    }

        //    DateTime effDate;
        //    if (!DateTime.TryParse(strEffDate, out effDate))
        //    {
        //        MessageWindow.Instance.Show("Invalid " + ar.StringVal2 + " date: " + strEffDate + " may result in exposing " + ar.StringVal3);
        //        return;
        //    }

        //    // If event date (StringVal1) is earlier than the effective date (StringVal2), then hide the attribute (StringVal3)
        //    if (DateTime.Compare(eventDate, effDate) < 0)
        //    {
        //        deTarget.IsHidden = true;
        //    }
        //}

        ////            atrbRules.Add(new AttributeRule { ActionRule = AttributeRules.RunReadOnlyBasedOnValueAndVerts, OnHiddenRequiredReadonlyTrigger = true, 
        ////StringVal1 = EN.ATRB.ECAP_TYPE, 
        ////StringArrayVal1 = new[] { EN.VALUES.TENDER }, 
        ////StringArrayVal2 = new[] { EN.VALUES.SVRWS }, 
        ////StringArrayVal3 = new[] { EN.ATRB.SERVER_DEAL_TYPE } });

        //public static void RunReadOnlyBasedOnValueAndVerts(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (deal == null || ar == null) return;

        //    string sourceItem = ar.StringVal1;  // attribute used for deciding whether to to make readonly any fields
        //    string[] sourceValues = ar.StringArrayVal1;  // attribute values that would trigger the decision
        //    string[] vertShowList = ar.StringArrayVal2;  // list of verticals that would be editable (not trigger a readonly)
        //    string[] hideFieldsList = ar.StringArrayVal3;  // list of fields to be hidden

        //    List<OpAtrbMap> cats = DcsDataClient.InstanceOptimal().GetOpAtrbMapItems().Where(c => c.AtrbCd == AttributeCodes.PRD_CATGRY_NM).ToList();

        //    var usedProductVerticals = deal.GetDataElementsWhere(AttributeCodes.PRD_BUCKET_CHK, d => d.AtrbValue.ToString() == "1")
        //        .Select(d => d.DimKey.GetDistinctDimKeyValue(5003, 0)).ToList();

        //    var dealVerticals = deal.GetDataElementsWhere(AttributeCodes.PRD_LEVEL,
        //        d => usedProductVerticals.Contains(d.DimKey.GetDistinctDimKeyValue(5003, 0))).Select(d => d.DimKey.GetDistinctDimKeyValue(5000, 0)).ToList();

        //    var dealCats = cats.Where(c => dealVerticals.Contains(c.AtrbItemId)).Select(c => c.AtrbItemValue);

        //    // if it satisfied the editable contitions... bail... other wise make them readonly
        //    if (BusinessLogicDcConditions.DataElementExistsAndContainsValue(deal, sourceItem, sourceValues) && (dealCats.Any(vertShowList.Contains))) return;

        //    BusinessLogicDcActions.ForEachDataElementIn(deal, hideFieldsList, BusinessLogicDataElementActions.SetReadOnly);
        //}

        ////// Added by David for v5.2
        //public static void RunHideBasedOnValueAndVerts(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (deal == null || ar == null) return;

        //    string sourceItem = ar.StringVal1;  // attribute used for deciding whether to show/hide any fields
        //    string[] sourceValues = ar.StringArrayVal1;  // attribute values that would trigger the decision to show/hide
        //    string[] vertShowList = ar.StringArrayVal2;  // list of verticals that would be shown (not trigger a hide field)
        //    string[] hideFieldsList = ar.StringArrayVal3;  // list of fields to be hidden

        //    List<OpAtrbMap> cats = DcsDataClient.InstanceOptimal().GetOpAtrbMapItems().Where(c => c.AtrbCd == AttributeCodes.PRD_CATGRY_NM).ToList();

        //    var usedProductVerticals = deal.GetDataElementsWhere(AttributeCodes.PRD_BUCKET_CHK, d => d.AtrbValue.ToString() == "1")
        //        .Select(d => d.DimKey.GetDistinctDimKeyValue(5003, 0))
        //        .ToList();
        //    var dealVerticals =
        //        deal.GetDataElementsWhere(AttributeCodes.PRD_LEVEL,
        //            d => usedProductVerticals.Contains(d.DimKey.GetDistinctDimKeyValue(5003, 0))).Select(d => d.DimKey.GetDistinctDimKeyValue(5000, 0)).ToList();
        //    var dealCats = cats.Where(c => dealVerticals.Contains(c.AtrbItemId)).Select(c => c.AtrbItemValue);

        //    if (BusinessLogicDcConditions.DataElementExistsAndContainsValue(deal, sourceItem, sourceValues) &&
        //        !(dealCats.Any(vertShowList.Contains)))
        //    {
        //        BusinessLogicDcActions.ForEachDataElementIn(deal, hideFieldsList, BusinessLogicDataElementActions.SetHidden);
        //    }
        //}

        //public static void RunHideUnusedTiers(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    foreach (OpDataElement de in dc.DataElements.Where(d => d.DimKey.ContainsKey(ar.IntVal1) && d.DimKey.GetDistinctDimKeyValue(ar.IntVal1, -1) > dc.GetIntValue(ar.StringVal1, 0)))
        //    {
        //        de.SetHidden();
        //    }
        //}

        //public static void RunHidePNL(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector deal = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (deal == null || ar == null) return;

        //    List<IOpDataElement> deLstPnl = deal.GetDataElements(EN.ATRB.PNL_SPLIT).ToList();

        //    IOpDataElement deKitValue = deal.GetDataElement(EN.ATRB.KIT_CHK);

        //    if (deKitValue.AtrbValue.ToString() != "N") return;

        //    foreach (IOpDataElement dataElement in deLstPnl)
        //    {
        //        dataElement.IsHidden = true;
        //    }
        //}


        //public static void RunHideRowBasedOnAtrbValueAndVerts(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    string sourceItem = ar.StringVal1;
        //    string[] sourceValues = ar.StringArrayVal1;
        //    string[] vertShowList = ar.StringArrayVal2;
        //    string[] hideFieldsList = ar.StringArrayVal3;

        //    IOpDataElement deSource = dc.GetDataElement(sourceItem);
        //    if (deSource == null || !sourceValues.Contains(deSource.AtrbValue.ToString()))
        //    {
        //        if (deSource == null) dc.Message += "RULE: RunHideRowBasedOnAtrbValueAndVerts missing deSource is null." + Environment.NewLine;
        //        return;
        //    }

        //    // If we find a category in the list... we don't hide it, so leave the function
        //    string[] facts = { AttributeCodes.PRD_LEVEL, AttributeCodes.PRODUCT_FILTER };
        //    var prodData = dc.DataElements.Where(p => facts.Contains(p.AtrbCd));

        //    List<string> cats = DcsDataClient.InstanceOptimal().GetOpAtrbMapItems().Select(c => c.AtrbItemValue).ToList();
        //    if (
        //        prodData.Any(
        //            p =>
        //                p.AtrbCd == EN.ATRB.PRODUCT_FILTER && p.State != OpDataElementState.Deleted &&
        //                vertShowList.Any(cats.Contains)))
        //    {
        //        dc.Message += "RULE: RunHideRowBasedOnAtrbValueAndVerts missing prodData." + Environment.NewLine;
        //        return;
        //    }

        //    foreach (IOpDataElement dataElement in dc.GetDataElementsIn(hideFieldsList))
        //    {
        //        dataElement.IsHidden = true;
        //    }
        //}


        //public static void RunShowHideRowBasedOnAtrbValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    foreach (IOpDataElement deSource in dc.GetDataElements(ar.StringVal1))
        //    {
        //        foreach (IOpDataElement deTarget in (dc.GetDataElementsIn(ar.StringArrayVal1)))
        //        {
        //            switch (ar.StringVal3)
        //            {
        //                case "EQUALS":
        //                    if (ar.StringArrayVal3.Contains(deSource.AtrbValue.ToString()))
        //                    {
        //                        if (ar.StringArrayVal2 != null && ar.StringArrayVal2.Contains(deTarget.AtrbCd))
        //                            deTarget.IsRequired = true;
        //                    }
        //                    else
        //                    {
        //                        deTarget.IsHidden = true;
        //                    }
        //                    break;

        //                case "NOT EQUALS":
        //                    if (!(ar.StringArrayVal3.Contains(deSource.AtrbValue.ToString())))
        //                    {
        //                        if (ar.StringArrayVal2 != null && ar.StringArrayVal2.Contains(deTarget.AtrbCd))
        //                            deTarget.IsRequired = true;
        //                        //deTarget.UIProperty.IsHidden = false;
        //                    }
        //                    else
        //                    {
        //                        //if (ar.StringArrayVal2 != null && ar.StringArrayVal2.Contains(deTarget.AtrbName))
        //                        //    deTarget.UIProperty.IsRequired = false;
        //                        deTarget.IsHidden = true;
        //                    }
        //                    break;

        //                case "CONTAINS":
        //                    bool found = false;
        //                    foreach (string s in ar.StringArrayVal3.Where(s => deSource.AtrbValue.ToString().Split('/').Contains(s)))
        //                    {
        //                        found = true;
        //                    }
        //                    if (!found)
        //                    {
        //                        foreach (IOpDataElement de in (dc.GetDataElementsIn(ar.StringArrayVal2)))
        //                        {
        //                            de.IsHidden = true;
        //                        }
        //                    }
        //                    break;

        //                case "HAS VALUE":
        //                    if (deSource.AtrbValue.ToString() == string.Empty)
        //                    {
        //                        deTarget.IsHidden = true;
        //                    }
        //                    break;
        //            }
        //            //dvm.SyncDataElementFromColumnSet(deTarget);
        //        }

        //        if (ar.StringArrayVal5 != null)
        //        {
        //            foreach (IOpDataElement deTarget in dc.GetDataElementsIn(ar.StringArrayVal5))
        //            {
        //                if (ar.StringArrayVal3.Contains(deSource.AtrbValue.ToString()))
        //                    deTarget.IsHidden = true;
        //                //dvm.SyncDataElementFromColumnSet(deTarget);
        //            }
        //        }
        //    }
        //}


        //#endregion

        //#region ReadOnlyRules

        ////public static void ForceReadOnlyBasedOnValue(params object[] args)
        ////{
        ////    if (args.Count() < 3) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    OpRoleType roleType = args[2] as OpRoleType;
        ////    if (dc == null || ar == null) return;


        ////    string attrbName = args[2].ToString();
        ////    string dealStage = args[3].ToString();
        ////    bool rtnVal = false;

        ////    string compareAtrbName = ar.StringVal2;
        ////    string[] compareAtrbVal = ar.StringArrayVal4;
        ////    string[] excludeRoleType = ar.StringArrayVal1;
        ////    string[] excludeAttrb = ar.StringArrayVal2;
        ////    string[] validStages = ar.StringArrayVal3;
        ////    string[] secondaryExcludeRoleType = ar.StringArrayVal1;
        ////    string[] secondaryExcludeAttrb = ar.StringArrayVal2;
        ////    string[] secondaryValidStages = ar.StringArrayVal3;
        ////    string[] secondaryCompareAtrbVal = ar.StringArrayVal4;
        ////    bool skipSecondRule = false;

        ////    if (!((!string.IsNullOrEmpty(ar.StringVal1) && attrbName != ar.StringVal1)
        ////          || (string.IsNullOrEmpty(ar.StringVal1) && !validStages.Contains(dealStage))
        ////         ))
        ////    {

        ////        if (string.IsNullOrEmpty(ar.StringVal1) && excludeRoleType != null && excludeAttrb != null &&
        ////            excludeRoleType.Contains(roleType.RoleTypeCd) &&
        ////            excludeAttrb.Contains(attrbName)) return;

        ////        IOpDataElement compareCS = dc.GetDataElement(compareAtrbName);
        ////        rtnVal = (compareCS != null && compareAtrbVal.Contains(compareCS.AtrbValue.ToString()));
        ////        if (!rtnVal) skipSecondRule = true;  // if we found an exception to readonly rule... it must stay editable... no matter what the second rule states... so leave function
        ////    }

        ////    if (validStages != null && secondaryValidStages.Count() != 0 && !skipSecondRule)
        ////    {

        ////        if (!((!string.IsNullOrEmpty(ar.StringVal1) && attrbName != ar.StringVal1)
        ////              || (string.IsNullOrEmpty(ar.StringVal1) && !secondaryValidStages.Contains(dealStage))))
        ////        {
        ////            if (
        ////                !(string.IsNullOrEmpty(ar.StringVal1) && secondaryExcludeRoleType != null &&
        ////                  secondaryExcludeAttrb != null &&
        ////                  secondaryExcludeRoleType.Contains(roleType.RoleTypeCd) &&
        ////                  secondaryExcludeAttrb.Contains(attrbName)))
        ////            {
        ////                IOpDataElement compareCS = dc.GetDataElement(compareAtrbName);
        ////                rtnVal = compareCS != null && secondaryCompareAtrbVal.Contains(compareCS.AtrbValue.ToString());
        ////            }
        ////        }
        ////    }

        ////    dc.PassedAction = rtnVal;
        ////}

        //public static void RunAtrbMakeReadOnlyBasedOnAtrbValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    string atrb1Name = ar.StringVal1; // "PROGRAM_PAYMENT"
        //    string[] atrb1Values = ar.StringArrayVal1; // new[] { "Frontend YCS2" }
        //    string[] atrb2Values = ar.StringArrayVal2; // new[] { "DIVISION_APPROVED_LIMIT" }

        //    if (BusinessLogicDcConditions.DataElementExistsAndContainsValue(dc, atrb1Name, atrb1Values) &&
        //        BusinessLogicDcConditions.DataElementExistsIn(dc, atrb2Values))
        //    {
        //        BusinessLogicDcActions.ForEachDataElementIn(dc, atrb2Values, BusinessLogicDataElementActions.SetReadOnly);
        //    }
        //}

        //public static void RunAtrbMakeHiddenBasedOnAtrbValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    string atrb1Name = ar.StringVal1; // atrb value(s) to check
        //    string[] atrb1Values = ar.StringArrayVal1; // accepted values to cause trigger

        //    foreach (IOpDataElement de in dc.GetDataElementsWhere(atrb1Name, d => atrb1Values.Contains(d.AtrbValue.ToString())))
        //    {
        //        de.SetHidden();
        //    }
        //}

        ////public static bool RunForceReadOnlyBasedOnValue(params object[] args)
        ////{
        ////    if (args.Count() < 4) return false;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    OpDataElement de = args[2] as OpDataElement;
        ////    OpRoleType roleType = args[3] as OpRoleType;
        ////    if (dc == null || ar == null || roleType == null) return false;

        ////    bool rtnVal = false;
        ////    bool rtnVal2 = false;
        ////    string dealStage = BusinessLogicDcFunctions.GetDealStage(dc, de, ar.StringVal3, ar.StringVal4);
        ////    string dealType = dc.GetDataElementValue(EN.ATRB.DEAL_TYPE_CD);
        ////    string programPayment = dc.GetDataElementValue(EN.ATRB.PROGRAM_PAYMENT);
        ////    string dealProgramType = dc.GetDataElementValue(EN.ATRB.DEAL_PGM_TYPE);
        ////    string compareAtrbName = ar.StringVal2;
        ////    string[] excludeRoleType = ar.StringArrayVal1;
        ////    string[] excludeAttrb = ar.StringArrayVal2;
        ////    string[] validStages = ar.StringArrayVal3;
        ////    string[] compareAtrbVal = ar.StringArrayVal4;
        ////    string[] secondaryExcludeRoleType = ar.StringArrayVal5;
        ////    string[] secondaryExcludeAttrb = ar.StringArrayVal6;
        ////    string[] secondaryValidStages = ar.StringArrayVal7;
        ////    string[] secondaryCompareAtrbVal = ar.StringArrayVal8;

        ////    if (de == null)
        ////    {
        ////        dc.Message += "RULE: RunForceReadOnlyBasedOnValue missing DE." + Environment.NewLine;
        ////        return false;
        ////    }

        ////    // Rel 5.4 Req 2.1  Always allow GA, DA, RA, and SA to edit
        ////    //                  IDMS_SHEET_COMMENT, REBATE_DEAL_ID, REBATE_OA_MAX_AMT, REBATE_OA_MAX_VOL, and END_CUSTOMER_RETAIL
        ////    //                  when the deal is in the ACTIVE stage - David
        ////    if (dealStage == EN.WORKFLOWSTAGE.ACTIVE)
        ////    {
        ////        if ((roleType.RoleTypeCd == EN.EMPLOYEEROLE.GA) ||
        ////            (roleType.RoleTypeCd == EN.EMPLOYEEROLE.DA) ||
        ////            (roleType.RoleTypeCd == EN.EMPLOYEEROLE.RA) ||
        ////            (roleType.RoleTypeCd == EN.EMPLOYEEROLE.SA))
        ////        {
        ////            if ((de.AtrbCd == EN.ATRB.IDMS_SHEET_COMMENT) ||
        ////                (de.AtrbCd == EN.ATRB.REBATE_DEAL_ID) ||
        ////                (de.AtrbCd == EN.ATRB.REBATE_OA_MAX_AMT) ||
        ////                (de.AtrbCd == EN.ATRB.REBATE_OA_MAX_VOL) ||
        ////                (de.AtrbCd == EN.ATRB.END_CUSTOMER_RETAIL))
        ////            {
        ////                return false;
        ////            }
        ////        }
        ////    }

        ////    // Rel 5.4 QC 13161 (Regression Testing)  Program Debit Memo deals and Program ECAP Adj deals should be READONLY in ACTIVE stage,
        ////    //   except for certain fields:  The ususal ones from Rel 5.4  Req 1 (see above) and COMMENTS open for everyone -David
        ////    if ((dealStage == EN.WORKFLOWSTAGE.ACTIVE) &&
        ////        (dealType == EN.DEALTYPE.PROGRAM) &&
        ////        ((dealProgramType == EN.PROGRAMTYPE.DEBIT_MEMO) || (dealProgramType == EN.PROGRAMTYPE.ECAP_ADJ)))
        ////    {
        ////        if (de.AtrbCd == EN.ATRB.COMMENTS) return false;
        ////        return true;
        ////    }

        ////    // Rel 5.4 Req 2.3  When EXPIRE_YCS2 is set to "Yes", it is locked against further changes - David
        ////    if ((de.AtrbCd == EN.ATRB.EXPIRE_YCS2) && (de.AtrbValue.ToString() == EN.VALUES.YES))
        ////    {
        ////        return true;
        ////    }

        ////    // Rel 5.4:  When Deal Stage is ACTIVE and Deal Type is ECAP Frontend YCS2, then set Start_DT and END_DT to READONLY (regression test fix) -David
        ////    if ((dealStage == EN.WORKFLOWSTAGE.ACTIVE) &&
        ////        (dealType == EN.DEALTYPE.ECAP) &&
        ////        ((programPayment == EN.PROGRAMPAYMENT.FE_XOA3) || (programPayment == EN.PROGRAMPAYMENT.FE_YCS2)))
        ////    {
        ////        if ((de.AtrbCd == EN.ATRB.START_DT) || (de.AtrbCd == EN.ATRB.END_DT))
        ////            return true;
        ////    }

        ////    if (!((!string.IsNullOrEmpty(ar.StringVal1) && de.AtrbCd != ar.StringVal1)
        ////          || (string.IsNullOrEmpty(ar.StringVal1) && !validStages.Contains(dealStage))))
        ////    {
        ////        if (!(string.IsNullOrEmpty(ar.StringVal1) && excludeRoleType != null && excludeAttrb != null &&
        ////              excludeRoleType.Contains(roleType.RoleTypeCd) &&
        ////              excludeAttrb.Contains(de.AtrbCd)))
        ////        {
        ////            IOpDataElement compareCS = dc.GetDataElement(compareAtrbName);
        ////            rtnVal = compareCS != null && compareAtrbVal.Contains(compareCS.AtrbValue.ToString());
        ////            if (!rtnVal) return false;  // if we found an exception to readonly rule... it must stay editable... no matter what the second rule states... so leave function
        ////        }
        ////    }

        ////    // Rel 5.4:  Hide PRD_CST ("Cost" in accordion) for ECAP deals if the field is empty (regression test fix) -David
        ////    if (dealType == EN.DEALTYPE.ECAP) // && (de.AtrbName == EN.ATRB.PRD_CST))
        ////    {
        ////        IOpDataElement el = dc.GetDataElement(EN.ATRB.PRD_CST);
        ////        string prodCost = dc.GetDataElementValue(EN.ATRB.PRD_CST);
        ////        if (string.IsNullOrEmpty(prodCost))
        ////        {
        ////            el.IsHidden = true;
        ////        }
        ////    }

        ////    if (!((!string.IsNullOrEmpty(ar.StringVal1) && de.AtrbCd != ar.StringVal1)
        ////          || (string.IsNullOrEmpty(ar.StringVal1) && !validStages.Contains(dealStage))))
        ////    {
        ////        if (!(string.IsNullOrEmpty(ar.StringVal1) && excludeRoleType != null && excludeAttrb != null &&
        ////              excludeRoleType.Contains(roleType.RoleTypeCd) &&
        ////              excludeAttrb.Contains(de.AtrbCd)))
        ////        {
        ////            IOpDataElement compareCS = dc.GetDataElement(compareAtrbName);
        ////            rtnVal = compareCS != null && compareAtrbVal.Contains(compareCS.AtrbValue.ToString());
        ////            if (!rtnVal) return false;  // if we found an exception to readonly rule... it must stay editable... no matter what the second rule states... so leave function
        ////        }
        ////    }

        ////    if (validStages == null || !secondaryValidStages.Any()) return rtnVal;

        ////    if (!((!string.IsNullOrEmpty(ar.StringVal1) && de.AtrbCd != ar.StringVal1)
        ////          || (string.IsNullOrEmpty(ar.StringVal1) && !secondaryValidStages.Contains(dealStage))))
        ////    {

        ////        if (!(string.IsNullOrEmpty(ar.StringVal1) && secondaryExcludeRoleType != null && secondaryExcludeAttrb != null &&
        ////              secondaryExcludeRoleType.Contains(roleType.RoleTypeCd) &&
        ////              secondaryExcludeAttrb.Contains(de.AtrbCd)))
        ////        {
        ////            IOpDataElement compareCS = dc.GetDataElement(compareAtrbName);
        ////            rtnVal2 = compareCS != null && secondaryCompareAtrbVal.Contains(compareCS.AtrbValue.ToString());
        ////        }
        ////    }

        ////    return rtnVal && rtnVal2;
        ////}

        ////public static void RunForceReadOnlyBasedOnValueStageRole(params object[] args)
        ////{
        ////    if (args.Count() < 3) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    OpRoleType roleType = args[2] as OpRoleType;
        ////    OpDataElement de = ar.ObjVal1 as OpDataElement;
        ////    if (dc == null || ar == null || roleType == null || de == null) return;

        ////    string dealStage = BusinessLogicDcFunctions.GetDealStage(dc, de, ar.StringVal2, ar.StringVal3);
        ////    string compareAtrbName = ar.StringVal1;
        ////    string[] excludeRoleType = ar.StringArrayVal1; // roles to exclude... like SA
        ////    string[] validStages = ar.StringArrayVal2;
        ////    string[] compareAtrbValues = ar.StringArrayVal3;
        ////    string[] doNotMakeReadOnlyAtrb = ar.StringArrayVal4;

        ////    if (doNotMakeReadOnlyAtrb.Contains(de.AtrbCd)
        ////        || excludeRoleType.Contains(roleType.RoleTypeCd)
        ////        || !validStages.Contains(dealStage)) return;

        ////    IOpDataElement deCompareAtrb = dc.GetDataElementWhere(compareAtrbName, d => compareAtrbValues.Contains(d.AtrbValue.ToString()));
        ////    dc.PassedAction = deCompareAtrb != null;
        ////}

        ////public static void RunLockPastEndDateFields(params object[] args)
        ////{
        ////    if (args.Count() < 2) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    if (dc == null || ar == null) return;

        ////    IOpDataElement deEndDate = dc.GetDataElement(ar.StringVal1);
        ////    string[] targetElements = ar.StringArrayVal1;
        ////    string[] excludeStages = ar.StringArrayVal2;
        ////    string dealStage = dc.GetDataElementValue(EN.ATRB.DEAL_STG_CD);

        ////    if (deEndDate == null || targetElements == null || excludeStages.Contains(dealStage))
        ////    {
        ////        dc.Message += "RULE: RunLockPastEndDateFields data." + Environment.NewLine;
        ////        return;
        ////    }

        ////    if (dc.GetDataElement(ar.StringVal1).IsDateInPast())
        ////    {
        ////        foreach (IOpDataElement de in dc.GetDataElementsIn(targetElements))
        ////        {
        ////            de.IsReadOnly = true;
        ////        }
        ////    }
        ////}

        ////public static void RunMakeAttributesReadOnlyForDealsWithTracker(params object[] args)
        ////{
        ////    if (args.Count() < 3) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    OpRoleType roleType = args[2] as OpRoleType;
        ////    if (dc == null || ar == null || roleType == null) return;


        ////    if (BusinessLogicDcConditions.AreAnyAtrbValuesPopulated(dc, ar.StringVal1) && (ar.StringArrayVal1 == null || ar.StringArrayVal1.Contains(roleType.RoleTypeCd)))
        ////    {
        ////        BusinessLogicDcActions.ForEachDataElementIn(dc, ar.StringArrayVal2, BusinessLogicDataElementActions.SetReadOnly);
        ////    }
        ////}

        ////public static void RunReadOnlyBasedOnAtrbValue(params object[] args)
        ////{
        ////    if (args.Count() < 2) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    if (dc == null || ar == null) return;

        ////    // StringVal1 = name of atrb = DEAL_PGM_TYPE
        ////    // StringArrayVal1 = value of atrbs = "Debit Memo", "Other"
        ////    // StringArrayVal2 - fields to hide = "", ""

        ////    if (BusinessLogicDcConditions.DataElementExistsAndContainsValue(dc, ar.StringVal1, ar.StringArrayVal1))
        ////    {
        ////        BusinessLogicDcActions.ForEachDataElementIn(dc, ar.StringArrayVal2, BusinessLogicDataElementActions.SetReadOnly);
        ////    }

        ////}

        //public static void RunReadOnlyBasedOnHasTracker(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    if (!dc.HasTracker()) return;

        //    BusinessLogicDcActions.ForEachDataElementIn(dc, ar.StringArrayVal1, BusinessLogicDataElementActions.SetReadOnly);
        //}


        ////public static void RunReadOnlyBasedOnInPastByStageAndRole(params object[] args)
        ////{
        ////    if (args.Count() < 3) return;
        ////    OpDataCollector dc = args[0] as OpDataCollector;
        ////    AttributeRule ar = args[1] as AttributeRule;
        ////    OpRoleType roleType = args[2] as OpRoleType;
        ////    if (dc == null || ar == null || roleType == null) return;

        ////    OpDataElement deStartDt = ((OpDataElement)dc.GetDataElement("START_DT"));
        ////    DateTime startDate = OpConvertSafe.ToDateTime(deStartDt.AtrbValue.ToString()).Date;

        ////    // If start date is NOT in the past...
        ////    if (startDate.Date >= DateTime.Now.Date) return;

        ////    string[] stages = ar.StringArrayVal2;
        ////    string stage = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
        ////    if (stages.Any() && !stages.Contains(stage)) return;

        ////    string[] roles = ar.StringArrayVal3;
        ////    if (roles.Any() && !roles.Contains(roleType.RoleTypeCd)) return;

        ////    BusinessLogicDcActions.ForEachDataElementIn(dc, ar.StringArrayVal1, BusinessLogicDataElementActions.SetReadOnly);
        ////}

        //public static void RunReadOnlyPNLSplit(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    //AttributeCollection ac = new AttributeCollection(DcsDataClient.InstanceOptimal());
        //    //int layerSid = ac.GetSid(AttributeCodes.PRD_BUCKT_SID);
        //    // hard coded because the call is causing 150 ms perfomance per deal
        //    int layerSid = 5003;
        //    IOpDataElement de = dc.GetDataElementWhere(EN.ATRB.PNL_SPLIT, d => d.GetDimValue(layerSid) == -1);

        //    if (de == null)
        //    {
        //        dc.Message += "RULE: RunReadOnlyPNLSplit missing DE." + Environment.NewLine;
        //        return;
        //    }

        //    de.IsReadOnly = true;
        //}

        //public static void RunSyncMarketSegs(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    AttributeCollection ac = new AttributeCollection(DcsDataClient.InstanceOptimal());
        //    IOpDataElement de = dc.GetDataElement(EN.ATRB.MRKT_SEG_COMBINED);
        //    List<IOpDataElement> des = dc.GetDataElements(EN.ATRB.MRKT_SEG).ToList();

        //    if (de == null)
        //    {
        //        dc.Message += "RULE: RunSyncMarketSegs missing DE." + Environment.NewLine;
        //        return;
        //    }

        //    if (dc.DcAltID > 0) return; // Not the first time you ever save a deal...  Don't run the rule, we have been here before.

        //    foreach (IOpDataElement element in des)
        //    {
        //        dc.DataElements.Remove((OpDataElement)element);
        //    }

        //    foreach (string s in de.AtrbValue.ToString().Split(','))
        //    {
        //        dc.AddDataElement(EN.ATRB.MRKT_SEG, s, ac);
        //    }
        //}

        //#endregion

        #region RequiredRules

        //public static void RunForceRequiredBasedOnMarketSegment(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    string[] search4These = ar.StringArrayVal1;
        //    string[] requiredAttributes = ar.StringArrayVal2;
        //    int requiredAttributesCount = ar.StringArrayVal2.Count();
        //    string marketSegCombined = dc.GetDataElementValue(EN.ATRB.MRKT_SEG_COMBINED);
        //    string[] marketSegments = marketSegCombined.Split('/').ToArray();
        //    int marketSegmentsCount = marketSegments.Count();
        //    for (int i = 0; i < search4These.Count(); i++)
        //    {
        //        for (int j = 0; j < marketSegmentsCount; j++)
        //        {
        //            if (search4These[i] == marketSegments[j])
        //            {
        //                for (int k = 0; k < requiredAttributesCount; k++)
        //                {
        //                    // TODO - Make method to exit gracefully and inform us of missing elements
        //                    //var element = dc.GetDataElement(requiredAttributes[k]);
        //                    //if (element != null) element.IsRequired = true;
        //                    //else
        //                    //{
        //                    //    int jz = 0;
        //                    //}
        //                    dc.GetDataElement(requiredAttributes[k]).IsRequired = true;
        //                }
        //                return;
        //            }
        //        }
        //    }
        //}


        //public static void RunForceRequiredBasedOnValue(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    OpDataElement de = ar.ObjVal1 as OpDataElement;
        //    if (de == null || !ar.StringArrayVal2.Contains(de.AtrbCd))
        //    {
        //        //dc.Message += "RULE: RunForceRequiredBasedOnValue missing de " + (de == null?"Null": de.AtrbCd + " not in [" + string.Join(",", ar.StringArrayVal2)) + "]." + Environment.NewLine;
        //        return;
        //    }

        //    // || !ar.StringArrayVal1.Contains(ar.StringVal4)
        //    if (dc.GetDataElementsWhere(ar.StringVal1, cs => ar.StringArrayVal1.Contains(cs.AtrbValue.ToString())).Any())
        //    {
        //        de.IsRequired = true;
        //    }
        //}


        //public static void RunValidateRequiredFields(params object[] args)
        //{
        //    if (!args.Any()) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    if (dc == null) return;

        //    foreach (OpDataElement de in dc.DataElements.Where(d => d.IsRequired && !d.IsReadOnly
        //                                                                     && !d.IsHidden && d.AtrbValue.ToString().Trim() == string.Empty
        //                                                                     && d.AtrbCd.ToString() != "LEGAL_COMMENTS"))
        //    {
        //        string newTxt = de.AtrbCd + " is Required." + Environment.NewLine;
        //        if (de.ValidationMessage.IndexOf(newTxt) < 0) de.ValidationMessage += newTxt;
        //    }

        //    // Intercept Legal Comments message and alter
        //    foreach (OpDataElement de in dc.DataElements.Where(d => d.IsRequired && !d.IsReadOnly
        //                                                                     && !d.IsHidden && d.AtrbValue.ToString().Trim() == string.Empty
        //                                                                     && d.AtrbCd.ToString() == "LEGAL_COMMENTS"))
        //    {
        //        de.ValidationMessage += "Legal Comments with Intel Legal approved text required." + Environment.NewLine;
        //    }

        //    foreach (IOpDataElement de in (from el in dc.GetDataElements(EN.ATRB.PRODUCT_TITLE)
        //                                   where (el.AtrbValue.ToString() == string.Empty || el.AtrbValue.ToString() == EN.MESSAGES.ADD_PRODUCTS)
        //                                         && el.ValidationMessage == string.Empty && el.State != OpDataElementState.Deleted && !el.IsHidden
        //                                   select el).Where(cs => cs.ValidationMessage.IndexOf("Product is Required.") < 0))
        //    {
        //        de.ValidationMessage += "Product is Required." + Environment.NewLine;
        //    }

        //    IOpDataElement csPrdCombined = dc.GetDataElement(EN.ATRB.PRODUCT_TITLE);
        //    //if (csPrdCombined != null) // if not a CS combined and there are not any fact 15... Break Test
        //    if (csPrdCombined != null && !dc.GetDataElements("PRD_LEVEL").Any()) // if not a CS combined and there are not any fact 15...
        //    {
        //        if (csPrdCombined.ValidationMessage.IndexOf("Product is Required") < 0) csPrdCombined.ValidationMessage += "Product is Required." + Environment.NewLine;
        //    }
        //}



        //public static void RunMinDealReqs(params object[] args)
        //{
        //    if (args.Count() < 2) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    if (dc == null || ar == null) return;

        //    List<string> msgs = ar.StringArrayVal1.Where(atrbCd => dc.GetDataElementWhere(atrbCd, d => d.AtrbValue.ToString() != string.Empty && d.State != OpDataElementState.Deleted) == null).ToList();

        //    if (!msgs.Any()) return;

        //    IOpDataElement deDealNbr = dc.GetDataElement("DEAL_NBR"); //changed from DEAL_SID to DEAL_NBR
        //    if (deDealNbr != null) deDealNbr.ValidationMessage += string.Format("DEAL INVALID -> Missing or Empty fields: {0}", string.Join(", ", msgs));
        //}


        #endregion

        #region SyncRules





        //public static void RunSyncHiddenItems(params object[] args)
        //{
        //    if (args.Count() < 4) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    OpRoleType roleType = args[2] as OpRoleType;
        //    Dictionary<string, bool> securityActionCache = args[3] as Dictionary<string, bool>;
        //    if (dc == null || ar == null || roleType == null) return;

        //    string[] excludeList = ar.StringArrayVal1 ?? new string[] { };

        //    foreach (OpDataElement de in dc.DataElements)
        //    {
        //        bool isHidden = false;
        //        string stg = BusinessLogicDcFunctions.GetCorrectStage(dc, de);

        //        if (!excludeList.Contains(de.AtrbCd) && OpSecurityViewModel.Instance.ChkAtrbRules(
        //            dc.DcType.ToUpper(),
        //            roleType.RoleTypeCd,
        //            stg,
        //            "ATRB_HIDDEN",
        //            de.AtrbCd,
        //            securityActionCache))
        //        {
        //            isHidden = true;
        //        }

        //        de.IsHidden = isHidden;
        //    }

        //    // Now apply all rules triggered by Hidden
        //    dc.ApplyRuleDuringHidden(dc.DcType, roleType, securityActionCache);
        //}

        //public static void RunSyncRequiredItems(params object[] args)
        //{
        //    if (args.Count() < 4) return;
        //    OpDataCollector dc = args[0] as OpDataCollector;
        //    AttributeRule ar = args[1] as AttributeRule;
        //    OpRoleType roleType = args[2] as OpRoleType;
        //    Dictionary<string, bool> securityActionCache = args[3] as Dictionary<string, bool>;
        //    if (dc == null || ar == null || roleType == null) return;

        //    string[] excludeList = ar.StringArrayVal1 ?? new string[] { };

        //    foreach (OpDataElement de in dc.DataElements)
        //    {
        //        bool isRequired = false;
        //        string stg = BusinessLogicDcFunctions.GetCorrectStage(dc, de);

        //        if (OpSecurityViewModel.Instance.ChkAtrbRules(dc.DcType, roleType.RoleTypeCd, stg, "ATRB_REQUIRED", de.AtrbCd, securityActionCache)) isRequired = true;

        //        // for now... this must stay here because it breaks the rule of free until proven guilty.  We want to force not required
        //        if (de.AtrbCd == "BACK_DATE_RSN")
        //        {
        //            var deStartDt = dc.DataElements.FirstOrDefault(d => d.AtrbCd == AttributeCodes.START_DT);
        //            if (deStartDt != null && deStartDt.State == OpDataElementState.Unchanged && deStartDt.IsRequired)
        //            {
        //                isRequired = false;
        //            }
        //        }

        //        de.IsRequired = isRequired;
        //    }

        //    dc.ApplyRuleDuringRequired(dc.DcType, roleType, securityActionCache);
        //}


        #endregion

        #region Helper Functions

        public static void UpdateMessages(this WorkFlowQueueItem item, OpDataPacket<OpDataElementType> responsePacket)
        {
            if (item.DcsAction.Messages == null) item.DcsAction.Messages = new OpMsgQueue();
            item.DcsAction.Messages.Messages.AddRange(responsePacket.Messages.IsErrors
                ? responsePacket.Messages.GetErrors()
                : responsePacket.Messages.GetMessages());
        }

        public static void ResponseMessage(OpDataPacket<OpDataElementType> dataPacket, string msg, OpMsg.MessageType type, int dcId, int dcAltId) // write only the dataPacket message
        {
            ResponseMessage(dataPacket, null, msg, type, dcId, dcAltId);
        }

        public static void ResponseMessage(OpDataPacket<OpDataElementType> dataPacket, WorkFlowQueueItem item, string msg, OpMsg.MessageType type, int dcId, int dcAltId) // write the dataPacket and Workflow Item messages
        {
            OpMsg addMessage = new OpMsg()
            {
                Message = msg,
                MsgType = type,
                //KeyIdentifier = dcId,
                KeyIdentifiers = new[] { dcId, dcAltId }  // Put the real deal ID in message
            };
            dataPacket.Messages.Write(addMessage); // passback with packet

            if (item == null) return;

            if (item.DcsAction.Messages == null) item.DcsAction.Messages = new OpMsgQueue();
            item.DcsAction.Messages.Write(addMessage); // Internal workflow message
        }

        #endregion

    }

}
