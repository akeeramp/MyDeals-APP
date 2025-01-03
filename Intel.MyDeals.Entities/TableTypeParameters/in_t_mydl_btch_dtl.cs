using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_mydl_btch_dtl : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_mydl_btch_dtl";
        public in_t_mydl_btch_dtl() : base(DATA_TABLE_NAME)
        {

        }
        public in_t_mydl_btch_dtl(SerializationInfo info, StreamingContext context) : base(DATA_TABLE_NAME, info, context)
        {

        }
        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("BTCH_SID", typeof(int));
            this.Columns.Add("BTCH_NM", typeof(string));
            this.Columns.Add("BTCH_DSC", typeof(string));
            this.Columns.Add("RUN_SCHDL", typeof(string));
            this.Columns.Add("ADHC_RUN", typeof(bool));
            this.Columns.Add("ACTV_IND", typeof(bool));
            this.Columns.Add("STATUS", typeof(string));
            this.Columns.Add("LST_RUN", typeof(DateTime));
            this.Columns.Add("EMP_WWID", typeof(int));
            this.Columns.Add("TRGRD_BY", typeof(string));
            this.Columns.Add("JOB_HLTH_CNFG_DTL", typeof(string));
            this.Columns.Add("PREDECESSOR_COND", typeof(string));
        }
        public void AddRow(BatchJobConstants itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["BTCH_SID"] = itm.BTCH_SID;
            r["BTCH_NM"] = itm.BTCH_NM;
            r["BTCH_DSC"] = itm.BTCH_DSC;
            r["RUN_SCHDL"] = itm.RUN_SCHDL;
            r["ADHC_RUN"] = itm.ADHC_RUN;
            r["ADHC_RUN"] = itm.ADHC_RUN;
            r["ACTV_IND"] = itm.ACTV_IND;
            r["STATUS"] = itm.STATUS;
            r["LST_RUN"] = itm.LST_RUN;
            r["EMP_WWID"] = itm.EMP_WWID;
            r["TRGRD_BY"] = itm.TRGRD_BY;
            r["JOB_HLTH_CNFG_DTL"] = itm.JOB_HLTH_CNFG_DTL;
            r["PREDECESSOR_COND"] = itm.PREDECESSOR_COND;
            this.Rows.Add(r);
        }
        public void AddRows(IEnumerable<BatchJobConstants> itms)
        {
            if (itms == null) { return; }
            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["BTCH_SID"] = itm.BTCH_SID;
                r["BTCH_NM"] = itm.BTCH_NM;
                r["BTCH_DSC"] = itm.BTCH_DSC;
                r["RUN_SCHDL"] = itm.RUN_SCHDL;
                r["ADHC_RUN"] = itm.ADHC_RUN;
                r["ADHC_RUN"] = itm.ADHC_RUN;
                r["ACTV_IND"] = itm.ACTV_IND;
                r["STATUS"] = itm.STATUS;
                r["LST_RUN"] = itm.LST_RUN;
                r["EMP_WWID"] = itm.EMP_WWID;
                r["TRGRD_BY"] = itm.TRGRD_BY;
                r["JOB_HLTH_CNFG_DTL"] = itm.JOB_HLTH_CNFG_DTL;
                r["PREDECESSOR_COND"] = itm.PREDECESSOR_COND;
                this.Rows.Add(r);
            }
        }
    }
}
