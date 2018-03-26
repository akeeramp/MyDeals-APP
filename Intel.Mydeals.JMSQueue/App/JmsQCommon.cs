using System;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using Intel.Opaque.Tools;
using System.Configuration;

namespace Intel.MyDeals.JMSQueueApp
{
    public static class JmsQCommon
    {
        private const string appName = "DQ JMSQueue Sender";
        private const string emailSubjectHeader = "JMSQ: ";

        public static string ENVIRONMENT_OVERRIDE = String.Empty; // Set to local is testing
        public static string SAP_ENVIRONMENT_OVERRIDE = String.Empty;

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
        /// When sleeping a thread, default amount of time
        /// </summary>
        public static int DefaultSleepSeconds
        {
            get
            {
                if (_DefaultSleepSeconds != null) { return (int)_DefaultSleepSeconds; }

                _DefaultSleepSeconds = GetAppSettingInt("DefaultSleepSeconds", 30);

#if DEBUG
                if (System.Diagnostics.Debugger.IsAttached)
                {
                    _DefaultSleepSeconds = 10; // When debugging, set this to something small
                }
#endif

                return (int)_DefaultSleepSeconds;
            }
        }

        private static int? _DefaultSleepSeconds = null;

        /// <summary>
        /// When running upload or expire in "Both" mode, how long to wait in between the two runs.
        /// </summary>
        public static int WaitBetweenSendReceiveSeconds
        {
            get
            {
                if (_WaitBetweenSendReceiveSeconds != null) { return (int)_WaitBetweenSendReceiveSeconds; }

                _WaitBetweenSendReceiveSeconds = GetAppSettingInt("WaitBetweenSendReceive", 480);

#if DEBUG
                if (System.Diagnostics.Debugger.IsAttached)
                {
                    _WaitBetweenSendReceiveSeconds = 10; // When debugging, set this to something small
                }
#endif

                return (int)_WaitBetweenSendReceiveSeconds;
            }
        }

        private static int? _WaitBetweenSendReceiveSeconds = null;

        static JmsQCommon()
        {
            Logger = new List<LogWriter>();
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

        /// <summary>
        ///
        /// </summary>
        /// <param name="ex"></param>
        public static void HandleException(Exception ex)
        {
            HandleException(ex, true);
        }

        /// <summary>
        /// Handle exception and log to DB and event logger
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="logToDB"></param>
        public static void HandleException(Exception ex, bool logToDB)
        {
            // log exception to Event Viewer

            WriteToEventLog(ex, appName, EventLogEntryType.Error);

            try
            {
                SendDebugMail("JMS Queue Error", ex.ToString());
            }
            catch (Exception mailException)
            {
                WriteToEventLog(mailException, appName, EventLogEntryType.Error);
            }

            if (logToDB)
            {
                try
                {
                    DataAccessLayer.InsertExceptionData(ex).Wait();
                }
                catch (Exception insertDataException)
                {
                    // If there is an error logging to database, ensure that exception is logged to the Event Viewer
                    WriteToEventLog(insertDataException, appName, EventLogEntryType.Error);
                }
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

        /// <summary>
        /// Send debug email to developers/ support engineers
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public static void SendDebugMail(string subject, string body)
        {
            if (String.IsNullOrEmpty(subject)) { subject = String.Format("Message From {0}", appName); }

            subject = emailSubjectHeader + subject;

            StringBuilder sb = new StringBuilder(body);
            sb.AppendLine("");
            sb.AppendLine("--------------------------------------------------------------------------------");
            sb.AppendLine("JmsQCommon.SendDebugMail:");

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
                to_email = OpUtilities.ParseEmailList(GetAppSetting(
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
                to_email = OpUtilities.ParseEmailList("dcs.dev.team@intel.com", ",");
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

        /// <summary>
        /// Get int app setting from app.config
        /// </summary>
        /// <param name="app_setting"></param>
        /// <param name="error_default"></param>
        /// <returns></returns>
        public static int GetAppSettingInt(string app_setting, int error_default)
        {
            int ts;
            if (!Int32.TryParse(JmsQCommon.GetAppSetting(app_setting), out ts))
            {
                return ts;
            }

            return error_default;
        }

        /// <summary>
        /// In debig mode changes directory to C drive
        /// </summary>
        /// <param name="absolutePathAndFileName"></param>
        /// <returns></returns>
        private static string CifyPath(string absolutePathAndFileName)
        {
#if DEBUG
            string root = Path.GetPathRoot(absolutePathAndFileName).ToUpper();

            // If in Debug mode and working with a non C root, make it C...

            if (root != @"C:\")
            {
                var drive_exists = System.IO.DriveInfo.GetDrives()
                    .Where(d => d.RootDirectory.FullName.ToUpper() == root)
                    .Any();

                if (!drive_exists)
                {
                    string working = absolutePathAndFileName;

                    var matches = Regex.Matches(root, @"[A-z]:\\");
                    if (matches != null && matches.Count > 0)
                    {
                        foreach (Match m in matches)
                        {
                            working = working.Replace(m.Value, @"C:\");
                        }
                    }

                    if (working != absolutePathAndFileName)
                    {
                        JmsQCommon.Log("absolutePathAndFileName changed to C drive: {0}", working);
                    }

                    return working;
                }
            }
#endif

            return absolutePathAndFileName;
        }

        /// <summary>
        /// Checks if Folder exists if not creates folder
        /// </summary>
        /// <param name="absolutePathAndFileName"></param>
        /// <returns></returns>
        public static bool TryCreateFileFolder(string absolutePathAndFileName)
        {
            absolutePathAndFileName = CifyPath(absolutePathAndFileName);

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
        /// Saves xml file to shared path
        /// </summary>
        /// <param name="absolutePathAndFileName"></param>
        /// <param name="xmlData"></param>
        public static void SaveXmlBatchFile(string absolutePathAndFileName, string xmlData)
        {
            absolutePathAndFileName = CifyPath(absolutePathAndFileName);

            JmsQCommon.Log("SaveXmlBatchFile. Writing {0} bytes to file \"{1}\".", (xmlData ?? "").Length, absolutePathAndFileName);

            TryCreateFileFolder(absolutePathAndFileName);

            //create Xml Batch file that is sent to SAP
            File.WriteAllText(absolutePathAndFileName, xmlData);
        }
    }

    /// <summary>
    /// Send error notification on Receive file from SAP
    /// </summary>
    public class JMSNotification
    {
        public int Flag { get; set; }

        public char JobType { get; set; }

        public string CsvFilePath { get; set; }

        public string ErrorDetails { get; set; }
    }
}