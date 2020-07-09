using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.OpDataCollectors;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// My DataElement Actions.  Most of the actions used will come from BusinessLogicDeActions
    /// This class will let you define MyDeals specific actions that might need to be performed
    /// </summary>
    public static partial class MyDeActions
    {

        public static void CheckDuplicateObjectTitle(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;
            bool result = new OpDataCollectorValidationDataLib().IsDuplicateTitle(de.DcType.IdToOpDataElementTypeString(), de.DcID, de.DcParentID, de.AtrbValue.ToString());
            if (result)
                de.AddMessage(args[0]);
        }

        public static void CheckInitialWorkFlow(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            string role = OpUserStack.MyOpUserToken.Role.RoleTypeCd;

            string opDeType = de.DcType.IdToOpDataElementTypeString().ToString();

            if (de.DcID > 0 || opDeType == OpDataElementType.PRC_TBL.ToString() || opDeType == OpDataElementType.PRC_TBL_ROW.ToString() || opDeType == OpDataElementType.ALL_OBJ_TYPE.ToString()) return;

            string newStage = string.Empty;

            if (opDeType == OpDataElementType.CNTRCT.ToString())
            {
                newStage = WorkFlowStages.InComplete;
            }
            else if (opDeType == OpDataElementType.PRC_ST.ToString())
            {
                newStage = WorkFlowStages.Draft;
                if (role == RoleTypes.GA) newStage = WorkFlowStages.Requested;
            }
            else if (opDeType == OpDataElementType.WIP_DEAL.ToString())
            {
                newStage = WorkFlowStages.Draft; // There are only 2 stages, Draft and Active
            }
            else if (opDeType == OpDataElementType.DEAL.ToString()) // Might have to set conditions here
            {
                newStage = WorkFlowStages.Offer;
            }

            de.AtrbValue = newStage;
        }

        public static void CheckSalesForceInitialWorkFlow(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            string opDeType = de.DcType.IdToOpDataElementTypeString().ToString();

            if (de.DcID > 0 || opDeType == OpDataElementType.PRC_TBL.ToString() || opDeType == OpDataElementType.PRC_TBL_ROW.ToString() || opDeType == OpDataElementType.ALL_OBJ_TYPE.ToString()) return;

            string newStage = string.Empty;

            if (opDeType == OpDataElementType.PRC_ST.ToString())
            {
                newStage = WorkFlowStages.Submitted;
            }
            else if (opDeType == OpDataElementType.WIP_DEAL.ToString())
            {
                newStage = WorkFlowStages.Draft; // There are only 2 stages, Draft and Active
            }

            de.AtrbValue = newStage;
        }

        public static void CheckConsumptionReason(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            string userConsumtionReason = de.AtrbValue.ToString();

            List<BasicDropdown> validConsumptionReasons = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == AttributeCodes.CONSUMPTION_REASON).ToList();

            BasicDropdown match = validConsumptionReasons.FirstOrDefault(m => m.DROP_DOWN.ToUpper() == userConsumtionReason.ToUpper());

            if (userConsumtionReason == null || userConsumtionReason == "")
            {
                if (!de.IsReadOnly) de.AddMessage("Cannot leave Consumption Reason blank.");
            }
            else if (match == null)  //no match
                de.AddMessage(userConsumtionReason + " is not a valid Consumption Reason.");
            else
            {
                if (match.DROP_DOWN != null && userConsumtionReason != match.DROP_DOWN) //if we found a match but the user input is spelled punctuated differently (no ToUpper())
                {
                    de.AtrbValue = match.DROP_DOWN; //set user input to how we have consumption reason defined in system
                }
            }
        }

        public static void CheckConsumptionReasonCmnt(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            if (de.AtrbValue.ToString() == "")
            {
                if (!de.IsReadOnly) de.AddMessage("Cannot leave Consumption Reason Comment blank if Consumption Reason is 'Other'.");
            }
        }

        public static void ClearNewDefaultValues(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            de.AtrbValue = "";
        }

        public static void ConsumptionLookbackPeriodCheck(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            int safeParse = 0;

            if (de.HasNoValue() || de.IsNegative() || !int.TryParse(de.AtrbValue.ToString(), out safeParse) || safeParse > 24)
                de.AddMessage("Consumption Lookback Period must be a whole number between 0 and 24.");
        }

        public static void CheckDealCombType(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            string userDealCombType = de.AtrbValue.ToString();

            List<BasicDropdown> validDealCombTypes = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == AttributeCodes.DEAL_COMB_TYPE).ToList();

            BasicDropdown match = validDealCombTypes.FirstOrDefault(m => m.DROP_DOWN.ToUpper() == userDealCombType.ToUpper());

            if (userDealCombType == null || userDealCombType == "")
            {
                if (!de.IsReadOnly) de.AddMessage("Cannot leave Group Type blank.");
            }
            else if (match == null)  //no match
                de.AddMessage(userDealCombType + " is not a valid Group Type.");
            else
            {
                if (match.DROP_DOWN != null && userDealCombType != match.DROP_DOWN) //if we found a match but the user input is spelled punctuated differently (no ToUpper())
                {
                    de.AtrbValue = match.DROP_DOWN; //set user input to how we have consumption reason defined in system
                }
            }
        }

        public static void CheckGeos(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            string ww = "Worldwide";
            string geoString = de.AtrbValue.ToString();
            string newGeoString = geoString;
            bool isBlendedGeo = geoString.Contains("[");

            // Format geo string to make into an array
            newGeoString = newGeoString.Replace("[", "");
            newGeoString = newGeoString.Replace("]", "");
            newGeoString = newGeoString.Replace(" ", "");

            List<string> geosList = newGeoString.Split(',').ToList();

            // Check that thse geos are valid
            Dictionary<string, string> validGeoValues = DataCollections.GetDropdownDict("Geo");
            foreach (string geo in geosList)
            {
                if (validGeoValues.ContainsKey(geo.ToUpper()))
                {
                    // set to db's stored value capitalization syntax
                    string posMatch = validGeoValues[geo.ToUpper()];
                    geoString = geoString.Replace(geo, posMatch);
                }
                else
                {
                    de.AddMessage(geo + " is not a valid Geo.");

                    if (args == null || args.Length < 2) continue;

                    var dc = (OpDataCollector)args[0];
                    dc?.Message.WriteMessage(OpMsg.MessageType.Error, geo + " is not a valid Geo.");

                    var myDealsData = (MyDealsData)args[1];
                    // TO DO: This is the point of tossing a "System.Collections.Generic.KeyNotFoundException: The given key was not present in the dictionary" message
                    // because item is not coming in as PRC_TBL_ROW, fixing it for PRC_TBL just blows up in pricingTable.controller.js line 47
                    myDealsData?[OpDataElementType.PRC_TBL_ROW].Messages.WriteMessage(OpMsg.MessageType.Error, geo + " is not a valid Geo.");
                }
            }

            // Blended GEO, can not mix WW and other Geo
            if (isBlendedGeo)
            {
                // Is "WorldWide" inside brackets?
                string wwRegex = @"\[((.*)" + ww + @"(.*))\]";
                bool isWorldWideInsideBlended = Regex.IsMatch(geoString, wwRegex);

                if (isWorldWideInsideBlended)
                {
                    de.AddMessage(ww + " cannot be mixed with other geos in a blend geo.");
                }
            }

            if (geoString != de.AtrbValue.ToString())
            {
                de.AtrbValue = geoString;
                de.State = OpDataElementState.Modified;
            }
        }

        public static void CheckTargetRegions(this IOpDataElement de, params object[] args)
        {
            string[] t_regions = de.AtrbValue.ToString().Split(',');
            List<string> geos = new List<string>();
            string geo;

            for (int i = 0; i < t_regions.Length; i++)
            {
                geo = t_regions[i].Split('/')[0].Trim();
                if (geos.Contains(geo))
                {
                    de.AddMessage(geo + " can only have one associated target region.");
                }
                else
                {
                    geos.Add(geo);
                }
            }
        }

        public static void UpdateConsumptionLookbackPeriodDate(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            de.AtrbValue = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss.fff");
        }

        public static void CheckMarketSegment(this IOpDataElement de, params object[] args)
        {
            if (de == null) return;

            List<string> userMrktSegs = de.AtrbValue.ToString().Split(',').Select(mrkt => mrkt.Trim()).ToList();

            List<BasicDropdown> validMrktEmbSubseg = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == AttributeCodes.MRKT_SUB_SEGMENT).ToList();
            List<BasicDropdown> validMrktNonCorp = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == AttributeCodes.MRKT_SEG_NON_CORP).ToList();
            List<BasicDropdown> validMrktSeg = DataCollections.GetBasicDropdowns().Where(d => d.ATRB_CD == AttributeCodes.MRKT_SEG).ToList();

            List<BasicDropdown> allSegs = validMrktEmbSubseg.ToList();
            allSegs.AddRange(validMrktNonCorp);
            allSegs.AddRange(validMrktSeg);

            //check to ensure user entries are valid market segments and set to db's stored value capitalization syntax
            for (var s = 0; s < userMrktSegs.Count; s++)
            {
                BasicDropdown dbSeg = allSegs.FirstOrDefault(m => m.DROP_DOWN.ToUpper() == userMrktSegs[s].ToUpper());
                if (dbSeg == null)  //no match
                    de.AddMessage(userMrktSegs[s] + " is not a valid Market Segment.");
                else
                {
                    if (dbSeg.DROP_DOWN != null && userMrktSegs[s] != dbSeg.DROP_DOWN) //if we found a match but the user input is spelled punctuated differently (no ToUpper())
                    {
                        userMrktSegs[s] = dbSeg.DROP_DOWN; //set user input to how we have mrkt seg defined in system
                    }
                }
            }

            //"All Direct Market Segments" check
            if (userMrktSegs.Count > 1 && userMrktSegs.Contains("All Direct Market Segments"))
            {
                de.AddMessage("Market Segment 'All Direct Market Segments' cannot be blended with any other Market Segment");
            }

            //"Embedded" check
            if (userMrktSegs.Count > 1)
            {
                foreach (string seg in userMrktSegs)
                {
                    if (validMrktEmbSubseg.FirstOrDefault(mrkt => mrkt.DROP_DOWN == seg) != null)
                    {
                        de.AddMessage("Embedded Market Segments cannot be blended with any other market segment.");
                    }
                }
            }

            //"NonCorp" check - // TODO: If Non Corp is chosen then user should not select a duplicate value outside of non corp selection.
            if (userMrktSegs.Contains("NON Corp"))
            {
                ////NONCORP is checked - make sure all NONCORP options are also included in user input
                //foreach (BasicDropdown mrkt in validMrktNonCorp)
                //{
                //    if (!userMrktSegs.Contains(mrkt.DROP_DOWN))
                //    {
                //        // user selected noncorp but did not include all noncorp options
                //        BusinessLogicDeActions.AddValidationMessage(de, "NonCorp Market Segment selected but " + mrkt.DROP_DOWN + " not included.");
                //    }
                //}

                //New requirement: "NON Corp" should not be put into spreadsheet if selected in kendo tree view.  It should only include non corp market segments, not "Non Corp" itself
                de.AddMessage("'Non Corp' should not be individually selectable.");
            }

            string newVal = string.Join(", ", userMrktSegs);
            de.AtrbValue = newVal;
        }

        public static void AddMessage(this IOpDataElement de, params object[] args)
        {
            if (de == null || args == null || args.Length != 1) return;

            string cd = de.AtrbCd;

            FieldInfo fieldInfo = typeof(Attributes).GetField(de.AtrbCd);
            if (fieldInfo != null)
            {
                cd = ((MyDealsAttribute)fieldInfo.GetValue(null)).ATRB_LBL;
            }

            var msg = string.Format(args[0].ToString(), cd);
            if (de.ValidationMessage.IndexOf(msg, StringComparison.Ordinal) < 0)
                de.ValidationMessage += msg + "\n";
        }

    }
}