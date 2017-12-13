using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;

namespace Intel.MyDeals.Helpers
{
    public class AntiForgeryValidate : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            string cookieToken = "";
            string formToken = "";

            IEnumerable<string> tokenHeaders;
            if (actionContext.Request.Headers.TryGetValues("__RequestVerificationToken", out tokenHeaders))
            {
                string[] tokens = tokenHeaders.First().Split(':');
                if (tokens.Length == 2)
                {
                    cookieToken = tokens[0].Trim();
                    formToken = tokens[1].Trim();
                }
            }
            System.Web.Helpers.AntiForgery.Validate(cookieToken, formToken);

            base.OnActionExecuting(actionContext);
        }
    }
}