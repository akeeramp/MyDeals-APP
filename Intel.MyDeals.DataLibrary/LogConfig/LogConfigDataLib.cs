using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.DataLibrary;


namespace Intel.MyDeals.DataLibrary
{
	public class LogConfigDataLib
	{
		// TODO : Move this to ConstantLookupDataLib
		// Maybe ask Doug / Kannan to rename SP to a nicer name to reuse elsewhere if needed
		/*
		 * The SP [PR_GET_LOG_CONFIG_DATA] parses the XML in MsgSrc for us, and here we use it
		 */
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
	}
}
