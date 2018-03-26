using Intel.Opaque.Tools;
using Intel.Opaque.Utilities.Server;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Intel.MyDeals.JMSQueueApp
{
    public partial class Program
    {
        #region Properties

        private static bool _debugMode;
        private static bool _noSapMode;
        private static bool _hasExtraLoggers;
        public static object LockObject = new object();
        private const int ErrorReturn = 1;
        private const int SuccessReturn = 0;
        private static JMSQueueSettings _jmsqConfig;
        public static bool IsProd = true; // default to true

        private static string FileSystemSafeTime
        {
            get
            {
                return DateTime.Now.ToString()
                    .Replace("/", "-")
                    .Replace(" ", "_")
                    .Replace(":", "_");
            }
        }

        private static string LogFile
        {
            get
            {
                if (String.IsNullOrEmpty(_logFile))
                {
                    try
                    {
                        _logFile = Path.Combine(JmsQCommon.StartupPath, "Logs", String.Format("JmsQueueDebugLog_{0:0}_{1}.txt",
                                Math.Abs((DateTime.Now - (new DateTime(DateTime.Now.Year, 1, 1))).TotalMinutes),
                                DateTime.Now.Second
                            ));
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        _logFile = "JmsQueueDebugLog.txt";
                    }
                }
                return _logFile;
            }
        }

        private static string _logFile = "";

        #endregion Properties

        public static int Main(string[] args)
        {
            DeleteOldLogFiles();

            JmsQCommon.LogWriter fileLogger, consoleLogger;

            SetLogger(out fileLogger, out consoleLogger);

            JmsQCommon.Logger.Add(consoleLogger);

            #region Arg Checking

#if DEBUG
            if (args.Length == 0 && System.Diagnostics.Debugger.IsAttached)
            {
                DisplayHelp(true, false);
                Console.WriteLine("Manually enter parameters here:");
                args = Console.ReadLine().Split(' ');
            }
#endif
            if (args.Length == 0)
            {
                DisplayHelp(true, false);
                return ErrorReturn;
            }

            #endregion Arg Checking

            Thread.GetDomain().UnhandledException += UnhandledExceptionHandler;

            var myArgs = new JMSQParams(args);
            var app_name = JmsQCommon.GetAppSetting("OpaqueApp");
            var env = string.Empty;

            #region Prod check and logging folders

            env = JmsQCommon.GetAppSetting("ENV");

            IsProd = (String.IsNullOrEmpty(env) || env.StartsWith("PROD") || env.StartsWith("PRD") || env.StartsWith("PD"));

            if (!JmsQCommon.TryCreateFileFolder(LogFile))
            {
                Console.WriteLine(String.Format("Unable to create logging folder for file: {0}", LogFile));
                System.Diagnostics.Debug.WriteLine(String.Format("Unable to create logging folder for file: {0}", LogFile));
            }

            if (myArgs.outputLogging || myArgs.diagnosticsMode)
            {
                fileLogger = new JmsQCommon.LogWriter((s, a) =>
                {
                    File.AppendAllText(LogFile, GetLogMessage(s, a));
                });

                JmsQCommon.Logger.Add(fileLogger);

                DumpLoggingDetails(app_name, myArgs);
            }

            #endregion Prod check and logging folders

            bool hasValMsg = !String.IsNullOrEmpty(myArgs.ValididationMessages);
            _debugMode = myArgs.debugMode;
            _noSapMode = myArgs.noSAP;

            #region Debug Dumping

            if (!myArgs.diagnosticsMode && (myArgs.displayHelpOnly || hasValMsg))
            {
                if (hasValMsg)
                {
                    Console.WriteLine(myArgs.ValididationMessages);
                }

                DisplayHelp(!hasValMsg, myArgs.debugMode);

                if (myArgs.debugMode)
                {
                    try
                    {
                        Console.WriteLine("Passed Parameters: {0}", myArgs.ToString());
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }

                    try
                    {
                        Console.WriteLine("Environment App Setting: {0}", env);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }

                    try
                    {
                        Console.WriteLine("Environment Details:");
                        Console.WriteLine(JmsQCommon.GetAppSetting("MyDealsService"));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }

#if DEBUG
                if (myArgs.pauseOnEnd)
                {
                    PressAnyKeyToContinue();
                }
#endif

                if (hasValMsg)
                {
                    JmsQCommon.HandleException(new ArgumentException(myArgs.ValididationMessages), false);
                }

                return ErrorReturn;
            }

            #endregion Debug Dumping

            #region Connect to Service

            // TO DO : Change this part after checking how this part works
            JmsQCommon.Log("Connecting to service...");

            if (!ConnectToService(myArgs.outputLogging || myArgs.diagnosticsMode))
            {
                if (!myArgs.diagnosticsMode)
                {
                    JmsQCommon.Log("Error starting up the service, review logs for details.");

                    JmsQCommon.HandleException(new InvalidOperationException("Error starting up the service, review logs for details."), false);

                    return ErrorReturn;
                }
                else
                {
                    JmsQCommon.Log("Exiting because we are in diagnostics mode.");

                    return SuccessReturn;
                }
            }

            JmsQCommon.Log("Connected to service!");

            JmsQCommon.Log(_jmsqConfig.ToString());

            #endregion Connect to Service

            #region JMSQ_DEBUG_MODE Loggers

            // TO DO : Check how can we give an alternative value for "JMSQ_DEBUG_MODE" rather than getting from Opaque.
            string runtime_debug = ""; //DataAccessLayer.GetConst("JMSQ_DEBUG_MODE");
            if (!String.IsNullOrEmpty(runtime_debug))
            {
                var extra_loggers = LogPerfHelper.ParseInitString(runtime_debug);
                if (extra_loggers != null && extra_loggers.Any())
                {
                    foreach (var ll in extra_loggers)
                    {
                        if (ll is EmailLogPerf)
                        {
                            ((EmailLogPerf)ll).ForceSendOnShutdown = true;
                        }
                        LogPerf.Add(ll);
                    }
                    _hasExtraLoggers = true;
                    LogPerf.Enabled = true;

                    JmsQCommon.Logger.Add(new JmsQCommon.LogWriter((s, a) =>
                    {
                        LogPerf.Log(GetLogMessage(s, a));
                    }));

                    DebugLog("Added extra loggers based on database const settings. Log messages before this point may be logged on source system but not included here: {0}", runtime_debug);
                }
            }

            #endregion JMSQ_DEBUG_MODE Loggers

            if (myArgs.diagnosticsMode)
            {
                return Diagnostics(myArgs, _jmsqConfig);
            }

            JmsQCommon.Log(myArgs.ToString());

            DoAction(myArgs).Wait();

            JmsQCommon.Log("Done.");

            if (!myArgs.pauseOnEnd) return SuccessReturn;

            PressAnyKeyToContinue();

            return SuccessReturn;
        }

        private static void SetLogger(out JmsQCommon.LogWriter fileLogger, out JmsQCommon.LogWriter consoleLogger)
        {
            fileLogger = null;
            consoleLogger = new JmsQCommon.LogWriter((s, a) =>
            {
                string msg = GetLogMessage(s, a);

                Console.WriteLine(msg);
#if DEBUG
                System.Diagnostics.Debug.WriteLine(msg);
#endif
            });
        }

        private static async Task DoAction(JMSQParams myArgs)
        {
            if (myArgs.sleepSeconds > 0)
            {
                JmsQCommon.Log("Sleeping for {0} seconds.", myArgs.sleepSeconds);
                Thread.Sleep(myArgs.sleepSeconds * 1000);
                JmsQCommon.Log("Done sleeping.");
            }

            // Set JobType Mode Flag
            switch (myArgs.jobMode)
            {
                case JobMode.Expire:
                case JobMode.Upload:
                    // Now, run under given operation mode
                    if (myArgs.jobDir == JobDir.Sender)
                    {
                        DebugLog("Running SENDER mode");
                        await JmsQSender(myArgs.jobType);
                    }
                    else if (myArgs.jobDir == JobDir.Receiver)
                    {
                        DebugLog("Running RECEIVER mode");
                        await JmsQReceiver(myArgs.jobType);
                    }
                    else
                    {
                        // -- Both Mode --
                        DebugLog("Running Both mode");

                        await JmsQSender(myArgs.jobType);

                        JmsQCommon.Log("Waiting {0} seconds in between Send and Receive.", JmsQCommon.WaitBetweenSendReceiveSeconds);
                        Thread.Sleep(JmsQCommon.WaitBetweenSendReceiveSeconds * 1000);

                        await JmsQReceiver(myArgs.jobType);
                    }
                    break;

                default:
                    JmsQCommon.Log("Invalid job mode");
                    break;
            }
        }

        private static void DumpLoggingDetails(string app_name, JMSQParams myArgs)
        {
            try
            {
                JmsQCommon.Log("Starting JMSQueueApp.exe {0}", myArgs.ToString());
            }
            catch (Exception ex)
            {
                JmsQCommon.Log("Error Starting JMSQueueApp.exe: {0}", ex);
            }

            JmsQCommon.Log("Detected Opaque App Name: \"{0}\"", app_name);

            try
            {
                JmsQCommon.Log("Executing As: \"{0}\\{1}\"", Environment.UserDomainName, Environment.UserName);
            }
            catch (Exception ex)
            {
                JmsQCommon.Log("{0}", ex);
            }

            try
            {
                JmsQCommon.Log("Environment App Setting: \"{0}\"", JmsQCommon.GetAppSetting("ENV"));
            }
            catch (Exception ex)
            {
                JmsQCommon.Log("{0}", ex);
            }

            try
            {
                JmsQCommon.Log(JmsQCommon.GetAppSetting("MyDealsService"));
            }
            catch (Exception ex)
            {
                JmsQCommon.Log("{0}", ex);
            }
        }

        private static void DisplayHelp(bool clear, bool tryConnectToService)
        {
            if (clear)
            {
                Console.Clear();
            }
            Console.WriteLine(JMSQParams.GetHelpMessage());

            if (!tryConnectToService)
            {
                return;
            }

            Console.WriteLine("Trying to connect to service...");

            const string MSK = @"
==============================================================================
{0}
==============================================================================
";
            if (ConnectToService(true))
            {
            }
            else
            {
                Console.WriteLine(MSK, "ERROR! Failed to connect to service.  Ensure service is running and settings are correct.");
            }
        }

        /// <summary>
        /// Connect to MyDeals service
        /// </summary>
        /// <param name="logErrors"></param>
        /// <returns></returns>
        private static bool ConnectToService(bool logErrors)
        {
            int service_startup_count = 5;
            int delay_multiplier = 1;
            bool service_running = false;
            while (--service_startup_count >= 0)
            {
                var envDetails = DataAccessLayer.TestConnection().GetAwaiter().GetResult();
                if (envDetails.ContainsKey("jmsQueue"))
                {
                    service_running = true;
                    JMSQueueSettings.Create(envDetails);
                    _jmsqConfig = JMSQueueSettings.Instance;
                }
                if (!service_running)
                {
                    Thread.Sleep(1000 * delay_multiplier);
                    delay_multiplier *= 2;
                }
                else
                {
                    return true;
                }
            }

            JmsQCommon.Log("Unable to connect to service.");

            try
            {
                JmsQCommon.Log("Environment Details:");
                JmsQCommon.Log(JmsQCommon.GetAppSetting("MyDealsService"));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return false;
        }

        public static string GetLogMessage(string s, params object[] a)
        {
            return String.Format("{0:HH:mm:ss.fff} @ {1}",
                        DateTime.Now,
                        (a != null && a.Length > 0)
                            ? String.Format(s, a)
                            : s
                        ) + Environment.NewLine;
        }

        private static void PressAnyKeyToContinue()
        {
#if DEBUG
            JmsQCommon.Log("Press any key to continue...");
            Console.ReadKey(true);
#endif
        }

        private static void DebugLog(string msg, params object[] args)
        {
            if (_debugMode || _hasExtraLoggers)
            {
                JmsQCommon.Log(msg, args);
            }
        }

        private static void DeleteOldLogFiles()
        {
            const int DaysToKeep = 180;

            try
            {
                string log_path = Path.Combine(JmsQCommon.StartupPath, "Logs");
                if (!Directory.Exists(log_path)) { return; }
                DateTime delete_date = DateTime.Now;
                delete_date = delete_date.Subtract(delete_date.TimeOfDay).AddDays(-1 * DaysToKeep);

                foreach (var fi in (new DirectoryInfo(log_path)).GetFiles("JmsQueueDebugLog*").OrderBy(f => f.LastWriteTime))
                {
                    if (fi.LastWriteTime < delete_date)
                    {
                        try
                        {
                            fi.Delete();
                        }
                        catch (Exception ex)
                        {
                            JmsQCommon.Log(ex.Message);
                        }
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                JmsQCommon.Log(ex.ToString());
            }
        }

        public static void UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs args)
        {
            if (args != null && args.ExceptionObject is Exception)
            {
                Exception ex = ((Exception)(args.ExceptionObject));
                JmsQCommon.Log("{0} : {1}", sender, ex);
                JmsQCommon.HandleException(ex, false);
            }
        }
    }
}