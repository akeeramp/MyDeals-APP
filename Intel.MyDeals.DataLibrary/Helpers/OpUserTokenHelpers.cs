using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary.Helpers
{
    public static class OpUserTokenHelpers
    {
        public static bool IsWwidInString(this OpUserToken opUserToken, string strName)
        {
            string theList = DataCollections.GetToolConstants()
                .Where(c => c.CNST_NM == strName)
                .Select(c => c.CNST_VAL_TXT)
                .FirstOrDefault();
            if (theList == null) return false;

            foreach (string strWwid in theList.Replace(" ", "").Split(','))
            {
                int wwid;
                if (!int.TryParse(strWwid, out wwid)) continue;
                if (wwid == opUserToken.Usr.WWID) return true;
            }

            return false;
        }


    }
}
