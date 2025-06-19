using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IEmployeeDataLib
    {
        List<UsrProfileRole> GetUsrProfileRole();

        List<UserRolePermission> GetUserRolePermission(string databaseUserName = null, string startDate = null, string endDate = null, int isFetchLatest = 0);

        EmployeeUsrRolePermissionDetails GetUserRolePermissionsByFilter(UserRolePermissionFilter data);
    }
}