using Intel.MyDeals.Entities;
using Intel.Opaque;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IEmployeesLib
    {
        List<UsrProfileRole> GetUsrProfileRole();
        List<UsrProfileRole> GetUsrProfileRoleByRoleCode(string[] strRoleCode);
        OpMsg getSelfGrantUIAccess(string Idsid);

        List<ManageUsersInfo> GetManageUserData(int wwid);
        List<UserRolePermission> GetUserRolePermission(string databaseUserName=null, string startDate = null, string endDate = null, int isFetchLatest = 0);
        EmployeeUsrRolePermissionDetails GetUserRolePermissionsByFilter(UserRolePermissionFilter data);
    }
}