using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using Intel.Opaque;
using Intel.Opaque.Tools;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.Entities.Logging
{
    public class EmailExLogPerf : IOpLogPerf
    {
        private static string _toEmailList = "michael.h.tipping@intel.com, mahesh.biradar@intel.com, saurav.kundu@intel.com"; // TODO: this should be read from an environment aware constants config setup. The from email might also be from a config file or constant. Mike prefers constants

//// not sure why this #if debug doesn't work, but we aren't getting emails from DEV/ITT/etc servers anymore. temp commenting out.
//#if DEBUG
//        private static string ToEmailList = OpUserStack.MyOpUserToken.Usr.Email;
//#else
//        private static string ToEmailList = "michael.h.tipping@intel.com, mahesh.biradar@intel.com, saurav.kundu@intel.com"; // TODO: this should be read from an environment aware constants config setup. The from email might also be from a config file or constant. Mike prefers constants
//#endif

        private static string _fromEmail = "MyDealsSupport@intel.com";
        public string EmailEmailSubject = "MyDeals Error [{0}] - {1}";

        #region Constructors

        public EmailExLogPerf()
        {
        }

        public EmailExLogPerf(string emailList) : this(emailList, true)
        {
        }

        public EmailExLogPerf(string emailList, bool appendDetails)
        {
            _toEmailList = emailList;
        }

        #endregion Constructors

        /// <summary>
        /// Determines if writer-specific logging is enabled and creates a writer if it is
        /// </summary>
        /// Note: Whether the writer's logging is enabled or not is determined by its name's presence in the writer's config string or parameter in OpLogPerfHelper.InitWriters()).
        /// Note: This function gets called by OpLogPerfHelper upon initializing writers via OpLogPerfHelper.InitWriters()
        public static IOpLogPerf ILogPerfFactory(string initFlag, Dictionary<string, object> initParams)
        {
            // Check that the init flag is asking for this writer
            // To support extensibility, allow for multiple named factories in other assemblies/classes...
            string sf = (initFlag ?? "").Trim().ToUpper();
            return !sf.StartsWith("EMAILEX") ? null : new EmailExLogPerf();
        }

        /// <summary>
        /// Email an exception
        /// </summary>
        /// <param name="msg"></param>
        public void Log(OpLogPerfMessage msg)
        {
            // Only email errors
            if (!msg.IsError) { return; }

            // get current user details
            OpUserToken opUserToken = OpUserStack.MyOpUserToken.EnsurePopulated();

            // Get the tools environment
            string env = OpLog.GetEnv();

            // construct message
            string shortMsg = msg.Message.Truncate(50) + "...";  // Was string shortMsg = msg.Message.Truncate(50) + "...";
            string title = string.Format(EmailEmailSubject, env, shortMsg);

            string header = "";
            header += "<style>BODY,P,DIV { font-size: 10px; font-family: arial; }</style><div>";
            header += "<b>User:</b> " + opUserToken.Usr.FullName + "</br>";
            header += "<b>Role:</b> " + opUserToken.Role.RoleTypeCd + "</hr></div>";

            string body = header + OpLogPerfHelper.MachineDetails;
            body += "<div>" + msg.Message + "</div>";

            body = body.Replace("\r\n", "</br>");

            // Send email
            SendEmail(title, body);
        }

        #region Email

        /// <summary>
        /// Send email message
        /// </summary>
        /// <param name="subject">Subject line in email</param>
        /// <param name="body">HTML body of email</param>
        public static bool SendEmail(string subject, string body)
        {
            if (string.IsNullOrEmpty(subject))
                subject = "Unknown Subject";

            if (string.IsNullOrEmpty(body))
                body = "Unknown Body";

            subject = subject.Replace("\r\n", "");

            // TODO Normally we would read config from env conscious config file... settly for hard codding until we can re-establish that
            //string env = DataAccess.Config.CurrentDatabaseOpEnvironment.EnvLoc.EnvType.Name.ToUpper().Trim();
            string mailToList = _toEmailList;

            // create mail message
            var myMail = new MailMessage
            {
                Subject = subject,
                Body = body,
                From = new MailAddress(_fromEmail),
                IsBodyHtml = true
            };
            myMail.To.Add(OpUtilities.ParseEmailList(mailToList, ","));

            using (var client = new SmtpClient())
            {
                if (string.IsNullOrEmpty(client.Host))
                {
                    // TODO: Remove later...
                    // A bit hackish, but saves some troubleshooting...
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential("SYS_SYSSYSBOSEMAILS", StringEncrypter.StringDecrypt("04601922222300Qa16209320615603P1506sQ2P9321303605Z151C00324514325202h913400z212924320G530930U02521307e20c24025eF21l20uZ1FO1O13620402315204H3917g21242130F091f", "Smtp_Password"));
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.EnableSsl = true;
                    //SMTP Change for Port Number and Host Name
                    client.Host = "smtpauth.intel.com";
                    client.Port = 587;
                    client.Send(myMail);
                }

                try
                {
                    client.Send(myMail);
                    return true;
                }
                catch (Exception)
                {
                    // Not sure how to handle this.  Throwing errors from a log is not critical, but would be nice to know if it fails
#if DEBUG
                    System.Diagnostics.Debug.WriteLine("SendEmail has failed.");
#endif
                    return false;
                }
            }
        }

        #endregion Email

        /// <summary>
        /// Checks if the writer wants additional details to log, such as threadID
        /// </summary>
        public bool AppendDetails => true;

        public OpLogPerfMessage.FormatMode Format { get; set; } = OpLogPerfMessage.FormatMode.TwoLine;

        public Func<string> MessageRider { set; get; }

        #region Not implemented

        public void Clear()
        {
            // Not implemented
        }

        public void OnShutdown()
        {
            // Not implemented
        }

        public void Flush()
        {
            // Not implemented
        }

        public void AddAttachment(string fullFilePath)
        {
            // Not implemented
        }

        #endregion Not implemented
    }
}