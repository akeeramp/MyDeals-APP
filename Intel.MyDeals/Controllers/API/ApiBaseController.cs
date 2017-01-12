using System;
using System.Net;
using System.Net.Http;
using Intel.Opaque;
using System.Web.Http;

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
