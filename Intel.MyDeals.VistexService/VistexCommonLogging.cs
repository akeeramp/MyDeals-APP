using System;
using System.Diagnostics;
using System.IO;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.Opaque.Tools;
using System.Configuration;
using Intel.Opaque;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.VistexService
{
    public static class VistexCommonLogging
    {
        private const string appName = "DQ Vistex Sender";
        private const string emailSubjectHeader = "Vistex: ";

        public static string ENVIRONMENT_OVERRIDE = String.Empty; // Set to local is testing
        public static string SAP_ENVIRONMENT_OVERRIDE = String.Empty;

        //Static Constutor
        static VistexCommonLogging()
        {
            Logger = new List<LogWriter>();
        }
        public static string StartupPath
        {
            get
            {
                if (String.IsNullOrEmpty(startupPath))
                {
                    startupPath = System.IO.Path.GetDirectoryName(
                        System.Reflection.Assembly.GetExecutingAssembly().Location
                        );

                    startupPath = (startupPath ?? "").TrimEnd('\\') + "\\";
                }

                return startupPath;
            }
        }

        private static string startupPath = String.Empty;

        public delegate void LogWriter(string mgs, params object[] args);

        public static List<LogWriter> Logger { set; get; }

        /// <summary>
        /// Get app setting from app.config
        /// </summary>
        /// <param name="appSettingName"></param>
        /// <returns></returns>
        public static string GetAppSetting(string appSettingName)
        {
            if (String.IsNullOrEmpty(ConfigurationManager.AppSettings[appSettingName]))
            {
                throw new Exception(appSettingName + " is missing!");
            }
            return ConfigurationManager.AppSettings[appSettingName];
        }


        public static string GetRootPath()
        {
            string logFileName = VistexCommonLogging.GetAppSetting("vistexLogFilePath");
            string absolutePathAndFileName = VistexCommonLogging.StartupPath + logFileName;//System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase).Replace("file:\\", "") + logFileName;
            return absolutePathAndFileName;
        }
        ///Create File or Folder for Log///
        public static bool CreateFileOrFolder(string absolutePathAndFileName)
        {            
            try
            {
                if (File.Exists(absolutePathAndFileName)) { return true; }
                string folder = Path.GetDirectoryName(absolutePathAndFileName);
                if (Directory.Exists(folder)) { return true; }

                var di = Directory.CreateDirectory(folder);
                if (di.Exists) { return true; }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                System.Diagnostics.Debug.WriteLine(ex);
            }

            return false;            
        }

        /// <summary>
        /// Write to specified logger
        /// </summary>
        public static void Log(string msg, params object[] args)
        {
            if (Logger != null && Logger.Any())
            {
                try
                {
                    foreach (var lgr in Logger)
                    {
                        try
                        {
                            lgr(msg, args);
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine(ex);
                        }
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }
            }
            #if DEBUG
                else
                {
                    System.Diagnostics.Debug.WriteLine(msg, args);
                }
            #endif
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

        ///Write Single line to File
        public static void WriteToLog(string msg)
        {
            string FormattedMessage = GetLogMessage(msg);
            File.AppendAllText(Intel.MyDeals.VistexService.Program._logFile, FormattedMessage);
        }

        ///Write API call logs
        public static void WriteToLogObject(List<string> msg)
        {
            if(msg != null)
            {
                foreach (string message in msg)
                {
                    File.AppendAllText(Intel.MyDeals.VistexService.Program._logFile, message);
                }
            }
                      
        }

        public static void DumpLoggingDetails(string app_name, VistexParams myArgs)
        {
            try
            {
                VistexCommonLogging.Log("Starting VistexService.exe {0}", myArgs.ToString());
            }
            catch (Exception ex)
            {
                VistexCommonLogging.Log("Error Starting VistexService.exe: {0}", ex);
            }

            VistexCommonLogging.Log("Detected Opaque App Name: \"{0}\"", app_name);

            try
            {
                VistexCommonLogging.Log("Executing As: \"{0}\\{1}\"", Environment.UserDomainName, Environment.UserName);
            }
            catch (Exception ex)
            {
                VistexCommonLogging.Log("{0}", ex);
            }

            try
            {
                VistexCommonLogging.Log("Environment App Setting: \"{0}\"", VistexCommonLogging.GetAppSetting("ENV"));
            }
            catch (Exception ex)
            {
                VistexCommonLogging.Log("{0}", ex);
            }

            try
            {
                VistexCommonLogging.Log(VistexCommonLogging.GetAppSetting("MyDealsService"));
            }
            catch (Exception ex)
            {
                VistexCommonLogging.Log("{0}", ex);
            }
        }

        
        public static void SetLogger(out VistexCommonLogging.LogWriter fileLogger, out VistexCommonLogging.LogWriter consoleLogger)
        {
            fileLogger = null;
            consoleLogger = new VistexCommonLogging.LogWriter((s, a) =>
            {
                string msg = GetLogMessage(s, a);

                Console.WriteLine(msg);
                #if DEBUG
                    System.Diagnostics.Debug.WriteLine(msg);
                #endif
            });
        }

        public static void DeleteOldLogFiles()
        {
            const int DaysToKeep = 180;
            string absolutePathAndFileName = GetRootPath();
            try
            {
                string log_path = Path.Combine(absolutePathAndFileName);
                if (!Directory.Exists(log_path)) { return; }
                DateTime delete_date = DateTime.Now;
                delete_date = delete_date.Subtract(delete_date.TimeOfDay).AddDays(-1 * DaysToKeep);

                foreach (var fi in (new DirectoryInfo(log_path)).GetFiles("VistexDebugLog*").OrderBy(f => f.LastWriteTime))
                {
                    if (fi.LastWriteTime < delete_date)
                    {
                        try
                        {
                            fi.Delete();
                        }
                        catch (Exception ex)
                        {
                            ///JmsQCommon.Log(ex.Message);
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
                ///JmsQCommon.Log(ex.ToString());
            }
        }

        /// <summary>
        /// Write to event logger
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="appName"></param>
        /// <param name="eventType"></param>
        /// <returns></returns>
        public static bool WriteToEventLog(Exception ex, string appName, EventLogEntryType eventType)
        {
            // Get all error data for log
            string eventViewerEntry = "Message:\r\n" +
                ex.Message + "\r\n\r\n" +
                "Source:\r\n" +
                ex.Source + "\r\n\r\n" +
                "Stack trace:\r\n" +
                ex.StackTrace + "\r\n\r\n" +
                "ToString():\r\n" +
                ex;

            var eventLog = new EventLog();

            try
            {
                // If a log with the name of the app does not exist, create it
                if (!(EventLog.SourceExists(appName)))
                {
                    EventLog.CreateEventSource(appName, appName);
                }

                eventLog.Log = appName;
                eventLog.Source = appName;
                eventLog.WriteEntry(eventViewerEntry, eventType);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static void HandleException(Exception ex, bool logToDB, string runMode)
        {
            // log exception to Event Viewer

            WriteToEventLog(ex, appName, EventLogEntryType.Error);

            try
            {
                SendDebugMail(runMode, ex.ToString());
            }
            catch (Exception mailException)
            {
                WriteToEventLog(mailException, appName, EventLogEntryType.Error);
            }            
        }

        /// <summary>
        /// Send mail 
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public static void SendMail(string runMode, VistexDFDataResponseObject responseObj, List<string> lstStatus)
        {
            responseObj.BatchStatus = responseObj.BatchStatus == "PROCESSED" ? "Success" : responseObj.BatchStatus;
            string subject = String.Format("MyDeals-VTX [{0}] [Status: {1}] [ENV: {2}]", runMode, responseObj.BatchStatus, VistexCommonLogging.GetAppSetting("ENV")); 
            
            StringBuilder sb = new StringBuilder();

            if(runMode != "Product-Vertical")
            {
                //Add Batch ID:
                sb.AppendLine("Batch ID: " + responseObj.BatchId);
                //Add Batch Status
                sb.AppendLine("Batch Status: " + responseObj.BatchStatus);
            }
            else
            {
                foreach(string itm in lstStatus)
                {
                    sb.AppendLine(itm);                    
                }
            }

            sb.AppendLine(responseObj.BatchMessage);

            string to_email = "";

            try
            {
                to_email = Opaque.OpUtilities.ParseEmailList(GetAppSetting(
                    Program.IsProd ? "SupportDevelopers" : "SupportDevelopers_NONPROD"
                    ), ",");
            }
            catch (Exception ex)
            {
                LogPerf.Log(ex);
            }

            if (String.IsNullOrEmpty(to_email))
            {
                //Replace Mike Name with DCS Dev PDL
                to_email = Opaque.OpUtilities.ParseEmailList("dcs.dev.team@intel.com", ",");
            }

            using (var client = new SmtpClient())
            {
                using (var myMail = new MailMessage())
                {
                    myMail.To.Add(to_email);
                    myMail.Subject = subject;
                    myMail.Body = sb.ToString();
                    myMail.IsBodyHtml = false;

                    client.Send(myMail);
                }
            }

        }

        public static void SendDebugMail(string runMode, string body)
        {
            string subject = String.Format("MyDeals-VTX [{0}] [Status: {1}] [ENV: {2}]", runMode, "Exception", VistexCommonLogging.GetAppSetting("ENV"));

            StringBuilder sb = new StringBuilder(body);
            sb.AppendLine("");
            sb.AppendLine("--------------------------------------------------------------------------------");
            sb.AppendLine("Vistex.SendDebugMail:");

            try
            {
                sb.AppendLine(String.Format("Machine Name: {0}", Environment.MachineName));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("Time: {0}", DateTime.Now));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("CurrentDirectory: {0}", Environment.CurrentDirectory));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("CommandLine: {0}", Environment.CommandLine));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("CommandLineArgs: {0}", String.Join(", ", Environment.GetCommandLineArgs())));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("UserInteractive: {0}", Environment.UserInteractive));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("OSVersion: {0}", Environment.OSVersion));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("User: {0}\\{1}", Environment.UserDomainName, Environment.UserName));
            }
            catch (Exception) { }

            try
            {
                sb.AppendLine(String.Format("UserInteractive: {0}", Environment.UserInteractive));
            }
            catch (Exception) { }

            sb.AppendLine("");
            sb.AppendLine("--------------------------------------------------------------------------------");
            sb.AppendLine("");

            string to_email = "";

            try
            {
                to_email = Opaque.OpUtilities.ParseEmailList(GetAppSetting(
                    Program.IsProd ? "SupportDevelopers" : "SupportDevelopers_NONPROD"
                    ), ",");
            }
            catch (Exception ex)
            {
                LogPerf.Log(ex);
            }

            if (String.IsNullOrEmpty(to_email))
            {
                //Replace Mike Name with DCS Dev PDL
                to_email = Opaque.OpUtilities.ParseEmailList("dcs.dev.team@intel.com", ",");
            }

            using (var client = new SmtpClient())
            {
                using (var myMail = new MailMessage())
                {
                    myMail.To.Add(to_email);
                    myMail.Subject = subject;
                    myMail.Body = sb.ToString();
                    myMail.IsBodyHtml = false;

                    client.Send(myMail);
                }
            }
        }

    }
}
