using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Tools;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary.Logging
{
	public class LoggingDataLib
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
		/// Saves a List of log data to db 
		/// </summary>
		public void UploadDbLogPrefLogs(IEnumerable<DbLogPerfMessage> messages)
		{
			if (messages == null || !messages.Any()) { return; }

			const int ZIP_CUTOFF_LENGTH = 3000; // Seemed roughly optimal in initial testing
			int msgCount = messages.Count();
			
			t_db_log dt = new t_db_log();
			int IX_STEP = dt.Columns.Add("STEP", typeof(int)).Ordinal;
			int IX_LOG_DTM = dt.Columns.Add("LOG_DTM", typeof(DateTime)).Ordinal;
			int IX_LGN_NM = dt.Columns.Add("LGN_NM", typeof(string)).Ordinal;
			int IX_USR_NM = dt.Columns.Add("USR_NM", typeof(string)).Ordinal;
			int IX_CLNT_MCHN_NM = dt.Columns.Add("CLNT_MCHN_NM", typeof(string)).Ordinal;
			int IX_SRVR = dt.Columns.Add("SRVR", typeof(string)).Ordinal;
			int IX_MSG_SRC = dt.Columns.Add("MSG_SRC", typeof(string)).Ordinal;
			int IX_MTHD = dt.Columns.Add("MTHD", typeof(string)).Ordinal;
			int IX_MSG = dt.Columns.Add("MSG", typeof(string)).Ordinal;
			int IX_STRT_DTM = dt.Columns.Add("SRT_DTM", typeof(DateTime)).Ordinal;
			int IX_END_DTM = dt.Columns.Add("END_DTM", typeof(DateTime)).Ordinal;
			int IX_REC_CNT = dt.Columns.Add("REC_CNT", typeof(int)).Ordinal;
			int IX_THRD_ID = dt.Columns.Add("THRD_ID", typeof(int)).Ordinal;
			int IX_IS_ZIP = dt.Columns.Add("IS_ZIP", typeof(int)).Ordinal;
			int IX_ERR_MSG = dt.Columns.Add("ERR_MSG", typeof(string)).Ordinal;
			

			foreach (var msg in messages)
			{
				var r = dt.NewRow();
				bool is_zip = (msg.Size >= ZIP_CUTOFF_LENGTH);
				
				r[IX_STEP] = msg.STEP;
				r[IX_LOG_DTM] = msg.LOG_DTM;
				r[IX_LGN_NM] = msg.LGN_NM; // TODO: is the lgn_nm different than the usr_nm?
				r[IX_USR_NM] = msg.USR_NM;
				r[IX_CLNT_MCHN_NM] = msg.CLNT_MCHN_NM;
				r[IX_SRVR] = msg.SRVR; 
				r[IX_MSG_SRC] = msg.MSG_SRC;
				r[IX_MTHD] = msg.MTHD;
				r[IX_MSG] = msg.MSG;
				r[IX_STRT_DTM] = msg.STRT_DTM;
				r[IX_END_DTM] = msg.END_DTM;
				r[IX_REC_CNT] = msgCount;
				r[IX_THRD_ID] = msg.THRD_ID;
				r[IX_IS_ZIP] = is_zip;
				r[IX_ERR_MSG] = msg.ERR_MSG;
				dt.Rows.Add(r);
			}

			DataSet dsCheckConstraintErrors = null;
			var ret = new List<AdminApplications>();
			try
			{
				Procs.dbo.PR_INS_DB_LOG_BULK cmd = new Procs.dbo.PR_INS_DB_LOG_BULK()
				{
					in_db_log = dt,
					in_wwid = 11525392 //OpUserStack.MyOpUserToken.Usr.WWID 
					// TODO josiTODO take out hard coded id... Ask about why default user has 123456 wwid :<
				};

				DataAccess.ExecuteDataSet(cmd, null, out dsCheckConstraintErrors);
			}
			catch (Exception ex)
			{
				if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
				{
					// DO SOME ERROR HANDLING
				}
				throw;
			}
		}
		
	}
}
