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

        [Authorize]
        [Route("GetUsrProfileRoleByRoleCd/{strRoles}")]
        public IEnumerable<UsrProfileRole> GetUsrProfileRoleByRoleCd(string strRoles)
        {
            string[] lstRoles = strRoles.Split(',').Select(x => x.Trim()).ToArray();
            return SafeExecutor(() => _employeeLib.GetUsrProfileRoleByRoleCode(lstRoles), "Unable to get User Profiles");
        }


        [Authorize]
        [AntiForgeryValidate]
        [HttpPost]
        [Route("PostUserRolePermission")]
        public IEnumerable<UserRolePermission> PostUserRolePermission([FromBody] PostUserRolePermission userFormData)
        {
            return SafeExecutor(() => _employeeLib.GetUserRolePermission(userFormData.DatabaseUserName, userFormData.StartDate, userFormData.EndDate), "Unable to get User Role Permission");
        }

        [Authorize]
        [HttpGet]
        [Route("FetchUserRolePermission")]
        public IEnumerable<UserRolePermission> FetchUserRolePermission(int isFetchLatest)
        {
            return SafeExecutor(() => _employeeLib.GetUserRolePermission(isFetchLatest: isFetchLatest), "Unable to get User Role Permission - Add New Record");
        }
    }
}
