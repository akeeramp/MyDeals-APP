using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BL
{
    public static class MetaDataExtensionMethods
    {

        // TODO: Move this to a meta extension file.
        public static int GetToolConstInt(this List<ToolConstants> cnst, string cnstLookup, int defaultValue = 0)
        {
            int constRetValue;
            if (!int.TryParse(cnst.GetToolConst(cnstLookup, defaultValue.ToString()), out constRetValue)) constRetValue = defaultValue;

            return constRetValue;
        }

        public static string GetToolConst(this List<ToolConstants> cnst, string cnstLookup, string defaultValue = "")
        {
            return cnst.Where(c => c.CNST_NM == cnstLookup).Select(c => c.CNST_VAL_TXT).FirstOrDefault() ?? defaultValue;
        }


    }
}
