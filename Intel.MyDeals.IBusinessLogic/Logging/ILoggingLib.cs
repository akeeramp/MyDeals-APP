using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ILoggingLib
    {
        LogConfig GetLogConfig();

        void UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages);
    }
}