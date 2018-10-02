using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class t_notif_list : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_notif_list";

        public t_notif_list()
            : base(DATA_TABLE_NAME)
        { }

        public t_notif_list(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("NOTIF_ID", typeof(int));
            this.Columns.Add("EMAIL_IND", typeof(bool));
            this.Columns.Add("IN_TOOL_IND", typeof(bool));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(NotificationSubscriptions itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["NOTIF_ID"] = itm.NOTIF_ID;
            r["EMAIL_IND"] = itm.EMAIL_IND;
            r["IN_TOOL_IND"] = itm.IN_TOOL_IND;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<NotificationSubscriptions> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["NOTIF_ID"] = itm.NOTIF_ID;
                r["EMAIL_IND"] = itm.EMAIL_IND;
                r["IN_TOOL_IND"] = itm.IN_TOOL_IND;
                this.Rows.Add(r);
            }
        }
    }
}