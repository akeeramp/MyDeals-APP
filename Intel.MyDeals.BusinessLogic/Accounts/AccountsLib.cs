using Intel.MyDeals.DataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class AccountsLib
    {
        public void SetUserAccessLevel(OpUserToken opUserToken)
        {
            var toolConstants = new ConstantLookupDataLib().GetAdminConstants();
        }
    }
}