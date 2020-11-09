using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_dsa_rspn_log : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_dsa_rspn_log";

        //Column Names  : OBJ_SID INT
        // RSPN_MSG VARCHAR(MAX)
        // RQST_STS VARCHAR(50)

        public in_dsa_rspn_log()
            : base(DATA_TABLE_NAME)
        { }

        public in_dsa_rspn_log(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("OBJ_SID", typeof(int));
            this.Columns.Add("RSPN_MSG", typeof(string));
            this.Columns.Add("RQST_STS", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(VistexResponseData itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["OBJ_SID"] = itm.OBJ_SID;
            r["RSPN_MSG"] = itm.RSPN_MSG;
            r["RQST_STS"] = itm.RQST_STS;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<VistexResponseData> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["OBJ_SID"] = itm.OBJ_SID;
                r["RSPN_MSG"] = itm.RSPN_MSG;
                r["RQST_STS"] = itm.RQST_STS;
                this.Rows.Add(r);
            }
        }
    }
}