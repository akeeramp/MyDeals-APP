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

        public static bool IsSuper(this OpUserToken opUserToken)
        {
            return ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER]);
        }
        public static bool IsSuperSa(this OpUserToken opUserToken)
        {
            return ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER_SA]);
        }
        public static bool IsDeveloper(this OpUserToken opUserToken)
        {
            return ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER]);
        }
        public static bool IsTester(this OpUserToken opUserToken)
        {
            return ObjToBool(opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER]);
        }

        public static bool IsInvalidUser(this OpUserToken opUserToken)
        {
            return opUserToken.Usr.WWID <= 0;
        }

    }
}