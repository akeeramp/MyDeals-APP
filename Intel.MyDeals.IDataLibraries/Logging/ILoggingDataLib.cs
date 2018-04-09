using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ILoggingDataLib
    {
        LogConfig GetLogConfig();

        bool UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages);

        Task<bool> UploadUiPerfLogs(IEnumerable<LogPerformanceTime> logPerformanceTimes);

        bool UploadUiPerfLogsSync(IEnumerable<LogPerformanceTime> logPerformanceTimes);
    }
}