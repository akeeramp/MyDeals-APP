using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class t_ui_log : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_ui_log";

        public t_ui_log() : base(DATA_TABLE_NAME) { }

        public t_ui_log(SerializationInfo info, StreamingContext context) : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("UID", typeof(string));
            this.Columns.Add("LOG_DTM", typeof(DateTime));
            this.Columns.Add("TTL", typeof(string));
            this.Columns.Add("EXEC_MS", typeof(int));
            this.Columns.Add("STRT_DT", typeof(DateTime));
            this.Columns.Add("END_DT", typeof(DateTime));
            this.Columns.Add("MEDIA", typeof(string));
            this.Columns.Add("TASK", typeof(string));
            this.Columns.Add("TASK_MS", typeof(int));
            this.Columns.Add("REC_CNT", typeof(int));
        }

        public void AddRow(LogPerformanceTime itm, int itmCount)
        {
            var r = NewRow();
            r["UID"] = itm.UID;
            r["LOG_DTM"] = DateTime.Now;
            r["TTL"] = itm.Title;
            r["EXEC_MS"] = itm.ExecutionMs;
            r["STRT_DT"] = itm.Start;
            r["END_DT"] = itm.End;
            r["MEDIA"] = itm.Mode;
            r["TASK"] = itm.Task;
            r["TASK_MS"] = itm.TaskMs;
            r["REC_CNT"] = itmCount;
            Rows.Add(r);
        }

        public void AddRows(IEnumerable<LogPerformanceTime> itms, int itmCount)
        {
            foreach (LogPerformanceTime itm in itms)
            {
                AddRow(itm, itmCount);
            }
        }
    }
}