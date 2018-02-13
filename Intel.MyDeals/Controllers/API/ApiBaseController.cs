using System;
using System.Net;
using System.Net.Http;
using Intel.Opaque;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    public abstract class BaseApiController : ApiController
    {
        /// <summary>
        /// Op core
        /// </summary>
        public OpCore op;

        public BaseApiController()
        {
            op = OpAppConfig.Init();
            //AppLib.InitAvm(op); Throwing error on server while uploading DbLogs for now disabling it..
        }

        /// <summary>
        /// Safely Executes an action and gracefully handles exceptions
        /// </summary>
        /// <param name="action"></param>
        public void SafeExecutor(Action action)
        {
            SafeExecutor(() =>
            {
                action();
                return 0;
            });
        }

        /// <summary>
        /// Safely Executes a function and gracefully handles exceptions
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="action">Task to safely execute.</param>
        /// <param name="errMsg">Optional error message to display to end user.</param>
        /// <returns>T</returns>
        public T SafeExecutor<T>(Func<T> action, string errMsg = "")
        {
            try
            {
				if (OpUserStack.MyOpUserToken.Usr.WWID <= 0)
				{
					// Re-populate WWID
					OpLog.Log("User WWID was not found. A server refresh likely happened between the time the user opened the page and the time the user clicked save. Now re-populating WWID.");
					OpUserToken opUserToken = new OpUserToken { Usr = { Idsid = OpUserStack.GetMyKey() } };
					AppLib.PopulateUserSettings(opUserToken);
				}

				return action();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);

                //responds with a simple status code for ajax call to consume.
                if (string.IsNullOrEmpty(errMsg))
                {
                    throw new HttpResponseException(HttpStatusCode.InternalServerError);
                }

                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(errMsg)
                });
            }
        }
    }
}