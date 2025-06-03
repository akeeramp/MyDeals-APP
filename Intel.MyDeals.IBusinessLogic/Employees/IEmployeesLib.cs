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
        List<UserRolePermission> GetUserRolePermission(string databaseUserName=null, string startDate = null, string endDate = null, int isFetchLatest = 0);
        List<UserRolePermission> GetUserRolePermissionsByFilter(string databaseUserName = null, string startDate = null, string endDate = null, int isFetchLatest = 0, int skipRows = 0, int takeRows = 25, string group = null, string filter = null);
    }
}