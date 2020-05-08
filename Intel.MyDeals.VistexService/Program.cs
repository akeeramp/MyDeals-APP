using System;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;


namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {

        #region Properties
        private static bool _debugMode;
        private const int ErrorReturn = 1;
        private const int SuccessReturn = 0;
        public static bool IsProd = true; // default to true

        static int iMaximumAttempts = Convert.ToInt32(ConfigurationManager.AppSettings["MaximumAttempts"]);
        public static void SetLogFileName(string mode)
        {
            string fileName = "";
            if(mode == "/mode:sv")
            {
                fileName = "Vertical";
            }
            else if(mode == "/mode:sc")
            {
                fileName = "Customer";
            }
            else if (mode == "/mode:sp")
            {
                fileName = "Product";
            }
            else if (mode == "/mode:sd")
            {
                fileName = "Deal";
            }
            _logFile = Path.Combine(VistexCommonLogging.StartupPath, "Logs", String.Format("VistexDebugLog_"+fileName+"_{0:0}_{1}.txt",
                                Math.Abs((DateTime.Now - (new DateTime(DateTime.Now.Year, 1, 1))).TotalMinutes),
                                DateTime.Now.Second
                            ));
        }
        public static string LogFile
        {
            get
            {
                if (String.IsNullOrEmpty(_logFile))
                {
                    try
                    {
                        _logFile = Path.Combine(VistexCommonLogging.StartupPath, "Logs", String.Format("VistexDebugLog_{0:0}_{1}.txt",
                                Math.Abs((DateTime.Now - (new DateTime(DateTime.Now.Year, 1, 1))).TotalMinutes),
                                DateTime.Now.Second
                            ));
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        _logFile = "VistexDebugLog.txt";
                    }
                }
                return _logFile;
            }
        }

        public static string _logFile = "";
        #endregion

        static int Main(string[] args)
        {
            #region Arg Checking
            if (args.Length == 0)
            {
                DisplayHelp(true, false);
                return ErrorReturn;
            }
            #endregion Arg Checking
            //Set File Name
            SetLogFileName(args[0].ToString());
            
            //Delete all the log which are more than 180 days old
            VistexCommonLogging.DeleteOldLogFiles();

            VistexCommonLogging.LogWriter fileLogger, consoleLogger;

            VistexCommonLogging.SetLogger(out fileLogger, out consoleLogger);

            VistexCommonLogging.Logger.Add(consoleLogger);
            //Checking Directory Exist or NOT
            //VistexCommonLogging.CreateFileOrFolder("");
            
            Thread.GetDomain().UnhandledException += UnhandledExceptionHandler;

            //var myArgs = new JMSQParams(args);
            var app_name = VistexCommonLogging.GetAppSetting("OpaqueApp");
            var env = string.Empty;
            env = VistexCommonLogging.GetAppSetting("ENV");

            IsProd = (String.IsNullOrEmpty(env) || env.StartsWith("PROD") || env.StartsWith("PRD") || env.StartsWith("PD"));

            if (!VistexCommonLogging.CreateFileOrFolder(_logFile))
            {
                Console.WriteLine(String.Format("Unable to create logging folder for file: {0}", LogFile));
                System.Diagnostics.Debug.WriteLine(String.Format("Unable to create logging folder for file: {0}", LogFile));
            }

            var myArgs = new VistexParams(args);
            if (myArgs.outputLogging || myArgs.diagnosticsMode)
            {
                fileLogger = new VistexCommonLogging.LogWriter((s, a) =>
                {
                    File.AppendAllText(_logFile, VistexCommonLogging.GetLogMessage(s, a));
                });

                VistexCommonLogging.Logger.Add(fileLogger);

                VistexCommonLogging.DumpLoggingDetails(app_name, myArgs);
            }

            //var myArgs = new VistexParams(args);

            VistexCommonLogging.Log(myArgs.ToString());

            DoAction(myArgs).Wait();

            VistexCommonLogging.Log("Done.");

            if (!myArgs.pauseOnEnd) return SuccessReturn;

            PressAnyKeyToContinue();
            return SuccessReturn;
        }

        private static void UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs e)
        {
            throw new NotImplementedException();
        }

        private static async Task DoAction(VistexParams myArgs)
        {
             // Set JobType Mode Flag
            switch (myArgs.jobMode)
            {
                case JobMode.SendDealsVistex:
                    Console.WriteLine("Sending Deals Data to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Deals Data to Vistex from My Deals...");
                    await SendDealsDataToSapPo("D");
                    VistexCommonLogging.WriteToLog("Completed - Sending Deals Data to Vistex from My Deals...");
                    break;
                case JobMode.SendCustomersVistex:
                    Console.WriteLine("Sending Customers to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Customers to Vistex from My Deals...");
                    await SendDFDataToSapPo("C");
                    VistexCommonLogging.WriteToLog("Completed - Sending Customers to Vistex from My Deals...");
                    break;
                case JobMode.SendProductsVistex:
                    Console.WriteLine("Sending Products to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Products to Vistex from My Deals...");
                    await SendDFDataToSapPo("P");
                    VistexCommonLogging.WriteToLog("Completed - Sending Products to Vistex from My Deals...");
                    break;
                case JobMode.SendVerticalsVistex:
                    Console.WriteLine("Sending Verticals to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Verticals to Vistex from My Deals...");
                    await SendVerticalsToSapPo();
                    VistexCommonLogging.WriteToLog("Completed - Sending Verticals to Vistex from My Deals...");
                    break;
                case JobMode.ProcessDealsTenders:
                    Console.WriteLine("Processing Tenders deals in My Deals...");
                    VistexCommonLogging.WriteToLog("Processing Tenders deals in My Deals...");
                    // Not implemented yet
                    break;
                case JobMode.TestPipelines:
                    Console.WriteLine("Starting: Testing Connection to Vistex SAP PO...");
                    VistexCommonLogging.WriteToLog("Starting: Testing Connection to Vistex SAP PO...");
                    //Console.Clear();
                    //Dictionary<string, string> myResponse = VistexHttpService.TestVistexConnection();
                    //Console.WriteLine("Job Status : " + myResponse["Status"]);
                    //Console.WriteLine("Returned Data : " + myResponse["Data"]);
                    //Console.WriteLine(".................................................");
                    //Console.WriteLine("Completed: Testing Connection to Vistex SAP PO...");
                    break;

                default:
                    Console.WriteLine("Invalid Operation...");
                    VistexCommonLogging.WriteToLog("Invalid Operation...");                    
                    break;
            }
        }


        private static void PressAnyKeyToContinue()
        {
#if DEBUG
            //JmsQCommon.Log("Press any key to continue...");
            Console.ReadKey(true);
#endif
        }

        private static void DisplayHelp(bool clear, bool tryConnectToService)
        {
            if (clear)
            {
                Console.Clear();
            }
            Console.WriteLine(VistexParams.GetHelpMessage());

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
            //if (ConnectToService(true))
            //{
            //}
            //else
            //{
            //    Console.WriteLine(MSK, "ERROR! Failed to connect to service.  Ensure service is running and settings are correct.");
            //}
        }


    }
}
