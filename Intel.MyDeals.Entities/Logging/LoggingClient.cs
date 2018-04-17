using System;
using System.Collections.Generic;
using System.Reflection;
using Intel.Opaque;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Intel.MyDeals.Entities.Logging
{
    public class LoggingClient
    {
        private static object LOCK_OBJECT = new object();
        private static LoggingClient _InstanceOptimal = null;

        private static LoggingClient Instance
        {
            get
            {
                return new LoggingClient();
            }
        }

        /// <summary>
        /// Try to get a Server-Side Instance first, if we can't, the try to get the client-side
        /// instance.  In either case, once we get one, we will cache it, which may cause some issues
        /// for mult-threaded/multi-user calls, so use carefully.
        /// </summary>
        public static LoggingClient InstanceOptimal()
        {
            return InstanceOptimal(true);
        }

        /// <summary>
        /// Try to get a Server-Side Instance first, if we can't, the try to get the client-side
        /// instance.
        /// </summary>
        /// <param name="cached">When true check to see if we have a cached instance to return, else always create new.</param>
        public static LoggingClient InstanceOptimal(bool cached)
        {
            if (_InstanceOptimal != null && cached)
            {
                return _InstanceOptimal;
            }

            try
            {
                OpLogPerf.Log("InstanceOptimal: CLIENT ACCESS MODE");

                if (cached)
                {
                    _InstanceOptimal = LoggingClient.Instance;
                }
                else
                {
                    return LoggingClient.Instance;
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(ex);
#endif
            }

            return _InstanceOptimal;
        }

        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler();
                handler.UseDefaultCredentials = true;
                HttpClient client = new HttpClient(handler)
                {
                    BaseAddress = new Uri(MyDealsWebApiUrl.ROOT_URL)
                };
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="messages"></param>
        public void UploadLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            MyDealsClient.PostAsJsonAsync(MyDealsWebApiUrl.UploadLogPerfLogs, new
            {
                Messages = OpSerializeHelper.ToJsonString(messages, true),
            });
        }
    }
}