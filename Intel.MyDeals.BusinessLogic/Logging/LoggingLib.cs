using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class LoggingLib : ILoggingLib
    {
        private readonly ILoggingDataLib _loggingDataLib;

        public LoggingLib(ILoggingDataLib loggingDataLib)
        {
            _loggingDataLib = loggingDataLib;
        }

        /// <summary>
        /// As LoggingLib is used in OpAppconfig, which is a static class we cannot inject dependency to it,
        /// Hence keeping this constructor
        /// </summary>
        public LoggingLib()
        {
            _loggingDataLib = new LoggingDataLib();
        }

        public LogConfig GetLogConfig()
        {
            return _loggingDataLib.GetLogConfig();
        }

        public bool UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            _loggingDataLib.UploadDbLogPerfLogs(messages);
            return true;
        }

        public List<batchJobTiming> getBatchJobTiming(string logType)
        {
            return _loggingDataLib.getBatchJobTiming(logType).ToList();
           
        }

        public bool UploadUiPerfLogs(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            return _loggingDataLib.UploadUiPerfLogs(logPerformanceTimes).Result;
        }

        public bool UploadUiPerfLogsSync(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            return _loggingDataLib.UploadUiPerfLogsSync(logPerformanceTimes);
        }
    }
}