using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.Logging;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals.BusinesssLogic
{
	public class LoggingLib
	{
		public LogConfig GetLogConfig()
		{
			return new LoggingDataLib().GetLogConfig();
		}
		public void UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
		{
			new LoggingDataLib().UploadDbLogPerfLogs(messages);
		}
	}
}
