using System;
using System.Collections.Generic;
using System.Reflection;
using Intel.Opaque;

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

        public void UploadLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            var onAsyncWait = MyDealsWebApiUrl.WebApi;
            onAsyncWait.EnableLogging = false;

            // Send data to Presentation Layer's API Controller because we can't reference DataLayer on Entity layer (circular reference error)
            bool success = onAsyncWait.Post<bool>(
                    MyDealsWebApiUrl.UploadLogPerfLogs,
                    "",
                    new
                    {
                        Messages = OpSerializeHelper.ToJsonString(messages, true)
                    },
                    false,
                    false
                    );
        }
    }
}