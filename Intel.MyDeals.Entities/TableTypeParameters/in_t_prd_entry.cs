using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
	public class in_t_prd_entry : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.in_t_prd_entry";

		public in_t_prd_entry()
			: base(DATA_TABLE_NAME)
		{ }

		public in_t_prd_entry(SerializationInfo info, StreamingContext context)
			: base(DATA_TABLE_NAME, info, context) { }

		protected override void Init()
		{
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)            
            this.Columns.Add("OBJ_SET_TYPE_SID", typeof(int));
            this.Columns.Add("PROD_NAMES", typeof(string));
			this.Columns.Add("START_DATE", typeof(string));
			this.Columns.Add("END_DATE", typeof(string));			
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRow(ProductEntryAttribute itm)
		{
			if (itm == null) { return; }
			var r = this.NewRow();
            //r["OBJ_SET_TYPE_SID"] = itm.PROD_MBR_SID;
            r["PROD_NAMES"] = itm.USR_INPUT;
			r["START_DATE"] = itm.START_DATE;
			r["END_DATE"] = itm.END_DATE;
			
			this.Rows.Add(r);
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRows(IEnumerable<ProductEntryAttribute> itms)
		{
			if (itms == null) { return; }

			foreach (var itm in itms)
			{
				var r = this.NewRow();
                //r["OBJ_SET_TYPE_SID"] = itm.PROD_MBR_SID;
                r["PROD_NAMES"] = itm.USR_INPUT;
                r["START_DATE"] = itm.START_DATE;
                r["END_DATE"] = itm.END_DATE;

                this.Rows.Add(r);
			}
		}
	}
}
