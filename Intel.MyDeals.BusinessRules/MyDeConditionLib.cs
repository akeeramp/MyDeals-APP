using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.BusinessRules
{
    /// <summary>
    /// My DataElement Conditions.  Most of the actions used will come from BusinessLogicDeConditions
    /// This class will let you define MyDeals specific conditions that might need to be performed
    /// </summary>
    public static class MyDeConditionLib
    {
        //Sample
        //public static bool IsPositive(this IOpDataElement de)
        //{
        //    {
        //        if (de.AtrbValue.ToString() == string.Empty) return true;
        //        return OpConvertSafe.ToDouble(de.AtrbValue.ToString().Replace("$", "")) > 0;
        //    }
        //}
    }
}