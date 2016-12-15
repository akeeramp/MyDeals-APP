using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Intel.MyDeals.App;
using Intel.MyDeals.Controllers;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            AppHelper.SetupDataAccessLib();

			// Init log writers
			OpLogPerfHelper.InitWriters("DEBUG:DB");
		}


        void Application_Error(Object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError();
            ErrorControllerContent errCon = AppHelper.GenerateErrorContext(ex, ((WebApiApplication)sender).Context);

            var controller = new ErrorController
            {
                ViewData =
                {
                    Model = new HandleErrorInfo(ex, errCon.CurrentController, errCon.CurrentAction)
                }
            };

            ((IController)controller).Execute(errCon.RequestContext);
        }


	    protected void Application_End()
	    {
			OpLogPerf.OnShutdown();
	    }
    }
}
