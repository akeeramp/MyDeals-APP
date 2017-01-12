using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities.Logging;

namespace Intel.MyDeals.Entities
{
	public class t_db_log : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.t_db_log";
		private int ZIP_CUTOFF_LENGTH = 3000; // Seemed roughly optimal in initial testing

		public t_db_log()
			: base(DATA_TABLE_NAME)
		{ }
		public t_db_log(int zipCutOffLength)
			: base(DATA_TABLE_NAME)
		{
			ZIP_CUTOFF_LENGTH = zipCutOffLength;
		}

		public t_db_log(SerializationInfo info, StreamingContext context)
			: base(DATA_TABLE_NAME, info, context) { }

		protected override void Init()
		{
			//// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
			this.Columns.Add("STEP", typeof(int));
			this.Columns.Add("LOG_DTM", typeof(DateTime));
			this.Columns.Add("LGN_NM", typeof(string));
			this.Columns.Add("USR_NM", typeof(string));
			this.Columns.Add("CLNT_MCHN_NM", typeof(string));
			this.Columns.Add("SRVR", typeof(string));
			this.Columns.Add("MSG_SRC", typeof(string));
			this.Columns.Add("MTHD", typeof(string));
			this.Columns.Add("MSG", typeof(string));
			this.Columns.Add("STRT_DTM", typeof(DateTime));
			this.Columns.Add("END_DTM", typeof(DateTime));
			this.Columns.Add("REC_CNT", typeof(int));
			this.Columns.Add("THRD_ID", typeof(int));
			this.Columns.Add("IS_ZIP", typeof(int));
			this.Columns.Add("ERR_MSG", typeof(string));
		}

		public void AddRow(DbLogPerfMessage itm, int msgCount)
		{
			var r = this.NewRow();
			bool is_zip = (itm.Size >= ZIP_CUTOFF_LENGTH);

			r["STEP"] = itm.STEP;
			r["LOG_DTM"] = itm.LOG_DTM;
			r["LGN_NM"] = itm.LGN_NM; // TODO: is the lgn_nm different than the usr_nm?
			r["USR_NM"] = itm.USR_NM;
			r["CLNT_MCHN_NM"] = itm.CLNT_MCHN_NM;
			r["SRVR"] = itm.SRVR;
			r["MSG_SRC"] = itm.MSG_SRC;
			r["MTHD"] = itm.MTHD;
			r["MSG"] = itm.MSG;
			r["STRT_DTM"] = itm.STRT_DTM;
			r["END_DTM"] = itm.END_DTM;
			r["REC_CNT"] = msgCount;
			r["THRD_ID"] = itm.THRD_ID;
			r["IS_ZIP"] = is_zip;
			r["ERR_MSG"] = itm.ERR_MSG;
			this.Rows.Add(r);
		}

		public void AddRows(IEnumerable<DbLogPerfMessage> itms, int msgCount)
		{
			foreach (DbLogPerfMessage itm in itms)
			{
				var r = this.NewRow();
				bool is_zip = (itm.Size >= ZIP_CUTOFF_LENGTH);

				r["STEP"] = itm.STEP;
				r["LOG_DTM"] = itm.LOG_DTM;
				r["LGN_NM"] = itm.LGN_NM; // TODO: is the lgn_nm different than the usr_nm?
				r["USR_NM"] = itm.USR_NM;
				r["CLNT_MCHN_NM"] = itm.CLNT_MCHN_NM;
				r["SRVR"] = itm.SRVR;
				r["MSG_SRC"] = itm.MSG_SRC;
				r["MTHD"] = itm.MTHD;
				r["MSG"] = itm.MSG;
				r["STRT_DTM"] = itm.STRT_DTM;
				r["END_DTM"] = itm.END_DTM;
				r["REC_CNT"] = msgCount;
				r["THRD_ID"] = itm.THRD_ID;
				r["IS_ZIP"] = is_zip;
				r["ERR_MSG"] = itm.ERR_MSG;
				this.Rows.Add(r);
			}
		}
	}
}
