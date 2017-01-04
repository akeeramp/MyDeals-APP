using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities.Logging;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Logging")]
    public class LoggingController : BaseApiController
    {
        private readonly ILoggingLib _loggingLib;

        public LoggingController(ILoggingLib _loggingLib)
        {
            this._loggingLib = _loggingLib;
        }

        /// <summary>
        ///  Upload Logging data to database used by the Entities layer
        /// </summary>
        /// <param name="data"> A Json object consisting of DbLogPerfMessages </param>
        [HttpPost]
        [Route("UploadLogPerfLogs")]
        public bool UploadLogPerfLogs([FromBody]dynamic data)
        {
            try
            {
                return (_loggingLib).UploadDbLogPerfLogs(
                    OpSerializeHelper.FromJsonString<DbLogPerfMessage[]>(
                        OpZipUtils.DecompressString((string)(data.Messages))
                    )
                );
            }
            catch (Exception ex)
            {
                // Don't use LogPerf here to avoid infinite loop
                System.Diagnostics.Debug.WriteLine(ex);
				return false;
            }
        }

        /// <summary>
        /// API for the web UI to send information logs to
        /// </summary>
        /// <param name="message"> A string which will be logged </param>
        [HttpPost]
        [Route("PostLogMessage")]
        public bool PostLogMessage([FromBody] string message)
        {
            bool givemebackmybreakpointswtfvs = true;
            try
            {
                OpLogPerf.Log(message, LogCategory.Information);
                return true;
            }
            catch { return false; }
        }

        /// <summary>
        /// API for the web UI to send warning logs to
        /// </summary>
        /// <param name="message"> A string which will be logged </param>
        [HttpPost]
        [Route("PostLogWarning")]
        public bool PostLogWarning([FromBody] string message)
        {
            try
            {
                OpLogPerf.Log(message, LogCategory.Warning);
                return true;
            }
            catch { return false; }
        }

        /// <summary>
        /// API for the web UI to send error logs to
        /// </summary>
        /// <param name="message"> A string which will be logged </param>
        [HttpPost]
        [Route("LogError")]
        public bool LogError([FromBody] string message)
        {
            try
            {
                OpLogPerf.Log(message, LogCategory.Error);
                return true;
            }
            catch { return false; }
        }
    }
}