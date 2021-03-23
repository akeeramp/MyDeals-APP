using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.MyDeals.App;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;

namespace Intel.MyDeals.Helpers
{
    public class AntiForgeryValidate : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            OpCore op = OpAppConfig.Init();
            string envs = op.AppToken.OpEnvironment.EnvLoc.Location.ToString().ToLower();
            string cookieToken = "";
            string formToken = "";

            IEnumerable<string> tokenHeaders;
            if ((envs != "local" || envs != "itt" || envs != "utt" || envs != "cons") && actionContext.Request.Headers.TryGetValues("__RequestVerificationToken", out tokenHeaders))
            {
                string[] tokens = tokenHeaders.First().Split(':');
                if (tokens.Length == 2)
                {
                    cookieToken = tokens[0].Trim();
                    formToken = tokens[1].Trim();
                }
                System.Web.Helpers.AntiForgery.Validate(cookieToken, formToken);                
            }
            base.OnActionExecuting(actionContext);
        }
    }
}