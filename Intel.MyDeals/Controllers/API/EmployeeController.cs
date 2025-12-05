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

        // usr Role Permission Server side pagination Changes
        [Authorize]
        [Route("GetUserRolePermissionSSP")]
        [HttpPost]
        [AntiForgeryValidate]
        public EmployeeUsrRolePermissionDetails GetUserRolePermissionByFilter([FromBody] UserRolePermissionFilter data)
        {
            return SafeExecutor(() => _employeeLib.GetUserRolePermissionsByFilter(data), "Unable to get User Role Permission");
        }

        [Authorize]
        [Route("GetUsrProfileRoleByRoleCd/{strRoles}")]
        public IEnumerable<UsrProfileRole> GetUsrProfileRoleByRoleCd(string strRoles)
        {
            string[] lstRoles = strRoles.Split(',').Select(x => x.Trim()).ToArray();
            return SafeExecutor(() => _employeeLib.GetUsrProfileRoleByRoleCode(lstRoles), "Unable to get User Profiles");
        }

        [AntiForgeryValidate]
        [Authorize]
        [Route("GetEmployeeHistory/{wwid}")]
        [HttpGet]
        public List<EmpHistoryData> GetEmployeeHistory(int wwid)
        {
            return SafeExecutor(() => _employeeLib.GetEmployeeHistory(wwid)
                , $"Unable to get EmployeeHistory");
        }

    }
}
