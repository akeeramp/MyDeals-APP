using Intel.Opaque.Tools;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.Entities.Logging
{
    public class DbLogPerf : IOpLogPerf
    {
        private const int MAX_MESSAGE_SIZE = 255;
        private const int DEFAULT_MAX_LOGSTACK_SIZE = 30;
        private const int MAX_LOGSTACK_MESSAGE_SID = (1024 * 1024);
        private int MAX_LOGSTACK_SIZE = DEFAULT_MAX_LOGSTACK_SIZE;
        private static object LOCK_OBJECT = new object();
        private static object LOCK_THREAD_OBJECT = new object();

        public List<DbLogPerfMessage> LogStack = new List<DbLogPerfMessage>();

        private delegate void UploadLogPerfLogsDelegate(IEnumerable<DbLogPerfMessage> messages);

        public static string MachineName { set; get; }

        private List<IAsyncResult> FlushActions { set; get; }

        public DbLogPerf()
        {
            FlushActions = new List<IAsyncResult>();
            OpLogPerfHelper.WireUpAppShutdown();
        }

        public DbLogPerf(string machine_name) : this(machine_name, DEFAULT_MAX_LOGSTACK_SIZE)
        {
        }

        public DbLogPerf(string machine_name, int max_db_logstack)
            : this()
        {
            if (String.IsNullOrEmpty(MachineName) && !String.IsNullOrEmpty(machine_name))
            {
                MachineName = machine_name;
            }
            MAX_LOGSTACK_SIZE = max_db_logstack;
            OpLogPerfHelper.WireUpAppShutdown();
        }

        /// <summary>
        /// Determines if writer-specific (DB) logging is enabled and creates a DB writer if it is
        /// </summary>
        /// Note: Whether the writer's logging is enabled or not is determined by its name's presence in the writer's config string or parameter in OpLogPerfHelper.InitWriters()).
        /// Note: This function gets called by OpLogPerfHelper upon initializing writers via OpLogPerfHelper.InitWriters()
        public static IOpLogPerf ILogPerfFactory(string init_flag, Dictionary<string, object> init_params)
        {
            // Check that the init flag is asking for a db
            // To support extensibility, allow for multiple named factories in other assemblies/classes...
            string sf = (init_flag ?? "").Trim().ToUpper();
            if (!sf.StartsWith("DB")) { return null; }

            if (init_params != null)
            {
                object mn;
                if (init_params.TryGetValue("MachineName", out mn))
                {
                    string machineName = String.Format("{0}", mn);
                    if (!String.IsNullOrEmpty(machineName))
                    {
                        // Only use the non-default constructor if we have a valid machine name...
                        object maxLogStack;
                        int imb = DEFAULT_MAX_LOGSTACK_SIZE;
                        if (init_params.TryGetValue("max_db_logstack", out maxLogStack))
                        {
                            imb = OpConvertSafe.ToInt(maxLogStack, DEFAULT_MAX_LOGSTACK_SIZE);
                        }
                        return new DbLogPerf(machineName, imb);
                    }
                }
            }
            return new DbLogPerf();
        }

        public void Log(OpLogPerfMessage msg)
        {
            //return; // PE removed for performance testing
            // Change the OPLogPerfMessage into a DbLogPerfMessage, which essentially renames columns and add new columns that the db expects
            Log(new DbLogPerfMessage(msg));
        }

        public void Log(DbLogPerfMessage msg)
        {
            lock (LOCK_OBJECT)
            {
                // Add more details to log
                msg.CLNT_MCHN_NM = MachineName ?? "";
                msg.SRVR = System.Environment.MachineName;
                msg.LGN_NM = (Utils.ThreadUser ?? "").Trim().ToUpper();
                msg.USR_NM = (Utils.ThreadUser ?? "").Trim().ToUpper();

                //  TODO: Sometimes We get here with OpLog.LogConfig undefined.  Need to track down why.  For now, I added a workaround
                msg.MSG_SRC = OpLog.LogConfig == null ? "UNKNOWN MESSAGE" : OpLog.LogConfig.MsgSrc;

                if (msg.Size <= MAX_MESSAGE_SIZE)
                {
                    LogStack.Add(msg);
                }
                else
                {
                    var newMsg = msg.Clone(MAX_MESSAGE_SIZE);
                    LogStack.Add(newMsg);
                }
            }
            // If the Log Stack is full or the msg size is too large, then flush (upload to db and clear log stack)
            if (LogStack.Count() > MAX_LOGSTACK_SIZE || msg.Size > MAX_LOGSTACK_MESSAGE_SID)
            {
                Flush();
            }
        }

        /// <summary>
        /// Clear the log stack
        /// </summary>
        public void Clear()
        {
            lock (LOCK_OBJECT)
            {
                LogStack.Clear();
            }

            lock (LOCK_THREAD_OBJECT)
            {
                FlushActions.Clear();
            }
        }

        public void AddAttachment(string fullFilePath)
        {
            // Not Implemented
        }

        /// <summary>
        /// Asynchronously sends all the logs currently in the log stack to the writer (DB) to upload, then clears the log stack.
        /// </summary>
        public void Flush()
        {
            try
            {
                DbLogPerfMessage[] tb;
                lock (LOCK_OBJECT)
                {
                    if (!LogStack.Any())
                    {
                        return; // Only upload if we have log entries.
                    }

                    // Make a copy of the data w/i the lock for use out side of the lock
                    tb = LogStack.ToArray();

                    // Then reset the Log Stack for the next message.
                    LogStack = new List<DbLogPerfMessage>();
                }

                // Create a delegate to fire off the upload request. Brad: (my hope in the dynamic delegate was
                // that .net would stay alive as long at the delegates were in memory.  Didn't work out to be
                // the case, oh well.
                var dlgt = new UploadLogPerfLogsDelegate((ll) =>
                {
                    LoggingClient.InstanceOptimal().UploadLogPerfLogs(ll);
                });

                // Lock FlushActions
                lock (LOCK_THREAD_OBJECT)
                {
                    // Call UploadLogPerfLogs asynchronously via dlgt
                    // Do not wait for the thread to come back as we are on main thread. The web api call will fire the upload on a different thread,
                    // If it fails that will be logged Diagnostics
                    dlgt.BeginInvoke(tb, null, null);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        /// <summary>
        /// Returns true if it thinks there is a requset pending to the database, else false.
        /// </summary>
        public bool IsFlushing
        {
            get
            {
                if (FlushActions == null) { return false; }
#if DEBUG
                System.Diagnostics.Debug.WriteLine("Waiting for {0} DbLogPerf writes.", FlushActions.Count());
#endif
                return FlushActions.Any();
            }
        }

        /// <summary>
        /// Attempts to flush data with timeout. See Flush function for more info.
        /// </summary>
        /// Note that the Web UI does not use this function due to its dependency on async calls to upload.
        /// The web UI instead uses the global.asx's Application_End function to upload files on Shutdown.
        public void OnShutdown()
        {
            Flush();

            int max_flush_attempts = 10;

            // Try to clear out the queue and wait for all messages to be logged
            // But don't wait forever, just a few seconds...
            while (IsFlushing && max_flush_attempts > 0)
            {
                --max_flush_attempts;

                // PCL poor man's Thread.Sleep()
                using (EventWaitHandle tmpEvent = new ManualResetEvent(false))
                {
                    tmpEvent.WaitOne(TimeSpan.FromSeconds(1));
                }
            }
        }

        /// <summary>
        /// Checks if the writer wants additional details to log, such as threadID
        /// </summary>
        public bool AppendDetails
        {
            get { return true; }
        }

        public OpLogPerfMessage.FormatMode Format
        {
            get
            {
                return _Format;
            }
            set
            {
                _Format = value;
            }
        }

        private OpLogPerfMessage.FormatMode _Format = OpLogPerfMessage.FormatMode.TwoLine;

        public Func<string> MessageRider { set; get; }
    }
}