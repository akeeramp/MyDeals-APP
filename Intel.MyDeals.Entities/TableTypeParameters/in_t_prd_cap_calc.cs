using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_prd_cap_calc : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_prd_cap_calc";

        public in_t_prd_cap_calc()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_prd_cap_calc(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("CUST_MBR_SID", typeof(int));
            this.Columns.Add("GEO_MBR_SID", typeof(string));
            this.Columns.Add("PRD_MBR_SID", typeof(int));
            this.Columns.Add("DEAL_STRT_DT", typeof(DateTime));
            this.Columns.Add("DEAL_END_DT", typeof(DateTime));
            this.Columns.Add("ROW_NM", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(ProductCAPYCS2Calc itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
            r["GEO_MBR_SID"] = itm.GEO_MBR_SID;
            r["PRD_MBR_SID"] = itm.PRD_MBR_SID;
            r["DEAL_STRT_DT"] = itm.DEAL_STRT_DT;
            r["DEAL_END_DT"] = itm.DEAL_END_DT;
            r["ROW_NM"] = itm.ROW_NM;

            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<ProductCAPYCS2Calc> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
                r["GEO_MBR_SID"] = itm.GEO_MBR_SID;
                r["PRD_MBR_SID"] = itm.PRD_MBR_SID;
                r["DEAL_STRT_DT"] = itm.DEAL_STRT_DT;
                r["DEAL_END_DT"] = itm.DEAL_END_DT;
                r["ROW_NM"] = itm.ROW_NM;

                this.Rows.Add(r);
            }
        }
    }
}