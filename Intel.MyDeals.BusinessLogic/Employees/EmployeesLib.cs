using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class EmployeesLib
    {
        #region Employees

        public EmployeeDetailData GetEmployeeDetail(string userIdentifier, string roles, string geos)
        {
            return new EmployeeDataLib().GetEmployeeDetail(userIdentifier, roles, geos);
        }

        public AppRoleLookup GetApplicationRoles()
        {
            return new EmployeeDataLib().GetApplicationRoles();
        }

        #endregion Employees

        public UserSetting GetUserSettings(OpUserToken opUserToken)
        {
            return new EmployeeDataLib().GetUserSettings(opUserToken);
        }

        public IEnumerable<UserPreference> GetUserPreference()
        {
            return new EmployeeDataLib().GetUserPreference();
        }

    }
}
