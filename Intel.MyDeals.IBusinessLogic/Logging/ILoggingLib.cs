using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ILoggingLib
    {
        LogConfig GetLogConfig();

        bool UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages);

        bool UploadUiPerfLogs(IEnumerable<LogPerformanceTime> logPerformanceTimes);
        bool UploadUiPerfLogsSync(IEnumerable<LogPerformanceTime> logPerformanceTimes);
    }
}