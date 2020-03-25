using System;
using System.Configuration;
using System.Threading.Tasks;

namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {

        #region Properties
        private static bool _debugMode;
        private const int ErrorReturn = 1;
        private const int SuccessReturn = 0;

        static int iMaximumAttempts = Convert.ToInt32(ConfigurationManager.AppSettings["MaximumAttempts"]);
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

            var myArgs = new VistexParams(args);

            //JmsQCommon.Log(myArgs.ToString());

            DoAction(myArgs).Wait();

            //JmsQCommon.Log("Done.");

            if (!myArgs.pauseOnEnd) return SuccessReturn;

            PressAnyKeyToContinue();
            return SuccessReturn;
        }

        private static async Task DoAction(VistexParams myArgs)
        {
            if (myArgs.sleepSeconds > 0)
            {
                //JmsQCommon.Log("Sleeping for {0} seconds.", myArgs.sleepSeconds);
                //Thread.Sleep(myArgs.sleepSeconds * 1000);
                //JmsQCommon.Log("Done sleeping.");
            }

            // Set JobType Mode Flag
            switch (myArgs.jobMode)
            {
                case JobMode.SendDealsVistex:
                    Console.WriteLine("Sending Deals Data to Vistex and SAP PO...");
                    await SendDealsDataToSapPo("D");
                    break;
                case JobMode.SendCustomersVistex:
                    Console.WriteLine("Sending Customers to Vistex from My Deals...");
                    await SendDFDataToSapPo("C");
                    break;
                case JobMode.SendProductsVistex:
                    Console.WriteLine("Sending Products to Vistex from My Deals...");
                    await SendDFDataToSapPo("P");
                    break;
                case JobMode.SendVerticalsVistex:
                    Console.WriteLine("Sending Verticals to Vistex from My Deals...");
                    await SendVerticalsToSapPo();
                    Console.ReadLine();
                    break;
                case JobMode.ProcessDealsTenders:
                    Console.WriteLine("Processing Tenders deals in My Deals...");
                    // Not implemented yet
                    break;
                case JobMode.TestPipelines:
                    Console.WriteLine("Starting: Testing Connection to Vistex SAP PO...");
                    //Console.Clear();
                    //Dictionary<string, string> myResponse = VistexHttpService.TestVistexConnection();
                    //Console.WriteLine("Job Status : " + myResponse["Status"]);
                    //Console.WriteLine("Returned Data : " + myResponse["Data"]);
                    //Console.WriteLine(".................................................");
                    //Console.WriteLine("Completed: Testing Connection to Vistex SAP PO...");
                    break;

                default:
                    Console.WriteLine("Invalid Operation...");
                    //JmsQCommon.Log("Invalid job mode");
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
