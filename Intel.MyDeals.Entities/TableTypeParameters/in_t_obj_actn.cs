using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_obj_actn : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_obj_actn";

        public in_t_obj_actn()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_obj_actn(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("BTCH_ID", typeof(int));       
            this.Columns.Add("OBJ_TYPE_SID", typeof(int));  
            this.Columns.Add("ACTN_NM", typeof(string));
            this.Columns.Add("ACTN_VAL_LIST", typeof(string)); 
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(DataFixAction itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();            
            r["BTCH_ID"] = itm.BTCH_ID;
            r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
            r["ACTN_NM"] = itm.ACTN_NM;
            r["ACTN_VAL_LIST"] = itm.ACTN_VAL_LIST; 
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<DataFixAction> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
				r["BTCH_ID"] = itm.BTCH_ID;
				r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
				r["ACTN_NM"] = itm.ACTN_NM;
				r["ACTN_VAL_LIST"] = itm.ACTN_VAL_LIST;				
				this.Rows.Add(r);
            }
        }
    }
}