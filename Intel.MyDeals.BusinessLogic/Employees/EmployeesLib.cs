using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class EmployeesLib : IEmployeesLib
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

        public List<UsrProfileRole> GetUsrProfileRole()
        {
            return DataCollections.GetUsrProfileRole().Where(e => e.USR_ACTV_IND).OrderBy(e => e.LST_NM).ToList();
        }

        public IEnumerable<UserPreference> GetUserPreference()
        {
            return new EmployeeDataLib().GetUserPreference();
        }

        public OpMsg SetOpUserToken(OpUserTokenParameters data)
        {
            new EmployeeDataLib().SetOpUserToken(data);
            return new OpMsg("Role has been set");
        }

        public OpMsg GetOtherUserToken(int wwid, string idsid)
        {
            new EmployeeDataLib().GetOtherUserToken(wwid, idsid);
            return new OpMsg("Role has been fetched");
        }

        public List<ManageUsersInfo> GetManageUserData(int wwid)
        {
            //return new EmployeeDataLib().GetManageUserData(wwid).Where(e => e.ACTV_IND).OrderBy(e => e.LST_NM).ToList()
            return new EmployeeDataLib().GetManageUserData(wwid).ToList();
        }

    }
}