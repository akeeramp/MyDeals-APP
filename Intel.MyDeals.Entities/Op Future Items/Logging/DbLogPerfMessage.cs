using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Intel.Opaque;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.Entities.Logging
{
	public class DbLogPerfMessage
	{
		public DbLogPerfMessage() // this needs to be includd here to avoid problems with deserializing
		{
		}

		public DbLogPerfMessage(OpLogPerfMessage msg)
		{
			this.STEP = msg.Step;
			this.LOG_DTM = msg.MessageTime;
			this.MTHD = msg.CallingMethod;
			this.MSG = msg.Message;

			// HACK: Note that the prev message time is essentially the previous log's end time. 
			// Because of this, the calculated times are not foolproof. A user could go away and come back
			// after grabbing a cup of coffee and the log's start time may be wrong.
			this.STRT_DTM = msg.PreviousMessageTime; 
			this.END_DTM = msg.MessageTime.ToUniversalTime();
			this.THRD_ID = msg.ThreadID;
			this.ERR_MSG = msg.IsError;
			this.MTHD = msg.CallingMethod;
		}

		public int STEP { get; set; }
		public DateTime LOG_DTM { get; set; }
		public string LGN_NM { get; set; }
		public string USR_NM { get; set; }
		public string CLNT_MCHN_NM { get; set; }
		public string SRVR { get; set; }
		public string MSG_SRC { get; set; }
		public string MTHD { get; set; }
		public string MSG { get; set; }
		public DateTime STRT_DTM { get; set; }
		public DateTime END_DTM { get; set; }
		public int REC_CNT { get; set; }
		public int THRD_ID { get; set; }
		public int IS_ZIP { get; set; }
		public bool ERR_MSG { get; set; }
		public double RuntimeMs { get; set; }
		public int Size { get; }


		public DbLogPerfMessage Clone(int max_size)
		{
			return new DbLogPerfMessage()
			{
				STEP = this.STEP,
				LOG_DTM = this.LOG_DTM,
				LGN_NM = this.LGN_NM,
				USR_NM = this.USR_NM,
				CLNT_MCHN_NM = this.CLNT_MCHN_NM,
				SRVR = this.SRVR,
				MSG_SRC = this.MSG_SRC,
				MTHD = this.MTHD,
				MSG = this.MSG,
				STRT_DTM = this.STRT_DTM,
				END_DTM = this.END_DTM,
				REC_CNT = this.REC_CNT,
				THRD_ID = this.THRD_ID,
				IS_ZIP = this.IS_ZIP,
				ERR_MSG = this.ERR_MSG
			};
		}
	}

}
