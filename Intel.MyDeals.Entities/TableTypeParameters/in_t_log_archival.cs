using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_log_archival : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_log_archival";

        public in_t_log_archival()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_log_archival(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("LOG_ARCHVL_PRG_TBL_DTL_SID", typeof(int));
            this.Columns.Add("SRT_ORDR", typeof(int));
            this.Columns.Add("DB_NAME", typeof(string));
            this.Columns.Add("SCHEMA", typeof(string));
            this.Columns.Add("LOG_TBL_NM", typeof(string));
            this.Columns.Add("IS_PURGE", typeof(bool));
            this.Columns.Add("IS_ARCHV", typeof(bool));
            DataColumn archdbnm = new DataColumn("ARCHV_DB_NAME", typeof(string));
            archdbnm.AllowDBNull = true;
            this.Columns.Add(archdbnm);
            DataColumn archsm = new DataColumn("ARCHV_SCHEMA", typeof(string));
            archsm.AllowDBNull = true;
            this.Columns.Add(archsm);
            DataColumn archtbl = new DataColumn("ARCHV_TBL_NM", typeof(string));
            archtbl.AllowDBNull = true;
            this.Columns.Add(archtbl);
            DataColumn jsoncond = new DataColumn("JSON_COND", typeof(string));
            jsoncond.AllowDBNull = true;
            this.Columns.Add(jsoncond);
            this.Columns.Add("ACTV_IND", typeof(bool));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(LogArchival itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            if(itm.ARCHV_DB_NAME == null || itm.ARCHV_DB_NAME == "") r["ARCHV_DB_NAME"] = DBNull.Value;
            else r["ARCHV_DB_NAME"] = itm.ARCHV_DB_NAME;
            if(itm.ARCHV_SCHEMA == null || itm.ARCHV_SCHEMA == "") r["ARCHV_SCHEMA"] = DBNull.Value;
            else r["ARCHV_SCHEMA"] = itm.ARCHV_SCHEMA;
            if (itm.ARCHV_TBL_NM == null || itm.ARCHV_TBL_NM == "") r["ARCHV_TBL_NM"] = DBNull.Value;
            else r["ARCHV_TBL_NM"] = itm.ARCHV_TBL_NM;
            if (itm.JSON_COND == null) r["JSON_COND"] = DBNull.Value;
            else r["JSON_COND"] = itm.JSON_COND;
            r["LOG_ARCHVL_PRG_TBL_DTL_SID"] = itm.LOG_ARCHVL_PRG_TBL_DTL_SID == 0 ? -1 : itm.LOG_ARCHVL_PRG_TBL_DTL_SID;
            r["SRT_ORDR"] = itm.SRT_ORDR;
            r["DB_NAME"] = itm.DB_NAME;
            r["SCHEMA"] = itm.SCHEMA;
            r["LOG_TBL_NM"] = itm.LOG_TBL_NM;
            r["IS_PURGE"] = itm.IS_PURGE;
            r["IS_ARCHV"] = itm.IS_ARCHV;
            r["ACTV_IND"] = itm.ACTV_IND;
            this.Rows.Add(r);
        }


    }
}
