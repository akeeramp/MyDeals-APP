using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ILoggingDataLib
    {
        LogConfig GetLogConfig();

        void UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages);
    }
}