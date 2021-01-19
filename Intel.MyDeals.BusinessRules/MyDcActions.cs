using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Helpers;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.Tools;
using Newtonsoft.Json;
using AttributeCollection = Intel.MyDeals.Entities.AttributeCollection;
using Newtonsoft.Json.Linq;

namespace Intel.MyDeals.BusinessRules
{
    //test changes for new story

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

            if (!item.ContainsKey(AttributeCodes.PAYOUT_BASED_ON)) return;

            //TODO: work around till JMSQ DB calls updates the PRC_TBL_ROW attributes, it updates WIP_DEAL and DEAL attrubutes alone when deal(price) is sent to SAP
            var trackers = r.Dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => d.AtrbValue.ToString() != string.Empty);
            var programPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            var dealType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            if (trackers != null && trackers.Any() && dealType == "ECAP" && programPayment.Contains("YCS2"))
            {
                item[AttributeCodes.START_DT] = r.Dc.GetDataElementValue(AttributeCodes.START_DT);
                item[AttributeCodes.END_DT] = r.Dc.GetDataElementValue(AttributeCodes.END_DT);
                item[AttributeCodes.NOTES] = r.Dc.GetDataElementValue(AttributeCodes.NOTES);
            }

            // Deal Dates
            string dcStStr = r.Dc.GetDataElementValue(AttributeCodes.START_DT);
            string dcEnStr = r.Dc.GetDataElementValue(AttributeCodes.END_DT);
            string dcSt = DateTime.Parse(dcStStr == "" ? item[AttributeCodes.START_DT].ToString() : dcStStr).ToString("MM/dd/yyyy");
            string dcEn = DateTime.Parse(dcEnStr == "" ? item[AttributeCodes.END_DT].ToString() : dcEnStr).ToString("MM/dd/yyyy");
            string dcItemSt = DateTime.Parse(item[AttributeCodes.START_DT].ToString()).ToString("MM/dd/yyyy");
            string dcItemEn = DateTime.Parse(item[AttributeCodes.END_DT].ToString()).ToString("MM/dd/yyyy");
            string payoutBasedOn = item[AttributeCodes.PAYOUT_BASED_ON]?.ToString() ?? "";
            string mrktSegValue = item[AttributeCodes.MRKT_SEG]?.ToString() ?? "";
            var billStartDate = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_START);
            //var billEndDate = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_END);

            DateTime dcItemStDt = DateTime.Parse(item[AttributeCodes.START_DT].ToString());
            string dcRebateType = item[AttributeCodes.REBATE_TYPE]?.ToString().ToUpper() ?? "";

            if (payoutBasedOn.Equals("Consumption", StringComparison.InvariantCultureIgnoreCase) && !dcRebateType.Equals("TENDER", StringComparison.InvariantCultureIgnoreCase))
            {
                // if payout is based on Consumption push the billing start date to Deal Start Date and
                // End date =  Billing End date
                if (string.IsNullOrEmpty(billStartDate?.AtrbValue.ToString()))
                {                    
                    item[AttributeCodes.REBATE_BILLING_START] = DateTime.Parse(dcSt).ToString("MM/dd/yyyy");
                    item[AttributeCodes.REBATE_BILLING_END] = DateTime.Parse(dcEn).ToString("MM/dd/yyyy");
                }
            }
            else
            {
                // Billing dates will be default to deal start and end date where payout is based Billings
                if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_START)) || dcSt != dcItemSt)
                {
                    item[AttributeCodes.REBATE_BILLING_START] = dcItemSt;
                }
                if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.REBATE_BILLING_END)) || dcEn != dcItemEn)
                {
                    item[AttributeCodes.REBATE_BILLING_END] = dcItemEn;
                }
            }

            // On Ad Date
            var onAdDate = r.Dc.GetDataElementValue(AttributeCodes.ON_ADD_DT);
            if (string.IsNullOrEmpty(onAdDate) || (item.ContainsKey(AttributeCodes.ON_ADD_DT) && item[AttributeCodes.ON_ADD_DT].ToString() == "Invalid date"))
            {
                //US 53204 - 8 - On add date-If Market segment is Consumer retail or ALL, then default to current quarter first date, other wise Blank. user can edit.
                // UPDATE!!! Per Trang... we can default this to the start date (10/20/2017) - Removed IF check to always default it as per Trang. (DE36799)

                //if (mrktSegValue.IndexOf("Consumer Retail Pull") >= 0 || mrktSegValue == "All Direct Market Segments")
                //{
                item[AttributeCodes.ON_ADD_DT] = item[AttributeCodes.START_DT];
                //}
            }

            // Consumption Reason no longer defaults to None as per US681744 - Vistex: Edits to Consumption Reason Dropdown
            // Consumption Reason
            //if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.CONSUMPTION_REASON)) && payoutBasedOn == "Consumption")
            //{
            //    item[AttributeCodes.CONSUMPTION_REASON] = "None";
            //}

            // Expire YCS2
            if ((r.Dc.DcType == "ECAP" || r.Dc.DcType == "KIT") && string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.EXPIRE_YCS2)))
            {
                item[AttributeCodes.EXPIRE_YCS2] = "No";
            }

            //CS Ship ahead start date / end date
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.CS_SHIP_AHEAD_STRT_DT)))
            {
                item[AttributeCodes.CS_SHIP_AHEAD_STRT_DT] = 0;
            }
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.CS_SHIP_AHEAD_END_DT)))
            {
                item[AttributeCodes.CS_SHIP_AHEAD_END_DT] = 0;
            }

            //NB / SB Split     //NOTE: this section of code will not work if uncommented, need to account for non-kit deals and for saving in WIP grid when TEMP_NB_SUM will not have been set...
            //TODO: check if already set condition, test with non kit deal types and moving back and forth between wip/spreadsh
            //if (r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Contains("CS"))
            //{
            //    item[AttributeCodes.NORTHBRIDGE_SPLIT] = item["TEMP_NB_SUM"];
            //    item[AttributeCodes.SOUTHBRIDGE_SPLIT] = 0;
            //} else
            //{
            //    item[AttributeCodes.NORTHBRIDGE_SPLIT] = null;
            //    item[AttributeCodes.SOUTHBRIDGE_SPLIT] = null;
            //}

            // Additive
            string dealCompType = r.Dc.GetDataElementValue(AttributeCodes.DEAL_COMB_TYPE);
            if (string.IsNullOrEmpty(dealCompType))
            {
                // If tender, make it exclusive, otherwise non additive
                item[AttributeCodes.DEAL_COMB_TYPE] = dcRebateType == "TENDER" ? "Mutually Exclusive" : "Non Additive";
            }
            else if (dcRebateType == "TENDER" && r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE).ToString() != dcRebateType)
            {
                item[AttributeCodes.DEAL_COMB_TYPE] = "Mutually Exclusive";
            }

            // Check for backdate Reason
            IOpDataElement deStr = r.Dc.GetDataElement(AttributeCodes.START_DT); // R is From DB data - Items is from UI
            if (!string.IsNullOrEmpty(dcSt))
            {
                string dcPrevSt = deStr.PrevAtrbValue == null || string.IsNullOrEmpty(deStr.PrevAtrbValue.ToString()) ? "" : DateTime.Parse(deStr.AtrbValue.ToString()).ToString("MM/dd/yyyy");
                if (string.IsNullOrEmpty(deStr.AtrbValue.ToString())) deStr.AtrbValue = dcSt;
                IOpDataElement deContractRsn = r.Dc.GetDataElement(AttributeCodes.BACK_DATE_RSN);
                // && dcPrevSt != dcItemSt  -- removed because it was causing validation issues.
                if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.BACK_DATE_RSN)) && dcItemStDt < DateTime.Now.Date && dcPrevSt != dcItemSt) // Added above back in for DE33016.  If they complain, they need to get togeather and fully resolve what they want!
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
            if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON)) && item.ContainsKey(AttributeCodes.PROGRAM_PAYMENT) && item[AttributeCodes.PROGRAM_PAYMENT].ToString() != "Backend")
            {
                item[AttributeCodes.PAYOUT_BASED_ON] = "Billings";
            }

            if (item.ContainsKey(AttributeCodes.HAS_SUBKIT))
            {
                if (item[AttributeCodes.HAS_SUBKIT].ToString() == "0")
                {
                    // Clear out subkit attributes if user changes products to make it ineligible for sub-kits
                    item[AttributeCodes.ECAP_PRICE + "_____20_____2"] = null;
                }
                else
                {
                    // If has subkit, then default Subkit ECAP to sum of first two items (the two L1s or L1+L2)
                    if (item.ContainsKey(AttributeCodes.ECAP_PRICE + "_____20_____2") && string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.ECAP_PRICE + "_____20_____2")))
                    {
                        item[AttributeCodes.ECAP_PRICE + "_____20_____2"] = Convert.ToDecimal(item[AttributeCodes.ECAP_PRICE + "_____20___0"]) + Convert.ToDecimal(item[AttributeCodes.ECAP_PRICE + "_____20___1"]);
                    }
                }
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
            string hasTrkr = (r.Dc.GetDataElementValue(AttributeCodes.HAS_TRACKER)) ?? "";
            string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
            string prdJsonIvalid = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_INVLD_PRD)) ?? "";
            if (!string.IsNullOrEmpty(prdJsonIvalid))
            {
                dePrdUsr.AddMessage("Product select has some invalid products.");
                return;
            }

            if (string.IsNullOrEmpty(prdJson)) return;

            ProdMappings items = null;
            try
            {
                prdJson = FixesHelpers.FixStructure(prdJson);
                items = JsonConvert.DeserializeObject<ProdMappings>(prdJson);
            }
            catch (Exception)
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
            //if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.ECAP.ToString())
            //{
            //    foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
            //    {
            //        foreach (ProdMapping prodMapping in kvp.Value)
            //        {
            //            if (string.IsNullOrEmpty(prodMapping.PRD_MBR_SID))
            //            {
            //                dePrdUsr.AddMessage($"User entered product ({kvp.Key}) is unable to locate product ({prodMapping.HIER_VAL_NM})");
            //            }

            //            if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.ECAP.ToString())
            //            {
            //                #region CAP Validations

            //                double cap;
            //                if (!double.TryParse(prodMapping.CAP, out cap) && prodMapping.CAP.IndexOf("-") >= 0)
            //                {
            //                    dePrdUsr.AddMessage($"Product ({prodMapping.HIER_VAL_NM}) CAP price ({prodMapping.CAP}) cannot be a range.");
            //                }

            //                //double ecap;
            //                //if (!double.TryParse(r.Dc.GetDataElementValue(AttributeCodes.ECAP_PRICE), out ecap)) ecap = 0;

            //                // When ECAP Price is greater than CAP, UI validation check on deal creation and system should give a soft warning.
            //                // TODO... put this as a soft warning on the grid
            //                //if (ecap > 0 && cap > ecap)
            //                //{
            //                //    BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"CAP price ({cap}) is greater than ECAP Price.");
            //                //}

            //                // IF CAP is not available at all then show as NO CAP.User can not create deals.
            //                // not true anymore... soft warning in grid now
            //                //if (cap <= 0)
            //                //{
            //                //    BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"CAP is not available ({prodMapping.CAP}). You can not create deals with this product.");
            //                //}

            //                //if (!string.IsNullOrEmpty(prodMapping.PRD_STRT_DTM) && !string.IsNullOrEmpty(prodMapping.CAP_START))
            //                //{
            //                //    DateTime capStart = DateTime.Parse(prodMapping.CAP_START);
            //                //    DateTime capEnd = DateTime.Parse(prodMapping.CAP_END);
            //                //    DateTime prdStart = DateTime.Parse(prodMapping.PRD_STRT_DTM);

            //                //    DateTime dealStart;
            //                //    DateTime dealEnd;
            //                //    if (DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.START_DT), out dealStart) && DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.END_DT), out dealEnd))
            //                //    {
            //                //        if (!(capStart < dealEnd && dealStart < capEnd))
            //                //        {
            //                //            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, "Product entered does not have CAP within the Deal's start date and end date");
            //                //        }

            //                //        if (capStart > dealEnd)
            //                //        {
            //                //            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"The CAP start date ({capStart:mm/dd/yyyy}) and end date ({capEnd:mm/dd/yyyy}) exists in future outside of deal end date. Please change the deal start date to match the CAP start date.");
            //                //        }
            //                //    }

            //                //    // If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.
            //                //    if (prdStart > dealStart)
            //                //    {
            //                //        BusinessLogicDeActions.AddValidationMessage(dePrdUsr, $"If the product start date is after the deal start date, then deal start date should match with product start date and back date would not apply.");
            //                //    }
            //                //}

            //                #endregion CAP Validations
            //            }
            //        }
            //    }
            //}
            if (r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.VOL_TIER.ToString() || r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD) == OpDataElementSetType.PROGRAM.ToString())
            {
                CheckForCrossVerticalProducts(dePrdUsr, hasTrkr, items);
            }
        }

        /// <summary>
        ///  Cross vertical validation allowed combinations
        ///  1. "DT", "Mb", "SvrWS", "EIA CPU"
        ///  2. "CS", "EIA CS"
        /// </summary>
        /// <param name="dePrdUsr"></param>
        /// <param name="items"></param>
        private static void CheckForCrossVerticalProducts(IOpDataElement dePrdUsr, string hasTrkr, ProdMappings items)
        {
            // TODO Move these to constants
            var productCombination1 = new string[] { "DT", "Mb", "SvrWS", "EIA CPU" }.ToDictionary(x => x);
            var productCombination2 = new string[] { "CS", "EIA CS" }.ToDictionary(x => x);

            var validContractProducts = new List<string>();
            foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
            {
                // Get unique product Vertical for Contract products
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
                    // (DE88221) - Append special message to trigger save calls to drop active invalid row saves
                    string activeDealProdError = "  Changes to this active deal/row have been restored to their previous saved values."; //Products reset to orignal values.  Please re-validate this line to clear errors.
                    if (productCombination1.ContainsKey(validContractProducts[i]))
                    {
                        if (!productCombination1.ContainsKey(newprodCategory))
                        {
                            string ErrMsg = hasTrkr == "1" ? $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid." + activeDealProdError :
                                $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.";
                           
                            Dictionary<string, List<string>> ItemsDic = new Dictionary<string, List<string>>();
                            for (var j = 0; j < validContractProducts.Count; j++)
                            {
                                List<string> subList = new List<string>();
                               foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                                {                                 
                                    foreach (ProdMapping prodMapping in kvp.Value.Where(x => !x.EXCLUDE))
                                    {
                                        if (validContractProducts[j] == prodMapping.PRD_CAT_NM)
                                        {
                                            subList.Add(kvp.Key.ToString());                                    
                                        }
                                    }                                    
                                }
                                ItemsDic.Add((validContractProducts[j]).ToString(), subList);
                            }
                          foreach (var kvp in ItemsDic.OrderBy(x => x.Value.Count))
                            {
                                if (kvp.Value.Count >= 5)
                                {
                                    int cnt = 0;
                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  ";
                                    foreach (string val in kvp.Value)
                                    {
                                        if (cnt < 5)
                                            ErrMsg = ErrMsg + val + ", ";
                                        else
                                            ErrMsg = ErrMsg + "...";
                                        cnt++;
                                    }
                                }
                                else
                                {
                                    var str = String.Join(", ", kvp.Value);

                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  " + str;
                                }
                            }
                            ErrMsg=ErrMsg+ "\n Below are the valid combinations to add the products into the deal:";
                            ErrMsg = ErrMsg + "\n Combination 1: DT, Mb, SrvrWS, EIA CPU";
                            ErrMsg = ErrMsg + "\n Combination 2: CS, EIA CS";
                            ErrMsg = ErrMsg + "\n Combination 3: Non CPU/ CS product vertical cannot be combined with any other product type.";
                            dePrdUsr.AddMessage(ErrMsg);
                            break;
                        }
                    }
                    else if (productCombination2.ContainsKey(validContractProducts[i]))
                    {
                        if (!productCombination2.ContainsKey(newprodCategory))
                        {
                            string ErrMsg = hasTrkr == "1" ? $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid." + activeDealProdError :
                                $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.";
                            Dictionary<string, List<string>> ItemsDic = new Dictionary<string, List<string>>();
                            for (var j = 0; j < validContractProducts.Count; j++)
                            {
                                List<string> subList = new List<string>();
                                foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                                {
                                    foreach (ProdMapping prodMapping in kvp.Value.Where(x => !x.EXCLUDE))
                                    {
                                        if (validContractProducts[j] == prodMapping.PRD_CAT_NM)
                                        {
                                            subList.Add(kvp.Key.ToString());
                                        }
                                    }
                                }
                                ItemsDic.Add((validContractProducts[j]).ToString(), subList);
                            }
                            foreach (var kvp in ItemsDic.OrderBy(x => x.Value.Count))
                            {
                                if (kvp.Value.Count >= 5)
                                {
                                    int cnt = 0;
                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  ";
                                    foreach (string val in kvp.Value)
                                    {
                                        if (cnt < 5)
                                            ErrMsg = ErrMsg + val + ", ";
                                        else
                                            ErrMsg = ErrMsg + "...";
                                        cnt++;
                                    }
                                }
                                else
                                {
                                    var str = String.Join(", ", kvp.Value);

                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  " + str;
                                }
                            }
                            ErrMsg = ErrMsg + "\n Below are the valid combinations to add the products into the deal:";
                            ErrMsg = ErrMsg + "\n Combination 1: DT, Mb, SrvrWS, EIA CPU";
                            ErrMsg = ErrMsg + "\n Combination 2: CS, EIA CS";
                            ErrMsg = ErrMsg + "\n Combination 3: Non CPU/ CS product vertical cannot be combined with any other product type.";
                            dePrdUsr.AddMessage(ErrMsg);
                            break;
                        }
                    }
                    else
                    {
                        if (validContractProducts[i] != newprodCategory)
                        {
                            string ErrMsg = hasTrkr == "1" ? $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid." + activeDealProdError :
                                $"The product combination ({validContractProducts[i]},{newprodCategory}) is not valid.";
                            Dictionary<string, List<string>> ItemsDic = new Dictionary<string, List<string>>();
                            for (var j = 0; j < validContractProducts.Count; j++)
                            {
                                List<string> subList = new List<string>();
                                foreach (KeyValuePair<string, IEnumerable<ProdMapping>> kvp in items)
                                {
                                    foreach (ProdMapping prodMapping in kvp.Value.Where(x => !x.EXCLUDE))
                                    {
                                        if (validContractProducts[j] == prodMapping.PRD_CAT_NM)
                                        {
                                            subList.Add(kvp.Key.ToString());
                                        }
                                    }
                                }
                                ItemsDic.Add((validContractProducts[j]).ToString(), subList);
                            }
                            foreach (var kvp in ItemsDic.OrderBy(x => x.Value.Count))
                            {
                                if (kvp.Value.Count >= 5)
                                {
                                    int cnt = 0;
                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  ";
                                    foreach (string val in kvp.Value)
                                    {
                                        if (cnt < 5)
                                            ErrMsg = ErrMsg + val + ", ";
                                        else
                                            ErrMsg = ErrMsg + "...";
                                        cnt++;
                                    }
                                }
                                else
                                {
                                    var str = String.Join(", ", kvp.Value);

                                    ErrMsg = ErrMsg + Environment.NewLine + kvp.Key.ToString() + ":  " + str;
                                }
                            }
                            ErrMsg = ErrMsg + "\n Below are the valid combinations to add the products into the deal:";
                            ErrMsg = ErrMsg + "\n Combination 1: DT, Mb, SrvrWS, EIA CPU";
                            ErrMsg = ErrMsg + "\n Combination 2: CS, EIA CS";
                            ErrMsg = ErrMsg + "\n Combination 3: Non CPU/ CS product vertical cannot be combined with any other product type.";
                            BusinessLogicDeActions.AddValidationMessage(dePrdUsr, ErrMsg);
                            break;
                        }
                    }
                }
            }
        }

        public static void CheckGeos(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;

            var deGeo = r.Dc.GetDataElement(AttributeCodes.GEO_COMBINED);
            deGeo?.CheckGeos(r.ExtraArgs);
        }

        public static void NewObjTimeLineComment(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            if (r.Dc.DcID >= 0) return;

            OpDataElementType deType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            var deTypeDesc = deType.ToDesc();

            // For contract and Tender type rebate change detype desc to folio
            if (deType == OpDataElementType.CNTRCT && r.Dc.GetDataElementValue(AttributeCodes.IS_TENDER) == "1")
            {
                deTypeDesc = "Folio";
            }

            string title = string.Empty;
            switch (deType)
            {
                case OpDataElementType.CNTRCT:
                case OpDataElementType.PRC_ST:
                case OpDataElementType.PRC_TBL:
                    title = r.Dc.GetDataElementValue(AttributeCodes.TITLE);
                    break;

                case OpDataElementType.PRC_TBL_ROW:
                    title = r.Dc.GetDataElementValue(AttributeCodes.PTR_USER_PRD).Replace(",", ", ");
                    break;

                case OpDataElementType.WIP_DEAL:
                    title = r.Dc.GetDataElementValue(AttributeCodes.TITLE);
                    break;
            }
            r.Dc.AddTimelineComment($"Created { deTypeDesc }: { title }"); //r.Dc.AddTimelineComment($"Created { deTypeDesc } ({ r.Dc.DcID }): { title }"); // But deal # shows up as -1000 ID upon creation
        }

        public static void SetCustDefaultValues(params object[] args)
        {

            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement dePayoutBasedOn = r.Dc.GetDataElement(AttributeCodes.PAYOUT_BASED_ON);
            if (!(dePayoutBasedOn.HasValueChanged && dePayoutBasedOn.HasValue("Consumption"))) return;

            int custId;
            bool deEcapTypeValue = int.TryParse(r.Dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID), out custId);
            MyCustomerDetailsWrapper custs = DataCollections.GetMyCustomers();
            MyCustomersInformation cust = custs.CustomerInfo.FirstOrDefault(c => c.CUST_SID == custId);

            IOpDataElement deConsLookback = r.Dc.GetDataElement(AttributeCodes.CONSUMPTION_LOOKBACK_PERIOD);
            IOpDataElement deConsRptGeo = r.Dc.GetDataElement(AttributeCodes.CONSUMPTION_CUST_RPT_GEO);
            IOpDataElement deConsReason = r.Dc.GetDataElement(AttributeCodes.CONSUMPTION_REASON);
            var isTender = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE) == "TENDER";

            if (deConsLookback.AtrbValue == "")
            {
                //Updated the condition as per the user story US695161
                deConsLookback.AtrbValue = cust.DFLT_LOOKBACK_PERD < 0 ? (isTender ? "0" : "") : cust.DFLT_LOOKBACK_PERD.ToString();
            }

            if (deConsRptGeo.AtrbValue == "")
            {
                deConsRptGeo.AtrbValue = cust.DFLT_CUST_RPT_GEO;
            }

            if (isTender && deConsReason.AtrbValue == "")
            {
                deConsReason.AtrbValue = "End Customer";
            }
        }

        public static void CheckCustDivValues(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.HasExtraArgs) return;

            int custId = (int)r.ExtraArgs[0];
            char delim = '/';

            IOpDataElement deUserCustDivs = r.Dc.GetDataElement(AttributeCodes.CUST_ACCNT_DIV);

            if (deUserCustDivs == null || deUserCustDivs.AtrbValue.ToString() == "" || custId == 0) return; // we also return on custId = 0 (All Customers) because that's what we ustilize for the tender dashboard

            //int custId = Convert.ToInt32(strCustId);
            var custs = DataCollections.GetCustomerDivisions().Where(c => c.CUST_NM_SID == custId);
            if (!r.Dc.HasTracker())
            {
                custs = custs.Where(c => c.ACTV_IND);
            }
            List<string> matchedDivs = new List<string>();
            bool foundMisMatch = false;

            List<string> custList = deUserCustDivs.AtrbValue.ToString().Split(delim).ToList();
            foreach (string divNm in custList)
            {
                // TO DO: Mike - Bring this back in later
                //if (divNm != "All")
                //{
                string matchedValue = custs.ToList()
                        .Where(d => d.CUST_DIV_NM.ToUpper() == divNm.ToString().ToUpper()).Select(d => d.CUST_DIV_NM)
                        .FirstOrDefault();
                if (string.IsNullOrEmpty(matchedValue))
                {
                    foundMisMatch = true;
                    matchedDivs.Add(divNm);
                }
                else
                {
                    matchedDivs.Add(matchedValue);
                }
                //}
                //else
                //{
                //    matchedDivs.Add("All");
                //}
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

        public static void MeetCompMandatoryCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deEcapTypeValue = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string[] deProductCategoriesValue = r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Split(',');
            string role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;

            int IsL1Product = Int32.Parse(r.Dc.GetDataElementValueNull(AttributeCodes.HAS_L1, "0"));

            List<string> mandatoryMeetCompFields = new List<string>
            {
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
                && IsL1Product > 0
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
            //if (!r.IsValid || !r.HasExtraArgs) return;

            //int custId = (int)r.ExtraArgs[0];
            //string mrktSegValue = r.Dc.GetDataElement(AttributeCodes.MRKT_SEG).AtrbValue.ToString();
            //IOpDataElement deOnAdDate = r.Dc.GetDataElement(AttributeCodes.ON_ADD_DT);

            //if ((mrktSegValue == "Consumer Retail Pull" || mrktSegValue == "All Direct Market Segments") && deOnAdDate.AtrbValue.ToString() == "")
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

        /// <summary>
        /// Frontend XOA3 deals can only have Exempt product.
        /// </summary>
        /// <param name="args"></param>
        public static void ValidateFrontendXOA3Products(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            if (!progPayment.Contains("XOA3"))
            {
                return;
            }

            IOpDataElement dePrdUsr = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
            if (string.IsNullOrEmpty(prdJson)) return;
            ProdMappings items = null;
            try
            {
                prdJson = FixesHelpers.FixStructure(prdJson);
                items = JsonConvert.DeserializeObject<ProdMappings>(prdJson);

                foreach (KeyValuePair<string, IEnumerable<ProdMapping>> prdMapping in items)
                {
                    foreach (ProdMapping prod in prdMapping.Value)
                    {
                        if (prod.HAS_L1 == 1 || prod.HAS_L2 == 1)
                        {
                            dePrdUsr.AddMessage("Frontend XOA3 deal can only have Exempt products. L1 and L2 products are not allowed");
                            return;
                        }
                    }
                }
            }
            catch (Exception)
            {
                dePrdUsr.AddMessage("Unable to read the selected products legal classification.  Please use the Product Selector to fix the issue.");
                return;
            }
        }

        public static void RequiredServerDealType(params object[] args)
        {
            // US53204 - TENDER: Tender deal item 2. Server deal type-drop down single select.Mandatory only for server products. Leave blank by default.
            // DE34995 - 'Server Deal Type' should be mandatory for deals with Server products (not just tender)
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string[] deProductCategoriesValue = r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Split(',');
            string deRebateTypeValue = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string deDealTypeValue = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            if (deDealTypeValue == "ECAP" && deRebateTypeValue == "TENDER" && deProductCategoriesValue.Contains("SvrWS"))
            {
                IOpDataElement deServerDealType = r.Dc.GetDataElement(AttributeCodes.SERVER_DEAL_TYPE);
                if (deServerDealType != null) deServerDealType.IsRequired = true;
            }
        }

        /// <summary>
        /// End customer required for Tender
        /// </summary>
        /// <param name="args"></param>
        public static void RequiredEndCustomer(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deRebateTypeValue = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string deDealTypeValue = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            if (deRebateTypeValue == "TENDER")
            {
                IOpDataElement deEndCustomer = r.Dc.GetDataElement(AttributeCodes.END_CUSTOMER_RETAIL);
                if (deEndCustomer != null) deEndCustomer.IsRequired = true;
            }
        }

        public static void ValidateServerDealType(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deSDT = r.Dc.GetDataElement(AttributeCodes.SERVER_DEAL_TYPE);
            if (deSDT == null) return;

            string usersdt = deSDT.AtrbValue.ToString();
            if (usersdt == "") return;

            string dealtype = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            List<BasicDropdown> validSDTs = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD.ToUpper() == "SERVER_DEAL_TYPE" && (d.OBJ_SET_TYPE_CD.ToUpper() == dealtype || (d.OBJ_SET_TYPE_CD.ToUpper() == "ALL_DEALS" || d.OBJ_SET_TYPE_CD.ToUpper() == "ALL_TYPES")) && d.ACTV_IND).ToList();
            BasicDropdown match = validSDTs.FirstOrDefault(d => d.DROP_DOWN.ToUpper() == usersdt.ToUpper());

            if (match == null)
            {
                deSDT.AddMessage(usersdt + " is not a valid Server Deal Type.");
            }
        }

        public static void ReadOnlyFrontendWithTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            List<string> excludeAtrbs = new List<string> { AttributeCodes.EXPIRE_YCS2, AttributeCodes.NOTES };

            string deFrontendValue = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

            if (deFrontendValue == "Backend" || !r.Dc.HasTracker()) return;

            foreach (OpDataElement de in r.Dc.DataElements.Where(d => !excludeAtrbs.Contains(d.AtrbCd)))
            {
                de.SetReadOnly();
            }
        }

        public static void ReadOnlyIfValueIsPopulatedAndHasTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);
                if (de != null && de.AtrbValue.ToString() != "" && r.Dc.HasTracker()) de.IsReadOnly = true;
            }
        }

        public static void ReadOnlyIfValueIsPopulatedAndWon(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string dealStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);

            if (dealStage != WorkFlowStages.Won) return;

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);
                if (de != null && !string.IsNullOrEmpty(de.AtrbValue.ToString())) de.IsReadOnly = true;
            }
        }

        public static void ReadOnlyIfHasTrackerAndSettlementIsCash(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);
                if (de != null && de.AtrbValue.ToString() == "Cash" && r.Dc.HasTracker()) // This is AR_SETTLEMENT_LVL value
                {
                    de.IsReadOnly = true;
                }
            }
        }

        public static void ValidateArSettlementLevelForActiveDeal(params object[] args)
        {
            // This rule should only allow changes for AR_SETTLEMENT_LVL after has tracker for one issue type to another, but not to cash
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string[] strTestingValues = new string[] { "Issue Credit to Billing Sold To", "Issue Credit to Default Sold To by Region" };

            IOpDataElement deArSettlementLvl = r.Dc.GetDataElement(AttributeCodes.AR_SETTLEMENT_LVL);
            if (deArSettlementLvl != null && deArSettlementLvl.HasValueChanged && r.Dc.HasTracker())
            {
                // If the original value was Cash, then you can't change it anyhow due to read only rule, we only want cases where the original
                // value was a testing target string (something with Issue flavor) and has been changed
                if (strTestingValues.Contains(deArSettlementLvl.OrigAtrbValue.ToString()) && deArSettlementLvl.AtrbValue.ToString() == "Cash")
                {
                    deArSettlementLvl.AddMessage(string.Concat("AR Settlement Level can be updated between [", string.Join(", ", strTestingValues), "] for deals with trackers.  Values have been reset to original values.  Please Re-validate to clear this message."));
                    deArSettlementLvl.AtrbValue = deArSettlementLvl.OrigAtrbValue;
                    deArSettlementLvl.State = OpDataElementState.Modified; // Trigger the save anyways to complete round trip and post the validation message
                }
            }
        }

        public static void AddHistoryMessagesForChanges(params object[] args)
        {
            // This rule posts value change messages into comment history at any time a value is updated.  not re-deal only events.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement sysComment = r.Dc.GetDataElement(AttributeCodes.SYS_COMMENTS);
            if (sysComment == null) return;

            // Get the list of all attributes so that we can pull meaningful names below
            AttributeCollection atrbMstr = DataCollections.GetAttributeData();

            List<string> updates = new List<string>();

            foreach (IOpDataElement de in r.Dc.GetDataElementsWhere(d =>
                r.Rule.OpRuleActions[0].Target.Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).ToList())
            {
                MyDealsAttribute atrb = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
                if (atrb == null) continue;
                if (atrb.ATRB_LBL != "Title") updates.Add(atrb.ATRB_LBL + " value changed from [" + de.OrigAtrbValue + "] to [" + de.AtrbValue + "]");
                else
                {
                    var origProds = de.OrigAtrbValue.ToString().Split(',');
                    var currProds = de.AtrbValue.ToString().Split(',');
                    IEnumerable<string> addedProducts = currProds.Except(origProds);
                    IEnumerable<string> removedProducts = origProds.Except(currProds);
                    string msg = "Deal products have changed:";
                    if (addedProducts.Count() > 0) msg += " Added [" + string.Join(",", addedProducts) + "]";
                    if (removedProducts.Count() > 0) msg += " Removed [" + string.Join(", ", removedProducts) + "]";
                    updates.Add(msg); // instead of showing "Title changed from.."
                }
            }

            if (updates.Count > 0) // If there are items to add, add them
            {
                // "; " is a safe spacing for excel output, but it is also replaced by "<br>" on web popup for readability.
                sysComment.AtrbValue += sysComment.AtrbValue.ToString().Length > 0
                    ? "; " + String.Join("; ", updates.ToArray())
                    : String.Join("; ", updates.ToArray());
            }
        }

        public static void ReadOnlyStartDateIfIsInPastAndHasTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);
                if (de != null && de.AtrbValue != "" && de.IsDateInPast() && r.Dc.HasTracker()) de.IsReadOnly = true;
            }
        }

        public static void ReadOnlyEndDateIfIsTooOldAndHasTracker(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            //var charsetResult = _constantsLookupsLib.GetConstantsByName("PROD_REPLACE_CHARSET"); // NULL Check
            int numDaysInPastLimit = 90; // Set to 90 days, by constant if we can

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);

                DateTime chkDate = OpConvertSafe.ToDateTime(de.AtrbValue.ToString());
                // Have to get a safe version of datatime(now) minus our buffer to force check to be 12AM time based like Start/End Dates
                bool isPnr = DateTime.Compare(chkDate.Date, OpConvertSafe.ToDateTime(DateTime.Now.AddDays(-numDaysInPastLimit).ToString("MM-dd-yyyy"))) < 0; // Point of No Return

                if (de != null && de.AtrbValue != "" && isPnr && r.Dc.HasTracker()) de.IsReadOnly = true;
            }
        }

        public static void ReadOnlyIfNotInRedeal(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string dealHasTracker = r.Dc.GetDataElementValue(AttributeCodes.HAS_TRACKER);
            string dealStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);

            foreach (var s in r.Rule.OpRuleActions[0].Target)
            {
                if (dealHasTracker == "0" || dealStage != WorkFlowStages.Draft)
                {
                    OpDataElement de = r.Dc.DataElements.FirstOrDefault(d => d.AtrbCd == s);
                    if (de != null) de.IsReadOnly = true;
                }
            }
        }

        public static void ReadOnlyFrontendWithNoTracker(params object[] args) // Set to read only if there is not a tracker and deal is frontend (DE38457)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            List<string> readonlyAtrbs = new List<string> { AttributeCodes.EXPIRE_YCS2 };

            string deFrontendValue = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

            if (deFrontendValue == "Backend" || r.Dc.HasTracker()) return; // If it is backend deal or has a tracker, leave

            foreach (OpDataElement de in r.Dc.DataElements.Where(d => readonlyAtrbs.Contains(d.AtrbCd)))
            {
                de.SetReadOnly();
            }
        }

        /// <summary>
        /// Set read only 
        /// </summary>
        /// <param name="args"></param>
        public static void ReadOnlyNonHybridOverarchingFields(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string deIsHybridPrcStratValue = r.Dc.GetDataElementValue(AttributeCodes.IS_HYBRID_PRC_STRAT);

            if (deIsHybridPrcStratValue != "1")
            {
                List<string> readonlyAtrbs = new List<string> { AttributeCodes.REBATE_OA_MAX_AMT, AttributeCodes.REBATE_OA_MAX_VOL };

                IOpDataElement deOAMaxVol = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_VOL);
                IOpDataElement deOAMaxAmt = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_AMT);

                if (deOAMaxAmt == null || deOAMaxVol == null)
                {
                    foreach (OpDataElement de in r.Dc.DataElements.Where(d => readonlyAtrbs.Contains(d.AtrbCd)))
                    {
                        de.SetReadOnly();
                    }
                    return;
                }

                string overarchingMaxVol = deOAMaxVol.AtrbValue.ToString();
                string overarchingMaxAmt = deOAMaxAmt.AtrbValue.ToString();

                //do not run validation if no user input
                if (overarchingMaxVol == "" && overarchingMaxVol == "")
                {
                    foreach (OpDataElement de in r.Dc.DataElements.Where(d => readonlyAtrbs.Contains(d.AtrbCd)))
                    {
                        de.SetReadOnly();
                    }
                }
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

        public static void DisableForActivityOrAccrual(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        public static void DisableForVistexHybrid(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            List<string> readonlyAtrbs = new List<string> {
                AttributeCodes.REBATE_TYPE,
                AttributeCodes.PAYOUT_BASED_ON,
                AttributeCodes.CUST_ACCNT_DIV,
                AttributeCodes.GEO_COMBINED,
                AttributeCodes.PROGRAM_PAYMENT,
                AttributeCodes.PERIOD_PROFILE
                //AttributeCodes.AR_SETTLEMENT_LVL // Not applicable as part of the User Story US680360, Should be editable at deal level (including active stage). Required validation has been handled in UI as PTE
            };

            string deIsHybridPrcStratValue = r.Dc.GetDataElementValue(AttributeCodes.IS_HYBRID_PRC_STRAT);

            if (deIsHybridPrcStratValue == "1")
            {
                foreach (OpDataElement de in r.Dc.DataElements.Where(d => readonlyAtrbs.Contains(d.AtrbCd)))
                {
                    de.SetReadOnly();
                }
            }
            //r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        public static void CheckDropDownValues(params object[] args)
        {
            Dictionary<string, string> eligibleDropDowns = new Dictionary<string, string>();
            eligibleDropDowns.Add(AttributeCodes.PAYOUT_BASED_ON, "Payout Based On");
            eligibleDropDowns.Add(AttributeCodes.PROGRAM_PAYMENT, "Program Payment");
            eligibleDropDowns.Add(AttributeCodes.REBATE_TYPE, "Rebate Type");
            eligibleDropDowns.Add(AttributeCodes.PROD_INCLDS, "Media");
            eligibleDropDowns.Add(AttributeCodes.SERVER_DEAL_TYPE, "Server Deal Type");
            eligibleDropDowns.Add(AttributeCodes.PERIOD_PROFILE, "Period Profile");
            eligibleDropDowns.Add(AttributeCodes.AR_SETTLEMENT_LVL, "AR Settlement Level");
            CheckDropDownValues(eligibleDropDowns, args);

            eligibleDropDowns.Clear();
            eligibleDropDowns.Add(AttributeCodes.QLTR_BID_GEO, "Bid Geo");
            CheckDropDownMultiValues(eligibleDropDowns, args);
        }

        static void CheckDropDownValues(Dictionary<string, string> eligibleDropDowns, params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(eligibleDropDowns.Keys))
            {
                if (de.AtrbValue.ToString().Trim() != string.Empty)
                {
                    List<string> dropDowns = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == de.AtrbCd).Select(d => d.DROP_DOWN).ToList();
                    string matchedValue = dropDowns.Where(d => d.ToUpper() == de.AtrbValue.ToString().ToUpper()).Select(d => d).FirstOrDefault();
                    if (string.IsNullOrEmpty(matchedValue))
                    {
                        de.AddMessage(string.Format("Invalid {0}. Please select from the drop-down list", eligibleDropDowns[de.AtrbCd]));
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
        }

        static void CheckDropDownMultiValues(Dictionary<string, string> eligibleDropDowns, params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(eligibleDropDowns.Keys))
            {
                if (de.AtrbValue.ToString().Trim() != string.Empty)
                {
                    List<string> dropDowns = DataCollections.GetDropdowns().Where(d => d.dropdownCategory == (de.AtrbCd == AttributeCodes.QLTR_BID_GEO ? "Geo" : de.AtrbCd) && d.active == 1).Select(d => d.dropdownName).ToList();
                    List<string> unMatchedValues = de.AtrbValue.ToString().Split(',').Select(x => x.Trim().ToUpper()).Except(dropDowns.Select(d => d.Trim().ToUpper())).ToList();
                    if (unMatchedValues.Count > 0)
                    {
                        de.AddMessage(string.Format("Invalid {0}. Please select from the drop-down list", eligibleDropDowns[de.AtrbCd]));
                    }
                }
            }
        }

        /// <summary>
        /// Check billing start and end date for deals
        /// </summary>
        /// <param name="args"></param>
        public static void CheckBillingDates(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement payoutBasedOn = r.Dc.GetDataElement(AttributeCodes.PAYOUT_BASED_ON);
            IOpDataElement deStart = r.Dc.GetDataElement(AttributeCodes.START_DT);
            IOpDataElement deEnd = r.Dc.GetDataElement(AttributeCodes.END_DT);
            IOpDataElement deBllgStart = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_START);
            IOpDataElement deBllgEnd = r.Dc.GetDataElement(AttributeCodes.REBATE_BILLING_END);
            IOpDataElement deType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            string paymentType = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

            if (paymentType.Contains("Frontend")) return;  // Bail out of this check for Front End deals since they might have overlap crush which doesn't reset billings end dates

            // For front end YCS2 do not check for billing dates

            if (string.IsNullOrEmpty(deStart?.AtrbValue.ToString()) || string.IsNullOrEmpty(deEnd?.AtrbValue.ToString())) return;
            if (string.IsNullOrEmpty(deBllgStart?.AtrbValue.ToString()) || string.IsNullOrEmpty(deBllgEnd?.AtrbValue.ToString())) return;

            DateTime dcSt = DateTime.Parse(deStart.AtrbValue.ToString()).Date;
            DateTime dcEn = DateTime.Parse(deEnd.AtrbValue.ToString()).Date;

            // US705342 get dates for previous quarter
            var quarterDetails = new CustomerCalendarDataLib().GetCustomerQuarterDetails(2, dcSt.AddMonths(-3), null, null);

            // changed billing start date to equal deal start date as part of US705342
            // if payout based on is Consumption, push the billing start date to one year prior to deal start date and 
            // End date =  Billing End date
            if (deStart.HasValueChanged && !deBllgStart.HasValueChanged)
            {
                if (payoutBasedOn.AtrbValue.ToString().Equals("Billings", StringComparison.InvariantCultureIgnoreCase) || deType.AtrbValue.ToString().Equals("TENDER", StringComparison.InvariantCultureIgnoreCase))
                {
                    var dt = DateTime.Parse(deStart.AtrbValue.ToString()).ToString("MM/dd/yyyy");
                    deBllgStart.SetAtrbValue(dt);
                } 
                else
                {              
                    // Consumption deal- billing start date set it same as Deal start date when deal start date is modified  
                    var dt = DateTime.Parse(deStart.AtrbValue.ToString()).ToString("MM/dd/yyyy");
                    deBllgStart.SetAtrbValue(dt);
                }
                
            }

            if (deEnd.HasValueChanged && !deBllgEnd.HasValueChanged)
            {
                deBllgEnd.SetAtrbValue(deEnd.AtrbValue.ToString());
            }

            if (string.IsNullOrEmpty(deBllgStart.AtrbValue.ToString()) || DateTime.Parse(deBllgStart.AtrbValue.ToString()).Date > dcSt)
            {
                deBllgStart.AddMessage("The Billing Start Date must be on or earlier than the Deal Start Date.");
            }
            if (string.IsNullOrEmpty(deBllgEnd.AtrbValue.ToString()) || DateTime.Parse(deBllgEnd.AtrbValue.ToString()).Date > dcEn)
            {
                deBllgEnd.AddMessage("The Billing End Date must be on or earlier than the Deal End Date.");
            }

            // Billing start date can only be backdated up until start of previous quarter US705342 - Set by constant value set at release time US815029
            string bllgTenderCutoverDealCnst = new DataCollectionsDataLib().GetToolConstants().Where(c => c.CNST_NM == "BLLG_TENDER_CUTOVER_DEAL").Select(c => c.CNST_VAL_TXT).FirstOrDefault();
            int bllgTenderCutoverDeal;
            if (!int.TryParse(bllgTenderCutoverDealCnst, out bllgTenderCutoverDeal)) bllgTenderCutoverDeal = 0;
            if (deBllgStart.DcID > bllgTenderCutoverDeal) // Apply new rules for tenders billing start dates
            {
                if (DateTime.Parse(deBllgStart.AtrbValue.ToString()).Date < quarterDetails.QTR_STRT && deType.AtrbValue.ToString().Equals("TENDER", StringComparison.InvariantCultureIgnoreCase))
                {
                    deBllgStart.AddMessage("Billing Start Date cannot be backdated beyond the Deal Start Date's previous quarter.");
                }
            }
            else // Apply old rules to old tenders before break off point
            {
                if (DateTime.Parse(deBllgStart.AtrbValue.ToString()).Date < dcSt.AddYears(-1) && deType.AtrbValue.ToString().Equals("TENDER", StringComparison.InvariantCultureIgnoreCase)) //AddYears(-1)
                {
                    deBllgStart.AddMessage("Billing Start Date cannot be backdated beyond 1 year prior to the Deal Start Date.");
                }
            }
        }

        public static void CheckMaxDealEndDate(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement deStartDate = r.Dc.GetDataElement(AttributeCodes.START_DT);
            IOpDataElement deEndDate = r.Dc.GetDataElement(AttributeCodes.END_DT);

            DateTime startDate = DateTime.Parse(deStartDate.AtrbValue.ToString()).Date;
            DateTime endDate = DateTime.Parse(deEndDate.AtrbValue.ToString()).Date;

            DateTime maxEndDt = startDate.AddYears(20);
            if (endDate > maxEndDt && progPayment == "Backend")
            {
                deEndDate.AddMessage("Deal End Date cannot exceed 20 years beyond the Deal Start Date");
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

        public static void CheckCeilingVolume(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string rType = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            string hasTracker = r.Dc.GetDataElementValue(AttributeCodes.HAS_TRACKER);
            string cVol = r.Dc.GetDataElementValue(AttributeCodes.VOLUME);
            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.VOLUME);

            if (rType.ToUpper() == "TENDER" && de != null) // Tender Deals Force Volume Check   //TODO: the 'de != null' check prevents system from throwing exceptions on the tenderDashboard for tenders created when this was not required... need to go clean up existing data and then we can remove this additional check (though leaving it in doesn't hurt either)
            {
                if (cVol == null || cVol == "")
                {
                    de.AddMessage("Ceiling Volume is required for TENDER deals.");
                    de.IsRequired = true;
                }
                if (cVol == "999999999")
                {
                    de.AddMessage("Ceiling Volume cannot be Blank or Unlimited (999999999) for TENDER deals.");
                }
            }

            if (progPayment == "Frontend XOA3" && hasTracker != "1") // XOA3 Deals Force Volume Check only if they are in play, don't crash on old deals. (DE20600 Addition)
            {
                if (cVol == null || cVol == "")
                {
                    de.AddMessage("Ceiling Volume is required for Frontend XOA3 deals.");
                    de.IsRequired = true;
                }
                if (cVol == "999999999")
                {
                    de.AddMessage("Ceiling Volume cannot be Blank or Unlimited (999999999) for Frontend XOA3 deals.");
                }
            }
        }

        public static void CheckFrontendSoldPrcGrpCd(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string progPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);
            string sold = r.Dc.GetDataElementValue(AttributeCodes.DEAL_SOLD_TO_ID);
            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.DEAL_SOLD_TO_ID);

            if (progPayment == "Backend" || !string.IsNullOrEmpty(sold)) return;

            string strCustId = r.Dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID);

            if (string.IsNullOrEmpty(strCustId))
            {
                de.AddMessage("This deal is missing it's customer.");
                return;
            }

            int custId = int.Parse(r.Dc.GetDataElementValue(AttributeCodes.CUST_MBR_SID));
            string prcCd = DataCollections.GetCustomerDivisions().Where(c => (c.CUST_NM_SID == custId || c.CUST_DIV_NM_SID == custId) && c.ACTV_IND).Select(c => c.PRC_GRP_CD).FirstOrDefault();
            if (string.IsNullOrEmpty(prcCd)) // && !de.IsReadOnly
            {
                de.AddMessage("Frontend Deals cannot be created if no sold to values are selected and the customer doesn't have a Price Group Code.");
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
            if (de.AtrbValue.ToString() != "" && progPayment == "Frontend YCS2") // Moved check from "All Front End" Deals to only "Front End YCS2" (DE20600)
            {
                de.AddMessage("Volume cannot be set for Frontend YCS2 Deals.");
                return;
            }

            int vol;
            if (!int.TryParse(de.AtrbValue.ToString(), out vol))
            {
                de.AddMessage("Volume must be a valid non-decimal number.");
            }
        }

        public static void CheckTierVolumes(params object[] args)
        {
            // DE36947 - PRODUCTION: Large end volume broke DSU batch 
            // This check doesn't take into account that start vol might be set to same value as end vol and that check (happens earlier then this)
            // will be violated.  We allow the save and catch the match later so that the PTR tab doesn't propogate the last tier values into the 
            // first tier while offsetting the save completely nuking the save data later on (killing tier numbers that requires a data fix)
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> atrbs = new List<string> { AttributeCodes.STRT_VOL, AttributeCodes.END_VOL };
            foreach (IOpDataElement de in r.Dc.GetDataElementsIn(atrbs))
            {
                decimal safeParse = 0;
                bool isNumber = Decimal.TryParse(de.AtrbValue.ToString(), out safeParse);

                if (isNumber && safeParse > 999999999)
                {
                    de.AtrbValue = 999999999;
                    de.State = OpDataElementState.Modified;
                }
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

        public static void CheckExpireFlag(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string dcEnStr = r.Dc.GetDataElementValue(AttributeCodes.END_DT);
            DateTime dcEn = DateTime.Parse(dcEnStr);

            string isExpired = r.Dc.GetDataElementValue(AttributeCodes.EXPIRE_FLG);

            if (dcEn > DateTime.Now.Date && isExpired == "1") // If there is an expired flag, reset it if it is set
            {
                r.Dc.SetAtrb(AttributeCodes.EXPIRE_FLG, "0", "Deal is no longer expired");
            }

            if (dcEn < DateTime.Now.Date && (isExpired == "0" || isExpired == "")) // If there is an expired flag, reset it if it is set
            {
                r.Dc.SetAtrb(AttributeCodes.EXPIRE_FLG, "1", "Deal is now expired");
            }
        }

        public static void ModifiedProductCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            if (!r.ExtraArgs.Any()) return;

            var myDealsData = (MyDealsData)r.ExtraArgs[0];

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW) || !myDealsData.ContainsKey(OpDataElementType.WIP_DEAL)) return;

            if (r.Dc.Message.HighestMessageType != "Error") return;

            var dcErrors = myDealsData[OpDataElementType.PRC_TBL_ROW].AllDataCollectors.Where(d => d.DcID == r.Dc.DcParentID);

            foreach (OpDataCollector dc in dcErrors)
            {
                var dePrd = dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
                dePrd?.AddMessage(EN.MESSAGES.CANNOT_MODIFY_PRODUCTS);
                dc.Message.WriteMessage(OpMsg.MessageType.Error, EN.MESSAGES.CANNOT_MODIFY_PRODUCTS);
                myDealsData[OpDataElementType.PRC_TBL_ROW].Messages.WriteMessage(OpMsg.MessageType.Error, EN.MESSAGES.CANNOT_MODIFY_PRODUCTS);
            }
        }

        public static void TimelineAtrbChangeCheck(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.ExtraArgs.Any()) return;
            var myDealsData = (MyDealsData)r.ExtraArgs[r.ExtraArgs.Count() - 1]; // Seems that sometimes we have 1, other times we have 2

            List<string> atrbs = new List<string> { AttributeCodes.DEAL_COMB_TYPE, AttributeCodes.C2A_DATA_C2A_ID, AttributeCodes.WF_STG_CD, AttributeCodes.EXPIRE_YCS2 };

            List<IOpDataElement> des = r.Dc.GetDataElementsIn(atrbs).Where(d => d.State != OpDataElementState.Unchanged).ToList();
            if (!des.Any()) return;

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();

            foreach (IOpDataElement de in des)
            {
                if (de.AtrbValue.ToString() == de.OrigAtrbValue.ToString()) continue;

                MyDealsAttribute atrb = atrbMstr.All.FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
                if (atrb == null) continue;

                switch (de.AtrbCd)
                {
                    case AttributeCodes.EXPIRE_YCS2:
                        if (de.AtrbValue.ToString() == "Yes") r.Dc.AddTimelineComment($"YCS2 deal has been expired");
                        break;

                    case AttributeCodes.WF_STG_CD:
                        if (OpDataElementTypeConverter.IdToOpDataElementTypeString(de.DcType) == OpDataElementType.WIP_DEAL) SetDealDcMessages(myDealsData, (OpDataElement)de, null); // WIP item, get PS data
                        else r.Dc.AddTimelineComment($"{ atrb.ATRB_LBL } changed from {de.OrigAtrbValue} to { de.AtrbValue }"); // Not wip - do normal
                        break;

                    default:
                        if (de.OrigAtrbValue.ToString() == string.Empty) continue;
                        r.Dc.AddTimelineComment($"{ atrb.ATRB_LBL } changed from {de.OrigAtrbValue} to { de.AtrbValue }");
                        break;
                }
            }
        }

        // This takes a WIP and myDealsData packet, and sets the deal level DC stage change message as defined by its parent PS
        public static void SetDealDcMessages(MyDealsData myDealsData, OpDataElement dealDe, string specificStage)
        {
            List<string> endPointStages = new List<string> { WorkFlowStages.Active, WorkFlowStages.Offer, WorkFlowStages.Won, WorkFlowStages.Lost };
            OpDataCollector dealDc = myDealsData[OpDataElementType.WIP_DEAL].AllDataCollectors.FirstOrDefault(d => d.DcID == dealDe.DcID);
            string dealBreadcrumbPathJSON = dealDc.GetDataElementValue(AttributeCodes.OBJ_PATH_HASH);
            if (!string.IsNullOrEmpty(dealBreadcrumbPathJSON))
            {
                // Dynamic makes the JSON an mapable object, otherwise need to parse it via dealBreadcrumbPath["PS"].ToString()
                dynamic dealBreadcrumbPath = JObject.Parse(dealBreadcrumbPathJSON);
                int dealParentPSId = Int32.Parse(dealBreadcrumbPath.PS.ToString());
                if (dealParentPSId != 0) // We got back a PS ID, get stage data from there
                {
                    OpDataElement psWfStgDe = null;
                    if (!myDealsData.ContainsKey(OpDataElementType.PRC_ST)) //&& myDealsData[OpDataElementType.PRC_ST].AllDataElements.FirstOrDefault(d => d.DcID == dealParentPSId && d.AtrbCd == AttributeCodes.WF_STG_CD) != null
                    {
                        MyDealsData psDealsData = new OpDataCollectorDataLib().GetByIDs(OpDataElementType.PRC_ST, new List<int> { dealParentPSId }, new List<OpDataElementType> { OpDataElementType.PRC_ST }, new List<int> { Attributes.WF_STG_CD.ATRB_SID, Attributes.OBJ_SET_TYPE_CD.ATRB_SID });
                        psWfStgDe = psDealsData[OpDataElementType.PRC_ST].AllDataElements.FirstOrDefault(d => d.DcID == dealParentPSId && d.AtrbCd == AttributeCodes.WF_STG_CD);
                    }
                    else
                    {
                        psWfStgDe = myDealsData[OpDataElementType.PRC_ST].AllDataElements.FirstOrDefault(d => d.DcID == dealParentPSId && d.AtrbCd == AttributeCodes.WF_STG_CD);
                    }

                    // If this is a tender deal - take the tender WIP stage, else take the PS stage
                    string fromStage = endPointStages.Contains(dealDe.OrigAtrbValue.ToString()) ? dealDe.OrigAtrbValue.ToString() : psWfStgDe.OrigAtrbValue.ToString();
                    string destStage = string.IsNullOrEmpty(specificStage) ? psWfStgDe.AtrbValue.ToString() : specificStage;
                    if (psWfStgDe != null) dealDc.AddTimelineComment($"Deal moved from {fromStage} to {destStage}.");
                }
            }
        }

        public static void MajorWrongWayChangeCheck(params object[] args)
        {
            // This rule added in because Kannan said that for wrong way major changes to properly generate a tracker.  The DB is relying on tracker having "*" prior to gen-tracker call.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            List<MyDealsAttribute> onChangeWrongWayItems = atrbMstr != null ? atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_INCREASE" || a.MJR_MNR_CHG == "MAJOR_DECREASE").ToList() : new List<MyDealsAttribute>();

            List<int> onChangeWrongWayIds = r.Dc.DataElements.Where(d => onChangeWrongWayItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).Select(d => d.DcID).ToList();
            List<int> majorFieldNoRedealIds = r.Dc.DataElements
                .Where(d => d.AtrbCdIs(AttributeCodes.WF_STG_CD) && (d.AtrbValue.ToString() == WorkFlowStages.Active || d.AtrbValue.ToString() == WorkFlowStages.Won) && !d.HasValueChanged && onChangeWrongWayIds.Contains(d.DcID))
                .Select(d => d.DcID).ToList();

            if (!majorFieldNoRedealIds.Any()) return; // If there are no "wrong way" major changes to process, bail out.

            if (majorFieldNoRedealIds.Contains(r.Dc.DcID))
            {
                foreach (IOpDataElement de in r.Dc.GetDataElements(AttributeCodes.TRKR_NBR)) // Get all trackers (Potentially multi-dimensional) for this object and update as needed.
                {
                    string tracker = de.AtrbValue.ToString();
                    // If there is a tracker number, put the WIP version in re-deal visual state.  We do this because we will issue a GEN_TRACKER call to update the tracker.
                    if (!string.IsNullOrEmpty(tracker) && !tracker.Contains('*'))
                    {
                        de.AtrbValue = tracker + "*";
                    }
                }

                // Tack on re-deal messages that are specific to "wrong way" major changes.
                var reason = "Fast Track Re-deal due to major change by " + OpUserStack.MyOpUserToken.Usr.FullName + " (" + OpUserStack.MyOpUserToken.Usr.WWID + "): ";
                var reasonDetails = new List<string>();
                List<IOpDataElement> onChangeWrongWayElements = r.Dc.GetDataElementsWhere(d => onChangeWrongWayItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).ToList();

                foreach (IOpDataElement de in r.Dc.GetDataElementsWhere(d => onChangeWrongWayItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged).ToList())
                {
                    MyDealsAttribute atrb = onChangeWrongWayItems.FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
                    if (atrb == null) continue;

                    reasonDetails.Add(atrb.DATA_TYPE_CD == "DATETIME"
                        ? $"{atrb.ATRB_LBL} changed from {DateTime.Parse(de.OrigAtrbValue.ToString()):MM/dd/yyyy} to {DateTime.Parse(de.AtrbValue.ToString()):MM/dd/yyyy}"
                        : atrb.DATA_TYPE_CD == "MONEY"
                            ? $"{atrb.ATRB_LBL} changed from ${de.OrigAtrbValue} to ${de.AtrbValue}"
                            : $"{atrb.ATRB_LBL} changed from {de.OrigAtrbValue} to {de.AtrbValue}");
                }
                r.Dc.AddTimelineComment(reason + string.Join(", ", reasonDetails));
            }
        }

        private static DateTime GetBackDateValue(OpDataCollector opDataCollector)
        {
            DateTime chkStartDate;
            DateTime chkEndDate;
            DateTime chkLastTrkr;
            DateTime dtNow = DateTime.Now;
            if (!DateTime.TryParse(opDataCollector.GetDataElementValue(AttributeCodes.START_DT), out chkStartDate)) chkStartDate = dtNow;
            if (!DateTime.TryParse(opDataCollector.GetDataElementValue(AttributeCodes.END_DT), out chkEndDate)) chkEndDate = dtNow;
            if (!DateTime.TryParse(opDataCollector.GetDataElementValue(AttributeCodes.LAST_TRKR_START_DT_CHK), out chkLastTrkr)) chkLastTrkr = chkStartDate;

            if (chkEndDate < dtNow) return chkEndDate; // The deals is fully in the past, End Date is your target
            if (dtNow < chkStartDate) // The deals is fully in the future, Start Date or previous tracker start is your target
            {
                if (chkLastTrkr > chkStartDate) return chkLastTrkr; // Someone set a future tracker start date, use it (Last Tracker Date, Not Tracker Start)
                return chkStartDate; // Otherwise, Start Date is your target
            }
             
            // Deal is currently running, check if the tracker date should be the marker or the current day is
            if (dtNow < chkLastTrkr) return chkLastTrkr;
            return dtNow;
        }

        public static void MajorChangeCheck(params object[] args)
        {
            // Check for changes in attributes that would trigger a major change and re-deal.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || !r.ExtraArgs.Any()) return;

            var myDealsData = (MyDealsData)r.ExtraArgs[0];

            string wipStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string ptrStage = r.Dc.GetDataElementValue(AttributeCodes.PS_WF_STG_CD);
            var futureStage = r.Dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), ptrStage, OpDataElementType.PRC_ST);
            var dealType = r.Dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);
            var programPayment = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

            // If there isn't a future stage, then it isn't redealable
            // TO DO - WE NEED TO ADD IN PARENT PS STAGE FOR THIS CHECK
            if (futureStage == null && wipStage != WorkFlowStages.Pending && wipStage != WorkFlowStages.Active
                && wipStage != WorkFlowStages.Won && wipStage != WorkFlowStages.Offer) return; // DE19865 - Place end stages that DO force redeal here (including Offer)

            // We should not call this function for ECAP Front End YCS2, if we are here then something went wrong. Correct it here(partially) do not redeal
            if (wipStage == WorkFlowStages.Active && dealType == OpDataElementSetType.ECAP.ToString() && programPayment.Contains("Frontend YCS2")) return;

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();
            List<MyDealsAttribute> onChangeItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR").ToList();
            List<MyDealsAttribute> onChangeIncreaseItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_INCREASE").ToList();
            List<MyDealsAttribute> onChangeDecreaseItems = atrbMstr.All.Where(a => a.MJR_MNR_CHG == "MAJOR_DECREASE").ToList();

            // Find DE item changes that trigger a true re-deal/stage change here
            List<IOpDataElement> changedDes = r.Dc.GetDataElementsWhere(d => onChangeItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged && d.IsValueDifferentFromOrig(atrbMstr)).ToList();
            List<IOpDataElement> changedIncreaseDes = r.Dc.GetDataElementsWhere(d => onChangeIncreaseItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged && d.IsValueIncreasedFromOrig(atrbMstr)).ToList();
            List<IOpDataElement> changedDecreaseDes = r.Dc.GetDataElementsWhere(d => onChangeDecreaseItems.Select(a => a.ATRB_COL_NM).Contains(d.AtrbCd) && d.DcID > 0 && d.HasValueChanged && d.IsValueDecreasedFromOrig(atrbMstr)).ToList();

            var titleDe = changedDes.Where(x => x.AtrbCd == AttributeCodes.TITLE);

            // Product title changed..  Check if Atrb 15 changed
            if (titleDe.Any())
            {
                // Get all the products
                List<OpDataElement> deProds = r.Dc.DataElements.Where(d => d.AtrbCd == AttributeCodes.PRODUCT_FILTER).ToList();

                // Get products changed value order them
                var deProdsValue = deProds.Select(x => x.AtrbValue.ToString()).OrderBy(x => x);

                // Get products original value order them
                var deProdsOriginalValue = deProds.Select(x => x.OrigAtrbValue.ToString()).OrderBy(x => x);

                // Compare sequentially, if its equal there is no change
                var isProductNotChanged = deProdsValue.SequenceEqual(deProdsOriginalValue, StringComparer.OrdinalIgnoreCase);

                if (isProductNotChanged)
                {
                    // When products attributes have not changed, only order changed, remove the TITLE major change (DT Ci3, MB Ci3 -> Mb Ci3, DT Ci3)
                    changedDes.Remove(titleDe.FirstOrDefault());
                }
            }

            // if not a major change... exit
            if (!changedDes.Any() && !changedIncreaseDes.Any() && !changedDecreaseDes.Any() && r.Dc.DcID > 0) return;

            // Define re deal reason

            // TO DO: Fix this later

            var reason = "Re-deal due to major change: ";
            var reasonDetails = new List<string>();
            if (r.Dc.DcID > 0)
            {
                foreach (IOpDataElement de in changedDes.Union(changedIncreaseDes).Union(changedDecreaseDes))
                {
                    MyDealsAttribute atrb = onChangeItems.Union(onChangeIncreaseItems).Union(onChangeDecreaseItems).Union(onChangeDecreaseItems).FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
                    if (atrb == null) continue;

                    reasonDetails.Add(atrb.DATA_TYPE_CD == "DATETIME"
                        ? $"{atrb.ATRB_LBL} changed from {DateTime.Parse(de.OrigAtrbValue.ToString()):MM/dd/yyyy} to {DateTime.Parse(de.AtrbValue.ToString()):MM/dd/yyyy}"
                        : atrb.DATA_TYPE_CD == "MONEY"
                            ? $"{atrb.ATRB_LBL} changed from ${de.OrigAtrbValue} to ${de.AtrbValue}"
                            : $"{atrb.ATRB_LBL} changed from {de.OrigAtrbValue} to {de.AtrbValue}");
                }
                r.Dc.AddTimelineComment(reason + string.Join(", ", reasonDetails));
            }

            // NOTE: We need to set the WIP and the PS stage
            // WIP always is "Draft" and PS depends on the users workflow
            // NOTE 2: We do not set the Contract stage.  We will rely on the SP to sync that stage

            // set WIP Stages to Draft for a re-deal if they already aren't there
            if (r.Dc.GetAtrbValue(AttributeCodes.WF_STG_CD).ToString() != WorkFlowStages.Draft)
            {
                r.Dc.SetAtrb(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft);
                r.Dc.SetAtrb(AttributeCodes.PS_WF_STG_CD, OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA
                    ? WorkFlowStages.Requested
                    : WorkFlowStages.Draft);
            }

            if (wipStage == WorkFlowStages.Active || wipStage == WorkFlowStages.Won) // WIP Object, Set re-deal date only if this came from active since it will drive the tracker effective from/to date calc.
            {
                bool setRedealFlag = false;
                r.Dc.SetAtrb(AttributeCodes.LAST_REDEAL_BY, OpUserStack.MyOpUserToken.Usr.WWID);
                r.Dc.SetAtrb(AttributeCodes.LAST_REDEAL_DT, GetBackDateValue(r.Dc).ToString("MM/dd/yyyy"));
                //string test = r.Dc.GetDataElementValue(AttributeCodes.LAST_REDEAL_DT);
                foreach (IOpDataElement de in r.Dc.GetDataElements(AttributeCodes.TRKR_NBR)) // Get all trackers for this object and update as needed
                {
                    string tracker = de.AtrbValue.ToString();
                    if (!string.IsNullOrEmpty(tracker)) // If there is a tracker number, put the WIP version in re-deal visual state
                    {
                        de.AtrbValue = tracker + "*";
                        setRedealFlag = true; // If there is a tracker change, this is hard re-deal and subject to rollback
                    }
                }

                // If this is a hard rollback, set it so that Cancel/delete/rollback flags can be set in UI.  Rollup will set parents as needed.  Tenders in Offer will not have
                // tracker and will be cancel in re-deal states since the no longer have a level 6 object tied to them until they actually win.
                IOpDataElement rde = r.Dc.GetDataElement(AttributeCodes.IN_REDEAL);
                if (rde != null)
                {
                    rde.AtrbValue = setRedealFlag ? 1 : 0;
                }
                else // Safety in case for some reason we don't have an attribute - shouldn't hit this code though.
                {
                    r.Dc.DataElements.Add(new OpDataElement
                    {
                        DcID = r.Dc.DcID,
                        DcType = OpDataElementTypeConverter.StringToId(r.Dc.DcType),
                        DcParentType = OpDataElementTypeConverter.StringToId(r.Dc.DcParentType),
                        DcParentID = r.Dc.DcParentID,
                        AtrbID = 5,
                        AtrbValue = setRedealFlag ? 1 : 0,
                        OrigAtrbValue = !setRedealFlag ? 1 : 0,
                        PrevAtrbValue = !setRedealFlag ? 1 : 0,
                        AtrbCd = "IN_REDEAL",
                        State = OpDataElementState.Modified
                    });
                }
            }

            // Locate and set Parent PS Attributes
            if ((r.Dc.DcID > 0 && futureStage == null) || futureStage != null || r.Dc.DcID < 0)
            {
                if (futureStage == null) // This is path where you edited a re-deal item, yet PS is not in re-deal pathing stage, so force the path
                {
                    futureStage = OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA
                        ? WorkFlowStages.Requested
                        : WorkFlowStages.Draft;
                }
                OpDataCollector dcRow = myDealsData[OpDataElementType.PRC_TBL_ROW].Data[r.Dc.DcParentID];
                int dcPs = myDealsData.ContainsKey(OpDataElementType.PRC_TBL)
                    ? myDealsData[OpDataElementType.PRC_TBL].Data[dcRow.DcParentID].DcParentID
                    : myDealsData[OpDataElementType.PRC_ST].Data.FirstOrDefault().Value.DcID;
                if (!myDealsData.ContainsKey(OpDataElementType.PRC_ST)) // Don't have the PS, fetch it.
                {
                    myDealsData[OpDataElementType.PRC_ST] = new OpDataCollectorDataLib().GetByIDs(OpDataElementType.PRC_ST,
                        new List<int> { dcPs },
                        new List<OpDataElementType> { OpDataElementType.PRC_ST },
                        new List<int> { Attributes.WF_STG_CD.ATRB_SID })[OpDataElementType.PRC_ST];
                }
                else if (myDealsData[OpDataElementType.PRC_ST].AllDataCollectors.All(d => d.DcID != dcPs))
                {
                    MyDealsData tempMyDealsData = new MyDealsData();
                    tempMyDealsData[OpDataElementType.PRC_ST] = new OpDataCollectorDataLib().GetByIDs(OpDataElementType.PRC_ST,
                        new List<int> { dcPs },
                        new List<OpDataElementType> { OpDataElementType.PRC_ST },
                        new List<int> { Attributes.WF_STG_CD.ATRB_SID })[OpDataElementType.PRC_ST];
                    myDealsData[OpDataElementType.PRC_ST].Data.AddRange(tempMyDealsData[OpDataElementType.PRC_ST].AllDataCollectors);
                }
                OpDataCollector dcSt = myDealsData[OpDataElementType.PRC_ST].Data[dcPs];
                dcSt.SetAtrb(AttributeCodes.WF_STG_CD, futureStage);
            }

            // If object is expired, un-expire it
            string isExpired = r.Dc.GetDataElementValue(AttributeCodes.EXPIRE_FLG);
            if (!string.IsNullOrEmpty(isExpired) && isExpired == "1") // If there is an expired flag, reset it if it is set
            {
                r.Dc.SetAtrb(AttributeCodes.EXPIRE_FLG, "0", "Deal is no longer expired");
            }

            // Finally, clear the Auto_approval information if this was a Tender Deal
            if (r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE) == "TENDER")
            {
                r.Dc.SetAtrb(AttributeCodes.AUTO_APPROVE_RULE_INFO, "");
            }

            //throw new Exception("Fracking hell...");
        }

        public static void SetSalesForceCreationMessages(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid || r.Dc.DcID > 0) return;

            string salesForceId = r.Dc.GetDataElementValue(AttributeCodes.SALESFORCE_ID);

            if (salesForceId != "")
            {
                r.Dc.AddTimelineComment("Deal moved from Requested to Submitted after IQR creation.");
            }
        }

        public static void ValidateEcapPrice(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deEcapPrice = r.Dc.GetDataElement(AttributeCodes.ECAP_PRICE);
            if (deEcapPrice == null) return;

            decimal price;
            if (!decimal.TryParse(deEcapPrice.AtrbValue.ToString(), out price))
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

        public static void ValidateOverarching(params object[] args)
        {
            //Validation Rules for overarching deals
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deOAMaxVol = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_VOL);
            IOpDataElement deOAMaxAmt = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_AMT);

            if (deOAMaxAmt == null || deOAMaxVol == null) return;

            string overarchingMaxVol = deOAMaxVol.AtrbValue.ToString();
            string overarchingMaxAmt = deOAMaxAmt.AtrbValue.ToString();

            //do not run validation if no user input
            if (overarchingMaxVol == "" && deOAMaxAmt.AtrbValue.ToString() == "") return;

            int numMaxVol;
            decimal numMaxAmt;

            if (!decimal.TryParse(overarchingMaxAmt, out numMaxAmt) && overarchingMaxAmt != "")
            {   //Non decimal type input error
                deOAMaxAmt.AddMessage("Overarching Max Dollar Amount is not a valid dollar amount.");
            }
            if (!int.TryParse(overarchingMaxVol, out numMaxVol) && overarchingMaxVol != "")
            {   //Non integer type input error
                deOAMaxVol.AddMessage("Overarching Max Volume is not a valid integer value.");
            }

            if (numMaxVol < 0)
            {
                deOAMaxVol.AddMessage("Overarching Max Volume cannot be a negative value.");
            }
            if (numMaxAmt < 0)
            {
                deOAMaxAmt.AddMessage("Overarching Max Dollar Amount cannot be a negative value.");
            }

            //if user adds an overarching deal id, then one but not both overarching max values are required
            if (overarchingMaxAmt != "" && overarchingMaxVol != "")
            {
                deOAMaxAmt.AddMessage("Cannot have both Overarching Max Dollar Amount and Overarching Max Volume.");
                deOAMaxVol.AddMessage("Cannot have both Overarching Max Volume and Overarching Max Dollar Amount.");
            }

        }

        public static void ValidateOverarchingInPTR(params object[] args)
        {
            //Validation Rules for overarching deals
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deOAMaxVol = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_VOL);
            IOpDataElement deOAMaxAmt = r.Dc.GetDataElement(AttributeCodes.REBATE_OA_MAX_AMT);

            if (deOAMaxAmt == null || deOAMaxVol == null) return;

            string overarchingMaxVol = deOAMaxVol.AtrbValue.ToString();
            string overarchingMaxAmt = deOAMaxAmt.AtrbValue.ToString();

            //do not run validation if no user input
            if (overarchingMaxVol == "" && deOAMaxAmt.AtrbValue.ToString() == "") return;

            int numMaxVol;
            decimal numMaxAmt;

            if (!decimal.TryParse(overarchingMaxAmt, out numMaxAmt) && overarchingMaxAmt != "")
            {   //Non decimal type input error
                deOAMaxAmt.AddMessage("Overarching Max Dollar Amount is not a valid dollar amount.");
            }
            if (!int.TryParse(overarchingMaxVol, out numMaxVol) && overarchingMaxVol != "")
            {   //Non integer type input error
                deOAMaxVol.AddMessage("Overarching Max Volume is not a valid integer value.");
            }
            if (numMaxVol < 0)
            {
                deOAMaxVol.AddMessage("Overarching Max Volume cannot be a negative value.");
            }
            if (numMaxAmt < 0)
            {
                deOAMaxAmt.AddMessage("Overarching Max Dollar Amount cannot be a negative value.");
            }

            //if user adds an overarching deal id, then one but not both overarching max values are required
            if (overarchingMaxAmt != "" && overarchingMaxVol != "")
            {
                deOAMaxAmt.AddMessage("Cannot have both Overarching Max Dollar Amount and Overarching Max Volume.");
                deOAMaxVol.AddMessage("Cannot have both Overarching Max Volume and Overarching Max Dollar Amount.");
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

            string wipStage = r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            List<string> blockedStages = new List<string> { WorkFlowStages.Submitted, WorkFlowStages.Lost, WorkFlowStages.Offer, WorkFlowStages.Won, WorkFlowStages.Pending };
            if (blockedStages.Contains(wipStage)) return;

            string backDateTxt = r.Dc.GetDataElementValue(AttributeCodes.BACK_DATE_RSN_TXT);

            if (backDateTxt != "" || !string.IsNullOrEmpty(deBackDate.AtrbValue.ToString()))
            {
                deBackDate.IsRequired = true;
            }
        }

        public static void TendersProjectRequired(params object[] args)
        {
            // Note that this will trigger on already published deals as well, but since they show up in Search screen, UI doesn't intercept the required messages.
            // This is also a PTR only level rule, so it doesn't enforce 
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string rebateType = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            IOpDataElement deProject = r.Dc.GetDataElement(AttributeCodes.QLTR_PROJECT);
            string wfStage = r.Dc.DcType == OpDataElementType.WIP_DEAL.ToString()? r.Dc.GetDataElementValue(AttributeCodes.WF_STG_CD): "Draft";

            if (rebateType == "TENDER" && deProject != null && string.IsNullOrEmpty(deProject.AtrbValue.ToString()))
            {
                deProject.IsRequired = true;
            }
        }

        public static void ForecastVolumeRequired(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            // Not required for Program MDF, Program ECAP ADJ, Program Debit Memo (US242659)
            List<string> notRequiredProgramTypes = new List<string>
            {
                "ECAP ADJ",
                "DEBIT MEMO",
                "MDF"
            };
            IOpDataElement rebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            if (notRequiredProgramTypes.Contains(rebateType.AtrbValue)) return;  // If this is one of the above program types, it cannot be required, so bail.

            IOpDataElement forecastVolume = r.Dc.GetDataElement(AttributeCodes.FRCST_VOL);
            if (forecastVolume == null) return;

            bool isL1Product = Int32.Parse(r.Dc.GetDataElementValueNull(AttributeCodes.HAS_L1, "0")) > 0;

            if (isL1Product)
                forecastVolume.IsRequired = true;  // Required for L1, optional if L2 or Exempt.
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

        public static void EcapAdjRequired(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string rebateType = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            if (rebateType != "ECAP ADJ") return;

            IOpDataElement deTrkr = r.Dc.GetDataElement(AttributeCodes.ORIG_ECAP_TRKR_NBR);
            if (deTrkr == null) return;

            deTrkr.IsRequired = true;
        }

        public static void ProgramNreDateChecks(params object[] args) // required check as well as date comparison checks
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            OpDataElementType deType = OpDataElementTypeConverter.FromString(r.Dc.DcType);
            bool testObject = false;
            List<string> parentStagesCheckToBypass = new List<string> { WorkFlowStages.Pending, WorkFlowStages.Approved };

            //switch (deType)
            //{
            //    case OpDataElementType.PRC_TBL_ROW:
            //        strMinDealId = new DataCollectionsDataLib().GetToolConstants().Where(c => c.CNST_NM == "PGM_NRE_OEM_START_PTR").Select(c => c.CNST_VAL_TXT).FirstOrDefault();
            //        break;
            //    case OpDataElementType.WIP_DEAL:
            //        strMinDealId = new DataCollectionsDataLib().GetToolConstants().Where(c => c.CNST_NM == "PGM_NRE_OEM_START_DEAL").Select(c => c.CNST_VAL_TXT).FirstOrDefault();
            //        break;
            //}

            IOpDataElement deParentStage = r.Dc.GetDataElement(AttributeCodes.PS_WF_STG_CD);

            switch (deType)
            {
                case OpDataElementType.PRC_TBL_ROW:
                    IOpDataElement deHasTrkr = r.Dc.GetDataElement(AttributeCodes.HAS_TRACKER);
                    IOpDataElement deInRedeal = r.Dc.GetDataElement(AttributeCodes.IN_REDEAL);
                    if (deParentStage == null || deHasTrkr == null || deInRedeal == null) return; // Because apparently meet comp uses this as well and doesn't bring these fields down
                    testObject = ((deHasTrkr.AtrbValue.ToString() == "0") || (deHasTrkr.AtrbValue.ToString() == "1" && deInRedeal.AtrbValue.ToString() == "1")) &&
                        (!parentStagesCheckToBypass.Contains(deParentStage.AtrbValue.ToString()));
                    break;
                case OpDataElementType.WIP_DEAL:
                    IOpDataElement deStg = r.Dc.GetDataElement(AttributeCodes.WF_STG_CD);
                    if (deParentStage == null || deStg == null) return; // Because apparently meeto comp uses this as well and doesn't bring these fields down
                    testObject = deStg.AtrbValue.ToString() != WorkFlowStages.Active && !parentStagesCheckToBypass.Contains(deParentStage.AtrbValue.ToString());
                    break;
            }

            if (testObject) // If the testObject meets above requirements, run this test...
            {
                r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
            }
        }

        public static void VistexRequiredFields(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement programPayment = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement rebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);

            if (programPayment == null || rebateType == null) return; // Safety check, if they are missing, skip!

            string programPaymentValue = programPayment.AtrbValue.ToString();
            string rebateTypeValue = rebateType.AtrbValue.ToString();
            if (programPaymentValue == "Backend" && !(rebateTypeValue == "MDF ACTIVITY" || rebateTypeValue == "MDF ACCRUAL" || rebateTypeValue == "NRE ACCRUAL"))
            {
                // Apply the action from the rule (SetRequired) to the targets (Anything in Target[])
                r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
            }
        }

        public static void VistexRequiredFieldsProgramPaymentOnly(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement programPayment = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);

            if (programPayment == null) return; // Safety check, if they are missing, skip!

            string programPaymentValue = programPayment.AtrbValue.ToString();
            if (programPaymentValue == "Backend")
            {
                // Apply the action from the rule (SetRequired) to the targets (Anything in Target[])
                r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
            }
        }

        public static void VistexBlankFields(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement dealType = r.Dc.GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD);
            IOpDataElement programPayment = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);
            IOpDataElement rebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            IOpDataElement periodProfile = r.Dc.GetDataElement(AttributeCodes.PERIOD_PROFILE);
            IOpDataElement arSettlementLvl = r.Dc.GetDataElement(AttributeCodes.AR_SETTLEMENT_LVL);

            if (dealType == null || programPayment == null || rebateType == null || periodProfile == null || arSettlementLvl == null) return; // Safety check, if they are missing, skip!

            string dealTypeValue = dealType.AtrbValue.ToString();
            string programPaymentValue = programPayment.AtrbValue.ToString();
            string rebateTypeValue = rebateType.AtrbValue.ToString();
            // Period Profile has different blanking rules then Settlement Level
            if (dealTypeValue == "PROGRAM" || programPaymentValue != "Backend" || rebateTypeValue == "MDF ACTIVITY" || rebateTypeValue == "MDF ACCRUAL" || rebateTypeValue == "NRE ACCRUAL")
            {
                if (periodProfile.AtrbValue != "")
                {
                    periodProfile.AtrbValue = "";
                    periodProfile.State = OpDataElementState.Modified;
                    periodProfile.AddMessage("Period Profile value was reset to blank as it is not required for this deal. Please Re-Save and Validate to clear the warning.");
                }
            }

            if (programPaymentValue != "Backend")
            {
                if (arSettlementLvl.AtrbValue != "")
                {
                    arSettlementLvl.AtrbValue = "";
                    arSettlementLvl.State = OpDataElementState.Modified;
                    arSettlementLvl.AddMessage("AR Settlement Level value was reset to blank as it is not required for this deal. Please Re-Save and Validate to clear the warning.");
                }
            }
        }

        public static void PastEndDateExtendOnly(params object[] args)
        {
            // End dates in past are all handled this way regardless of tracker or not.  Read only rules depend on tracker.
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement endDate = r.Dc.GetDataElement(AttributeCodes.END_DT);
            List<OpDataElement> otherChangeElements = r.Dc.DataElements.Where(d => d.HasValueChanged == true).Select(d => d).ToList();

            if (endDate.OrigAtrbValue.ToString() == string.Empty) return; // In initial create, this rule can be bypassed because there isn't an Original Value in DE

            DateTime newEndDate = DateTime.Parse(endDate.AtrbValue.ToString());
            DateTime originalEndDate = DateTime.Parse(endDate.OrigAtrbValue.ToString());
            DateTime today = DateTime.Today;
            // DateTime.Compare, <0 If date1 is earlier than date2, 0 If date1 is the same as date2, > 0 If date1 is later than date2

            if (DateTime.Compare(originalEndDate, today) >= 0) return; // If original end is EARLIER then today, it was in past, not changed to the past, continue
            if (!endDate.HasValueChanged) return; // If the value hasn't been changed, continue
            if (DateTime.Compare(newEndDate, originalEndDate) >= 0) return; // If New end is EARLIER then Original, wrong way move, continue and roll all changes back
            foreach (OpDataElement changeElement in otherChangeElements)
            {
                changeElement.AtrbValue = changeElement.OrigAtrbValue;
                changeElement.State = OpDataElementState.Unchanged;
                if (changeElement.AtrbCd == AttributeCodes.END_DT)
                {
                    changeElement.AddMessage("A Past End Date can only be extended forward in time from " + originalEndDate.ToString("MM/dd/yyyy") + ".  Please adjust the End Date to after that date or the System will reset this value back to the Original End Date.");
                }
            }
        }

        public static void RedealNoEarlierThenPrevious(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement userEnteredRedealDateDe = r.Dc.GetDataElement(AttributeCodes.LAST_REDEAL_DT);
            string inRedeal = r.Dc.GetDataElementValue(AttributeCodes.IN_REDEAL);

            if (userEnteredRedealDateDe == null || inRedeal != "1") return; // Bail out if there isn't a user entered Re-deal date or not in re-deal - DE95332

            DateTime userEnteredRedealDate;
            DateTime dealStartDate;
            DateTime dealEndDate;
            DateTime lastTrackerStartDate;
            DateTime dtNow = DateTime.Now;
            if (!DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.LAST_REDEAL_DT), out userEnteredRedealDate)) userEnteredRedealDate = DateTime.MinValue;
            if (!DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.START_DT), out dealStartDate)) dealStartDate = dtNow;
            if (!DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.END_DT), out dealEndDate)) dealEndDate = dtNow;
            if (!DateTime.TryParse(r.Dc.GetDataElementValue(AttributeCodes.LAST_TRKR_START_DT_CHK), out lastTrackerStartDate)) lastTrackerStartDate = dealStartDate;

            // If User Entered is earlier then the Last Re-deal marker or User Entered is later then the End Date, toss an error
            if (userEnteredRedealDate < lastTrackerStartDate || userEnteredRedealDate > dealEndDate) 
            {
                //Validation error was enough to prevent deal from moving, so no need to alter the date back to original
                userEnteredRedealDateDe.AddMessage("Tracker Effective Start Date must be between " + lastTrackerStartDate.ToString("MM/dd/yyyy") + " and " + dealEndDate.ToString("MM/dd/yyyy"));
            }
        }

        public static void SalesForceSetReadOnly(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            
            string salesForceId = r.Dc.GetDataElementValue(AttributeCodes.SALESFORCE_ID);

            if (salesForceId == "") return;

            // Salesforce wants everything read only, including comments.  If they change their minds, this comes back in.
            //List<string> skipReadOnlyCheckAtrbs = new List<string> { AttributeCodes.DEAL_DESC };

            foreach (IOpDataElement de in r.Dc.DataElements)
            {
                //if (!skipReadOnlyCheckAtrbs.Contains(de.AtrbCd)) // If this is not a skip attribute, set to read only
                //{
                    de.IsReadOnly = true;
                //}
            }
        }

        public static void VolTierMdfVolumeRequired(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            r.Dc.ApplyActions(r.Dc.MeetsRuleCondition(r.Rule) ? r.Rule.OpRuleActions : r.Rule.OpRuleElseActions);
        }

        #region Tiered Validations

        private static bool IsGreaterThanZero(decimal attrb)
        {
            return (attrb > 0);
        }

        private static bool IsGreaterOrEqualToZero(decimal attrb)
        {
            return (attrb >= 0);
        }

        private static bool IsWholeNumber(decimal attrb)
        {
            return (attrb % 1 == 0) && (attrb >= 0);
        }

        public static void RollUpErrorMessage(params object[] args)
        {
            var r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            var dealLevelErrorMessages = r.Dc.GetDataElementsWhere(de => de.ValidationMessage != string.Empty);
            if (dealLevelErrorMessages.Any())
            {
                r.Dc.Message.WriteMessage(OpMsg.MessageType.Warning, "Validation Errors detected in deal");
            }
        }

        public static void ClearSysComments(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement sysComment = r.Dc.GetDataElement(AttributeCodes.SYS_COMMENTS);
            if (sysComment == null || sysComment.AtrbValue.ToString() == "") return;

            sysComment.AtrbValue = "";
            sysComment.PrevAtrbValue = "";
            sysComment.OrigAtrbValue = "";
            sysComment.State = OpDataElementState.Unchanged;
        }

        public static void CompareStartEndVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier
            IOpDataElement startAtrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.STRT_VOL).FirstOrDefault();
            IOpDataElement endAtrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.END_VOL).FirstOrDefault();

            // Make dictionary of <tier, start vol>
            var startVols = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.STRT_VOL).Select(de => new
            {
                Key = de.DimKey.FirstOrDefault().AtrbItemId,
                Value = de.AtrbValue.ToString()
            });
            var endVols = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.END_VOL).Select(de => new
            {
                Key = de.DimKey.FirstOrDefault().AtrbItemId,
                Value = de.AtrbValue.ToString()
            });

            Dictionary<int, string> startVolDict = startVols.ToDictionary(pair => pair.Key, pair => pair.Value);
            Dictionary<int, string> endVolDict = endVols.ToDictionary(pair => pair.Key, pair => pair.Value);

            // Safety pullout since vol tier rules are also run on approvals screen where tiers information is not pulled.  Skip tiers data check if there is no tiers data.
            if (startVolDict.Count == 0 || endVolDict.Count == 0) return;

            int prevStartVal = 0;
            int prevEndVal = 0;
            for (int tierKey = 1; tierKey <= 10; tierKey++)
            {
                int currStartVol = 0;
                int currEndVol = 0;
                bool isStartVolANumber = int.TryParse(startVolDict[tierKey], out currStartVol);
                bool isEndVolANumber = int.TryParse(endVolDict[tierKey], out currEndVol);
                if (!isEndVolANumber && endVolDict[tierKey].ToString().Equals("UNLIMITED", StringComparison.InvariantCultureIgnoreCase))
                {
                    currEndVol = int.MaxValue;
                }

                if (currStartVol == 0 && currEndVol == 0) continue; // Hit the end of populated values, skip these rows

                if (prevStartVal > currStartVol)
                {
                    AddTierValidationMessage(startAtrbWithValidation, "Start volume must be greater than previous tier start volume.", tierKey);
                }
                if (prevEndVal > currEndVol)
                {
                    AddTierValidationMessage(endAtrbWithValidation, "End volume must be greater than previous tier end volume.", tierKey);
                }
                if (currStartVol >= currEndVol)
                {
                    AddTierValidationMessage(endAtrbWithValidation, "End volume must be greater than start volume.", tierKey);
                }
                prevStartVal = currStartVol;
                prevEndVal = currEndVol;
            }
        }

        public static void ValidateTierNumber(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IEnumerable<IOpDataElement> tierNbrAtrbs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.TIER_NBR);
            int atrbMtxSid = Attributes.ALL_TIER_NM.DIM_SID;

            foreach (IOpDataElement atrb in tierNbrAtrbs)
            {
                int tier = atrb.DimKey.FirstOrDefault(mtx => mtx.AtrbID == atrbMtxSid).AtrbItemId;  // NOTE: "10" is the Tier's dim key. In thoery this shouldn't need to change

                decimal myTierNbr = 0;
                bool tierNumberValue = Decimal.TryParse(atrb.AtrbValue.ToString(), out myTierNbr); // Grab the expected dimensional value because TIER_NBR should match
                if (tierNumberValue && tier != myTierNbr)
                {
                    // Note that we could just fix the value here.  If we want a message, go back to atrbwithvalidation to attach message there, but this is cleaner.
                    atrb.AtrbValue = tier;
                }
            }
        }

        public static void ValidateTierRate(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateVolTieredAttribute(AttributeCodes.RATE.ToString(), "Rate must have a positive value.", IsGreaterOrEqualToZero, r, false, true, IsGreaterThanZero, "At least one rate must be greater than 0.");
        }

        public static void ValidateTieredQty(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateKitTieredDecimalAttribute(AttributeCodes.QTY.ToString(), "Qty must be a whole number.", IsWholeNumber, r);
        }

        public static void ValidateTierStartVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateVolTieredAttribute(AttributeCodes.STRT_VOL.ToString(), "Start Volume must be greater than 0.", IsGreaterThanZero, r);
        }

        public static void ValidateTierEndVol(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateVolTieredAttribute(AttributeCodes.END_VOL.ToString(), "End Volume must be greater than 0.", IsGreaterThanZero, r, true);
        }

        public static void ValidateTierQty(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;
            ValidateKitTieredDecimalAttribute(AttributeCodes.QTY.ToString(), "Quantity must be greater than 0.", IsGreaterThanZero, r);
        }

        public static void ValidateTierEcap(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            if (deNumTiers == null) return;

            // Get number of "tiers" from product, since we don't save NUM_OF_TIERS
            int numOfTiers = deNumTiers.AtrbValue.ToString().Count(f => f == ',') + 1;

            // KIT ECAP specific changes (Note that KIT ECAP is ECAP of tier -1)
            numOfTiers += 1;
            int offset = 2; // Note that the offset is now 2 to account for KIT ECAPs at tier -1

            ValidateTieredDecimalAttribute(AttributeCodes.ECAP_PRICE.ToString(), "ECAP must be greater than 0.", IsGreaterThanZero, r, numOfTiers, offset, false);
        }

        public static void ValidateVolTieredAttribute(string myAtrbCd, string validationMessage, Func<decimal, bool> validationCondition, MyOpRuleCore r, bool isEndVol = false, bool isValidateAtrbTotal = false, Func<decimal, bool> totalValidationCondition = null, string totalValidationMessage = null)
        {
            IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.NUM_OF_TIERS);
            if (deNumTiers == null || deNumTiers.AtrbValue.ToString() == string.Empty) return;

            int numOfTiers = int.Parse(deNumTiers.AtrbValue.ToString());

            ValidateTieredDecimalAttribute(myAtrbCd, validationMessage, validationCondition, r, numOfTiers, 0, isEndVol, isValidateAtrbTotal, totalValidationCondition, totalValidationMessage);
        }

        public static void ValidateKitTieredDecimalAttribute(string myAtrbCd, string validationMessage, Func<decimal, bool> validationCondition, MyOpRuleCore r, bool isValidateAtrbTotal = false, Func<decimal, bool> totalValidationCondition = null, string totalValidationMessage = null)
        {
            IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            if (deNumTiers == null) return;

            // Get number of "tiers" from product, since we don't save NUM_OF_TIERS
            // TODO: Ask Mahesh what logic is needed for separating products in PTR_USR_PRD... I think he said comma, +, /, &, "OR" but doublecheck
            int numOfTiers = deNumTiers.AtrbValue.ToString().Count(f => f == ',') + 1;

            ValidateTieredDecimalAttribute(myAtrbCd, validationMessage, validationCondition, r, numOfTiers, 1, false, isValidateAtrbTotal, totalValidationCondition, totalValidationMessage);
        }

        public static void ValidateTieredDecimalAttribute(string myAtrbCd, string validationMessage, Func<decimal, bool> validationCondition, MyOpRuleCore r, int numOfTiers, int tierOffset, bool isEndVol = false, bool isValidateAtrbTotal = false, Func<decimal, bool> totalValidationCondition = null, string totalValidationMessage = null)
        {
            IEnumerable<IOpDataElement> atrbs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == myAtrbCd); // NOTE: "10" is the Tier's dim key. In thoery this shouldn't need to change
            IOpDataElement atrbWithValidation = atrbs.FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            decimal totalOfAtrb = 0;

            // Validate and set validation message if applicable on each tier
            foreach (IOpDataElement atrb in atrbs)
            {
                if (atrb.DimKey.FirstOrDefault() != null)
                {
                    int tier = atrb.DimKey.FirstOrDefault().AtrbItemId;

                    if (tier >= (1 - tierOffset) && tier <= (numOfTiers - tierOffset))
                    {
                        if (string.IsNullOrWhiteSpace(atrb.AtrbValue.ToString()))
                        {
                            AddTierValidationMessage(atrbWithValidation, validationMessage, tier);
                            continue;
                        }

                        // unlimited end vol
                        if (isEndVol && (tier == numOfTiers) &&
                            atrb.AtrbValue.ToString().Equals("UNLIMITED", StringComparison.InvariantCultureIgnoreCase))
                        {
                            continue;
                        }

                        decimal safeParse = 0;
                        bool isNumber = Decimal.TryParse(atrb.AtrbValue.ToString(), out safeParse);
                        totalOfAtrb += safeParse;

                        // added this to prevent user from saving 0 as QTY breaking DSAs, only triggers for QTY and 0/improper values.
                        if (atrb.AtrbCd == AttributeCodes.QTY && safeParse == 0)
                        {
                            atrb.AtrbValue = 1;  // Just default it to 1 since QTY must be populated and at least 1 unit.
                            atrb.State = OpDataElementState.Modified; // Force it modified to save
                            continue; // Dispense with the QTY validation message filled in below.
                        }

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

            // Validation of totals
            if (isValidateAtrbTotal)
            {
                if (!totalValidationCondition(totalOfAtrb))
                {
                    foreach (IOpDataElement tieredObj in atrbs)
                    {
                        int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;
                        if (tier >= (1 - tierOffset) && tier <= (numOfTiers - tierOffset))
                        {
                            AddTierValidationMessage(atrbWithValidation, totalValidationMessage, tier);
                        }
                    }
                }
            }
        }

        private static void AddTierValidationMessage(IOpDataElement de, string msg, int tier = 1, params object[] args)
        {
            if (de == null) return;
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

        #endregion Tiered Validations

        public static void ValidateKitRebateBundleDiscount(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            // Get number of "tiers" from product, since we don't save NUM_OF_TIERS
            IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            if (deNumTiers == null) return;
            int numOfTiers = deNumTiers.AtrbValue.ToString().Count(f => f == ',') + 1;      //TODO: Investigate - isn't it possible for the user to use separators other than ","?

            IEnumerable<IOpDataElement> tieredObjs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE.ToString());
            IOpDataElement atrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString()).FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            decimal kitEcap = 0; // KIT ECAP = tier of "-1"
            decimal kitRebate = 0; // KIT Rebate = sum of all ecap prices - kitRebate
            decimal totalDiscountsSum = 0;

            // Get KIT ecap sum
            foreach (IOpDataElement tieredObj in tieredObjs)
            {
                if (tieredObj.DimKey.Count > 0)
                {
                    int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;

                    if (tier >= -1 && tier <= numOfTiers) // Only do this for kit level and used tier levels, exclude others
                    {
                        IOpDataElement ecapPrice = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE && de.DimKey.FirstOrDefault() != null && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
                        IOpDataElement qty = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.QTY.ToString() && de.DimKey.FirstOrDefault() != null && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
                        IOpDataElement discountPerLine = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString() && de.DimKey.FirstOrDefault() != null && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();

                        decimal ecapPriceSafeParse = 0;
                        decimal qtySafeParse = 0;
                        decimal discountSafeParse = 0;

                        if (ecapPrice == null || qty == null || discountPerLine == null)
                        {
                            // isRequired validations should catch these if needed
                            return;
                        }

                        Decimal.TryParse(ecapPrice.AtrbValue.ToString(), out ecapPriceSafeParse);
                        Decimal.TryParse(qty.AtrbValue.ToString(), out qtySafeParse);
                        Decimal.TryParse(discountPerLine.AtrbValue.ToString(), out discountSafeParse);

                        //// Qty check
                        //if (qtySafeParse > 1 && discountSafeParse == 0)
                        //{
                        //    AddTierValidationMessage(qty, "Qty must be 1 if Discount per Line is $0.", tier);
                        //}

                        // Kit ECAP
                        if (tier == -1)
                        {
                            // Only Kit Ecap is tier of -1
                            kitEcap = ecapPriceSafeParse;
                        }
                        else
                        {
                            // Any other tier
                            kitRebate += qtySafeParse * ecapPriceSafeParse;

                            // Calcuate total discount per line
                            totalDiscountsSum += (qtySafeParse * discountSafeParse);
                        }
                    }
                }
            }
            // KIT ECAP must = (sum of total dicount per line * Qty ) BUT ONLY if the later is > 0
            if (totalDiscountsSum > 0 && kitRebate - kitEcap != totalDiscountsSum)
            {
                foreach (IOpDataElement tieredObj in tieredObjs)
                {
                    int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;
                    if (tier >= 0 && tier < numOfTiers) // Because tiers are 0 based
                    {
                        AddTierValidationMessage(atrbWithValidation, "KIT Rebate must be equal to KIT sum of total discount per line.", tier);
                    }
                }
            }
        }

        public static void ValidateSubKitRebateBundleDiscount(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement hasSubkitDe = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.HAS_SUBKIT.ToString()).FirstOrDefault();
            string hasSubkit = hasSubkitDe?.AtrbValue.ToString();

            if (hasSubkit == "0" || hasSubkit == null || hasSubkit == "") return;

            IEnumerable<IOpDataElement> tieredObjs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE.ToString());
            IOpDataElement atrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString()).FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            decimal subkitEcap = 0; // SUBKIT ECAP = tier of "-2"
            decimal subkitStandaloneSum = 0; // SUBKIT Standalone Sum = sum of Primary and Secondary1 Ecaps
            decimal totalDiscountsSum = 0;

            // Get SUBKIT ecap sum
            foreach (IOpDataElement tieredObj in tieredObjs)
            {
                if (tieredObj.DimKey.Count > 0)
                {
                    int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;
                    if (tier == -2 || tier == 0 || tier == 1)   // subkit OR primary OR secondary1
                    {
                        IOpDataElement ecapPrice = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
                        IOpDataElement qty = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.QTY.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
                        IOpDataElement discountPerLine = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();

                        decimal ecapPriceSafeParse = 0;
                        decimal qtySafeParse = 0;
                        decimal discountSafeParse = 0;

                        if (ecapPrice == null || qty == null || discountPerLine == null)
                        {
                            return;
                        }

                        Decimal.TryParse(ecapPrice.AtrbValue.ToString(), out ecapPriceSafeParse);
                        Decimal.TryParse(qty.AtrbValue.ToString(), out qtySafeParse);
                        Decimal.TryParse(discountPerLine.AtrbValue.ToString(), out discountSafeParse);

                        if (tier == -2)
                        {
                            // Only SubKit Ecap is tier of -2
                            subkitEcap = ecapPriceSafeParse;
                        }
                        else
                        {
                            // Any other tier, namely Primary and Secondary1
                            subkitStandaloneSum += qtySafeParse * ecapPriceSafeParse;

                            // Calcuate total discount per line
                            totalDiscountsSum += (qtySafeParse * discountSafeParse);
                        }
                    }
                }
            }
            // SUBKIT ECAP must = (sum of total dicount per line * Qty ) of subkit eligible products BUT ONLY if there is a subkit rebate and only if total discount per line values is > 0
            if (totalDiscountsSum > 0 && subkitStandaloneSum != subkitEcap && subkitStandaloneSum - subkitEcap != totalDiscountsSum)
            {
                AddTierValidationMessage(atrbWithValidation, "Sub KIT Rebate must be equal to Sub KIT sum of total discount per line or zero.", 0);     //Assumption: Subkit Consists of Primary and Secondary1 Products
                AddTierValidationMessage(atrbWithValidation, "Sub KIT Rebate must be equal to Sub KIT sum of total discount per line or zero.", 1);     //Assumption: Subkit Consists of Primary and Secondary1 Products
            }
        }

        public static void CheckTenderSettings(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            string myRebateType = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);
            if (myRebateType != "TENDER") return;

            IOpDataElement de = r.Dc.GetDataElement(AttributeCodes.PROGRAM_PAYMENT);

            if (de == null) return;

            if (de.AtrbValue.ToString() == "Frontend YCS2")
            {
                de.AddMessage("Tender deals can not be Frontend YCS2.");
            }
        }

        public static void CheckForBadCapRemoval(params object[] args)
        {
            // If there are DEs for CAP/CAP_STRT_DT/CAP_END_DT that are removed or reset to bad values, over-ride them to prevent corrupt data into DB
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement myCap = r.Dc.GetDataElement(AttributeCodes.CAP);

            if (myCap != null && myCap.HasOrigValueChanged && String.IsNullOrEmpty(myCap.AtrbValue.ToString()))
            {
                myCap.AtrbValue = myCap.OrigAtrbValue;
            }
        }

        public static void CheckForBadCapDates(params object[] args)
        {
            // If there are DEs for CAP/CAP_STRT_DT/CAP_END_DT that are removed or reset to bad values, over-ride them to prevent corrupt data into DB
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement myCapStrtDt = r.Dc.GetDataElement(AttributeCodes.CAP_STRT_DT);
            IOpDataElement myCapEndDt = r.Dc.GetDataElement(AttributeCodes.CAP_END_DT);

            if (myCapStrtDt != null && myCapStrtDt.HasOrigValueChanged && (String.IsNullOrEmpty(myCapStrtDt.AtrbValue.ToString()) || myCapStrtDt.AtrbValue.ToString() == "1/1/1900"))
            {
                myCapStrtDt.AtrbValue = myCapStrtDt.OrigAtrbValue;
            }

            if (myCapEndDt != null && myCapEndDt.HasOrigValueChanged && (String.IsNullOrEmpty(myCapEndDt.AtrbValue.ToString()) || myCapEndDt.AtrbValue.ToString() == "1/1/1900"))
            {
                myCapEndDt.AtrbValue = myCapEndDt.OrigAtrbValue;
            }
        }

        public static void CheckTotalDollarAmount(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement myRebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            IOpDataElement totalDollarObj = r.Dc.GetDataElement(AttributeCodes.TOTAL_DOLLAR_AMOUNT);
            decimal totalDollarAmount = 0;

            if (totalDollarObj == null || myRebateType == null) return;

            Decimal.TryParse(totalDollarObj.AtrbValue.ToString(), out totalDollarAmount);

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

        public static void DefaultProgramAdditive(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            List<string> targetTypes = new List<string> { "NRE", "MDF" };

            IOpDataElement myRebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            IOpDataElement myCombType = r.Dc.GetDataElement(AttributeCodes.DEAL_COMB_TYPE);

            if (myRebateType.DcID < 0 && targetTypes.Contains(myRebateType.AtrbValue)) // Only do this check initially to default value.
            {
                myCombType.AtrbValue = "Additive";
            }
        }

        public static void CheckEcapAdjUnit(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            decimal parsedRebateType = 0;

            IOpDataElement adjEcapUnit = r.Dc.GetDataElement(AttributeCodes.ADJ_ECAP_UNIT);
            IOpDataElement rebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
            if (rebateType == null || adjEcapUnit == null) return;

            decimal.TryParse(adjEcapUnit.AtrbValue.ToString(), out parsedRebateType);

            if (String.Equals(rebateType.AtrbValue.ToString(), "ECAP ADJ", StringComparison.OrdinalIgnoreCase) && (parsedRebateType <= 0))
            {
                adjEcapUnit.AddMessage("Adjusted ECAP Units must have a positive value for ECAP Adj rebate types.");
            }
        }

        public static void ValidateKITSpreadsheetProducts(params object[] args) // PTR only rule
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            IOpDataElement dePrdUsr = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
            string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
            if (string.IsNullOrEmpty(prdJson)) return;  //this rule will not work at the wip grid level because it does not have access to product json

            int parsedQty = 0;
            IOpDataElement deQty = null;
            IOpDataElement atrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.QTY.ToString()).FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            ProdMappings items = null;
            int numOfL1s = 0;
            int numOfL2s = 0;

            try
            {
                prdJson = FixesHelpers.FixStructure(prdJson);
                items = JsonConvert.DeserializeObject<ProdMappings>(prdJson);

                // Rule: maximum 10 products allowed
                if (items.Count > 10)
                {
                    dePrdUsr.AddMessage("Too many products. Please remove products.");
                    return;
                }
                else if (items.Count == 1)
                {
                    dePrdUsr.AddMessage("KIT deals must contain at least 2 products.");
                    return;
                }

                foreach (KeyValuePair<string, IEnumerable<ProdMapping>> prdMapping in items)
                {
                    // Previous code used an index value for walking throug the dimension keys, however, items is a direct pull from JSON data and contains no indexing or dimensioning,
                    // and can come in basically random order unrelated to the walking index, so update is to force a product bucket lookup to get dimension, then apply it to QTY lookup.
                    IOpDataElement deProd = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.PRD_BCKT) && de.AtrbValue.ToString().ToUpper() == prdMapping.Key.ToUpper()).FirstOrDefault();
                    int deDimKey = deProd.DimKey.FirstOrDefault(d => d.AtrbID == 20).AtrbItemId;
                    deQty = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.QTY) && de.DimKey.FirstOrDefault().AtrbItemId == deDimKey).FirstOrDefault();
                    Int32.TryParse(deQty.AtrbValue.ToString(), out parsedQty);

                    foreach (ProdMapping prod in prdMapping.Value)
                    {
                        // Rule: CPU products must be Tray
                        if (prod.DEAL_PRD_TYPE.ToString().Equals("CPU", StringComparison.OrdinalIgnoreCase) && prod.MM_MEDIA_CD.ToString().Equals("BOX", StringComparison.OrdinalIgnoreCase))
                        {
                            dePrdUsr.AddMessage("Media Type of \"Box\" is not allowed for CPUs.");
                        }

                        // Rule: Up the L1 and L2 counts
                        if (prod.HAS_L1 >= 1)
                        {
                            // Rule: Each L1 can only have a Qty of 1
                            if (parsedQty > 1)
                            {
                                AddTierValidationMessage(atrbWithValidation, "L1 Products can only have a Qty of 1.", deDimKey);
                            }
                            numOfL1s += parsedQty;
                        }
                        else if (prod.HAS_L2 >= 1)
                        {
                            numOfL2s += parsedQty;
                        }

                        // Do valiation: maximum 2 L1s, or if 1 L1 then maximum one L2 allowed
                        if (numOfL1s > 2)
                        {
                            dePrdUsr.AddMessage("You can only have up to two L1s. Please check that your products and their Qty meet this requirement.");
                        }
                        else if (numOfL1s == 1 && numOfL2s > 1)
                        {
                            dePrdUsr.AddMessage("You have one L1, so you may only have up to one L2. Please check that your products and their Qty meet this requirement.");
                        }
                        else if (numOfL1s == 2 && numOfL2s >= 1)
                        {
                            dePrdUsr.AddMessage("You have two L1s, so you may not have any L2s. Please check that your products and their Qty meet this requirement.");
                        }

                    }
                }
            }
            catch (Exception)
            {
                dePrdUsr.AddMessage("Unable to read the selected products.  Please use the Product Selector to fix the issue.");
                return;
            }
        }

        public static void ValidateKITGridProducts(params object[] args)
        {
            MyOpRuleCore r = new MyOpRuleCore(args);
            if (!r.IsValid) return;

            int hasL1 = Int32.Parse(r.Dc.GetDataElementValueNull(AttributeCodes.HAS_L1, "0"));
            int hasL2 = Int32.Parse(r.Dc.GetDataElementValueNull(AttributeCodes.HAS_L2, "0"));

            //We assume that all kit deals are properly enforced to have at least a primary and one secondary - it doesn't make sense to have a single item kit after all.
            int qtyPrimary;
            int qtySecondary1;

            IOpDataElement deQty1 = null;
            IOpDataElement deQty2 = null;

            deQty1 = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.QTY) && de.DimKey.FirstOrDefault().AtrbItemId == 0).FirstOrDefault();
            deQty2 = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.QTY) && de.DimKey.FirstOrDefault().AtrbItemId == 1).FirstOrDefault();

            IOpDataElement atrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.QTY.ToString()).FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

            if (deQty1 != null) Int32.TryParse(deQty1.AtrbValue.ToString(), out qtyPrimary); else qtyPrimary = 0;
            if (deQty2 != null) Int32.TryParse(deQty2.AtrbValue.ToString(), out qtySecondary1); else qtySecondary1 = 0;

            if (hasL1 >= 1 && hasL2 >= 1)
            {
                if (qtyPrimary != 1)
                {
                    AddTierValidationMessage(atrbWithValidation, "L1 Products can only have a Qty of 1.", 0);
                }
                if (qtySecondary1 != 1)
                {
                    AddTierValidationMessage(atrbWithValidation, "You have one L1, so you may only have up to one L2. Please check that your products and their Qty meet this requirement.", 1);
                }
            }

            if (hasL1 >= 1 && hasL2 == 0)
            {
                if (qtyPrimary != 1)
                {
                    AddTierValidationMessage(atrbWithValidation, "L1 Products can only have a Qty of 1.", 0);
                }
                if (qtySecondary1 != 1 && hasL1 > 1)     //how do we check if second item is L1?  only want to run this if second product is also L1
                {
                    AddTierValidationMessage(atrbWithValidation, "L1 Products can only have a Qty of 1.", 1);
                }
            }
        }
    }
}