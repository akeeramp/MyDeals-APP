namespace Intel.MyDeals.Entities.Helpers
{
    public static class OpUserTokenHelpers
    {
        //private static bool IsWwidInString(OpUserToken opUserToken, string strName, List<AdminConstant> toolConstants)
        //{
        //    //new ConstantsLookupsLib().GetToolConstants()
        //    string theList = toolConstants
        //        .Where(c => c.CNST_NM == strName)
        //        .Select(c => c.CNST_VAL_TXT)
        //        .FirstOrDefault();
        //    if (theList == null) return false;

        //    foreach (string strWwid in theList.Replace(" ", "").Split(','))
        //    {
        //        int wwid;
        //        if (!int.TryParse(strWwid, out wwid)) continue;
        //        if (wwid == opUserToken.Usr.WWID) return true;
        //    }

        //    return false;
        //}

        //private static bool IsPropertySet(OpUserToken opUserToken, string strName)
        //{
        //    // TO DO - fix this string crap to bool.  Wish I had resharper...
        //    bool retValue = false;
        //    if (opUserToken.Properties[strName].ToString() == "1") retValue = true;
        //    return retValue;
        //}


        //public static bool IsSuper(OpUserToken opUserToken, List<AdminConstant> toolConstants)
        //{
        //    return IsPropertySet(opUserToken, EN.OPUSERTOKEN.IS_SUPER);
        //}

        //public static bool IsSuperSa(OpUserToken opUserToken, List<AdminConstant> toolConstants)
        //{
        //    if (opUserToken.Role.RoleTypeCd == RoleTypes.SA)
        //    {
        //        return IsPropertySet(opUserToken, EN.OPUSERTOKEN.IS_SUPER);
        //    }
        //    return false;
        //}

        //public static bool IsDeveloper(OpUserToken opUserToken, List<AdminConstant> toolConstants)
        //{
        //    return IsPropertySet(opUserToken, EN.OPUSERTOKEN.IS_DEVELOPER);
        //}

        //public static bool IsTester(OpUserToken opUserToken, List<AdminConstant> toolConstants)
        //{
        //    return IsPropertySet(opUserToken, EN.OPUSERTOKEN.IS_TESTER);
        //}
    }
}