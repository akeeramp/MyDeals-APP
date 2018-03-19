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
            SendExceptionEmail(ex);
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

        // TODO::TJE for debugging
        public static bool SendExceptionEmail(Exception ex)
        {
            // TODO Normally we would read config from env conscious config file... settly for hard codding until we can re-establish that
            //string env = DataAccess.Config.CurrentDatabaseOpEnvironment.EnvLoc.EnvType.Name.ToUpper().Trim();
            string mailToList = "Tory.J.Eneboe@intel.com";

            System.Text.StringBuilder body = new System.Text.StringBuilder();
            if (ex.InnerException != null && !string.IsNullOrWhiteSpace(ex.InnerException.Message))
                body.Append(ex.InnerException.Message + "\n\n" + ex.InnerException.StackTrace);
            else
                body.Append(ex.Message + "\n\n" + ex.StackTrace);

            // create mail message
            var myMail = new System.Net.Mail.MailMessage
            {
                Subject = "Exception",
                Body = body.ToString(),
                From = new System.Net.Mail.MailAddress("Tory.J.Eneboe@intel.com"),
                IsBodyHtml = true
            };
            myMail.To.Add(OpUtilities.ParseEmailList(mailToList, ","));

            using (var client = new System.Net.Mail.SmtpClient())
            {
                if (string.IsNullOrEmpty(client.Host))
                {
                    // TODO: Remove later...
                    // A bit hackish, but saves some troubleshooting...
                    client.Host = "mail.intel.com";
                }

                try
                {
                    client.Send(myMail);
                    return true;
                }
                catch (Exception)
                {
                    // Not sure how to handle this.  Throwing errors from a log is not critical, but would be nice to know if it fails

                    return false;
                }
            }
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