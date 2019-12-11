using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Linq;

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
        [Route("GetUsrProfileRoleByRoleCd/{strRoles}")]
        public IEnumerable<UsrProfileRole> GetUsrProfileRoleByRoleCd(string strRoles)
        {
            List<string> lstRoles = strRoles.Split(',').Select(x => x.Trim()).ToList();
            return SafeExecutor(() => _employeeLib.GetUsrProfileRole().Where(x => lstRoles.Contains(x.ROLE_NM)), "Unable to get User Profiles");
        }
    }
}
