using System;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers.API
{
    public class LoggingController : BaseApiController
	{
		/// <summary>
		///  Upload Logging data to database
		/// </summary>
		/// <param name="data"> A Json object consisting of DbLogPerfMessages </param>
		[HttpPost]
		[Route("api/Logging/UploadLogPrefLogs")]
		public void UploadLogPrefLogs([FromBody]dynamic data)
		{
			try
			{
				(new LoggingLib()).UploadDbLogPrefLogs(
					OpSerializeHelper.FromJsonString<DbLogPerfMessage[]>(
						OpZipUtils.DecompressString((string)(data.Messages))
					)
				);
			}
			catch (Exception ex)
			{
				// Don't use LogPerf here to avoid infinite loop
				System.Diagnostics.Debug.WriteLine(ex);
			}
		}

		/// <summary>
		/// API for the UI to send logs to
		/// </summary>
		/// <param name="message"> A string which will be logged </param>
		[HttpPost]
		[Route("api/Logging/UploadLogMessage")]
		public void UploadLogMessage(String message)
		{
			OpLogPerf.Log(message);
		}

	}
}
