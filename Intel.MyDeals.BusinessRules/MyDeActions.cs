using System;
using System.Collections.Generic;
using System.Linq;
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
                BusinessLogicDeActions.AddValidationMessage(de, args[0]);
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
            List<string> validGeoValues = DataCollections.GetGeoData().Where(g => string.IsNullOrEmpty(g.CTRY_NM) && string.IsNullOrEmpty(g.RGN_NM)).Select(g => g.GEO_NM).ToList();
            foreach (string geo in geosList)
            {
                if (validGeoValues.All(x => (string.IsNullOrEmpty(x) ? ww : x) != geo))
                {
                    // now check for duplicates before throwing and error
                    string posMatch = validGeoValues.Where(g => g.ToUpper() == geo.ToUpper()).Select(g => g).FirstOrDefault();
                    if (string.IsNullOrEmpty(posMatch))
                    {
                        BusinessLogicDeActions.AddValidationMessage(de, geo + " is not a valid Geo.");
                    }
                    else
                    {
                        geoString = geoString.Replace(geo, posMatch);
                    }
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
                    BusinessLogicDeActions.AddValidationMessage(de, ww + " cannot be mixed with other geos in a blend geo.");
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
                    BusinessLogicDeActions.AddValidationMessage(de, geo + " can only have one associated target region.");
                }
                else
                {
                    geos.Add(geo);
                }
            }
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
            for (var s=0; s<userMrktSegs.Count; s++)
            {
                BasicDropdown dbSeg = allSegs.FirstOrDefault(m => m.DROP_DOWN.ToUpper() == userMrktSegs[s].ToUpper());
                if (dbSeg == null)  //no match
                    BusinessLogicDeActions.AddValidationMessage(de, userMrktSegs[s] + " is not a valid Market Segment.");
                else
                {
                    if (dbSeg.DROP_DOWN != null && userMrktSegs[s] != dbSeg.DROP_DOWN) //if we found a match but the user input is spelled punctuated differently (no ToUpper())
                    {
                        userMrktSegs[s] = dbSeg.DROP_DOWN; //set user input to how we have mrkt seg defined in system
                    }
                }
            }

            //"ALL" check
            if (userMrktSegs.Count > 1 && userMrktSegs.Contains("All"))
            {
                BusinessLogicDeActions.AddValidationMessage(de, "Market Segment ALL cannot be blended with any other Market Segment");
            }

            //"Embedded" check
            if (userMrktSegs.Count > 1)
            {
                foreach (string seg in userMrktSegs)
                {
                    if (validMrktEmbSubseg.FirstOrDefault(mrkt => mrkt.DROP_DOWN == seg) != null)
                    {
                        BusinessLogicDeActions.AddValidationMessage(de, "Embedded Market Segments cannot be blended with any other market segment.");
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
                BusinessLogicDeActions.AddValidationMessage(de, "'Non Corp' should not be individually selectable.");
            }

            string newVal = string.Join(", ", userMrktSegs);
            de.AtrbValue = newVal;
        }

    }
}