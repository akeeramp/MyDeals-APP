using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Helpers;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class AccountsLib
    {
        public void SetUserAccessLevel(OpUserToken opUserToken)
        {
            var toolConstants = new ConstantLookupDataLib().GetAdminConstants();
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] = OpUserTokenHelpers.IsSuper(opUserToken, toolConstants);
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER_SA] = OpUserTokenHelpers.IsSuperSa(opUserToken, toolConstants);
            opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] = OpUserTokenHelpers.IsDeveloper(opUserToken, toolConstants);
            opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] = OpUserTokenHelpers.IsTester(opUserToken, toolConstants);

            // TODO remove when security is setup... for now hard code
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] = true;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER_SA] = true;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] = true;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] = true;
        }
    }
}