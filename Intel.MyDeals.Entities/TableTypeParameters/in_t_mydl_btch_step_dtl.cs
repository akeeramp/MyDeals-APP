using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_mydl_btch_step_dtl : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_mydl_btch_step_dtl";
        public in_t_mydl_btch_step_dtl() : base(DATA_TABLE_NAME)
        {

        }
        public in_t_mydl_btch_step_dtl(SerializationInfo info, StreamingContext context) : base(DATA_TABLE_NAME, info, context)
        {

        }
        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("BTCH_STEP_SID", typeof(int));
            this.Columns.Add("BTCH_SID", typeof(int));
            this.Columns.Add("STEP_SRT_ORDR", typeof(int));
            this.Columns.Add("STEP_NM", typeof(string));
            this.Columns.Add("STEP_TYPE", typeof(string));            
            this.Columns.Add("ADHC_RUN", typeof(bool));
            this.Columns.Add("ACTV_IND", typeof(bool));            
            this.Columns.Add("EMP_WWID", typeof(int));
        }
        public void AddRow(BatchJobStepConstants itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["BTCH_STEP_SID"] = itm.BTCH_STEP_SID;
            r["BTCH_SID"] = itm.BTCH_SID;            
            r["STEP_SRT_ORDR"] = itm.STEP_SRT_ORDR;            
            r["STEP_NM"] = itm.STEP_NM;            
            r["STEP_TYPE"] = itm.STEP_TYPE;
            r["ADHC_RUN"] = itm.ADHC_RUN;
            r["ACTV_IND"] = itm.ACTV_IND;            
            r["EMP_WWID"] = itm.EMP_WWID;
            this.Rows.Add(r);
        }
        public void AddRows(IEnumerable<BatchJobStepConstants> itms)
        {
            if (itms == null) { return; }
            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["BTCH_STEP_SID"] = itm.BTCH_STEP_SID;
                r["BTCH_SID"] = itm.BTCH_SID;
                r["STEP_SRT_ORDR"] = itm.STEP_SRT_ORDR;
                r["STEP_NM"] = itm.STEP_NM;
                r["STEP_TYPE"] = itm.STEP_TYPE;
                r["ADHC_RUN"] = itm.ADHC_RUN;
                r["ACTV_IND"] = itm.ACTV_IND;
                r["EMP_WWID"] = itm.EMP_WWID;
                this.Rows.Add(r);
            }
        }
    }
}
