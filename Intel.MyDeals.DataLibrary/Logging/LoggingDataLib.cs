using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class LoggingDataLib : ILoggingDataLib
    {
        /// <summary>
        ///  Get the Log config data form the database to determine how and if we should use our logging code.
        /// </summary>
        ///  Note that the SP [PR_GET_LOG_CONFIG_DATA] parses the XML in the db's MsgSrc column for us, so we don't have to.
        public LogConfig GetLogConfig()
        {
            var ret = new List<LogConfig>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_GET_LOG_CONFIG_DATA
            {
                in_msg_src = "UI_LOG"
            }))
            {
                int IDX_msgSrc = DB.GetReaderOrdinal(rdr, "MsgSrc");
                int IDX_isActive = DB.GetReaderOrdinal(rdr, "Isactive");

                while (rdr.Read())
                {
                    ret.Add(new LogConfig
                    {
                        MsgSrc = rdr.IsDBNull(IDX_msgSrc) ? default(String) : rdr.GetFieldValue<String>(IDX_msgSrc),
                        IsActive = rdr.IsDBNull(IDX_isActive) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_isActive),
                    });
                } // while
            }

            return ret.FirstOrDefault();
        }


        /// <summary>
        ///To get the Batch Job Timing 
        /// </summary>
        public List<batchJobTiming> getBatchJobTiming(string logType)
        {
            var ret = new List<batchJobTiming>();
            try
            {
                Procs.dbo.PR_MYDL_GET_BTCH_DB_LOG_DTL cmd = new Procs.dbo.PR_MYDL_GET_BTCH_DB_LOG_DTL()
                {

                    in_log_type = logType
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {

                    int IDX_BTCH_JOB_EXEC_DTM = DB.GetReaderOrdinal(rdr, "BTCH_JOB_EXEC_DTM");
                    int IDX_BTCH_JOB_NM = DB.GetReaderOrdinal(rdr, "BTCH_JOB_NM");
                    int IDX_BTCH_JOB_SCH_TM = DB.GetReaderOrdinal(rdr, "BTCH_JOB_SCH_TM");
                    int IDX_BTCH_JOB_STS = DB.GetReaderOrdinal(rdr, "BTCH_JOB_STS");
                    int IDX_BTCH_TYPE = DB.GetReaderOrdinal(rdr, "BTCH_TYPE");
                    int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");

                    while (rdr.Read())
                    {
                        ret.Add(new batchJobTiming
                        {
                            BTCH_JOB_EXEC_DTM = (IDX_BTCH_JOB_EXEC_DTM < 0 || rdr.IsDBNull(IDX_BTCH_JOB_EXEC_DTM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BTCH_JOB_EXEC_DTM),
                            BTCH_JOB_NM = (IDX_BTCH_JOB_NM < 0 || rdr.IsDBNull(IDX_BTCH_JOB_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BTCH_JOB_NM),
                            BTCH_JOB_SCH_TM = (IDX_BTCH_JOB_SCH_TM < 0 || rdr.IsDBNull(IDX_BTCH_JOB_SCH_TM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BTCH_JOB_SCH_TM),
                            BTCH_JOB_STS = (IDX_BTCH_JOB_STS < 0 || rdr.IsDBNull(IDX_BTCH_JOB_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BTCH_JOB_STS),
                            BTCH_TYPE = (IDX_BTCH_TYPE < 0 || rdr.IsDBNull(IDX_BTCH_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BTCH_TYPE),
                            ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG)
                        });
                    } // while
                   
                }
            }
            catch (Exception)
            {
                throw;
            }
            return ret;
        }

        /// <summary>
        /// Saves a List of log data to db,
        /// Called from DbLogPerf asynchronously
        /// </summary>
        public async Task<bool> UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            if (messages == null || !messages.Any()) { return false; }

            t_db_log dt = new t_db_log(3000);

            dt.AddRows(messages, messages.Count());

            try
            {
                Procs.dbo.PR_INS_DB_LOG_BULK cmd = new Procs.dbo.PR_INS_DB_LOG_BULK()
                {
                    in_db_log = dt,
                    in_wwid = OpUserStack.MyOpUserToken.EnsurePopulated().Usr.WWID
                };
                using (var q = await DataAccess.ExecuteReaderAsync(cmd))
                {
                }
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> UploadUiPerfLogs(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            var performanceTimes = logPerformanceTimes as IList<LogPerformanceTime> ?? logPerformanceTimes.ToList();
            if (!performanceTimes.Any()) { return false; }

            t_ui_log dt = new t_ui_log();

            dt.AddRows(performanceTimes, performanceTimes.Count);

            try
            {
                Procs.dbo.PR_INS_UI_LOG_BULK cmd = new Procs.dbo.PR_INS_UI_LOG_BULK()
                {
                    in_ui_log = dt,
                    in_wwid = OpUserStack.MyOpUserToken.EnsurePopulated().Usr.WWID
                };
                using (var async = await DataAccess.ExecuteReaderAsync(cmd))
                {
                }
            }
            catch (Exception)
            {
                throw;
            }
            return true;
        }

        public bool UploadUiPerfLogsSync(IEnumerable<LogPerformanceTime> logPerformanceTimes)
        {
            var performanceTimes = logPerformanceTimes as IList<LogPerformanceTime> ?? logPerformanceTimes.ToList();
            if (!performanceTimes.Any()) { return false; }

            t_ui_log dt = new t_ui_log();

            dt.AddRows(performanceTimes, performanceTimes.Count);

            try
            {
                Procs.dbo.PR_INS_UI_LOG_BULK cmd = new Procs.dbo.PR_INS_UI_LOG_BULK()
                {
                    in_ui_log = dt,
                    in_wwid = OpUserStack.MyOpUserToken.EnsurePopulated().Usr.WWID
                };
                using (var sync = DataAccess.ExecuteReader(cmd))
                {
                }
            }
            catch (Exception)
            {
                throw;
            }
            return true;
        }
    }
}