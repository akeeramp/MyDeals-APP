using Intel.Opaque.Tools;
using Intel.Opaque.Utilities.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.JMSQueueApp
{
    public enum JobMode
    {
        UNKNOWN,

        Expire,
        Upload
    }

    public enum JobDir
    {
        UNKNOWN,

        Receiver,
        Sender,
        Both
    }

    public class JobModeCode
    {
        public const char Upload = 'U';
        public const char Expire = 'E';
    }

    public class JMSQParams
    {
        public int sleepSeconds = 0;
        public JobDir jobDir = JobDir.UNKNOWN;
        public JobMode jobMode = JobMode.UNKNOWN;
        public char jobType = JobModeCode.Upload; // Default to run as upload since jobmode is defaulted to upload
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

            if (jobDir != JobDir.UNKNOWN)
            {
                args_list.Add(String.Format("/dir:{0}", jobDir));
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

            if (!String.IsNullOrEmpty(JmsQCommon.ENVIRONMENT_OVERRIDE))
            {
                args_list.Add(String.Format("/env:{0}", JmsQCommon.ENVIRONMENT_OVERRIDE));
            }

            if (!String.IsNullOrEmpty(JmsQCommon.SAP_ENVIRONMENT_OVERRIDE))
            {
                args_list.Add(String.Format("/sapenv:{0}", JmsQCommon.SAP_ENVIRONMENT_OVERRIDE));
            }

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

        public JMSQParams(string[] args)
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

            foreach (string env_arg in fa.Where(s => s.StartsWith("/env:")))
            {
                JmsQCommon.ENVIRONMENT_OVERRIDE = env_arg.Split(':')[1].Trim();
                break;
            }

            foreach (string env_arg in fa.Where(s => s.StartsWith("/sapenv:")))
            {
                JmsQCommon.SAP_ENVIRONMENT_OVERRIDE = env_arg.Split(':')[1].Trim();
                break;
            }

            foreach (string env_arg in fa.Where(s => s.StartsWith("/sleep")))
            {
                displayHelpOnly = false;

                var arr = env_arg.Split(':');
                if (arr.Length > 1)
                {
                    if (Int32.TryParse(arr[1].Trim(), out sleepSeconds))
                    {
                        break;
                    }
                }
                sleepSeconds = JmsQCommon.DefaultSleepSeconds;
            }

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
            else if (TypeConverter.ToBool(JmsQCommon.GetAppSetting("LogAll"), false))
            {
                outputLogging = true;
            }

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
                        case "upload":
                        case "ul":
                        case "u":
                            displayHelpOnly = false;
                            jobMode = JobMode.Upload;
                            jobType = JobModeCode.Upload;
                            break;

                        case "expire":
                        case "exp":
                        case "ex":
                        case "x":
                            displayHelpOnly = false;
                            jobMode = JobMode.Expire;
                            jobType = JobModeCode.Expire;
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

            foreach (string env_arg in fa.Where(s => s.StartsWith("/dir:")))
            {
                var arr = env_arg.Split(':');
                if (arr.Length > 1)
                {
                    switch (arr[1].Trim())
                    {
                        case "sender":
                        case "send":
                            displayHelpOnly = false;
                            jobDir = JobDir.Sender;
                            break;

                        case "receiver":
                        case "rec":
                            displayHelpOnly = false;
                            jobDir = JobDir.Receiver;
                            break;

                        case "both":
                        case "b":
                        case "sr":
                        case "sendrec":
                            displayHelpOnly = false;
                            jobDir = JobDir.Both;
                            break;

                        default:
                            errorMessages.Add(String.Format("Invalid Direction: {0}", arr[1]));
                            break;
                    }
                }
                else
                {
                    errorMessages.Add("Missing Direction Input Parameter.");
                }
            }
        }

        /// <summary>
        /// Clone core properties from another param
        /// </summary>
        /// <param name="master_param"></param>
        private JMSQParams(JMSQParams master_param)
        {
            this.autoMode = false;
            this.displayHelpOnly = false;
            this.errorMessages = new List<string>();

            this.debugMode = master_param.debugMode;
            this.diagnosticsMode = master_param.diagnosticsMode;
            this.noSAP = master_param.noSAP;
            this.outputLogging = master_param.outputLogging;
            this.pauseOnEnd = master_param.pauseOnEnd;

            this.jobDir = JobDir.UNKNOWN;
            this.jobMode = JobMode.UNKNOWN;
            this.jobType = ' '; // Not set
            this.sleepSeconds = 0;
        }

        /// <summary>
        /// Expects E, ES, ER, U, US, UR
        /// </summary>
        /// <param name="str">E, ES, ER, U, US, UR</param>
        /// <returns>JobDir, defaulting to Both if unknown</returns>
        private static JobDir ParseJobDir(string str)
        {
            if (String.IsNullOrEmpty(str) || str.Length == 1) { return JobDir.Both; }

            str = str.Trim().ToUpper();
            if (str.EndsWith("R")) { return JobDir.Receiver; }
            if (str.EndsWith("S")) { return JobDir.Sender; }

            return JobDir.Both; // Default
        }

        public static JMSQParams ParseMode(string mode, JMSQParams master_param)
        {
            if (String.IsNullOrEmpty(mode) || mode.Trim().Length == 0) { return null; }

            mode = mode.Trim().ToUpper();

            switch (mode[0]) // Look at the first char...
            {
                case 'S':
                    {
                        int temp_sleep;
                        int set_sleep = JmsQCommon.DefaultSleepSeconds;

                        if (mode.Length > 1 && Int32.TryParse(mode.Replace("S", ""), out temp_sleep) && temp_sleep > 0)
                        {
                            set_sleep = temp_sleep;
                        }

                        return new JMSQParams(master_param)
                        {
                            sleepSeconds = set_sleep
                        };
                    }
                case 'D':
                    return new JMSQParams(master_param)
                    {
                        diagnosticsMode = true,
                        debugMode = true
                    };

                case 'U':
                    return new JMSQParams(master_param)
                    {
                        jobDir = ParseJobDir(mode),
                        jobMode = JobMode.Upload,
                        jobType = JobModeCode.Upload
                    };

                case 'E':
                    return new JMSQParams(master_param)
                    {
                        jobDir = ParseJobDir(mode),
                        jobMode = JobMode.Expire,
                        jobType = JobModeCode.Expire
                    };

                default:
                    return null;
            }
        }

        public string ValididationMessages
        {
            get
            {
                if (errorMessages != null && errorMessages.Count > 0)
                {
                    return String.Join(Environment.NewLine, errorMessages);
                }

                if (jobMode == JobMode.Expire || jobMode == JobMode.Upload)
                {
                    if (jobDir == JobDir.UNKNOWN)
                    {
                        return "Job Modes Expire and Upload require a direction parameter.";
                    }
                }

                return String.Empty;
            }
        }

        public static string GetHelpMessage()
        {
            string sub_title = "";

            try
            {
                var ver = Assembly.GetExecutingAssembly().GetName().Version;

                if (!String.IsNullOrEmpty(sub_title)) { sub_title += ", "; }
                sub_title += String.Format("{0}", ver);
            }
            catch (Exception ex)
            {
                LogPerf.Log(ex);
            }

            try
            {
                DateTime dt = Reflector.GetAssemblyCompileDate(typeof(Program).Assembly);

                if (!String.IsNullOrEmpty(sub_title)) { sub_title += ", "; }
                sub_title += String.Format("Compiled: {0}", dt);
            }
            catch (Exception ex)
            {
                LogPerf.Log(ex);
            }

            return String.Format
                (
                HelpMessage,
                sub_title
                );
        }

        private const string HelpMessage = @"
JMS Queue Help ({0})
This command line tool is part of the MyDeals framework for talking to SAP.
Supported command line options:

/mode:<mode> = JMS Queue Mode, where <mode> is:
   ul (or upload) = Upload data to SAP.
   exp (or expire) = Expire Price.

/dir:<direction> = JMS Queue Mode Direction, where <direction> is:
   send (or sender) = Sender Mode.
   rec (or receiver) = Receiver Mode.
   both = Send and Receiver Mode.

/log = Write details to output log file.
/diag = Perform diagnostics.
/debug = Debug Mode (display more output and pause after execution).
/nosap = Do not try to talk to SAP (send or rec) (for debugging)

/sleep:XX = Sleep for XX seconds (used in batches that call send then receive).
    Sleep will be executed before any other action.

(no parameters) = This message.

As of MyDeals 1.0, there is no default mode.
You must pass in a specific mode (and dir when required).
";
    }
}