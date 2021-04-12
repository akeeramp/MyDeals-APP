using System;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;


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
            else if (mode == "/mode:cl")
            {
                fileName = "ConsumptionLoad";
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
            else if (mode == "/mode:tr")
            {
                fileName = "TenderReturn";
            }
            else if (mode == "/mode:se")
            {
                fileName = "ErrorDeal";
            }
            else if (mode == "/mode:sf")
            {
                fileName = "ErrorVertical";
            }
            _logFile = Path.Combine(VistexCommonLogging.StartupPath, "Logs", String.Format(mode == "/mode:tr" ? "TenderDebugLog_" : "VistexDebugLog_" +fileName+"_{0:0}_{1}.txt",
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

            MergeDealLogs(_logFile, args[0].ToString());

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
                case JobMode.SendConsumptionLoad:
                    Console.WriteLine("Sending Consumption Load Data to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Consumption Load Data to Vistex from My Deals...");
                    await SendConsumptionLoadDataToSapPo("M");
                    VistexCommonLogging.WriteToLog("Completed - Sending Consumption Load Data to Vistex from My Deals...");
                    break;
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
                    break;
                case JobMode.TenderReturn:
                    Console.WriteLine("Processing Tenders Return in My Deals...");
                    VistexCommonLogging.WriteToLog("Processing Tenders Return in My Deals...");
                    await SendTenderReturn("R");
                    // Not implemented yet
                    break;
                case JobMode.SendErrorDealsVistex:
                    Console.WriteLine("Sending Error Deals Data to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Deals Data to Vistex from My Deals...");
                    await SendDealsDataToSapPo("E");
                    VistexCommonLogging.WriteToLog("Completed - Sending Deals Data to Vistex from My Deals...");
                    break;
                case JobMode.SendFailProductsVistex:
                    Console.WriteLine("Sending Error Verticals to Vistex from My Deals...");
                    VistexCommonLogging.WriteToLog("Initiated - Sending Verticals to Vistex from My Deals...");
                    await SendVerticalsToSapPo();
                    VistexCommonLogging.WriteToLog("Completed - Sending Verticals to Vistex from My Deals...");
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

        public static void MergeDealLogs(string _logFile, string mode)
        {
            string LogDirectory = Path.Combine(VistexCommonLogging.StartupPath, "Logs");
            string separator = "------------------------------------------------------------------------------";
            string HourlyFileName = (mode == "/mode:tr" ? "TenderReturnDebugLog" : "VistexDebugLog_Deal") + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.Hour + ".txt";
            string HourlyFile = Path.Combine(LogDirectory, HourlyFileName);
            if (File.Exists(HourlyFile))
            {
                string content = File.ReadAllText(_logFile);
                File.AppendAllText(HourlyFile, separator + Environment.NewLine);
                File.AppendAllText(HourlyFile, content);
            }
            else
            {
                using (var output = File.Create(HourlyFile))
                {
                    using (var input = File.OpenRead(_logFile))
                    {
                        input.CopyTo(output);
                    }
                }

            }

            if (File.Exists(_logFile))
            {
                File.Delete(_logFile);
            }

            var LogDirectoryinfo = Directory.GetFiles(LogDirectory).Select(f => new FileInfo(f)).Where(f => f.LastAccessTime < DateTime.Now.AddDays(-7) && f.Name.Contains("Deal")).ToList();

            if (LogDirectoryinfo.Count > 0)
            {
                string LogArchive = Path.Combine(VistexCommonLogging.StartupPath, "Logs", "LOG_ARCHIEVE");
                if (!Directory.Exists(LogArchive))
                {
                    Directory.CreateDirectory(LogArchive);
                }
                string archiveFilepath = LogArchive + @"\VistexDebugLog_Deal_File.txt";
                foreach (var file in LogDirectoryinfo)
                {
                    string con = File.ReadAllText(file.FullName);
                    File.AppendAllText(archiveFilepath, con);
                    File.AppendAllText(archiveFilepath, separator + Environment.NewLine);
                    File.Move(file.FullName, Path.Combine(LogArchive, file.Name));
                }
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
