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
        /// Saves a List of log data to db,
        /// Called from DbLogPerf asynchronously
        /// </summary>
        public async Task<bool> UploadDbLogPerfLogs(IEnumerable<DbLogPerfMessage> messages)
        {
            if (messages == null || !messages.Any()) { return false; }

            t_db_log dt = new t_db_log(3000);

            dt.AddRows(messages, messages.Count());

            var ret = new List<AdminApplications>();
            try
            {
                Procs.dbo.PR_INS_DB_LOG_BULK cmd = new Procs.dbo.PR_INS_DB_LOG_BULK()
                {
                    in_db_log = dt,
                    in_wwid = OpUserStack.MyOpUserToken.EnsurePopulated().Usr.WWID
                };
                await DataAccess.ExecuteReaderAsync(cmd);
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}