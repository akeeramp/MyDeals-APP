using System;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using static Intel.MyDeals.IQRService.BusinessFlow;

namespace Intel.MyDeals.IQRService
{
    public partial class Program
    {
        //private static bool _debugMode;
        private const int ErrorReturn = 1;
        private const int SuccessReturn = 0;
        public static bool IsProd = true; // default to true

        static int iMaximumAttempts = Convert.ToInt32(ConfigurationManager.AppSettings["MaximumAttempts"]);
        public static void SetLogFileName()
        {
            string fileName = "SalesForceTenderData";
            _logFile = Path.Combine(IQRCommonLogging.StartupPath, "Logs", String.Format("SalesForceTenderDataDebugLog_" + fileName + "_{0:0}_{1}.txt",
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
                        _logFile = Path.Combine(IQRCommonLogging.StartupPath, "Logs", String.Format("VistexDebugLog_{0:0}_{1}.txt",
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
        static void Main(string[] args)
        {
            SetLogFileName();
            DoAction().Wait();
        }


        private static void PressAnyKeyToContinue()
        {
            Console.ReadKey(true);
        }

        private static async Task DoAction()
        {
            await SendTenderReturn();
        }
    }
}