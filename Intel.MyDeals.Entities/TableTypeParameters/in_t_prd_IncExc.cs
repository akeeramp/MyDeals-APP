using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
	public class in_t_prd_IncExc : SqlTableValueParameterBase
	{
		private const string DATA_TABLE_NAME = "dbo.type_int_list";

		public in_t_prd_IncExc()
			: base(DATA_TABLE_NAME)
		{ }

		public in_t_prd_IncExc(SerializationInfo info, StreamingContext context)
			: base(DATA_TABLE_NAME, info, context) { }

		protected override void Init()
		{
			//// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
			this.Columns.Add("ATTR_VAL", typeof(string));
			
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRow(ProductIncExcAttribute itm)
		{
			if (itm == null) { return; }
			var r = this.NewRow();
			r["ATTR_VAL"] = itm.ATTR_VAL;
						
			this.Rows.Add(r);
		}

		/// <summary>
		/// Add a rows to the table parameter
		/// </summary>
		public void AddRows(IEnumerable<ProductIncExcAttribute> itms)
		{
			if (itms == null) { return; }

			foreach (var itm in itms)
			{
				var r = this.NewRow();
                r["ATTR_VAL"] = itm.ATTR_VAL;
                
                this.Rows.Add(r);
			}
		}
	}
}
