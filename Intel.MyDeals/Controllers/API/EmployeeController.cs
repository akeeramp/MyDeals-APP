using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Linq;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Employees")]

    public class EmployeeController : BaseApiController
    {
        private readonly IEmployeesLib _employeeLib;

        public EmployeeController(IEmployeesLib employeeLib)
        {
            _employeeLib = employeeLib;
        }

        [Authorize]
        [Route("GetUsrProfileRole")]
        public IEnumerable<UsrProfileRole> GetUsrProfileRole()
        {
            return SafeExecutor(() => _employeeLib.GetUsrProfileRole(), "Unable to get User Profiles");
        }

        [Authorize]
        [Route("GetUserRolePermission")]
        public IEnumerable<UserRolePermission> GetUserRolePermission()
        {
            return SafeExecutor(() => _employeeLib.GetUserRolePermission(), "Unable to get User Role Permission");
        }

        // Have to modify to allow for querying / searching
        [Authorize]
        [Route("GetUserRolePermissionByFilter")]
        public IEnumerable<UserRolePermission> GetUserRolePermissionByFilter(int skipRows = 0, int takeRows = 25, string databaseUserName = null, string startDate = null, string endDate = null, int isFetchLatest = 0, string group = null, string filter = null)
        {
            return SafeExecutor(() => _employeeLib.GetUserRolePermissionsByFilter(databaseUserName: databaseUserName,
                                                                                  startDate: startDate, 
                                                                                  endDate: endDate, 
                                                                                  skipRows: skipRows, 
                                                                                  takeRows: takeRows, 
                                                                                  isFetchLatest: isFetchLatest,
                                                                                  group: group,
                                                                                  filter: filter), "Unable to get User Role Permission");
        }

        [Authorize]
        [Route("GetUsrProfileRoleByRoleCd/{strRoles}")]
        public IEnumerable<UsrProfileRole> GetUsrProfileRoleByRoleCd(string strRoles)
        {
            string[] lstRoles = strRoles.Split(',').Select(x => x.Trim()).ToArray();
            return SafeExecutor(() => _employeeLib.GetUsrProfileRoleByRoleCode(lstRoles), "Unable to get User Profiles");
        }

        //[Authorize]
        //[HttpGet]
        //[Route("FetchUserRolePermission")]
        //public IEnumerable<UserRolePermission> FetchUserRolePermission(int isFetchLatest)
        //{
        //    return SafeExecutor(() => _employeeLib.GetUserRolePermission(isFetchLatest: isFetchLatest), "Unable to get User Role Permission - Add New Record");
        //}
    }
}
