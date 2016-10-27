using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary.Security_Attributes
{
    public static class OpSecurity
    {

        public static bool ChkDealRules(ActionCodes actionCd)
        {
            return ChkDealRulesBase(actionCd, ObjSetTypeCodes.ALL, StageCodes.ALL);
        }

        public static bool ChkDealRules(ActionCodes actionCd, ObjSetTypeCodes objSetTypeCd, StageCodes stageCd)
        {
            return ChkDealRulesBase(actionCd, objSetTypeCd, stageCd);
        }

        private static bool ChkDealRulesBase(ActionCodes actionCd, ObjSetTypeCodes objSetTypeCd, StageCodes stageCd)
        {
            return true;
            //return DataCollections.GetSecurityWrapper()
            //    .ChkDealRules(objSetTypeCd, OpUserStack.MyOpUserToken.Role.RoleTypeCd, stageCd, actionCd);
        }

    }
}
