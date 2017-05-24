using System;
using System.Collections.Generic;
using System.Linq;
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

            if (de.DcID > 0 || de.AtrbValue.ToString() != string.Empty) return;

            string opDeType = de.DcType.IdToOpDataElementTypeString().ToString();
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
                newStage = WorkFlowStages.Draft;
            }
            else if (opDeType == OpDataElementType.DEAL.ToString())
            {
                newStage = WorkFlowStages.Offer;
            }

            de.AtrbValue = newStage;
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

            for (var s=0; s<userMrktSegs.Count; s++)
            {
                BasicDropdown dbSeg = allSegs.FirstOrDefault(m => m.DROP_DOWN.ToUpper() == userMrktSegs[s].ToUpper());
                if (dbSeg == null)
                    BusinessLogicDeActions.AddValidationMessage(de, userMrktSegs[s] + " is not a valid Market Segment.");
                else
                {
                    if (dbSeg.DROP_DOWN != null && userMrktSegs[s] != dbSeg.DROP_DOWN)
                    {
                        userMrktSegs[s] = dbSeg.DROP_DOWN;
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
                //NONCORP is checked - make sure all NONCORP options are also included in user input
                foreach (BasicDropdown mrkt in validMrktNonCorp)
                {
                    if (!userMrktSegs.Contains(mrkt.DROP_DOWN))
                    {
                        // user selected noncorp but did not include all noncorp options
                        BusinessLogicDeActions.AddValidationMessage(de, "NonCorp Market Segment selected but " + mrkt.DROP_DOWN + " not included.");
                    }
                }
            }

            string newVal = string.Join(", ", userMrktSegs);
            de.AtrbValue = newVal;
        }
    }
}