using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
	public class t_secur_info : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.t_secur_info";

		public t_secur_info()
			: base(DATA_TABLE_NAME)
		{ }

		public t_secur_info(SerializationInfo info, StreamingContext context)
			: base(DATA_TABLE_NAME, info, context) { }

		protected override void Init()
		{
			//// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
			this.Columns.Add("ACTN_MAP_SID", typeof(int));
			this.Columns.Add("OBJ_TYPE_SID", typeof(int));
			this.Columns.Add("OBJ_SET_TYPE_SID", typeof(int));
			this.Columns.Add("ROLE_TYPE_SID", typeof(int));
			this.Columns.Add("WFSTG_MBR_SID", typeof(int));
			this.Columns.Add("ATRB_SID", typeof(int));
			this.Columns.Add("SECUR_ACTN_SID", typeof(int));
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRow(SecurityMapSave itm)
		{
			if (itm == null) { return; }
			var r = this.NewRow();
			r["ACTN_MAP_SID"] = -1;
			r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
			r["OBJ_SET_TYPE_SID"] = itm.OBJ_SET_TYPE_SID;
			r["ROLE_TYPE_SID"] = itm.ROLE_TYPE_SID;
			r["WFSTG_MBR_SID"] = itm.WFSTG_MBR_SID;
			r["ATRB_SID"] = itm.ATRB_SID;
			r["SECUR_ACTN_SID"] = itm.SECUR_ACTN_SID;

			this.Rows.Add(r);
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRows(IEnumerable<SecurityMapSave> itms)
		{
			if (itms == null) { return; }

			foreach (var itm in itms)
			{
				var r = this.NewRow();
				r["ACTN_MAP_SID"] = -1;
				r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
				r["OBJ_SET_TYPE_SID"] = itm.OBJ_SET_TYPE_SID;
				r["ROLE_TYPE_SID"] = itm.ROLE_TYPE_SID;
				r["WFSTG_MBR_SID"] = itm.WFSTG_MBR_SID;
				r["ATRB_SID"] = itm.ATRB_SID;
				r["SECUR_ACTN_SID"] = itm.SECUR_ACTN_SID;

				this.Rows.Add(r);
			}
		}
	}
}
