using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_obj_atrb : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_obj_atrb";

        public in_t_obj_atrb()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_obj_atrb(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("BTCH_ID", typeof(int));       
            this.Columns.Add("CUST_MBR_SID", typeof(int));  
            this.Columns.Add("OBJ_TYPE_SID", typeof(int));
            this.Columns.Add("OBJ_SID", typeof(int));            
            this.Columns.Add("ATRB_SID", typeof(int));
            this.Columns.Add("ATRB_RVS_NBR", typeof(int));
            this.Columns.Add("ATRB_MTX_SID", typeof(int));
            this.Columns.Add("ATRB_VAL", typeof(string));
            this.Columns.Add("ATRB_VAL_MAX", typeof(string));
            this.Columns.Add("MDX_CD", typeof(string));
            
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(DataFixAttribute itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();            
            r["BTCH_ID"] = itm.BTCH_ID;
            r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
            r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
            r["OBJ_SID"] = itm.OBJ_SID;
            r["ATRB_SID"] = itm.ATRB_SID;
            r["ATRB_RVS_NBR"] = itm.ATRB_RVS_NBR;
            r["ATRB_VAL"] = itm.ATRB_VAL;
            r["ATRB_VAL_MAX"] = itm.ATRB_VAL_MAX;
            r["MDX_CD"] = itm.MDX_CD;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<DataFixAttribute> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["BTCH_ID"] = itm.BTCH_ID;
                r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
                r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
                r["OBJ_SID"] = itm.OBJ_SID;
                r["ATRB_SID"] = itm.ATRB_SID;
                r["ATRB_RVS_NBR"] = itm.ATRB_RVS_NBR;
                r["ATRB_VAL"] = itm.ATRB_VAL;
                r["ATRB_VAL_MAX"] = itm.ATRB_VAL_MAX;
                r["MDX_CD"] = itm.MDX_CD;
                this.Rows.Add(r);
            }
        }
    }
}