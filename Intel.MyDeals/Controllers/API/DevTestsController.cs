using System;
using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System.Net;
using System.Web;
using Intel.MyDeals.Entities.Logging;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DevTests")]
    public class DevTestsController : BaseApiController
    {
        [Authorize]
        [Route("GetDBTest")]
        public Dictionary<string, string> GetDBTest()
        {
            OpUserToken user = AppLib.InitAVM(op);
            return new DevTestsLib().PingDbDetails(user);
        }

        public string Exception405()
        {
            //incorrect routing will prevent this from ever being reached
            return "string";
        }

        [Authorize]
        [Route("GetCSharpAPIException")]
        public string GetCSharpAPIException()
        {
            try
            {
                Exception x1 = new Exception("Example Uncaught Detailed Exception");
                throw x1;
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetCSharpException")]
        public string GetCSharpException()
        {
            try
            {
                return new DevTestsLib().CSharpException();
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }

        }

        [Authorize]
        [Route("GetSQLException")]
        public string GetSQLException()
        {
            try
            {
                return new DevTestsLib().ExampleSQLException();
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetClientHostTest")]
        public IEnumerable<string> GetClientHostTest()
        {
            try
            {

				//t1-3 are HOST names for where we deploy the c# code
				string t1 = System.Environment.MachineName;
                string t2 = HttpContext.Current.Server.MachineName;
                string t3 = System.Net.Dns.GetHostName();

                //hopefully client name
                string t4 = System.Environment.GetEnvironmentVariable("CLIENTNAME");

                //misc other checks
                //string t5 = "" + OpUserStack.MyOpUserToken.Usr.WWID;
                string t6 = OpCurrentConfig.CurrentURL;
	            string t7 = "JTEST";

				foreach (DbLogPerf perf in OpLogPerf.GetTypedWriters<DbLogPerf>())
				{
					//var test = perf.GetLogStack();
					t7 += "#" + perf + ": " + perf.LogStack.Count;
					foreach (var l in perf.LogStack)
					{
						t7 += " ... " + l.MSG;
					}
				}
	            string t8 = " " + OpLog.LogConfig.IsActive;
				string t9 = OpLog.LogConfig.MsgSrc;
	            var t10 = OpLogPerf.WiredIntoAppShutdown;
				string t11 = MyDealsWebApiUrl.ROOT_URL;
	            var t12 = HttpContext.Current.Session;
	            OpFileLogPerf test = new OpFileLogPerf();
				var t13 = test.GetFullFilePath();
				List<string> ret = new List<string>();
                ret.Add("System.Environment.MachineName: " + t1);
                ret.Add("HttpContext.Current.Server.MachineName: " + t2);
                ret.Add("System.Net.Dns.GetHostName(): " + t3);
                ret.Add("Environment.GetEnvironmentVariable('CLIENTNAME'): " + t4);
                //ret.Add("OpUserStack.MyOpUserToken.Usr.WWID: " + t5);
                ret.Add("OpCurrentConfig.CurrentURL: " + t6);
				ret.Add("OpCurrentConfig.CurrentURL: " + t7);
				ret.Add("Log config is active:  " + t8);
				ret.Add("Log config src: " + t9);
				ret.Add("WiredIntoAppShutdown: " + t10);
				ret.Add("MyDealsWebApiUrl RootURL: " + t11);
				ret.Add("FilePath: " + t13);

				return ret;
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}
