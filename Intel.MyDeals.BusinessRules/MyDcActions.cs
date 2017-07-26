using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Helpers;
using Intel.Opaque.Data;
using Intel.Opaque.Rules;
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
                    if (mrktSegValue.IndexOf("Consumer Retail Pull") >=0 || mrktSegValue == "All")
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
            
            if (SecurityActionCache == null) SecurityActionCache=new Dictionary<string, bool>();
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
            string prdJson = LZString.decompressFromBase64(r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
            string prdJsonIvalid = LZString.decompressFromBase64(r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_INVLD_PRD)) ?? "";
            if (string.IsNullOrEmpty(prdJson)) return;

            ProdMappings items = null;
            try
            {
                items = JsonConvert.DeserializeObject<ProdMappings>(prdJson);
            }
            catch (Exception ex)
            {
                BusinessLogicDeActions.AddValidationMessage(dePrdUsr, "Unable to read the selected products.  Please use the Product Selector to fix the issue.");
                return;
            }

            if (!items.Any())
            {
                BusinessLogicDeActions.AddValidationMessage(dePrdUsr, "Product select did not result in any products.");
                return;
            }

            if (!string.IsNullOrEmpty(prdJsonIvalid))
            {
                BusinessLogicDeActions.AddValidationMessage(dePrdUsr, "Product select has some invalid products.");
                return;
            }

            foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
            {
                foreach (ProdMapping prodMapping in kvp.Value)
                {
                    if (string.IsNullOrEmpty(prodMapping.PRD_MBR_SID))
                    {
                        BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"User entered product ({kvp.Key}) is unable to locate product ({prodMapping.HIER_VAL_NM})");
                    }

                    if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.ECAP.ToString())
                    {
                        #region CAP Validations

                        double cap;
                        if (!double.TryParse(prodMapping.CAP, out cap) && prodMapping.CAP.IndexOf("-") >= 0)
                        {
                            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"CAP price ({prodMapping.CAP}) cannot be a range.");
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
                BusinessLogicDeActions.AddValidationMessage(deUserCustDivs, "Please enter a valid value.");
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
                if (deServerDealType != null) deServerDealType.IsHidden = true;
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
                    BusinessLogicDeActions.AddValidationMessage(de, "Please enter a valid value.");
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
                BusinessLogicDeActions.AddValidationMessage(deBllgStart, "The Billing Start Date must be on or earlier than the Deal Start Date.");
            }
            if (string.IsNullOrEmpty(deBllgEnd.AtrbValue.ToString()) || DateTime.Parse(deBllgEnd.AtrbValue.ToString()).Date > dcEn)
            {
                BusinessLogicDeActions.AddValidationMessage(deBllgEnd, "The Billing End Date must be on or earlier than the Deal End Date.");
            }
        }

        public static void CheckFrontendConsumption(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string payout = r.Dc.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON);
            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement deProgPayment = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.DC_ID);

            if (payout != "Billings" && progPayment != "Backend")
            {
                BusinessLogicDeActions.AddValidationMessage(de, "Frontend Deals cannot be Consumption.");
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
                BusinessLogicDeActions.AddValidationMessage(de, "Volume cannot be set for Frontend Deals.");
                return;
            }

            int vol;
            if (!int.TryParse(de.AtrbValue.ToString(), out vol))
            {
                BusinessLogicDeActions.AddValidationMessage(de, "Volume must be a valid non-decimal number.");
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
            if (progPayment.Contains("rontend") && startDate < today)
            {
                BusinessLogicDeActions.AddValidationMessage(deStart, "The deal start date must be greater or equal to the current date if program payment is Frontend.");
            }
        }

        public static void CompressJson(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> atrbs = new List<string> {AttributeCodes.PTR_SYS_PRD, AttributeCodes.PTR_SYS_INVLD_PRD};
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

        public static void ValidateEcapPrice(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deEcapPrice = r.Dc.GetDataElement(AttributeCodes.ECAP_PRICE);
            double price;
            if (!double.TryParse(deEcapPrice.AtrbValue.ToString(), out price))
            {
                BusinessLogicDeActions.AddValidationMessage(deEcapPrice, "ECAP Price is not a valid number.");
                return;
            }

            IOpDataElement ecapType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            if (ecapType == null) return;
            if (ecapType.ToString() == string.Empty)
            {
                BusinessLogicDeActions.AddValidationMessage(ecapType, "Rebate Type must be filled out.");
                return;
            }

            if (ecapType.AtrbValue.ToString() == "SEED" && price < 0)
            {
                BusinessLogicDeActions.AddValidationMessage(deEcapPrice, "ECAP Price for SEED must not be negative.");
            }
            else if (ecapType.AtrbValue.ToString() != "SEED" && price <= 0)
            {
                BusinessLogicDeActions.AddValidationMessage(deEcapPrice, "ECAP Price must be a positive number.");
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
    }
}