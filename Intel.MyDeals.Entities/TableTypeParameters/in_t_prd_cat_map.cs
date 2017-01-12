using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
	public class in_t_prd_cat_map : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.in_t_prd_cat_map";

		public in_t_prd_cat_map()
			: base(DATA_TABLE_NAME)
		{ }

		public in_t_prd_cat_map(SerializationInfo info, StreamingContext context)
			: base(DATA_TABLE_NAME, info, context) { }

		protected override void Init()
		{
			//// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
			this.Columns.Add("PRD_CAT_MAP_SID", typeof(int));
			this.Columns.Add("DEAL_PRD_TYPE", typeof(string));
			this.Columns.Add("PRD_CAT_NM", typeof(string));
			this.Columns.Add("ACTV_IND", typeof(bool));
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRow(ProductCategory itm)
		{
			if (itm == null) { return; }
			var r = this.NewRow();
			r["ACTV_IND"] = itm.ACTV_IND;
			r["DEAL_PRD_TYPE"] = itm.DEAL_PRD_TYPE;
			r["PRD_CAT_NM"] = itm.PRD_CAT_NM;
			r["PRD_CAT_MAP_SID"] = itm.PRD_CAT_MAP_SID;

			this.Rows.Add(r);
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRows(IEnumerable<ProductCategory> itms)
		{
			if (itms == null) { return; }

			foreach (var itm in itms)
			{
				var r = this.NewRow();
				r["ACTV_IND"] = itm.ACTV_IND;
				r["DEAL_PRD_TYPE"] = itm.DEAL_PRD_TYPE;
				r["PRD_CAT_NM"] = itm.PRD_CAT_NM;
				r["PRD_CAT_MAP_SID"] = itm.PRD_CAT_MAP_SID;

				this.Rows.Add(r);
			}
		}
	}
}
