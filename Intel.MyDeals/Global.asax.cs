using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Controllers;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;
using System.Web.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

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
            UnityConfig.RegisterComponents();
            AppHelper.SetupDataAccessLib();

            AntiForgeryConfig.SuppressXFrameOptionsHeader = true;            
            // Init log writers
            OpLogPerfHelper.InitWriters("DEBUG:DB:EVENTLOG:FILE:EMAILEX"); // TODO: Get this string of writers from db or config

            JsonSerializerSettings jSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                DateFormatString = "MM/dd/yyyy hh:mm:ss"
            };
            jSettings.Converters.Add(new MyDateTimeConvertor());
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings = jSettings;

            var dateTimeConverter = new IsoDateTimeConverter
            {
                DateTimeFormat = "MM/dd/yyyy hh:mm:ss"
            };

            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.Converters.Add(dateTimeConverter);
            
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("x-frame-options", "DENY");            
        }

        private void Application_Error(Object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError();
            ErrorControllerContent errCon = AppHelper.GenerateErrorContext(ex, ((WebApiApplication)sender).Context);

            if (ex.Message.Contains("You do not have access to this site"))
            {
                errCon.CurrentController = "Error";
                errCon.CurrentAction = "Access";
                errCon.RequestContext.RouteData.Values["action"] = "Access";
            }

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
			LoggingLib loglib = new LoggingLib();

			// Upload db logs
			foreach (DbLogPerf perf in OpLogPerf.GetTypedWriters<DbLogPerf>())
			{
				loglib.UploadDbLogPerfLogs(perf.LogStack);
				perf.Clear();
			}
		}

        public class MyDateTimeConvertor : DateTimeConverterBase
        {
            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                return DateTime.Parse(reader.Value.ToString());
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                DateTime date = (DateTime)value; 
                if ((DateTime)value == DateTime.MinValue)
                {
                    date = new DateTime(1900, 1, 1, 0, 0, 0, 0);
                }
                
                string strDate = ((date.Hour == 0 && date.Minute == 0) || (date.Hour == 23 && date.Minute == 59))
                    ? $"{date.Month}/{date.Day}/{date.Year}"
                    : $"{date.Month}/{date.Day}/{date.Year} {date.Hour}:{date.Minute}:{date.Second}.{date.Millisecond}";
                writer.WriteValue(strDate);
            }
        }
    }
}
