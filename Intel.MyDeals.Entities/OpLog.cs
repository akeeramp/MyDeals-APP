using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public static class OpLog
    {
        public static OpAppToken OpAppToken { get; set; }

		public static LogConfig LogConfig { get; set; }

        private static DebugLevel DebugLevel = DebugLevel.Application;
		private static bool IsEmailErrorsEnabled = true;
        private static string ToEmailList = "jeffrey.j.yeh@intel.com; philip.w.eckenroth@intel.com"; // TODO this shoud be read from an env aware config setup
        private static string FromEmail = "MyDealsSupport@intel.com";

        private static List<OpLogItem> _logStack = new List<OpLogItem>();		

        #region Constants

        private static class LogConsts
        {
            public const string DefaultStatusMsg = "UNKNOWN Logging Event";
            public const string DefaultDetailMsg = "UNKNOWN Detailed Status";
            public const string MsgQueueMsg = "Logging MsgQueue";
            public const string TimeStampFormat = "hh:mm:ss.fff tt";
            public const DebugLevel DefaultDebugLevel = DebugLevel.Application;
            public const LogCategory DefaultLogCategory = LogCategory.Information;

            private const string MsgHeader = "<HEAD><style>body {{font-size: 11px; font-family: verdana;}}</style></HEAD>";
            public const string ErrorLogBody = "<HTML>" + MsgHeader + "<BODY><p>" +
                "IDSID: {0}<br />" +
                "Role: {1}<br />" +
                "Environment: {2}</p>" +
                "<p>{3}</p>" +
                "</BODY></HTML>";

            public const string EmailEmailSubject = "MyDeals Crash [{0}] - {1}";
            public const string EmailLogItemSubject = "MyDeals Error [{0}] - {1}";
            public const string EmailLogItemBody = "<HTML>" + MsgHeader + "<BODY><p>" +
                "IDSID: {0}<br />" +
                "Role: {1}<br />" +
                "Environment: {2}</p>" +
                "<p>{3}</p>" +
                "</BODY></HTML>";

        }

        #endregion


        #region LogEvent
        /// <summary>
        /// Log a collection of OpMsgs
        /// </summary>
        /// <param name="messages"></param>
        public static void LogEvent(IEnumerable<OpMsg> messages)
        {
            if (messages == null || !messages.Any()) { return; }

            foreach (OpMsg m in messages)
            {
                LogEvent(
                    DebugLevel.Debug, 
                    LogConsts.MsgQueueMsg, 
                    m.GetMessage(true),
                    m.IsError ? LogCategory.Error : (m.IsAlert ? LogCategory.Warning : LogCategory.Information));
            }
        }

        /// <summary>
        /// Quick log a single message
        /// </summary>
        /// <param name="detailMsg"></param>
        public static void LogEvent(string detailMsg)
        {
            LogEvent(
                detailMsg, 
                LogConsts.DefaultLogCategory);
        }

        /// <summary>
        /// Log a Debug message.  This will only log if the logging is set to LogCategory.Debug
        /// </summary>
        /// <param name="detailMsg">Message to log</param>
        public static void LogDebugEvent(string detailMsg)
        {
            LogEvent(
                DebugLevel.Debug,
                detailMsg,
                detailMsg,
                LogConsts.DefaultLogCategory);
        }

        /// <summary>
        /// Log message based on LogCategory setting
        /// </summary>
        /// <param name="detailMsg">Message to log</param>
        /// <param name="cat">Category of the log item... error, warning, information, etc...</param>
        public static void LogEvent(string detailMsg, LogCategory cat)
        {
            LogEvent(
                LogConsts.DefaultDebugLevel, 
                detailMsg, 
                detailMsg, 
                cat);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dLevel">Debugging level... debug, application, performance,etc... </param>
        /// <param name="statusMsg">Short message to log.  This might be used in an email subject line</param>
        /// <param name="detailMsg">Message to log</param>
        /// <param name="cat">Category of the log item... error, warning, information, etc...</param>
        public static void LogEvent(DebugLevel dLevel, string statusMsg, string detailMsg, LogCategory cat)
        {
            LogEventBase(
                dLevel, 
                statusMsg ?? LogConsts.DefaultStatusMsg, 
                detailMsg ?? LogConsts.DefaultDetailMsg, 
                cat);
        }

        /// <summary>
        /// Log an exception event.  Will save the innermost exception
        /// </summary>
        /// <param name="ex">Exception to log.</param>
        public static void LogEvent(Exception ex)
        {
            LogEvent(
                GetInnermostException(ex).Message,
                LogConsts.DefaultLogCategory);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dLevel">Debugging level... debug, application, performance,etc... </param>
        /// <param name="statusMsg">Short message to log.  This might be used in an email subject line</param>
        /// <param name="detailMsg">Message to log</param>
        /// <param name="cat">Category of the log item... error, warning, information, etc...</param>
        private static void LogEventBase(DebugLevel dLevel, string statusMsg, string detailMsg, LogCategory cat)
        {
#if DEBUG
            Debug.WriteLine(DateTime.Now.ToString(LogConsts.TimeStampFormat) + " -> " + cat + " :: " + detailMsg);
#endif

            // if logger is disabled, do not log
            if (LogConfig!=null && !LogConfig.IsActive) return;

            // if log item is debug level and the apps debug level is below debug, do not log
            if (dLevel == DebugLevel.Debug && DebugLevel != DebugLevel.Debug) return;

            // Retrieve user from User Stack
            OpUserToken opUserToken = EnsurePopulated(OpUserStack.MyOpUserToken);

            // Instanciate our log item
            OpLogItem logItem = new OpLogItem
            {
                Category = cat,
                DetailedMessage = detailMsg,
                ShortMessage = statusMsg,
                TimeStamp = DateTime.UtcNow,
                WWID = opUserToken.Usr.WWID.ToString()
            };

            // Add log item to stack
            AddLogItem(logItem);

            // If the log error is critical, email to developer for proactive research
            if (cat == LogCategory.Error)
            {
                logItem.Email();
            }
        }

        #endregion


        #region Email

        /// <summary>
        /// Ensures the OpUserToken contains values.
        /// </summary>
        /// <param name="opUserToken"></param>
        /// <returns></returns>
        private static OpUserToken EnsurePopulated(this OpUserToken opUserToken)
        {
            if (opUserToken == null) opUserToken = new OpUserToken();

            if (opUserToken.Usr == null)
            {
                opUserToken.Usr = new OpUser
                {
                    Idsid = "UNKNOWN",
                    WWID = 00000000,
                    FirstName = "UNKNOWN",
                    LastName = "UNKNOWN"
                };
            }

            if (opUserToken.Role == null)
                opUserToken.Role = new OpRoleType
                {
                    RoleTypeCd = "UNKNOWN",
                    RoleTypeDisplayName = "UNKNOWN"
                };

            return opUserToken;
        }

        /// <summary>
        /// Email a single log item
        /// </summary>
        /// <param name="opLogItem"></param>
        public static void Email(this OpLogItem opLogItem)
        {
            // if email is disabled, exit
            if (!IsEmailErrorsEnabled) return;

            // log message
            OpLogPerf.Log(opLogItem.DetailedMessage);

            // get current user details
            OpUserToken opUserToken = OpUserStack.MyOpUserToken.EnsurePopulated();

            // Get the tools environment
            string env = OpAppToken?.OpEnvironment?.EnvLoc == null ? "UNKNOWN" : OpAppToken.OpEnvironment.EnvLoc.Location;

            // construct message
            string title = string.Format(LogConsts.EmailLogItemSubject, env, opLogItem.ShortMessage);
            string body = string.Format(
                LogConsts.EmailLogItemBody, 
                opUserToken.Usr.Idsid ?? "UNKNOWN", 
                opUserToken.Role.RoleTypeCd ?? "UNKNOWN", 
                env, 
                opLogItem.DetailedMessage);
            
            // Send email
            SendEmail(title, body);
        }

        /// <summary>
        /// Email an exception
        /// </summary>
        /// <param name="ex"></param>
        public static void EmailError(Exception ex)
        {
            // if email is disabled, exit
            if (!IsEmailErrorsEnabled) return;

            // log message
            OpLogPerf.Log(ex);

            // get current user details
            OpUserToken opUserToken = OpUserStack.MyOpUserToken.EnsurePopulated();

            // Get the tools environment
            string env = OpAppToken?.OpEnvironment?.EnvLoc == null ? "UNKNOWN" : OpAppToken.OpEnvironment.EnvLoc.Location;

            // construct message
            string title = string.Format(LogConsts.EmailEmailSubject, env, ex.Message);
            string body = string.Format(LogConsts.ErrorLogBody, opUserToken.Usr.Idsid, opUserToken.Role.RoleTypeCd, env, ex);

            // Send email
            SendEmail(title, body);
        }

        /// <summary>
        /// Send email message
        /// </summary>
        /// <param name="subject">Subject line in email</param>
        /// <param name="body">HTML body of email</param>
        public static void SendEmail(string subject, string body)
        {
            if (string.IsNullOrEmpty(subject))
                subject = "Unknown Subject";

            if (string.IsNullOrEmpty(body))
                body = "Unknown Body";
            
            subject = subject.Replace("\r\n", "");

            // TODO Normally we would read config from env conscious config file... settly for hard codding until we can re-establish that
            //string env = DataAccess.Config.CurrentDatabaseOpEnvironment.EnvLoc.EnvType.Name.ToUpper().Trim();
            string mailToList = ToEmailList;

            // create mail message
            var myMail = new MailMessage
            {
                Subject = subject,
                Body = body,
                From = new MailAddress(FromEmail),
                IsBodyHtml = true
            };
            myMail.To.Add(OpUtilities.ParseEmailList(mailToList, ","));

            using (var client = new SmtpClient())
            {
                if (string.IsNullOrEmpty(client.Host))
                {
                    // TODO: Remove later...
                    // A bit hackish, but saves some troubleshooting...
                    client.Host = "mail.intel.com";
                }

                try
                {
                    client.Send(myMail);
                }
                catch (Exception)
                {
                    // Not sure how to handle this.  Throwing errors from a log is not critical, but would be nice to know if it fails
                }
            }



        }

        #endregion


        #region Log Stack

        /// <summary>
        /// Ensure log stack is created
        /// </summary>
        private static void ValidateStack()
        {
            if (_logStack == null) _logStack = new List<OpLogItem>();
        }

        /// <summary>
        /// Clear the log stack
        /// </summary>
        public static void ClearStack()
        {
            ValidateStack();
            _logStack.Clear();
        }

        /// <summary>
        /// Add log item to the stack
        /// </summary>
        /// <param name="opLogItem"></param>
        public static void AddLogItem(OpLogItem opLogItem)
        {
            ValidateStack();
            _logStack.Add(opLogItem);
        }

        /// <summary>
        /// Get the entire log stack
        /// </summary>
        /// <returns></returns>
        public static List<OpLogItem> GetLogStack()
        {
            return _logStack;
        }

        /// <summary>
        /// Get only log items I added to the stack
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<OpLogItem> GetMyLogStack()
        {
            string myWwid = OpUserStack.MyOpUserToken.Usr.WWID.ToString();
            return _logStack.Where(l => l.WWID == myWwid);
        }

        #endregion


        #region Error Handling

        /// <summary>
        /// Handles exceptions we encounter by logging and emailing exception details
        /// </summary>
        /// <param name="ex">Exception thrown</param>
        public static void HandleException(Exception ex)
        {
            LogEvent(ex);
            EmailError(ex); //Note: LogEvent seems to already sends an email if the exception is critical enough. Consider revisiting what we consider "critical"?
        }

        #endregion


        #region Log Utils

        /// <summary>
        /// Get the inner most exception message from exception
        /// </summary>
        /// <param name="exception">Exception thrown</param>
        /// <returns></returns>
        public static Exception GetInnermostException(Exception exception)
        {
            while (exception.InnerException != null)
            {
                // goodie... good old fashion recursion
                exception = GetInnermostException(exception.InnerException);
            }

            return exception;
        }

        public static void SetDebugLevel(DebugLevel debugLevel)
        {
            DebugLevel = debugLevel;
        }

        public static DebugLevel GetDebugLevel() => DebugLevel;

        public static void SetToEmailList(string toEmailList)
        {
            ToEmailList = toEmailList;
        }

        public static string GetToEmailList() => ToEmailList;

        #endregion

    }
}
