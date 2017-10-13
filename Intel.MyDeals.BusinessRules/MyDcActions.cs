using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Helpers;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// Place all MyDeals specific actions here.
    /// Most of the actions used will come from BusinessLogicDcActions
    /// This class will let you define MyDeals specific actions that might need to be performed
    /// </summary>
    public static partial class MyDcActions
    {
        public static Dictionary<string, bool> SecurityActionCache { get; set; }

        /// <summary>
        /// Execute the appropiate action based on the condition statement
        /// </summary>
        /// <param name="args"></param>
        public static void ExecuteActions(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        public static void ExecuteMerges(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            OpDataCollectorFlattenedItem item = ((object[])args[3])[0] as OpDataCollectorFlattenedItem;
            if (item == null) return;
            if (!r.Dc.DataElements.Any()) return;

            // Deal Dates
            string dcStStr = r.Dc.GetDataElementValue(AttributeCodes.START_DT);
            string dcEnStr = r.Dc.GetDataElementValue(AttributeCodes.END_DT);
            string dcSt = DateTime.Parse(dcStStr == "" ? item[AttributeCodes.START_DT].ToString() : dcStStr).ToString("MM/dd/yyyy");
            string dcEn = DateTime.Parse(dcEnStr == "" ? item[AttributeCodes.END_DT].ToString() : dcEnStr).ToString("MM/dd/yyyy");
            string dcItemSt = DateTime.Parse(item[AttributeCodes.START_DT].ToString()).ToString("MM/dd/yyyy");
            string dcItemEn = DateTime.Parse(item[AttributeCodes.END_DT].ToString()).ToString("MM/dd/yyyy");
            string payoutBasedOn = item[AttributeCodes.PAYOUT_BASED_ON].ToString();
            string mrktSegValue = item[AttributeCodes.MRKT_SEG].ToString();
            DateTime dcItemStDt = DateTime.Parse(item[AttributeCodes.START_DT].ToString());

            // Billing Dates
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_START)) || dcSt != dcItemSt)
            {
                item[AttributeCodes.REBATE_BILLING_START] = dcItemSt;
            }
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_END)) || dcEn != dcItemEn)
            {
                item[AttributeCodes.REBATE_BILLING_END] = dcItemEn;
            }

            // On Ad Date
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.ON_ADD_DT)))
            {
                //US 53204 - 8 - On add date-If Market segment is Consumer retail or ALL, then default to current quarter first date, other wise Blank. user can edit.
                if (!item.ContainsKey(AttributeCodes.CUST_MBR_SID)) return;

                string strCust = item[AttributeCodes.CUST_MBR_SID]?.ToString();
                if (!string.IsNullOrEmpty(strCust))
                {
                    int custId = Convert.ToInt32(strCust);
                    if (mrktSegValue.IndexOf("Consumer Retail Pull") >= 0 || mrktSegValue == "All")
                    {
                        var customerQuarterDetails = new CustomerCalendarDataLib().GetCustomerQuarterDetails(custId, DateTime.Today, null, null);
                        item[AttributeCodes.ON_ADD_DT] = customerQuarterDetails.QTR_STRT.Date;
                    }
                }
            }

            // Consumption Reason
            //if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.CONSUMPTION_REASON)))
            //{
            //    item[AttributeCodes.CONSUMPTION_REASON] = "None";
            //}

            // Additive
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.DEAL_COMB_TYPE)))
            {
                item[AttributeCodes.DEAL_COMB_TYPE] = "Non Additive";
                //item[AttributeCodes.DEAL_COMB_TYPE] = payoutBasedOn == "Consumption" ? "Non Additive" : "Additive";
            }

            // Check for backdate Reason
            IOpDataElement deStr = r.Dc.GetDataElement(AttributeCodes.START_DT);
            if (!string.IsNullOrEmpty(dcSt))
            {
                string dcPrevSt = string.IsNullOrEmpty(deStr.AtrbValue.ToString()) ? "" : DateTime.Parse(deStr.AtrbValue.ToString()).ToString("MM/dd/yyyy");
                if (string.IsNullOrEmpty(deStr.AtrbValue.ToString())) deStr.AtrbValue = dcSt;
                IOpDataElement deContractRsn = r.Dc.GetDataElement(AttributeCodes.BACK_DATE_RSN);
                if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.BACK_DATE_RSN)) && dcItemStDt < DateTime.Now.Date && dcPrevSt != dcItemSt)
                {
                    IOpDataElement deContractRsnTxt = r.Dc.GetDataElement(AttributeCodes.BACK_DATE_RSN_TXT);
                    string strContractRsn = item.ContainsKey(AttributeCodes.BACK_DATE_RSN_TXT) ? item[AttributeCodes.BACK_DATE_RSN_TXT].ToString() : "";
                    if (string.IsNullOrEmpty(strContractRsn))
                    {
                        deContractRsnTxt.AtrbValue = "NEEDED";
                        deContractRsnTxt.State = OpDataElementState.Modified;
                    }
                    else
                    {
                        deContractRsn.AtrbValue = item[AttributeCodes.BACK_DATE_RSN_TXT];
                        deContractRsn.State = OpDataElementState.Modified;
                    }
                }
                else if (!string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.BACK_DATE_RSN)) && dcItemStDt >= DateTime.Now.Date)
                {
                    deContractRsn.AtrbValue = "";
                    deContractRsn.State = OpDataElementState.Modified;
                }
            }

            // Frontend -> PROGRAM_PAYMENT
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON)) && item[AttributeCodes.PROGRAM_PAYMENT].ToString() != "Backend")
            {
                item[AttributeCodes.PAYOUT_BASED_ON] = "Billings";
            }

            // Clear out consumption if the user sets payout based on = billings.  DE30320
            if (item[AttributeCodes.PAYOUT_BASED_ON].ToString() == "Billings")
            {
                item[AttributeCodes.CONSUMPTION_REASON] = "";
                item[AttributeCodes.CONSUMPTION_REASON_CMNT] = "";
            }

            if (item[AttributeCodes.PRODUCT_CATEGORIES].ToString().IndexOf("SvrWS") < 0)
            {
                item[AttributeCodes.SERVER_DEAL_TYPE] = "";
            }

            //r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        /// <summary>
        /// Sync Attribute Properties (ReadOnly, Required, Hidden) based on attribute security and rules
        /// </summary>
        /// <param name="actionCode">ATRB_READ_ONLY, ATRB_REQUIRED, ATRB_HIDDEN</param>
        /// <param name="myRulesTrigger">Trigger to invoke rule (OnReadonly, OnRequired, OnHidden)</param>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        private static void SyncAtrbPropertyItems(string actionCode, MyRulesTrigger myRulesTrigger, params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            if (SecurityActionCache == null) SecurityActionCache = new Dictionary<string, bool>();
            r.Dc.ApplySecurityAttributes(actionCode, DataCollections.GetSecurityWrapper(), new string[] { }, SecurityActionCache);

            // Now apply all rules
            r.Dc.ApplyRules(myRulesTrigger, r.Security);
        }

        /// <summary>
        /// Sync ReadOnly items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncReadOnlyItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_READ_ONLY, MyRulesTrigger.OnReadonly, args);
        }

        /// <summary>
        /// Sync Required items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncRequiredItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_REQUIRED, MyRulesTrigger.OnRequired, args);
        }

        /// <summary>
        /// Sync Hidden items
        /// </summary>
        /// <param name="args">OpDataCollector, MyOpRule and SecurityActionCache</param>
        public static void SyncHiddenItems(params object[] args)
        {
            SyncAtrbPropertyItems(SecurityActns.ATRB_HIDDEN, MyRulesTrigger.OnHidden, args);
        }

        public static void CheckProductJson(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement dePrdUsr = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
            string prdJsonIvalid = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_INVLD_PRD)) ?? "";
            if (string.IsNullOrEmpty(prdJson)) return;

            ProdMappings items = null;
            try
            {
                items = JsonConvert.DeserializeObject<ProdMappings>(prdJson);
            }
            catch (Exception ex)
            {
                dePrdUsr.AddMessage("Unable to read the selected products.  Please use the Product Selector to fix the issue.");
                return;
            }

            if (!items.Any())
            {
                dePrdUsr.AddMessage("Product select did not result in any products.");
                return;
            }

            if (!string.IsNullOrEmpty(prdJsonIvalid))
            {
                dePrdUsr.AddMessage("Product select has some invalid products.");
                return;
            }
            if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.ECAP.ToString())
            {
                foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                {
                    foreach (ProdMapping prodMapping in kvp.Value)
                    {
                        if (string.IsNullOrEmpty(prodMapping.PRD_MBR_SID))
                        {
                            dePrdUsr.AddMessage($"User entered product ({kvp.Key}) is unable to locate product ({prodMapping.HIER_VAL_NM})");
                        }

                        if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.ECAP.ToString())
                        {
                            #region CAP Validations

                            double cap;
                            if (!double.TryParse(prodMapping.CAP, out cap) && prodMapping.CAP.IndexOf("-") >= 0)
                            {
                                dePrdUsr.AddMessage($"Product ({prodMapping.HIER_VAL_NM}) CAP price ({prodMapping.CAP}) cannot be a range.");
                            }

                            //double ecap;
                            //if (!double.TryParse(r.Dc.GetDataElementValue(AttributeCodes.ECAP_PRICE), out ecap)) ecap = 0;

                            // When ECAP Price is greater than CAP, UI validation check on deal creation and system should give a soft warning.
                            // TODO... put this as a soft warning on the grid
                            //if (ecap > 0 && cap > ecap)
                            //{
                            //    BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"CAP price ({cap}) is greater than ECAP Price.");
                            //}

                            // IF CAP is not available at all then show as NO CAP.User can not create deals.
                            // not true anymore... soft warning in grid now
                            //if (cap <= 0)
                            //{
                            //    BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"CAP is not available ({prodMapping.CAP}). You can not create deals with this product.");
                            //}

                            //if (!string.IsNullOrEmpty(prodMapping.PRD_STRT_DTM) && !string.IsNullOrEmpty(prodMapping.CAP_START))
                            //{
                            //    DateTime capStart = DateTime.Parse(prodMapping.CAP_START);
                            //    DateTime capEnd = DateTime.Parse(prodMapping.CAP_END);
                            //    DateTime prdStart = DateTime.Parse(prodMapping.PRD_STRT_DTM);

                            //    DateTime dealStart;
                            //    DateTime dealEnd;
                            //    if (DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.START_DT), out dealStart) && DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.END_DT), out dealEnd))
                            //    {
                            //        if (!(capStart < dealEnd && dealStart < capEnd))
                            //        {
                            //            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, "Product entered does not have CAP within the Deal's start date and end date");
                            //        }

                            //        if (capStart > dealEnd)
                            //        {
                            //            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"The CAP start date ({capStart:mm/dd/yyyy}) and end date ({capEnd:mm/dd/yyyy}) exists in future outside of deal end date. Please change the deal start date to match the CAP start date.");
                            //        }
                            //    }

                            //    // If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.
                            //    if (prdStart > dealStart)
                            //    {
                            //        BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.");
                            //    }
                            //}

                            #endregion CAP Validations
                        }
                    }
                }
            }
            if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.VOL_TIER.ToString())
            {
                CheckForCrossVerticalProducts(dePrdUsr, items);
            }
        }

        /// <summary>
        ///  Cross vertical validation allowed combinations
        ///  1. "DT", "Mb", "SvrWS", "EIA CPU"
        ///  2. "CS", "EIA CS"
        /// </summary>
        /// <param name="dePrdUsr"></param>
        /// <param name="items"></param>
        private static void CheckForCrossVerticalProducts(IOpDataElement dePrdUsr, ProdMappings items)
        {
            // TODO Move these to constants
            var productCombination1 = new string[] { "DT", "Mb", "SvrWS", "EIA CPU" }.ToDictionary(x => x);
            var productCombination2 = new string[] { "CS", "EIA CS" }.ToDictionary(x => x);

            var validContractProducts = new List<string>();
            foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
            {
                // Get unique product categories for Contract products
                foreach (ProdMapping prodMapping in kvp.Value.Where(x => !x.EXCLUDE))
                {
                    if (!validContractProducts.Contains(prodMapping.PRD_CAT_NM))
                    {
                        validContractProducts.Add(prodMapping.PRD_CAT_NM);
                    }
                }
            }

            if (validContractProducts.Any())
            {
                for (var i = 0; i < validContractProducts.Count; i++)
                {
                    if (i == validContractProducts.Count() - 1) break;
                    var newprodCategory = validContractProducts[i + 1];
                    if (productCombination1.ContainsKey(validContractProducts[i]))
                    {
                        if (!productCombination1.ContainsKey(newprodCategory))
                        {
                            dePrdUsr.AddMessage($"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.");
                            break;
                        }
                    }
                    else if (productCombination2.ContainsKey(validContractProducts[i]))
                    {
                        if (!productCombination2.ContainsKey(newprodCategory))
                        {
                            dePrdUsr.AddMessage($"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.");
                            break;
                        }
                    }
                    else
                    {
                        if (validContractProducts[i] != newprodCategory)
                        {
                            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.");
                            break;
                        }
                    }
                }
            }
        }

        public static void CheckCustDivValues(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            if (!r.HasExtraArgs) return;
            char delim = '/';

            //return

            IOpDataElement deUserCustDivs = r.Dc.GetDataElement(AttributeCodes.CUST_ACCNT_DIV);

            int custId = (int)r.ExtraArgs[0];

            if (deUserCustDivs == null || deUserCustDivs.AtrbValue.ToString() == "") return;

            //int custId = Convert.ToInt32(strCustId);
            var custs = DataCollections.GetCustomerDivisions().Where(c => c.CUST_NM_SID == custId).ToList();
            List<string> matchedDivs = new List<string>();
            bool foundMisMatch = false;

            List<string> custList = deUserCustDivs.AtrbValue.ToString().Split(delim).ToList();
            foreach (string divNm in custList)
            {
                string matchedValue = custs.Where(d => d.CUST_DIV_NM.ToUpper() == divNm.ToString().ToUpper()).Select(d => d.CUST_DIV_NM).FirstOrDefault();
                if (string.IsNullOrEmpty(matchedValue))
                {
                    foundMisMatch = true;
                    matchedDivs.Add(divNm);
                }
                else
                {
                    matchedDivs.Add(matchedValue);
                }
            }

            string newList = string.Join(delim.ToString(), matchedDivs.OrderBy(m => m));
            if (newList != deUserCustDivs.AtrbValue.ToString())
            {
                deUserCustDivs.AtrbValue = newList;
                deUserCustDivs.State = OpDataElementState.Modified;
            }

            if (foundMisMatch)
                deUserCustDivs.AddMessage("Please enter a valid value.");
        }

        //Mikes New Rule
        public static void MeetCompMandatoryCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deEcapTypeValue = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string[] deProductCategoriesValue = r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Split(',');
            string role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;
            bool IsL1Product = r.Dc.GetDataElementValue(AttributeCodes.HAS_L1) == "1" ? true : false;

            List<string> mandatoryMeetCompFields = new List<string>
            {
                AttributeCodes.MEET_COMP_PRICE_QSTN,
                AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE,
                AttributeCodes.MEETCOMP_TEST_FAIL_OVERRIDE_REASON,
                AttributeCodes.MEETCOMP_TEST_RESULT
            };

            // US52971 - If ECAP Type=MCP or pull in MCP then user(FSE) has to enter the Meet comp related information Mandatory for CPU and CS products .Mandatory for GA for all other cases.
            if ((deEcapTypeValue == "MCP" || deEcapTypeValue == "PULL-IN MCP")
                && (deProductCategoriesValue.Contains("CPU") || deProductCategoriesValue.Contains("CS"))
                && role == RoleTypes.FSE)
            {
                foreach (IOpDataElement de in r.Dc.GetDataElementsIn(mandatoryMeetCompFields))
                {
                    de.IsRequired = true;
                }
            }

            // US52971 - if it is not MCP nor pull in MCP and if product is L1, then system would not ask as mandatory for FSE, But GA has to fill it as mandatory.If not filled.give a message' Meetcomp info is required '.If meetcomp fails then GA can not submit the deal.
            if ((deEcapTypeValue != "MCP" || deEcapTypeValue != "PULL-IN MCP")
                && IsL1Product
                && role == RoleTypes.GA)
            {
                foreach (IOpDataElement de in r.Dc.GetDataElementsIn(mandatoryMeetCompFields))
                {
                    de.IsRequired = true;
                }
            }
        }

        public static void ExecuteOnAd(params object[] args)
        {
            ////US 53204 - 8 - On add date-If Market segment is Consumer retail or ALL, then default to current quarter first date, other wise Blank. user can edit.
            //MyOpRuleCore r = new MyOpRuleCore(args);
            //if (!r.IsValid) return;

            //string mrktSegValue = r.Dc.GetDataElement(AttributeCodes.MRKT_SEG).AtrbValue.ToString();
            //IOpDataElement deOnAdDate = r.Dc.GetDataElement(AttributeCodes.ON_ADD_DT);
            //if (!r.HasExtraArgs) return;
            //int custId = (int)r.ExtraArgs[0];

            //if ((mrktSegValue == "Consumer Retail Pull" || mrktSegValue == "All") && deOnAdDate.AtrbValue.ToString() == "")
            //{
            //    var customerQuarterDetails = new CustomerCalendarDataLib().GetCustomerQuarterDetails(custId, DateTime.Today, null, null);
            //    deOnAdDate.AtrbValue = customerQuarterDetails.QTR_STRT.Date;
            //    deOnAdDate.State=OpDataElementState.Modified;
            //}
        }

        public static void ShowServerDealType(params object[] args)
        {
            // US53204 - 15 - If product selected is of SvrWS then enable the 'Server Deal Type' Column in kendo grid ,otherwise do not show it.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string[] deProductCategoriesValue = r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Split(',');

            if (!deProductCategoriesValue.Contains("SvrWS"))
            {
                IOpDataElement deServerDealType = r.Dc.GetDataElement(AttributeCodes.SERVER_DEAL_TYPE);
                if (deServerDealType != null) deServerDealType.IsReadOnly = true;
            }
        }

        public static void ReadOnlyFrontendWithTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deFrontendValue = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

            if (deFrontendValue == "Backend" || !r.Dc.HasTracker()) return;

            foreach (OpDataElement de in r.Dc.DataElements.Where(d => d.AtrbCd != AttributeCodes.NOTES && d.AtrbCd != AttributeCodes.COMMENTS))
            {
                de.SetReadOnly();
            }
        }

        public static void ShowExpireYCS2(params object[] args)
        {
            // DE28754 - Expire YCS2 Should be Editable for Front End Active Deals only.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deProgramPaymentValue = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            string deTrackerValue = r.Dc.GetDataElementValue(AttributeCodes.TRKR_NBR);
            IOpDataElement deExpireYcs = r.Dc.GetDataElement(AttributeCodes.EXPIRE_YCS2);

            if (deProgramPaymentValue.Contains("Frontend") && deTrackerValue != "")
            {
                if (deExpireYcs != null) deExpireYcs.IsHidden = false;
            }
            else
            {
                if (deExpireYcs != null) deExpireYcs.IsHidden = true;
            }
        }

        public static void CheckDropDownValues(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> eligableDropDowns = new List<string>
            {
                AttributeCodes.PAYOUT_BASED_ON,
                AttributeCodes.PROGRAM_PAYMENT,
                AttributeCodes.REBATE_TYPE,
                AttributeCodes.MEET_COMP_PRICE_QSTN,
                AttributeCodes.PROD_INCLDS
            };

            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(eligableDropDowns))
            {
                List<string> dropDowns = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == de.AtrbCd).Select(d => d.DROP_DOWN).ToList();
                string matchedValue = dropDowns.Where(d => d.ToUpper() == de.AtrbValue.ToString().ToUpper()).Select(d => d).FirstOrDefault();
                if (string.IsNullOrEmpty(matchedValue))
                {
                    de.AddMessage("Please enter a valid value.");
                }
                else
                {
                    if (matchedValue != de.AtrbValue.ToString())
                    {
                        // strings match but case is different
                        de.AtrbValue = matchedValue;
                    }
                }
            }
        }

        public static void CheckBillingDates(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deStart = r.Dc.GetDataElement(AttributeCodes.START_DT);
            IOpDataElement deEnd = r.Dc.GetDataElement(AttributeCodes.END_DT);
            IOpDataElement deBllgStart = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_START);
            IOpDataElement deBllgEnd = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_END);

            if (string.IsNullOrEmpty(deStart?.AtrbValue.ToString()) || string.IsNullOrEmpty(deEnd?.AtrbValue.ToString())) return;
            if (string.IsNullOrEmpty(deBllgStart?.AtrbValue.ToString()) || string.IsNullOrEmpty(deBllgEnd?.AtrbValue.ToString())) return;

            DateTime dcSt = DateTime.Parse(deStart.AtrbValue.ToString()).Date;
            DateTime dcEn = DateTime.Parse(deEnd.AtrbValue.ToString()).Date;

            if (string.IsNullOrEmpty(deBllgStart.AtrbValue.ToString()) || DateTime.Parse(deBllgStart.AtrbValue.ToString()).Date > dcSt)
            {
                deBllgStart.AddMessage("The Billing Start Date must be on or earlier than the Deal Start Date.");
            }
            if (string.IsNullOrEmpty(deBllgEnd.AtrbValue.ToString()) || DateTime.Parse(deBllgEnd.AtrbValue.ToString()).Date > dcEn)
            {
                deBllgEnd.AddMessage("The Billing End Date must be on or earlier than the Deal End Date.");
            }
        }

        public static void CheckFrontendConsumption(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string payout = r.Dc.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON);
            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);

            if (payout != "Billings" && progPayment != "Backend")
            {
                de.AddMessage("Frontend Deals cannot be Consumption.");
            }
        }

        public static void CheckVolume(params object[] args)
        {
            // DE28830 - Deal Ceiling Validation message issue in case of Front End Deal fix
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.VOLUME);
            if (de == null || de.AtrbValue.ToString() == "") return;
            if (de.AtrbValue.ToString() != "" && progPayment != "Backend")
            {
                de.AddMessage("Volume cannot be set for Frontend Deals.");
                return;
            }

            int vol;
            if (!int.TryParse(de.AtrbValue.ToString(), out vol))
            {
                de.AddMessage("Volume must be a valid non-decimal number.");
            }
        }

        public static void CheckFrontendDates(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deStart = r.Dc.GetDataElement(AttributeCodes.START_DT);
            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            if (string.IsNullOrEmpty(progPayment) || string.IsNullOrEmpty(deStart?.AtrbValue.ToString())) return;

            DateTime startDate = DateTime.Parse(deStart.AtrbValue.ToString());
            DateTime today = DateTime.Now.Date;

            // Additional validation-for program payment=Front end, the deal st. date can not be past, it should be >= current date
            if (progPayment.Contains("rontend") && startDate < today && !r.Dc.HasTracker())
            {
                deStart.AddMessage("The deal start date must be greater or equal to the current date if program payment is Frontend.");
            }
        }

        public static void CompressJson(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> atrbs = new List<string> { AttributeCodes.PTR_SYS_PRD, AttributeCodes.PTR_SYS_INVLD_PRD };
            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(atrbs))
            {
                if (de.HasValueChanged && string.IsNullOrEmpty(de.AtrbValue.ToString()))
                    de.AtrbValue = CompressHelpers.EncodeTo64(de.AtrbValue.ToString());
            }
        }

        public static void UnCompressJson(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> atrbs = new List<string> { AttributeCodes.PTR_SYS_PRD, AttributeCodes.PTR_SYS_INVLD_PRD };
            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(atrbs))
            {
                string val = de.AtrbValue.ToString();
                if (!string.IsNullOrEmpty(val) && val.IsBase64String())
                {
                    de.AtrbValue = CompressHelpers.DecodeFrom64(val);
                }
            }
        }

        public static void ClearValidateForHold(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IEnumerable<IOpDataElement> des = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.WF_STG_CD) && de.HasValue("Hold"));
            if (!des.Any()) return;

            foreach (IOpDataElement de in r.Dc.GetDataElementsWhere(d => !string.IsNullOrEmpty(d.ValidationMessage)))
            {
                de.ValidationMessage = string.Empty;
                if (de.IsRequired) de.IsRequired = false;
            }
        }

        public static void MajorChangeAddPtCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            
            if (r.Dc.DcID > 0 || !r.ExtraArgs.Any()) return;

            var myDealsData = (MyDealsData)r.ExtraArgs[0];

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_ST)) return;

            IOpDataElement deStage = myDealsData[OpDataElementType.PRC_ST].AllDataCollectors.FirstOrDefault().GetDataElement(AttributeCodes.WF_STG_CD);
            string curStage = deStage.AtrbValue.ToString();
            var futureStage = r.Dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), curStage, OpDataElementType.PRC_ST);

            if (!string.IsNullOrEmpty(futureStage) && curStage != futureStage)
            {
                deStage.SetAtrbValue(futureStage);
            }
        }

        public static void MajorChangeCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string wipStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string ptrStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD + "_PRNT");
            var futureStage = r.Dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), ptrStage, OpDataElementType.PRC_ST);

            // if there isn't a future stage, then it isn't redealable
            if (futureStage == null && wipStage != WorkFlowStages.Active && r.Dc.DcID > 0) return;

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            List<MyDealsAttribute> onChangeItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR").ToList();
            List<MyDealsAttribute> onChangeIncreaseItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_INCREASE").ToList();
            List<MyDealsAttribute> onChangeDecreaseItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_DECREASE").ToList();

            if (!r.ExtraArgs.Any()) return;

            var myDealsData = (MyDealsData)r.ExtraArgs[0];

            List<IOpDataElement> changedDes = r.Dc.GetDataElementsWhere(d => onChangeItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).ToList();
            List<IOpDataElement> changedIncreaseDes = r.Dc.GetDataElementsWhere(d => onChangeIncreaseItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged && d.IsValueIncreasedFromOrig(atrbMstr)).ToList();
            List<IOpDataElement> changedDecreaseDes = r.Dc.GetDataElementsWhere(d => onChangeDecreaseItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged && d.IsValueDecreasedFromOrig(atrbMstr)).ToList();

            // if not a major change... exit
            if (!changedDes.Any() && !changedIncreaseDes.Any() && !changedDecreaseDes.Any() && r.Dc.DcID > 0) return;

            // Define redeal reason
            var reason = "Redeal due to major change: \n";
            foreach (IOpDataElement de in changedDes.Union(changedIncreaseDes))
            {
                MyDealsAttribute atrb = onChangeItems.Union(onChangeIncreaseItems).Union(onChangeDecreaseItems).FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
                if (atrb.DATA_TYPE_CD == "DATETIME")
                {
                    reason += $"{atrb.ATRB_LBL} changed from {DateTime.Parse(de.OrigAtrbValue.ToString()):MM/dd/yyyy} to {DateTime.Parse(de.AtrbValue.ToString()):MM/dd/yyyy} \n";
                }
                else
                {
                    reason += $"{atrb.ATRB_LBL} changed from {de.OrigAtrbValue} to {de.AtrbValue} \n";
                }
            }

            myDealsData[OpDataElementType.WIP_DEAL].Actions.Add(new MyDealsDataAction(DealSaveActionCodes.ADD_TO_TIMELINE, reason, 30));

            // NOTE: We need to set the WIP and the PS stage
            // WIP always is "Draft" and PS depends on the users workflow
            // NOTE 2: We do not set the Contract stage.  We will rely on the SP to sync that stage

            // set WIP Stages for a redeal
            r.Dc.SetAtrb(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft);
            if (wipStage == WorkFlowStages.Active) // WIP Object, Set redeal date only if this came from active since it will drive the tracker effective from/to date calc.
            {
                r.Dc.SetAtrb(AttributeCodes.LAST_REDEAL_BY, OpUserStack.MyOpUserToken.Usr.WWID);
                r.Dc.SetAtrb(AttributeCodes.LAST_REDEAL_DT, DateTime.Now.Date);
                string tracker = r.Dc.GetDataElementValue(AttributeCodes.TRKR_NBR);
                if (!string.IsNullOrEmpty(tracker)) // If there is a tracker number, put the WIP version in redeal visual state
                {
                    r.Dc.SetAtrb(AttributeCodes.TRKR_NBR, tracker + "*");
                }
            }

            // Locate and set Parent PS Attributes
            if (futureStage != null || r.Dc.DcID < 0)
            {
                if (r.Dc.DcID < 0)
                {
                    futureStage = OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA
                        ? WorkFlowStages.Requested
                        : WorkFlowStages.Draft;
                }
                OpDataCollector dcRow = myDealsData[OpDataElementType.PRC_TBL_ROW].Data[r.Dc.DcParentID];
				OpDataCollector dcTbl = myDealsData[OpDataElementType.PRC_TBL].Data[dcRow.DcParentID];
				if (!myDealsData.ContainsKey(OpDataElementType.PRC_ST))
				{
					myDealsData[OpDataElementType.PRC_ST] = new OpDataCollectorDataLib().GetByIDs(OpDataElementType.PRC_ST,
						new List<int> { dcTbl.DcParentID },
						new List<OpDataElementType> { OpDataElementType.PRC_ST },
						new List<int> { Attributes.WF_STG_CD.ATRB_SID })[OpDataElementType.PRC_ST];
				}
				OpDataCollector dcSt = myDealsData[OpDataElementType.PRC_ST].Data[dcTbl.DcParentID];
				dcSt.SetAtrb(AttributeCodes.WF_STG_CD, futureStage);
			}

			// If object is expired, unexpire it
			string isExpired = r.Dc.GetDataElementValue(AttributeCodes.EXPIRE_FLG);
            if (!string.IsNullOrEmpty(isExpired) && isExpired == "1") // If there is an expired flag, reset it if it is set
            {
                r.Dc.SetAtrb(AttributeCodes.EXPIRE_FLG, "0");
            }
        }

        public static void ValidateEcapPrice(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deEcapPrice = r.Dc.GetDataElement(AttributeCodes.ECAP_PRICE);
            if (deEcapPrice == null) return;

            double price;
            if (!double.TryParse(deEcapPrice.AtrbValue.ToString(), out price))
            {
                deEcapPrice.AddMessage("ECAP Price is not a valid number.");
                return;
            }

            IOpDataElement ecapType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            if (ecapType == null) return;
            if (ecapType.ToString() == string.Empty)
            {
                ecapType.AddMessage("Rebate Type must be filled out.");
                return;
            }

            if (ecapType.AtrbValue.ToString() == "SEED" && price < 0)
            {
                deEcapPrice.AddMessage("ECAP Price for SEED must not be negative.");
            }
            else if (ecapType.AtrbValue.ToString() != "SEED" && price <= 0)
            {
                deEcapPrice.AddMessage("ECAP Price must be a positive number.");
            }
        }

        public static void BackdateRequired(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deStarDate = r.Dc.GetDataElement(AttributeCodes.START_DT);
            if (deStarDate == null || !deStarDate.IsDateInPast()) return;

            IOpDataElement deBackDate = r.Dc.GetDataElement(AttributeCodes.BACK_DATE_RSN);
            if (deBackDate == null) return;

            string backDateTxt = r.Dc.GetDataElementValue(AttributeCodes.BACK_DATE_RSN_TXT);

            if (backDateTxt != "" || !string.IsNullOrEmpty(deBackDate.AtrbValue.ToString()))
            {
                deBackDate.IsRequired = true;
            }
        }

        public static void UserDefinedRpuRequired(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string userMaxRpu = r.Dc.GetDataElementValue(AttributeCodes.USER_MAX_RPU);
            string userAvgRpu = r.Dc.GetDataElementValue(AttributeCodes.USER_AVG_RPU);

            if (string.IsNullOrEmpty(userMaxRpu) && string.IsNullOrEmpty(userAvgRpu)) return;

            IOpDataElement deRpuComment = r.Dc.GetDataElement(AttributeCodes.RPU_OVERRIDE_CMNT);
            if (deRpuComment == null) return;

            deRpuComment.IsRequired = true;
        }

        #region Voltier Validations

        private static bool IsGreaterThanZero(double attrb)
        {
            return (attrb > 0);
        }

        private static bool IsGreaterOrEqualToZero(double attrb)
        {
            return (attrb >= 0);
        }

        public static void CompareStartEndVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IEnumerable<IOpDataElement> endVolAtrbs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.END_VOL); // NOTE: "10" is the Tier's dim key. In thoery this shouldn't need to change
            IOpDataElement atrbWithValidation = endVolAtrbs.FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            // Make dictionary of <tier, start vol>
            var startVols = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.STRT_VOL).Select(x => new
            {
                Key = x.DimKey.FirstOrDefault().AtrbItemId,
                Value = x.AtrbValue.ToString()
            });
            Dictionary<int, string> startVolDict = startVols.ToDictionary(pair => pair.Key, pair => pair.Value);

            // Validate and set validation message if applicable on each tier
            foreach (IOpDataElement atrb in endVolAtrbs)
            {
                if (string.IsNullOrWhiteSpace(atrb.AtrbValue.ToString()) || atrb.DimKey.Count() == 0)
                {
                    continue;
                }
                double startVol = 0;
                double endVol = 0;
                int tier = atrb.DimKey.FirstOrDefault().AtrbItemId;
                string relatedStartVol = "";

                // Find the related start vol (in the same tier)
                if (startVolDict.ContainsKey(tier))
                {
                    relatedStartVol = startVolDict[tier];
                }

                // Parse the double values
                bool isEndDateANumber = Double.TryParse(atrb.AtrbValue.ToString(), out endVol);
                bool isStrtDateANumber = Double.TryParse(relatedStartVol, out startVol);

                // End Vol is unlimited
                if (!isEndDateANumber && atrb.AtrbValue.ToString().Equals("UNLIMITED", StringComparison.InvariantCultureIgnoreCase))
                {
                    continue;
                }

                // Compare
                if (startVol >= endVol)
                {
                    AddTierValidationMessage(atrbWithValidation, "End volume must be greater than start volume.", tier);
                }
            }
        }

        public static void ValidateTierRate(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateTieredAttribute(AttributeCodes.RATE.ToString(), "Rate must have a positive value.", IsGreaterOrEqualToZero, r);
        }

        public static void ValidateTierStartVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateTieredAttribute(AttributeCodes.STRT_VOL.ToString(), "Start Volume must be greater than 0.", IsGreaterThanZero, r);
        }

        public static void ValidateTierEndVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateTieredAttribute(AttributeCodes.END_VOL.ToString(), "End Volume must be greater than 0.", IsGreaterThanZero, r, true);
        }

        public static void ValidateTieredAttribute(string myAtrbCd, string validationMessage, Func<double, bool> validationCondition, MyOpRuleCore r, bool isEndVol = false)
        {
            IEnumerable<IOpDataElement> atrbs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == myAtrbCd); // NOTE: "10" is the Tier's dim key. In thoery this shouldn't need to change
            IOpDataElement atrbWithValidation = atrbs.FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.NUM_OF_TIERS);
            if (deNumTiers == null) return;

            int numOfTiers = int.Parse(deNumTiers.AtrbValue.ToString());

            // Validate and set validation message if applicable on each tier
            foreach (IOpDataElement atrb in atrbs)
            {
                int tier = atrb.DimKey.FirstOrDefault().AtrbItemId;

                if (tier <= numOfTiers)
                {
                    if (string.IsNullOrWhiteSpace(atrb.AtrbValue.ToString()))
                    {
                        AddTierValidationMessage(atrbWithValidation, validationMessage, tier);
                        continue;
                    }

                    // unlimited end vol
                    if (isEndVol && (tier == numOfTiers) && atrb.AtrbValue.ToString().Equals("UNLIMITED", StringComparison.InvariantCultureIgnoreCase))
                    {
                        continue;
                    }

                    double safeParse = 0;
                    bool isNumber = Double.TryParse(atrb.AtrbValue.ToString(), out safeParse);

                    if (!isNumber)
                    {
                        AddTierValidationMessage(atrbWithValidation, "Must be a number.", tier);
                    }
                    else if (!validationCondition(safeParse))
                    {
                        AddTierValidationMessage(atrbWithValidation, validationMessage, tier);
                    }
                }
            }
        }

        private static void AddTierValidationMessage(IOpDataElement de, string msg, int tier = 1, params object[] args)
        {
            Dictionary<int, string> tieredValidationMsgs = new Dictionary<int, string>();

            // Previous tier validations exist, so we need to append them together
            if (!string.IsNullOrWhiteSpace(de.ValidationMessage))
            {
                tieredValidationMsgs = OpSerializeHelper.FromJsonString<Dictionary<int, string>>(de.ValidationMessage);
            }

            // Turn the new validation into an object
            tieredValidationMsgs[tier] = msg;

            // Format into JSON
            string jsonMsg = OpSerializeHelper.ToJsonString(tieredValidationMsgs);

            de.ValidationMessage = jsonMsg;
            //BusinessLogicDeActions.AddJsonValidationMessage(de, jsonMsg);
        }

        #endregion Voltier Validations

        public static void CheckTotalDollarAmount(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement myRebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            IOpDataElement totalDollarObj = r.Dc.GetDataElement(AttributeCodes.TOTAL_DOLLAR_AMOUNT);
            double totalDollarAmount = 0;

            if (totalDollarObj == null || myRebateType == null) return;

            Double.TryParse(totalDollarObj.AtrbValue.ToString(), out totalDollarAmount);

            if (myRebateType.AtrbValue.ToString().Equals("DEBIT MEMO", StringComparison.OrdinalIgnoreCase))
            {
                if (totalDollarAmount >= 0)
                {
                    totalDollarObj.AddMessage("Total dollar amount must be negative for debit memos.");
                }
            }
            else
            {
                if (totalDollarAmount <= 0)
                {
                    totalDollarObj.AddMessage("Total dollar amount must be positive for non-debit memos.");
                }
            }
        }
    }
}