using Intel.MyDeals.DataLibrary.OpDataCollectors;
using Intel.MyDeals.Entities;
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

    }
}