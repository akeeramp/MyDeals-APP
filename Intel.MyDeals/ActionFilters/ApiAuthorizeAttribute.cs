using Intel.MyDeals.App;
using Intel.Opaque;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.ActionFilters
{
    /// <summary>
    /// TODO: We need to write a similar authorize attribute for MVC, where we want to redirect user to access denied page,
    /// </summary>
    public class ApiAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        private string _responseReason = "";

        /// <summary>
        /// Op core
        /// </summary>
        private OpCore op;

        /// <summary>
        /// Allow for developers
        /// </summary>
        public bool AuthorizeDeveloper { get; set; }

        public ApiAuthorizeAttribute()
        {

        }

        //TODO: Add other authorization properties IsSuperSA, IsSuper etc. And check if we need to log these requests
        /// <summary>
        ///
        /// </summary>
        /// <param name="actionContext"></param>
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            if (!string.IsNullOrEmpty(_responseReason))
                actionContext.Response.ReasonPhrase = _responseReason;
        }

        /// <summary>
        /// Get the attributes from the custom authorize attribute(Implementation for developer in place)
        /// </summary>
        /// <param name="descriptor"></param>
        /// <returns></returns>
        private IEnumerable<ApiAuthorizeAttribute> GetApiAuthorizeAttributes(HttpActionDescriptor descriptor)
        {
            return descriptor.GetCustomAttributes<ApiAuthorizeAttribute>(true)
                .Concat(descriptor.ControllerDescriptor.GetCustomAttributes<ApiAuthorizeAttribute>(true));
        }

        private bool HasAccess()
        {
            bool result = true;
            // TODO: Once the OpAppConfig properties are set read from them, enhance the logic to handle other roles
            OpCore op = OpAppConfig.Init();
            OpUserToken user = AppLib.InitAVM(op);

            result = user.IsDeveloper();
            return result;
        }

        /// <summary>
        /// Check if logged in user is authorized to access this api
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            //logic for check whether we have an attribute with AuthorizeDeveloper = true e.g [AuthorizeDeveloper(true)]
            if (AuthorizeDeveloper
                || GetApiAuthorizeAttributes(actionContext.ActionDescriptor).Any(x => x.AuthorizeDeveloper))
            {
                //checking against our custom OpAppConfig goes here
                if (!this.HasAccess())
                {
                    this.HandleUnauthorizedRequest(actionContext);
                    _responseReason = "Access Denied";
                    return false;
                }
            }

            return base.IsAuthorized(actionContext);
        }
    }
}