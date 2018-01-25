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
			string payoutBasedOn = (item[AttributeCodes.PAYOUT_BASED_ON] != null) ? item[AttributeCodes.PAYOUT_BASED_ON].ToString() : "";
			string mrktSegValue = (item[AttributeCodes.MRKT_SEG] != null) ? item[AttributeCodes.MRKT_SEG].ToString() : "";
			DateTime dcItemStDt = DateTime.Parse(item[AttributeCodes.START_DT].ToString());
			string dcRebateType = (item[AttributeCodes.REBATE_TYPE] != null) ? item[AttributeCodes.REBATE_TYPE].ToString() : "";

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
				// UPDATE!!! Per Trang... we can default this to the start date (10/20/2017)

				if (mrktSegValue.IndexOf("Consumer Retail Pull") >= 0 || mrktSegValue == "All Direct Market Segments")
				{
					item[AttributeCodes.ON_ADD_DT] = item[AttributeCodes.START_DT];
				}
			}

			// Consumption Reason
			if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.CONSUMPTION_REASON)) && payoutBasedOn == "Consumption")
			{
				item[AttributeCodes.CONSUMPTION_REASON] = "None";
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
				string dcPrevSt = string.IsNullOrEmpty(deStr.PrevAtrbValue.ToString()) ? "" : DateTime.Parse(deStr.AtrbValue.ToString()).ToString("MM/dd/yyyy");
				if (string.IsNullOrEmpty(deStr.AtrbValue.ToString())) deStr.AtrbValue = dcSt;
				IOpDataElement deContractRsn = r.Dc.GetDataElement(AttributeCodes.BACK_DATE_RSN);
				// && dcPrevSt != dcItemSt  -- removed bacuse it was causing validation issues.
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
			if (string.IsNullOrEmpty(r.Dc.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON)) && item[AttributeCodes.PROGRAM_PAYMENT].ToString() != "Backend")
			{
				item[AttributeCodes.PAYOUT_BASED_ON] = "Billings";
			}

            if (item.ContainsKey(AttributeCodes.HAS_SUBKIT))
            {
                if (item[AttributeCodes.HAS_SUBKIT].ToString() == "0")
                {
                    // Clear out subkit attributes if user changes products to make it ineligible for subkits
                    item[AttributeCodes.ECAP_PRICE + "_____20_____2"] = null;
                } else
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
			string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
			string prdJsonIvalid = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_INVLD_PRD)) ?? "";
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
			var custs = DataCollections.GetCustomerDivisions().Where(c => c.CUST_NM_SID == custId && c.ACTV_IND).ToList();
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
			//if (!r.IsValid) return;

			//string mrktSegValue = r.Dc.GetDataElement(AttributeCodes.MRKT_SEG).AtrbValue.ToString();
			//IOpDataElement deOnAdDate = r.Dc.GetDataElement(AttributeCodes.ON_ADD_DT);
			//if (!r.HasExtraArgs) return;
			//int custId = (int)r.ExtraArgs[0];

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

		public static void RequiredServerDealType(params object[] args)
		{
			// US53204 - TENDER: Tender deal item 2. Server deal type-drop down single select.Mandatory only for server products. Leave blank by default.
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			string[] deProductCategoriesValue = r.Dc.GetDataElementValue(AttributeCodes.PRODUCT_CATEGORIES).Split(',');
			string deRebateTypeValue = r.Dc.GetDataElementValue(AttributeCodes.REBATE_TYPE);

			if (deRebateTypeValue == "TENDER" && deProductCategoriesValue.Contains("SvrWS"))
			{
				IOpDataElement deServerDealType = r.Dc.GetDataElement(AttributeCodes.SERVER_DEAL_TYPE);
				if (deServerDealType != null) deServerDealType.IsRequired = true;
			}
		}

		public static void ReadOnlyFrontendWithTracker(params object[] args)
		{
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			string deFrontendValue = r.Dc.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT);

			if (deFrontendValue == "Backend" || !r.Dc.HasTracker()) return;

			foreach (OpDataElement de in r.Dc.DataElements.Where(d => d.AtrbCd != AttributeCodes.NOTES))
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
			List<string> eligibleDropDowns = new List<string>
			{
				AttributeCodes.PAYOUT_BASED_ON,
				AttributeCodes.PROGRAM_PAYMENT,
				AttributeCodes.REBATE_TYPE,
				AttributeCodes.PROD_INCLDS
			};
			CheckDropDownValues(eligibleDropDowns, args);
		}

		public static void CheckDropDownValues(List<string> eligibleDropDowns, params object[] args)
		{
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			foreach (IOpDataElement de in r.Dc.GetDataElementsIn(eligibleDropDowns))
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
			string ptrStage = r.Dc.GetDataElementValue(AttributeCodes.PS_WF_STG_CD);
			var futureStage = r.Dc.GetNextStage("Redeal", DataCollections.GetWorkFlowItems(), ptrStage, OpDataElementType.PRC_ST);

			// if there isn't a future stage, then it isn't redealable
			// TO DO - WE NEED TO ADD IN PARENT PS STAGE FOR THIS CHECK
			if (futureStage == null && wipStage != WorkFlowStages.Active) return;

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

			// TO DO: Fix this later

			//var reason = "Redeal due to major change: \n";
			//if (r.Dc.DcID > 0)
			//{
			//    foreach (IOpDataElement de in changedDes.Union(changedIncreaseDes))
			//    {
			//        MyDealsAttribute atrb = onChangeItems.Union(onChangeIncreaseItems).Union(onChangeDecreaseItems).FirstOrDefault(a => a.ATRB_COL_NM == de.AtrbCd);
			//        if (atrb.DATA_TYPE_CD == "DATETIME")
			//        {
			//            reason += $"{atrb.ATRB_LBL} changed from {DateTime.Parse(de.OrigAtrbValue.ToString()):MM/dd/yyyy} to {DateTime.Parse(de.AtrbValue.ToString()):MM/dd/yyyy} \n";
			//        }
			//        else
			//        {
			//            reason += $"{atrb.ATRB_LBL} changed from {de.OrigAtrbValue} to {de.AtrbValue} \n";
			//        }
			//    }
			//}
			//else
			//{
			//    reason += "New deal/s have been added to this strategy.";
			//}

			//myDealsData[OpDataElementType.WIP_DEAL].Actions.Add(new MyDealsDataAction(DealSaveActionCodes.ADD_TO_TIMELINE, reason, 30));

			// NOTE: We need to set the WIP and the PS stage
			// WIP always is "Draft" and PS depends on the users workflow
			// NOTE 2: We do not set the Contract stage.  We will rely on the SP to sync that stage

			// set WIP Stages to Draft for a redeal if they already aren't there
		    if (r.Dc.GetAtrbValue(AttributeCodes.WF_STG_CD).ToString() != WorkFlowStages.Draft)
		    {
                r.Dc.SetAtrb(AttributeCodes.WF_STG_CD, WorkFlowStages.Draft);
                r.Dc.SetAtrb(AttributeCodes.PS_WF_STG_CD, OpUserStack.MyOpUserToken.Role.RoleTypeCd == RoleTypes.GA
                    ? WorkFlowStages.Requested
                    : WorkFlowStages.Draft);
            }

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

        #region Tiered Validations

		private static bool IsGreaterThanZero(double attrb)
		{
			return (attrb > 0);
		}

		private static bool IsGreaterOrEqualToZero(double attrb)
		{
			return (attrb >= 0);
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
			ValidateVolTieredAttribute(AttributeCodes.RATE.ToString(), "Rate must have a positive value.", IsGreaterOrEqualToZero, r);
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
			ValidateKitTieredDoubleAttribute(AttributeCodes.QTY.ToString(), "Quantity must have a positive value.", IsGreaterThanZero, r);
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

			ValidateTieredDoubleAttribute(AttributeCodes.ECAP_PRICE.ToString(), "ECAP must be greater than 0.", IsGreaterThanZero, r, numOfTiers, offset, false);
		}

		public static void ValidateVolTieredAttribute(string myAtrbCd, string validationMessage, Func<double, bool> validationCondition, MyOpRuleCore r, bool isEndVol = false)
		{
			IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.NUM_OF_TIERS);
			if (deNumTiers == null) return;

			int numOfTiers = int.Parse(deNumTiers.AtrbValue.ToString());

			ValidateTieredDoubleAttribute(myAtrbCd, validationMessage, validationCondition, r, numOfTiers, 0, isEndVol);
		}

		public static void ValidateKitTieredDoubleAttribute(string myAtrbCd, string validationMessage, Func<double, bool> validationCondition, MyOpRuleCore r)
		{
			IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
			if (deNumTiers == null) return;

			// Get number of "tiers" from product, since we don't save NUM_OF_TIERS
			// TODO: Ask Mahesh what logic is needed for separating products in PTR_USR_PRD... I think he said comma, +, /, &, "OR" but doublecheck
			int numOfTiers = deNumTiers.AtrbValue.ToString().Count(f => f == ',') + 1;

			ValidateTieredDoubleAttribute(myAtrbCd, validationMessage, validationCondition, r, numOfTiers, 1, false);
		}

		public static void ValidateTieredDoubleAttribute(string myAtrbCd, string validationMessage, Func<double, bool> validationCondition, MyOpRuleCore r, int numOfTiers, int tierOffset, bool isEndVol = false)
		{
			IEnumerable<IOpDataElement> atrbs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == myAtrbCd); // NOTE: "10" is the Tier's dim key. In thoery this shouldn't need to change
			IOpDataElement atrbWithValidation = atrbs.FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

			// Validate and set validation message if applicable on each tier
			foreach (IOpDataElement atrb in atrbs)
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

		public static void ValidateKitRebateBundleDiscount(params object[] args)
		{
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			// Get number of "tiers" from product, since we don't save NUM_OF_TIERS
			IOpDataElement deNumTiers = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
			if (deNumTiers == null) return;
			int numOfTiers = deNumTiers.AtrbValue.ToString().Count(f => f == ',') + 1;

			numOfTiers += 1; // Note that KIT ECAP is ECAP of tier -1
			int tierOffset = 2; // Note that the offset is now 2 to account for KIT ECAPs at tier -1
			
			IEnumerable<IOpDataElement> tieredObjs = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE.ToString());
			IOpDataElement atrbWithValidation = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString()).FirstOrDefault(); // We need to pick only one of the tiered attributes to set validation on, else we'd keep overriding the message value per tier

			double kitEcap = 0; // KIT ECAP = tier of "-1"
			double kitRebate = 0; // KIT Rebate = sum of all ecap prices - kitRebate
			double totalDiscountsSum = 0;

			// Get KIT ecap sum
			foreach (IOpDataElement tieredObj in tieredObjs)
			{
				if (tieredObj.DimKey.Count > 0) {
					int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;
					if (tier >= (1 - tierOffset) && tier <= (numOfTiers - tierOffset))
					{
						IOpDataElement ecapPrice = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.ECAP_PRICE.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
						IOpDataElement qty = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.QTY.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();
						IOpDataElement discountPerLine = r.Dc.GetDataElementsWhere(de => de.AtrbCd == AttributeCodes.DSCNT_PER_LN.ToString() && de.DimKey.FirstOrDefault().AtrbItemId == tier).FirstOrDefault();

						double ecapPriceSafeParse = 0;
						double qtySafeParse = 0;
						double discountSafeParse = 0;

						if (ecapPrice == null || qty == null || discountPerLine == null)
						{
							// isRequired validations should catch these if needed
							return;
						}

						Double.TryParse(ecapPrice.AtrbValue.ToString(), out ecapPriceSafeParse);
						Double.TryParse(qty.AtrbValue.ToString(), out qtySafeParse);
						Double.TryParse(discountPerLine.AtrbValue.ToString(), out discountSafeParse);

						if (tier == -1)
						{
							// Only Kit Ecap is tier of -1
							kitEcap = ecapPriceSafeParse;
						}
						else
						{
							// Any other tier
							kitRebate += ecapPriceSafeParse;

							// Calcuate total discount per line
							totalDiscountsSum += (qtySafeParse * discountSafeParse);
						}
					}
				}
			}
			// KIT ECAP must = (sum of total dicount per line * Qty ) BUT ONLY if the later is > 0
			if (totalDiscountsSum > 0 && (Math.Round(kitRebate,2) - Math.Round(kitEcap,2)) != Math.Round(totalDiscountsSum,2))
			{
				foreach (IOpDataElement tieredObj in tieredObjs)
				{
					int tier = tieredObj.DimKey.FirstOrDefault().AtrbItemId;
					var excludingKitOffset = tierOffset - 1; // Kit offset, but not including "-1" for KIT ecap rows
					if (tier >= (1 - excludingKitOffset) && tier <= (numOfTiers - excludingKitOffset))
					{
						AddTierValidationMessage(atrbWithValidation, "KIT Rebate must be equal to sum of total discount per line.", tier);
					}
				}
			}
		}

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

		public static void CheckEcapAdjUnit(params object[] args)
		{
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			double parsedRebateType = 0;

			IOpDataElement adjEcapUnit = r.Dc.GetDataElement(AttributeCodes.ADJ_ECAP_UNIT);
			IOpDataElement rebateType = r.Dc.GetDataElement(AttributeCodes.REBATE_TYPE);
			if (rebateType == null || adjEcapUnit == null) return;

			double.TryParse(adjEcapUnit.AtrbValue.ToString(), out parsedRebateType);

			if (String.Equals(rebateType.AtrbValue.ToString(), "ECAP ADJ", StringComparison.OrdinalIgnoreCase) && (parsedRebateType <= 0))
			{
				adjEcapUnit.AddMessage("Adjusted ECAP Units must have a positive value for ECAP Adj rebate types.");
			}
		}

		public static void ValidateKITSpreadsheetProducts(params object[] args)
		{
			MyOpRuleCore r = new MyOpRuleCore(args);
			if (!r.IsValid) return;

			IOpDataElement dePrdUsr = r.Dc.GetDataElement(AttributeCodes.PTR_USER_PRD);
			string prdJson = (r.Dc.GetDataElementValue(AttributeCodes.PTR_SYS_PRD)) ?? "";
			if (string.IsNullOrEmpty(prdJson)) return;  //this rule will not work at the wip grid level because it does not have access to product json

			int parsedQty = 0;
            IOpDataElement deQty = null;

			ProdMappings items = null;
			int numOfL1s = 0;
			int numOfL2s = 0;

            int prdMapIndex = 0;

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
                    deQty = r.Dc.GetDataElementsWhere(de => de.AtrbCdIs(AttributeCodes.QTY) && de.DimKey.FirstOrDefault().AtrbItemId == prdMapIndex).FirstOrDefault();
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
								AddTierValidationMessage(deQty, "L1 Products can only have a Qty of 1.", prdMapIndex);
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
							dePrdUsr.AddMessage("You have one L1, so you may only have up to one L2. Please check that your products and their Qty and their Qty meet this requirement.");
						}
                        else if (numOfL1s == 2 && numOfL2s >= 1)
                        {
                            dePrdUsr.AddMessage("You have two L1s, so you may not have any L2s. Please check that your products and their Qty and their Qty meet this requirement.");
                        }

                        prdMapIndex++;
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

            if (deQty1 != null) Int32.TryParse(deQty1.AtrbValue.ToString(), out qtyPrimary); else qtyPrimary = 0;
            if (deQty2 != null) Int32.TryParse(deQty2.AtrbValue.ToString(), out qtySecondary1); else qtySecondary1 = 0;

            if (hasL1 >= 1 && hasL2 >= 1)
            {
                if (qtyPrimary != 1)
                {
                    AddTierValidationMessage(deQty1, "L1 Products can only have a Qty of 1.", 0);
                }
                if (qtySecondary1 != 1)
                {
                    AddTierValidationMessage(deQty2, "You have one L1, so you may only have up to one L2. Please check that your products and their Qty and their Qty meet this requirement.", 1);
                }
            }

            if (hasL1 >= 1 && hasL2 == 0)
            {
                if (qtyPrimary != 1)
                {
                    AddTierValidationMessage(deQty1, "L1 Products can only have a Qty of 1.", 0);
                }
                if (qtySecondary1 != 1 && hasL1 > 1)     //how do we check if second item is L1?  only want to run this if second product is also L1
                {
                    AddTierValidationMessage(deQty2, "L1 Products can only have a Qty of 1.", 1);
                }
            }
        }
    }
}