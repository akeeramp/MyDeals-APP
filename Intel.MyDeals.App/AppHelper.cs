using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using System.Web.Routing;
using Intel.Opaque;

namespace Intel.MyDeals.App
{
    public static class AppHelper
    {
        private static string GetSiteRoot()
        {
            string port = System.Web.HttpContext.Current.Request.ServerVariables["SERVER_PORT"];
            if (port == null || port == "80" || port == "443")
                port = "";
            else
                port = ":" + port;

            string protocol = System.Web.HttpContext.Current.Request.ServerVariables["SERVER_PORT_SECURE"];
            if (protocol == null || protocol == "0")
                protocol = "http://";
            else
                protocol = "https://";

            string sOut = protocol + System.Web.HttpContext.Current.Request.ServerVariables["SERVER_NAME"] + port + System.Web.HttpContext.Current.Request.ApplicationPath;

            if (sOut.EndsWith("/"))
            {
                sOut = sOut.Substring(0, sOut.Length - 1);
            }

            return sOut + HttpContext.Current.Request.CurrentExecutionFilePath;
        }

        public static ErrorControllerContent GenerateErrorContext(Exception ex, HttpContext httpContext)
        {

            var currentRouteData = RouteTable.Routes.GetRouteData(new HttpContextWrapper(httpContext));
            var currentController = " ";
            var currentAction = " ";

            if (currentRouteData != null)
            {
                if (!string.IsNullOrEmpty(currentRouteData.Values["controller"]?.ToString()))
                {
                    currentController = currentRouteData.Values["controller"].ToString();
                }

                if (!string.IsNullOrEmpty(currentRouteData.Values["action"]?.ToString()))
                {
                    currentAction = currentRouteData.Values["action"].ToString();
                }
            }
			
			OpLogPerf.Log(ex);

			RouteData routeData = new RouteData();
            var action = "Index";

            if (ex is HttpException)
            {
                var httpEx = ex as HttpException;

                switch (httpEx.GetHttpCode())
                {
                    case 401:
                    case 403:
                        action = "Access";
                        break;

                    case 408:
                        action = "Timeout";
                        break;

                    case 404:
                        action = "NotFound";
                        break;

                    // others if any

                    default:
                        action = "Index";
                        break;
                }
            }


            httpContext.ClearError();
            httpContext.Response.Clear();
            HttpException exception = ex as HttpException;
            httpContext.Response.StatusCode = exception?.GetHttpCode() ?? 500;
            httpContext.Response.TrySkipIisCustomErrors = true;
            routeData.Values["controller"] = "Error";
            routeData.Values["action"] = action;

            return new ErrorControllerContent
            {
                CurrentController = currentController,
                CurrentAction = currentAction,
                RequestContext = new RequestContext(new HttpContextWrapper(httpContext), routeData)
            };
        }

        public static void SetupDataAccessLib()
        {
            Configuration rootWebConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("/Intel.Mydeals");

            if (rootWebConfig.ConnectionStrings.ConnectionStrings.Count <= 0)
                throw new Exception("Unable to get the ConnectionString for the Database.");

            var connString = rootWebConfig.ConnectionStrings.ConnectionStrings["MyDealsConnectionString"];
            if (connString == null)
            {
                throw new MissingFieldException("WebConfig is missing the 'MyDealsConnectionString' entry.");
            }

            var env = rootWebConfig.AppSettings.Settings["Environment"];
            if (env == null)
            {
                throw new MissingFieldException("WebConfig is missing the 'Environment' entry.");
            }

            // JmsQ Configuration Settings - because Phil likes it this way...
            Dictionary<string, string> envConfigs = new Dictionary<string, string>();
            List<string> jmsConfigItems = new List<string> { "jmsServer", "jmsQueue", "jmsUID", "jmsPWD", "jmsResponseDir" };

            foreach (string jmsConfigItem in jmsConfigItems)
            {
                envConfigs.SetValue(rootWebConfig, jmsConfigItem);
            }

            BusinessLogic.BusinessLogic.InitializeDataLibrary(connString.ConnectionString, env.Value, envConfigs);
        }

        private static void SetValue(this Dictionary<string, string> envConfigs, Configuration rootWebConfig, string sKey)
        {
            var jms = rootWebConfig.AppSettings.Settings[sKey];
            if (jms == null) throw new MissingFieldException("WebConfig is missing the " + sKey + " entry.");
            envConfigs[sKey] = jms.Value;
        }

    }
}
