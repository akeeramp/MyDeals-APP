using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpUserTokenHelpers
    {
        public static bool IsSuper(this OpUserToken opUserToken)
        {
            // todo fix this
            return true;
            //return opUserToken.IsWwidInString(EN.OPUSERTOKEN.SUPER_LIST);
        }

        public static bool IsSuperSa(this OpUserToken opUserToken)
        {
            // todo fix this
            return true;
            //return opUserToken.IsSuper() && opUserToken.Role.RoleTypeCd == EN.EMPLOYEEROLE.SA;
        }

        public static bool IsDeveloper(this OpUserToken opUserToken)
        {
            // todo fix this
            return true;
            //return opUserToken.IsWwidInString(EN.OPUSERTOKEN.DEVELOPER_LIST);
        }

        public static bool IsTester(this OpUserToken opUserToken)
        {
            // todo fix this
            return true;
            //return opUserToken.IsWwidInString(EN.OPUSERTOKEN.TESTER_LIST);
        }

    }
}
