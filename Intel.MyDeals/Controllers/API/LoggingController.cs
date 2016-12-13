using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Runtime.Serialization;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers.API
{
    public class LoggingController : ApiController 
	{
		/// <summary>
		///  Upload Logging data to database
		/// </summary>
		/// <param name="data"> A Json object consisting of { OpSerializeHelper.ToJsonString(messages, true), MachineName = machine_name } </param>
		///  Note that the SP [PR_GET_LOG_CONFIG_DATA] parses the XML in the db's MsgSrc column for us, so we don't have to.
		[HttpPost]
		[Route("api/Logging/UploadLogPrefLogs")]
		public bool UploadLogPrefLogs([FromBody]dynamic data) 
		{
			try
			{
				(new LoggingLib()).UploadDbLogPrefLogs(
					OpSerializeHelper.FromJsonString<DbLogPerfMessage[]>(
						OpZipUtils.DecompressString((string)(data.Messages))
					)
				);
				return true;
			}
			catch (Exception ex)
			{
				// Don't use LogPerf here to avoid infinite loop
				System.Diagnostics.Debug.WriteLine(ex);
			}
			return false;
		}


		/// <summary>
		///  Upload Logging data to database
		/// </summary>
		/// <param name="messages"> A Json object consisting of { OpSerializeHelper.ToJsonString(messages, true), MachineName = machine_name } </param>
		///  Note that the SP [PR_GET_LOG_CONFIG_DATA] parses the XML in the db's MsgSrc column for us, so we don't have to.	
		[HttpPost]
		[Route("api/Logging/UploadLogMessage")]
		public void UploadLogMessage(String message, bool isError) // int workbook_id, DcsWorkbookLockAction action
		{
			// TODO josiTODO Make API controller for UI to call	
			OpLogPerf.Log(message);
		}

	}
}
