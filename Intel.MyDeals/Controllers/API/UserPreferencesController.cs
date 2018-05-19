using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.BusinessLogic;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.Opaque;
using Intel.MyDeals.Helpers;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/UserPreferences")]
    public class UserPreferencesController : BaseApiController
    {
        private readonly IUserPreferencesLib _userPreferencesLib;

        public UserPreferencesController(IUserPreferencesLib userPreferencesLib)
        {
            this._userPreferencesLib = userPreferencesLib;
        }

        [Authorize]
        [Route("Get/{category}/{subCategory}")]
        [HttpGet]
        public List<UserPreferences> Get(string category, string subCategory)
        {
            return SafeExecutor(() => _userPreferencesLib.GetUserPreferences(category, subCategory)
                , $"Unable to get UserPreferences"
            );
        }

        [Authorize]
        [Route("Update/{category}/{subCategory}/{key}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<UserPreferences> Update(string category, string subCategory, string key, [FromBody]dynamic bodyParam)
        {
            return SafeExecutor(() => _userPreferencesLib.UpdateUserPreferences(category, subCategory, key, (string)bodyParam.value)
                , $"Unable to update UserPreferences");
        }

        [Authorize]
        [Route("SetOpUserToken")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsg SetOpUserToken(OpUserTokenParameters data)
        {
            return SafeExecutor(() => new EmployeesLib().SetOpUserToken(data)
                , $"Unable to set UserOpToken");
        }

        #region Manager User Calls

        private readonly ICustomerLib _customerLib;

		[Authorize]
		[Route("GetManageUserData/{wwid}")]
		public List<ManageUsersInfo> GetManageUserData(int wwid)
		{
			return SafeExecutor(() => new EmployeesLib().GetManageUserData(wwid)
				, $"Unable to GetManageUserData");
		}

		[Authorize]
		[Route("GetManageUserGeos/{wwid}")]
		public List<string> GetManageUserGeos(int wwid)
		{
			return SafeExecutor(() =>  new EmployeesLib().GetManageUserData(wwid).Where(x => x.EMP_WWID == wwid).FirstOrDefault().USR_GEOS.Split(',').ToList()				
				, $"Unable to GetManageUserGeos");
		}

		[Authorize]
        [Route("GetManageUserDataGetCustomers/{getCachedResult:bool?}")]
        public IEnumerable<CustomerDivision> GetManageUserDataGetCustomers(bool getCachedResult = true)
        {
            return SafeExecutor(() => new EmployeesLib().GetManageUserDataGetCustomers()
                , "Unable to GetManageUserDataGetCustomers"
            );
        }

        [Authorize]
        [Route("GetManageUserDataGetCustomersInGeos")]
        [HttpPost]
        [AntiForgeryValidate]
        public IEnumerable<CustomerDivision> GetManageUserDataGetCustomersInGeos(List<string> geos)
        {
            return SafeExecutor(() => new EmployeesLib().GetManageUserDataGetCustomers(geos)
                , "Unable to GetManageUserDataGetCustomersInGeos"
            );
        }

        [AntiForgeryValidate]
        [Authorize]
        [Route("SetManageUserData")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsg SetManageUserData(EmployeeCustomers data)
        {
            return SafeExecutor(() => new EmployeesLib().SetManageUserData(data)
                , $"Unable to set ManageUserData");
        }

        [Authorize]
        [Route("ApplyForCustomers")]
        [HttpPost]
        [AntiForgeryValidate]
        public OpMsg ApplyForCustomers(EmployeeEmailCustomers data)
        {
            return SafeExecutor(() => new EmployeesLib().ApplyForCustomers(data)
                , $"Unable to Apply for Customer Accounts");
        }

        #endregion

    }
}