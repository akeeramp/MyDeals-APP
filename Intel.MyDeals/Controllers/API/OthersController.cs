using System;
using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    public class OthersController : ApiController
    {
        OpCore op = OpAppConfig.Init();

        [Authorize]
        [Route("api/Others/GetDBTest")]
        public Dictionary<string, string> GetDBTest()
        {
            OpUserToken user = AppLib.InitAVM(op);
            return new OthersLib().PingDbDetails(user);
        }

        public string Exception405()
        {
            //incorrect routing will prevent this from ever being reached
            return "string";
        }

        [Authorize]
        [Route("api/Others/GetCSharpAPIException")]
        public string GetCSharpAPIException()
        {
            try
            {
                Exception x1 = new Exception("Example Uncaught Detailed Exception");
                throw x1;
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Others/GetCSharpException")]
        public string GetCSharpException()
        {
            try
            {
                return new OthersLib().CSharpException();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
            
        }

        [Authorize]
        [Route("api/Others/GetSQLException")]
        public string GetSQLException()
        {
            try
            {
                return new OthersLib().ExampleSQLException();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}
