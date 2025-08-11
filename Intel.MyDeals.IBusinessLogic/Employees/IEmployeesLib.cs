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
        EmployeeUsrRolePermissionDetails GetUserRolePermissionsByFilter(UserRolePermissionFilter data);
    }
}