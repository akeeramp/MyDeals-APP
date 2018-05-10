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
using Intel.RulesEngine;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DevTests")]
    public class DevTestsController : BaseApiController
    {
        private readonly ICacheLib _cacheLib;

        public DevTestsController(ICacheLib _cacheLib)
        {
            this._cacheLib = _cacheLib;
        }

        [Authorize]
        [Route("GetDBTest")]
        public Dictionary<string, string> GetDBTest()
        {
            OpUserToken user = AppLib.InitAvm(op);
            return new DevTestsLib().PingDbDetails(user);
        }

        public string Exception405()
        {
            //incorrect routing will prevent this from ever being reached
            return "string";
        }

        /// <summary>
        /// Recycles the app pool
        /// </summary>
        [HttpGet]
        public string RecycleAppPool()
        {
            // Instead of clearing all cache recycle app pool, as some of our cache doesn't get refreshed even after cache clear(e.g. geo)
            // Recycle will keep our web servers healthy..
            System.Web.HttpRuntime.UnloadAppDomain();
            return $"App pool recycled at - {DateTime.Now}";
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

        [Authorize]
        [Route("GetRulesEngineTests")]
        public List<bool> GetRulesEngineTests()
        {
            List<bool> ret = new List<bool>();

            RuleBundle rb = new RuleBundle();
            ProductCategory pc = new ProductCategory();

            pc.DIV_NM = "TEST";
            pc.PRD_CAT_NM = "TEST2";

            RuleSet rs = new RuleSet();
            RuleItem ri = new RuleItem();
            List<RuleCondition> rcs = new List<RuleCondition>();
            RuleCondition rc1 = new RuleCondition();
            RuleCondition rc2 = new RuleCondition();
            RuleCondition rc3 = new RuleCondition();
            RuleCondition rc4 = new RuleCondition();
            RuleCondition rc5 = new RuleCondition();
            RuleCondition rc6 = new RuleCondition();

            rs.Category = "TEST";
            rs.Description = "TEST";
            rs.Id = 1;
            rs.Name = "TEST";
            rs.Order = 1;
            rs.RuleId = 1;
            rs.SubCategory = "TEST";
            rs.Trigger = "onTest";

            ri.Id = 1;
            ri.RuleConditionId = 1;
            ri.Tier = "C#";

            rc1.Id = 1;
            rc1.ConditionType = "AND";
            rc1.LeftExpressionType = "";
            rc1.LeftExpressionValue = "";
            rc1.Operator = "";
            rc1.RightExpressionType = "";
            rc1.RightExpressionValue = "";
            rc1.Order = 1;
            rc1.RuleId = 1;

            rc2.Id = 2;
            rc2.ConditionType = "CONDITION";
            rc2.LeftExpressionType = "Attribute";
            rc2.LeftExpressionValue = "DIV_NM";
            rc2.Operator = "=";
            rc2.RightExpressionType = "User Defined";
            rc2.RightExpressionValue = "TEST";
            rc2.Order = 2;
            rc2.RuleId = 1;

            rc3.Id = 3;
            rc3.ConditionType = "CONDITION";
            rc3.LeftExpressionType = "User Defined";
            rc3.LeftExpressionValue = "123";
            rc3.Operator = "<=";
            rc3.RightExpressionType = "User Defined";
            rc3.RightExpressionValue = "456";
            rc3.Order = 3;
            rc3.RuleId = 1;

            rc4.Id = 4;
            rc4.ConditionType = "OR";
            rc4.LeftExpressionType = "";
            rc4.LeftExpressionValue = "";
            rc4.Operator = "";
            rc4.RightExpressionType = "";
            rc4.RightExpressionValue = "";
            rc4.Order = 4;
            rc4.RuleId = 1;

            rc5.Id = 5;
            rc5.ConditionType = "CONDITION";
            rc5.LeftExpressionType = "User Defined";
            rc5.LeftExpressionValue = "TST B";
            rc5.Operator = "==";
            rc5.RightExpressionType = "User Defined";
            rc5.RightExpressionValue = "TST";
            rc5.Order = 5;
            rc5.RuleId = 1;

            rc6.Id = 6;
            rc6.ConditionType = "CONDITION";
            rc6.LeftExpressionType = "User Defined";
            rc6.LeftExpressionValue = "TEST2";
            rc6.Operator = "==";
            rc6.RightExpressionType = "Attribute";
            rc6.RightExpressionValue = "PRD_CAT_NM";
            rc6.Order = 6;
            rc6.RuleId = 1;

            List<int> rc1children = new List<int>();
            List<int> rc4children = new List<int>();
            rc1children.Add(2);
            rc1children.Add(3);
            rc1children.Add(4);
            rc1.ChildConditionIds = rc1children;
            rc4children.Add(5);
            rc4children.Add(6);
            rc4.ChildConditionIds = rc4children;
            rc2.ParentConditionId = 1;
            rc3.ParentConditionId = 1;
            rc4.ParentConditionId = 1;
            rc5.ParentConditionId = 4;
            rc6.ParentConditionId = 4;

            rcs.Add(rc1);
            rcs.Add(rc2);
            rcs.Add(rc3);
            rcs.Add(rc4);
            rcs.Add(rc5);
            rcs.Add(rc6);

            rb.RuleSet = rs;
            rb.RuleItem = ri;
            rb.RuleConditions = rcs;

            RulesEngine.RulesEngine re = new RulesEngine.RulesEngine();
            bool engineResult = re.RunRuleBundleWithValidation(rb, pc);

            ret.Add(engineResult);

            return ret;
        }
    }
}