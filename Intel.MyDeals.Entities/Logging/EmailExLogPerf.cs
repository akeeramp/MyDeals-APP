using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Intel.Opaque;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities.Logging
{
	public class EmailExLogPerf : IOpLogPerf
	{
		private static string ToEmailList = "josephine.a.juang@intel.com"; // TODO: this shoud be read from an environment aware constants config setup. The from email might also be from a config file or constant. Mike prefers constants
		private static string FromEmail = "MyDealsSupport@intel.com";
		public string EmailEmailSubject = "MyDeals Error [{0}] - {1}";
		
		#region Constructors

		public EmailExLogPerf() { }
		public EmailExLogPerf(string emailList) : this(emailList, true) { }

		public EmailExLogPerf(string emailList, bool appendDetails)
		{
			ToEmailList = emailList;
		}
		#endregion


		/// <summary>
		/// Determines if writer-specific logging is enabled and creates a writer if it is 
		/// </summary>
		/// Note: Whether the writer's logging is enabled or not is determined by its name's presence in the writer's config string or parameter in OpLogPerfHelper.InitWriters()).
		/// Note: This function gets called by OpLogPerfHelper upon initializing writers via OpLogPerfHelper.InitWriters()
		public static IOpLogPerf ILogPerfFactory(string init_flag, Dictionary<string, object> init_params)
		{
			// Check that the init flag is asking for this writer
			// To support extensibility, allow for multiple named factories in other assemblies/classes...
			string sf = (init_flag ?? "").Trim().ToUpper();
			if (!sf.StartsWith("EMAILEX")) { return null; }
			return new EmailExLogPerf();
		}


		/// <summary>
		/// Email an exception
		/// </summary>
		/// <param name="ex"></param>
		public void Log(OpLogPerfMessage msg)
		{
			// Only email errors
			if (!msg.IsError) { return; }

			// get current user details
			OpUserToken opUserToken = OpUserStack.MyOpUserToken.EnsurePopulated();

			// Get the tools environment
			string env = OpLog.GetEnv();

			// construct message
			string shortMsg = msg.Message.Truncate(50) + "...";
			string title = string.Format(EmailEmailSubject, env, shortMsg);
			string body = OpLogPerfHelper.MachineDetails;
			body += msg.Message;

			// Send email
			SendEmail(title, body);
		}
		
		#region Email
		
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
#if DEBUG
					System.Diagnostics.Debug.WriteLine("SendEmail has failed.");
#endif
				}
			}
		}
		#endregion


		/// <summary>
		/// Checks if the writer wants additional details to log, such as threadID
		/// </summary>
		public bool AppendDetails
		{
			get { return true; }
		}

		public OpLogPerfMessage.FormatMode Format
		{
			get
			{
				return _Format;
			}
			set
			{
				_Format = value;
			}
		}
		private OpLogPerfMessage.FormatMode _Format = OpLogPerfMessage.FormatMode.TwoLine;

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
		#endregion


	}

}
