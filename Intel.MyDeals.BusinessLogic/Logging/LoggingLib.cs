using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class LoggingLib : ILoggingLib
    {
        private readonly ILoggingDataLib _loggingDataLib;

        public LoggingLib(ILoggingDataLib _loggingDataLib)
        {
            this._loggingDataLib = _loggingDataLib;
        }

        /// <summary>
        /// As LoggingLib is used in OpAppconfig, which is a static class we cannot inject dependency to it,
        /// Hence keeping this constructor
        /// </summary>
        public LoggingLib()
        {
            this._loggingDataLib = new LoggingDataLib();
        }

        public LogConfig GetLogConfig()
        {
            return _loggingDataLib.GetLogConfig();
        }

        public bool UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            return _loggingDataLib.UploadDbLogPerfLogs(messages);
        }
    }
}