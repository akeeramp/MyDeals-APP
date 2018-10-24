using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class T_NOTIF_INFO : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.T_NOTIF_INFO";

        public T_NOTIF_INFO()
            : base(DATA_TABLE_NAME)
        { }

        public T_NOTIF_INFO(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("NOTIF_ID", typeof(int));
            this.Columns.Add("CONTRACT_SID", typeof(int));
            this.Columns.Add("OBJ_SID", typeof(int));
            this.Columns.Add("OBJ_TYPE_SID", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(NotificationLog itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["NOTIF_ID"] = itm.NOTIF_ID;
            r["CONTRACT_SID"] = itm.CONTRACT_SID;
            r["OBJ_SID"] = itm.OBJ_SID;
            r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<NotificationLog> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["NOTIF_ID"] = itm.NOTIF_ID;
                r["CONTRACT_SID"] = itm.CONTRACT_SID;
                r["OBJ_SID"] = itm.OBJ_SID;
                r["OBJ_TYPE_SID"] = itm.OBJ_TYPE_SID;
                this.Rows.Add(r);
            }
        }
    }
}