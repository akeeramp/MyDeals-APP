using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.VistexService
{
    // TODO Clean this up, use only what you want to keep, drop the rest.
    public enum JobMode
    {
        UNKNOWN,

        SendDealsVistex,
        SendCustomersVistex,
        SendProductsVistex,
        SendVerticalsVistex,
        ProcessDealsTenders,
        TestPipelines
    }

    public class JobModeCode
    {
        public const char SendDealsVistex = 'D';
        public const char SendCustomersVistex = 'C';
        public const char SendProductsVistex = 'P';
        public const char SendVerticalsVistex = 'V';
        public const char ProcessDealsTenders = 'T';
        public const char TestPipelines = 'X';
    }

    class VistexParams
    {
        public int sleepSeconds = 0;
        public JobMode jobMode = JobMode.SendCustomersVistex;
        public char jobType = JobModeCode.SendCustomersVistex; // Default to run as SendDealsVistex is nothing is passed
        public bool pauseOnEnd = false;
        public bool displayHelpOnly = false;
        public bool outputLogging = false;
        public bool diagnosticsMode = false;
        public bool noSAP = false;
        public bool autoMode = false;

        private List<string> errorMessages = new List<string>();

        public override string ToString()
        {
            List<string> args_list = new List<string>();
            if (sleepSeconds > 0)
            {
                args_list.Add(String.Format("/sleep:{0}", sleepSeconds));
            }

            if (jobMode != JobMode.UNKNOWN)
            {
                args_list.Add(String.Format("/mode:{0}", jobMode));
            }

            if (autoMode)
            {
                args_list.Add("/auto");
            }

            if (debugMode)
            {
                args_list.Add("/debug");
            }

            if (outputLogging)
            {
                args_list.Add("/log");
            }

            if (diagnosticsMode)
            {
                args_list.Add("/diag");
            }

            if (noSAP)
            {
                args_list.Add("/nosap");
            }

            //if (!String.IsNullOrEmpty(JmsQCommon.ENVIRONMENT_OVERRIDE))
            //{
            //    args_list.Add(String.Format("/env:{0}", JmsQCommon.ENVIRONMENT_OVERRIDE));
            //}

            //if (!String.IsNullOrEmpty(JmsQCommon.SAP_ENVIRONMENT_OVERRIDE))
            //{
            //    args_list.Add(String.Format("/sapenv:{0}", JmsQCommon.SAP_ENVIRONMENT_OVERRIDE));
            //}

            return String.Join(" ", args_list);
        }

#if DEBUG
        public bool debugMode = true;
#else
        public bool debugMode = false;
#endif

        private bool AnyStringLike(ref string[] arr, params string[] srch)
        {
            if (arr == null || !arr.Any()) { return false; }
            if (srch == null || !srch.Any()) { return false; }

            srch = srch
                .Select(s => s.Trim().ToLower())
                .Where(s => !String.IsNullOrEmpty(s))
                .ToArray();

            if (!srch.Any()) { return false; }

            foreach (string st in srch)
            {
                if (arr.Any(s => s.ToLower().Contains(st)))
                {
                    return true;
                }
            }

            return false;
        }

        public VistexParams(string[] args)
        {
            displayHelpOnly = true;

            if (args == null || args.Length == 0)
            {
                return;
            }

            var fa = args
                .Select(s => s.Trim().ToLower())
                .Where(s => !String.IsNullOrEmpty(s))
                .ToArray();

            //foreach (string env_arg in fa.Where(s => s.StartsWith("/env:")))
            //{
            //    JmsQCommon.ENVIRONMENT_OVERRIDE = env_arg.Split(':')[1].Trim();
            //    break;
            //}

            //foreach (string env_arg in fa.Where(s => s.StartsWith("/sapenv:")))
            //{
            //    JmsQCommon.SAP_ENVIRONMENT_OVERRIDE = env_arg.Split(':')[1].Trim();
            //    break;
            //}

            //foreach (string env_arg in fa.Where(s => s.StartsWith("/sleep")))
            //{
            //    displayHelpOnly = false;

            //    var arr = env_arg.Split(':');
            //    if (arr.Length > 1)
            //    {
            //        if (Int32.TryParse(arr[1].Trim(), out sleepSeconds))
            //        {
            //            break;
            //        }
            //    }
            //    sleepSeconds = JmsQCommon.DefaultSleepSeconds;
            //}

            if (AnyStringLike(ref fa, "auto"))
            {
                autoMode = true;
                displayHelpOnly = false;
            }

            if (AnyStringLike(ref fa, "diag", "diagnostics"))
            {
                diagnosticsMode = true;
            }

            if (AnyStringLike(ref fa, "nosap"))
            {
                noSAP = true;
            }

            if (AnyStringLike(ref fa, "debug"))
            {
                debugMode = true;
                pauseOnEnd = true;
            }

            if (AnyStringLike(ref fa, "log"))
            {
                outputLogging = true;
            }
            //else if (TypeConverter.ToBool(JmsQCommon.GetAppSetting("LogAll"), false))
            //{
            //    outputLogging = true;
            //}

            string[] helpflags = new string[] { "help", "/help", "--help", "?", "/?", "-?", "--?" };

            if (fa.Any(s => helpflags.Contains(s)))
            {
                displayHelpOnly = true;
                return;
            }

            foreach (string env_arg in fa.Where(s => s.StartsWith("/mode:")))
            {
                var arr = env_arg.Split(':');
                if (arr.Length > 1)
                {
                    switch (arr[1].Trim())
                    {
                        case "senddealsvistex":
                        case "sd":
                            displayHelpOnly = false;
                            jobMode = JobMode.SendDealsVistex;
                            jobType = JobModeCode.SendDealsVistex;
                            break;

                        case "sendcustomersvistex":
                        case "sc":
                            displayHelpOnly = false;
                            jobMode = JobMode.SendCustomersVistex;
                            jobType = JobModeCode.SendCustomersVistex;
                            break;

                        case "sendproductsvistex":
                        case "sp":
                            displayHelpOnly = false;
                            jobMode = JobMode.SendProductsVistex;
                            jobType = JobModeCode.SendProductsVistex;
                            break;

                        case "sendverticalsvistex":
                        case "sv":
                            displayHelpOnly = false;
                            jobMode = JobMode.SendVerticalsVistex;
                            jobType = JobModeCode.SendVerticalsVistex;
                            break;

                        case "processdealstenders":
                        case "tp":
                            displayHelpOnly = false;
                            jobMode = JobMode.ProcessDealsTenders;
                            jobType = JobModeCode.ProcessDealsTenders;
                            break;

                        case "testpipelines":
                        case "test":
                            displayHelpOnly = false;
                            jobMode = JobMode.TestPipelines;
                            jobType = JobModeCode.TestPipelines;
                            break;

                        default:
                            errorMessages.Add(String.Format("Invalid Mode: {0}", arr[1]));
                            break;
                    }
                }
                else
                {
                    errorMessages.Add("Missing Mode Input Parameter.");
                }
            }

        }

        private VistexParams(VistexParams master_param)
        {
            this.autoMode = false;
            this.displayHelpOnly = false;
            this.errorMessages = new List<string>();

            this.debugMode = master_param.debugMode;
            this.diagnosticsMode = master_param.diagnosticsMode;
            this.noSAP = master_param.noSAP;
            this.outputLogging = master_param.outputLogging;
            this.pauseOnEnd = master_param.pauseOnEnd;

            this.jobMode = JobMode.UNKNOWN;
            this.jobType = ' '; // Not set
            this.sleepSeconds = 0;
        }

        public string ValididationMessages
        {
            get
            {
                if (errorMessages != null && errorMessages.Count > 0)
                {
                    return String.Join(Environment.NewLine, errorMessages);
                }

                return String.Empty;
            }
        }

        public static string GetHelpMessage()
        {
            string sub_title = "";

            try
            {
                //var ver = Assembly.GetExecutingAssembly().GetName().Version;

                if (!String.IsNullOrEmpty(sub_title)) { sub_title += ", "; }
                //sub_title += String.Format("{0}", ver);
            }
            catch (Exception ex)
            {
                //LogPerf.Log(ex);
            }

            try
            {
                //DateTime dt = Reflector.GetAssemblyCompileDate(typeof(Program).Assembly);

                if (!String.IsNullOrEmpty(sub_title)) { sub_title += ", "; }
                //sub_title += String.Format("Compiled: {0}", dt);
            }
            catch (Exception ex)
            {
                //LogPerf.Log(ex);
            }

            return String.Format
                (
                HelpMessage,
                sub_title
                );
        }

        private const string HelpMessage = @"
Vistex Service Help ({0})
This command line tool is part of the MyDeals framework for talking to Vistes SAP
PO and Tenders Mulesoft.
Supported command line options:

/mode:<mode> = Processing Queue Mode, where <mode> is:
   sd (or senddealsvistex) = Send Deals Data to Vistex.
   sc (or sendcustomersvistex) = Send Customers Data to Vistex.
   sp (or sendproductsvistex) = Send Products Data to Vistex.
   sv (or sendverticalsvistex) = Send Verticals Data to Vistex.
   tp (or processdealstenders) = Process Deals sent from Tenders.
   test (or testpipelines) = Testing Mode.

/log = Write details to output log file.
/diag = Perform diagnostics.
/debug = Debug Mode (display more output and pause after execution).
/nosap = Do not try to talk to SAP (send or rec) (for debugging)

/sleep:XX = Sleep for XX seconds (used in batches that call send then receive).
    Sleep will be executed before any other action.

(no parameters) = This message.

As of MyDeals 1.0, there is no default mode.
You must pass in a specific mode.
";
    }

}