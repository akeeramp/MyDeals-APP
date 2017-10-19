using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.BusinessLogic;
using System.Collections.Generic;
using System.Web.Http;
using Intel.Opaque;

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
        public List<UserPreferences> Update(string category, string subCategory, string key, [FromBody]dynamic bodyParam)
        {
            return SafeExecutor(() => _userPreferencesLib.UpdateUserPreferences(category, subCategory, key, (string)bodyParam.value)
                , $"Unable to update UserPreferences");
        }

        [Authorize]
        [Route("SetOpUserToken")]
        [HttpPost]
        public OpMsg SetOpUserToken(OpUserTokenParameters data)
        {
            return SafeExecutor(() => new EmployeesLib().SetOpUserToken(data)
                , $"Unable to set UserOpToken");
        }

    }
}