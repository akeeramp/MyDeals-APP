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
                newStage = WorkFlowStages.Working;
            }
            else if (opDeType == OpDataElementType.DEAL.ToString())
            {
                newStage = WorkFlowStages.Offer;
            }

            de.AtrbValue = newStage;
        }

    }
}