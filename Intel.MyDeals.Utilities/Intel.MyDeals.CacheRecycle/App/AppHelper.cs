using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;

namespace Intel.MyDeals.CacheRecycle.App
{
    public static class AppHelper
    {
        private const string appName = "App Pool Recycler";
        public static List<LogWriter> Logger { set; get; }

        public delegate void LogWriter(string mgs, params object[] args);

        static AppHelper()
        {
            Logger = new List<LogWriter>();
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
        /// Writes to the specified logger(if any)
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
        /// Handles the exception
        /// </summary>
        /// <param name="ex">The Exception object</param>
        internal static void HandleException(Exception ex)
        {
            // Log the exception to Event Viewer
            WriteToEventLog(ex, appName, EventLogEntryType.Error);
        }

        /// <summary>
        /// Write to event logger
        /// </summary>
        /// <param name="ex">The Exception</param>
        /// <param name="appName">The App Name</param>
        /// <param name="eventType">The Event Log Type</param>
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
    }

    /// <summary>
    /// The AdminConstant Class
    /// </summary>
    public class AdminConstant
    {
        public int CNST_SID { get; set; }
        public string CNST_DESC { get; set; }
        public string CNST_NM { get; set; }
        public string CNST_VAL_TXT { get; set; }
        public bool UI_UPD_FLG { get; set; }
    }
}
