using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_pct_lgl_excpt : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_pct_lgl_excpt";

        public in_t_pct_lgl_excpt()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_pct_lgl_excpt(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("MYDL_PCT_LGL_EXCPT_SID", typeof(string));
            this.Columns.Add("INTEL_PRD", typeof(string));
            this.Columns.Add("SCPE", typeof(string));
            this.Columns.Add("PRC_RQST", typeof(string));
            this.Columns.Add("COST", typeof(double));
            this.Columns.Add("PCT_LGL_EXCPT_STRT_DT", typeof(string));
            this.Columns.Add("PCT_LGL_EXCPT_END_DT", typeof(string));
            this.Columns.Add("FRCST_VOL_BYQTR", typeof(string));
            this.Columns.Add("CUST_PRD", typeof(string));
            this.Columns.Add("MEET_COMP_PRD", typeof(string));
            this.Columns.Add("MEET_COMP_PRC", typeof(double));
            this.Columns.Add("BUSNS_OBJ", typeof(string));
            this.Columns.Add("PTNTL_MKT_IMPCT", typeof(string));
            this.Columns.Add("OTHER", typeof(string));
            this.Columns.Add("JSTFN_PCT_EXCPT", typeof(string));
            this.Columns.Add("RQST_CLNT", typeof(string));
            this.Columns.Add("RQST_ATRNY", typeof(string));
            this.Columns.Add("APRV_ATRNY", typeof(string));
            this.Columns.Add("DT_APRV", typeof(string));
            this.Columns.Add("ACTV_IND", typeof(bool));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(PCTLegalException itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["MYDL_PCT_LGL_EXCPT_SID"] = itm.MYDL_PCT_LGL_EXCPT_SID;
            r["INTEL_PRD"] = itm.INTEL_PRD;
            r["SCPE"] = itm.SCPE;
            r["PRC_RQST"] = itm.PRC_RQST;
            r["COST"] = itm.COST;
            r["PCT_LGL_EXCPT_STRT_DT"] = itm.PCT_LGL_EXCPT_STRT_DT;
            r["PCT_LGL_EXCPT_END_DT"] = itm.PCT_LGL_EXCPT_END_DT;
            r["FRCST_VOL_BYQTR"] = itm.FRCST_VOL_BYQTR;
            r["CUST_PRD"] = itm.CUST_PRD;
            r["MEET_COMP_PRD"] = itm.MEET_COMP_PRD;
            r["MEET_COMP_PRC"] = itm.MEET_COMP_PRC;
            r["BUSNS_OBJ"] = itm.BUSNS_OBJ;
            r["PTNTL_MKT_IMPCT"] = itm.PTNTL_MKT_IMPCT;
            r["OTHER"] = itm.OTHER;
            r["JSTFN_PCT_EXCPT"] = itm.JSTFN_PCT_EXCPT;
            r["RQST_CLNT"] = itm.RQST_CLNT;
            r["RQST_ATRNY"] = itm.RQST_ATRNY;
            r["APRV_ATRNY"] = itm.APRV_ATRNY;
            r["DT_APRV"] = itm.DT_APRV;
            r["ACTV_IND"] = itm.ACTV_IND;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<PCTLegalException> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["MYDL_PCT_LGL_EXCPT_SID"] = itm.MYDL_PCT_LGL_EXCPT_SID;
                r["INTEL_PRD"] = itm.INTEL_PRD;
                r["SCPE"] = itm.SCPE;
                r["PRC_RQST"] = itm.PRC_RQST;
                r["COST"] = itm.COST;
                r["PCT_LGL_EXCPT_STRT_DT"] = itm.PCT_LGL_EXCPT_STRT_DT;
                r["PCT_LGL_EXCPT_END_DT"] = itm.PCT_LGL_EXCPT_END_DT;
                r["FRCST_VOL_BYQTR"] = itm.FRCST_VOL_BYQTR;
                r["CUST_PRD"] = itm.CUST_PRD;
                r["MEET_COMP_PRD"] = itm.MEET_COMP_PRD;
                r["MEET_COMP_PRC"] = itm.MEET_COMP_PRC;
                r["BUSNS_OBJ"] = itm.BUSNS_OBJ;
                r["PTNTL_MKT_IMPCT"] = itm.PTNTL_MKT_IMPCT;
                r["OTHER"] = itm.OTHER;
                r["JSTFN_PCT_EXCPT"] = itm.JSTFN_PCT_EXCPT;
                r["RQST_CLNT"] = itm.RQST_CLNT;
                r["RQST_ATRNY"] = itm.RQST_ATRNY;
                r["APRV_ATRNY"] = itm.APRV_ATRNY;
                r["DT_APRV"] = itm.DT_APRV;
                r["ACTV_IND"] = itm.ACTV_IND;
                this.Rows.Add(r);
            }
        }
    }
}