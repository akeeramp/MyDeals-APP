using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.Entities.Helpers
{
    public static class OpUserTokenHelpers
    {
        private static bool IsWwidInString(OpUserToken opUserToken, string strName, List<ToolConstants> toolConstants)
        {
            //new ConstantsLookupsLib().GetToolConstants()
            string theList = toolConstants
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

        public static bool IsSuper(this OpUserToken opUserToken, List<ToolConstants> toolConstants)
        {
            return IsWwidInString(opUserToken, EN.OPUSERTOKEN.SUPER_LIST, toolConstants);
        }

        public static bool IsSuperSa(this OpUserToken opUserToken, List<ToolConstants> toolConstants)
        {
            return IsSuper(opUserToken, toolConstants) && opUserToken.Role.RoleTypeCd == EN.EMPLOYEEROLE.SA;
        }

        public static bool IsDeveloper(this OpUserToken opUserToken, List<ToolConstants> toolConstants)
        {
            return IsWwidInString(opUserToken, EN.OPUSERTOKEN.DEVELOPER_LIST, toolConstants);
        }

        public static bool IsTester(this OpUserToken opUserToken, List<ToolConstants> toolConstants)
        {
            return IsWwidInString(opUserToken, EN.OPUSERTOKEN.TESTER_LIST, toolConstants);
        }
    }
}
