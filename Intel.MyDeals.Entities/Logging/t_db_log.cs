using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
	public class t_db_log : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.t_db_log";

		public t_db_log()
			: base(DATA_TABLE_NAME)
		{}
		
		public t_db_log(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }
		
		protected override void Init()
		{
			//// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
			//this.Columns.Add("STEP", typeof(int));
			//this.Columns.Add("LOG_DTM", typeof(DateTime));
			//this.Columns.Add("LGN_NM", typeof(string));
			//this.Columns.Add("USR_NM", typeof(string));
			//this.Columns.Add("CLNT_MCHN_NM", typeof(string));
			//this.Columns.Add("SRVR", typeof(string));
			//this.Columns.Add("MSG_SRC", typeof(string));
			//this.Columns.Add("MTHD", typeof(string));
			//this.Columns.Add("MSG", typeof(string));
			//this.Columns.Add("SRT_DTM", typeof(DateTime));
			//this.Columns.Add("END_DTM", typeof(DateTime));
			//this.Columns.Add("REC_CNT", typeof(int));
			//this.Columns.Add("THRD_ID", typeof(int));
			//this.Columns.Add("IS_ZIP", typeof(int));
			//this.Columns.Add("ERR_MSG", typeof(string));
		}
	}
}
