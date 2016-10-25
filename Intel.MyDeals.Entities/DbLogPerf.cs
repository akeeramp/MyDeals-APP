using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Intel.Opaque;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities
{
    public class DbLogPerf : IOpLogPerf
    {
        public enum DbLogPerfMode
        {
            Unknown = 0,

            PerfOnly = 1,
            Small = 2,
            Full = 3
        }

        public DbLogPerf() 
        {
            FlushActions = new List<IAsyncResult>();
            BigMode = DbLogPerfMode.Small;
        }

        public DbLogPerf(string machine_name) : this(machine_name, DEFAULT_MAX_BUFFER_SIZE) { }
        public DbLogPerf(string machine_name, int max_db_buffer, DbLogPerfMode log_mode = DbLogPerfMode.Small)
            : this()
        {
            if (String.IsNullOrEmpty(MachineName) && !String.IsNullOrEmpty(machine_name))
            {
                MachineName = machine_name;
            }
            MAX_BUFFER_SIZE = max_db_buffer;
            BigMode = log_mode;
        }

        public static IOpLogPerf ILogPerfFactory(string init_flag, Dictionary<string, object> init_params)
        {
            // To support extensibility, allow for multiple named factoryies in other assemblies/classes...
            string sf = (init_flag ?? "").Trim().ToUpper();
            if (!sf.StartsWith("DB")) { return null; }

            DbLogPerfMode big_mode = DbLogPerfMode.Unknown;
            try
            {
                int mi = 0;
                if (Int32.TryParse(sf.Replace("DB", ""), out mi))
                {
                    if (Enum.IsDefined(typeof(DbLogPerfMode), mi))
                    {
                        big_mode = (DbLogPerfMode)Enum.ToObject(typeof(DbLogPerfMode), mi);
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }

            if (big_mode == DbLogPerfMode.Unknown) { big_mode = DbLogPerfMode.Small; } // Default mode

            if (init_params != null)
            {
                object mn;
                if (init_params.TryGetValue("MachineName", out mn))
                {
                    string smn = String.Format("{0}", mn);
                    if (!String.IsNullOrEmpty(smn))
                    {
                        // Only use the non-default constructor if we have a valid machine name...
                        object mb;
                        int imb = DEFAULT_MAX_BUFFER_SIZE;
                        if (init_params.TryGetValue("max_db_buffer", out mb))
                        {
                            imb = OpConvertSafe.ToInt(mb, DEFAULT_MAX_BUFFER_SIZE);
                        }

                        return new DbLogPerf(smn, imb, big_mode);
                    }
                }
            }

            return new DbLogPerf() { BigMode = big_mode };
        }

        /// <summary>
        /// When true, log the full message, else log a portion of it...
        /// </summary>
        public DbLogPerfMode BigMode {private set; get;}
        
        private const int MAX_MESSAGE_SIZE = 255;
        private const int DEFAULT_MAX_BUFFER_SIZE = 30;
        private const int MAX_BUFFERED_MESSAGE_SID = (1024 * 1024);
        private int MAX_BUFFER_SIZE = DEFAULT_MAX_BUFFER_SIZE;
        private static object LOCK_OBJECT = new object();
        private static object LOCK_THREAD_OBJECT = new object();
        

        private delegate void UploadLogPrefLogsDelegate(IEnumerable<OpLogPerfMessage> messages, string machine_name);
        private List<IAsyncResult> FlushActions { set; get; }
        
        private List<OpLogPerfMessage> Buffer = new List<OpLogPerfMessage>();
        
        public static string MachineName { set; get; }

        public void Log(OpLogPerfMessage msg)
        {
            // They have indicated to only log messages with perf times
            if (BigMode == DbLogPerfMode.PerfOnly && msg.RuntimeMs <= 0) { return; }

            lock (LOCK_OBJECT)
            {
                msg.MessageTime = msg.MessageTime.ToUniversalTime(); // standardize on UTC since this value will come from users laptops

                if (BigMode == DbLogPerfMode.Full || msg.Size <= MAX_MESSAGE_SIZE)
                {
                    Buffer.Add(msg);
                }
                else
                {
                    Buffer.Add(msg.Clone(MAX_MESSAGE_SIZE));
                }
            }
            if (Buffer.Count() > MAX_BUFFER_SIZE || msg.Size > MAX_BUFFERED_MESSAGE_SID)
            {
                Flush();
            }
        }

        public void Clear()
        {
            lock (LOCK_OBJECT)
            {
                Buffer.Clear();
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

        public void Flush()
        {
            try
            {
                OpLogPerfMessage[] tb;
                lock (LOCK_OBJECT)
                {
                    if (!Buffer.Any()) 
                    {
                        return; // Only upload if we have log entries.
                    } 

                    // Make a copy of the data w/i the lock for use out side of the lock
                    tb = Buffer.ToArray();

                    // Then reset the buffer for the next message.
                    Buffer = new List<OpLogPerfMessage>();
                }

                // Create a delegate to fire off the upload request (my hope in the dynamic delegate was 
                // that .net would stay alive as long at the delegates were in memory.  Didn't work out to be
                // the case, oh well.
                var dlgt = new UploadLogPrefLogsDelegate((ll, mn) =>
                {
                    ////DataCollections.Instance.UploadLogPrefLogs(ll, mn);
                });

                // Lock FlushActions
                lock (LOCK_THREAD_OBJECT)
                {
                    var send_iar = dlgt.BeginInvoke(tb, MachineName ?? "", new AsyncCallback(iar =>
                    {
                        try
                        {
#if DEBUG
                            System.Diagnostics.Debug.WriteLine("FlushActions End: {0}", iar);
#endif

                            if (iar == null) { return; }

                            lock (LOCK_THREAD_OBJECT)
                            {
                                FlushActions.Remove(iar); // Flag the call as completed
                            }
                        }
                        catch (Exception ex2)
                        {
                            System.Diagnostics.Debug.WriteLine(ex2);
                        }

                    }), null);

                    // Keep track of how many remote calls we have, I know, eeeeewwww.
                    FlushActions.Add(send_iar);
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

        public Func<string> MessageRider {set;get;}

    }

}
