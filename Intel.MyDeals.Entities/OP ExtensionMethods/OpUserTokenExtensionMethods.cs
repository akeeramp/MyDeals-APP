using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public static class OpUserTokenExtensionMethods
    {
        private static bool ObjToBool(object obj)
        {
            if (obj is bool)
            {
                return (bool) obj;
            }
            return false;
        }

        public static bool IsAdmin(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_ADMIN) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_ADMIN] ?? false);
        }
        public static bool IsFinanceAdmin(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_FINANCE_ADMIN) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_FINANCE_ADMIN] ?? false);
        }
        public static bool IsSuper(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_SUPER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] ?? false);
        }
        public static bool IsSuperSa(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_SUPER_SA) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER_SA] ?? false);
        }
        public static bool IsDeveloper(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_DEVELOPER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] ?? false);
        }
        public static bool IsTester(this OpUserToken opUserToken)
        {
            return opUserToken != null && opUserToken.Properties.ContainsKey(EN.OPUSERTOKEN.IS_TESTER) && ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] ?? false);
        }

        public static bool IsInvalidUser(this OpUserToken opUserToken)
        {
            return opUserToken.Usr.WWID <= 0;
        }

    }
}