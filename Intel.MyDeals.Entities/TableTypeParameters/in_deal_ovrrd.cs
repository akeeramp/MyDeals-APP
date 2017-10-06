using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_deal_ovrrd : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_deal_ovrrd";

        public in_deal_ovrrd()
            : base(DATA_TABLE_NAME)
        { }

        public in_deal_ovrrd(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("CUST_NM_SID", typeof(string));
            this.Columns.Add("DEAL_OBJ_TYPE_SID", typeof(int));
            this.Columns.Add("DEAL_OBJ_SID", typeof(int));
            this.Columns.Add("PRD_MBR_SIDS", typeof(string));
            this.Columns.Add("CST_OVRRD_FLG", typeof(int));
            this.Columns.Add("CST_OVRRD_RSN", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(PctOverrideReason itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["CUST_NM_SID"] = itm.CUST_NM_SID;
            r["DEAL_OBJ_TYPE_SID"] = itm.DEAL_OBJ_TYPE_SID;
            r["DEAL_OBJ_SID"] = itm.DEAL_OBJ_SID;
            r["PRD_MBR_SIDS"] = itm.PRD_MBR_SIDS;
            r["CST_OVRRD_FLG"] = itm.CST_OVRRD_FLG;
            r["CST_OVRRD_RSN"] = itm.CST_OVRRD_RSN;
            this.Rows.Add(r);
        }

               
    }
}