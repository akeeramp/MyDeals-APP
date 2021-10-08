using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_end_cust_unify : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.T_END_CUST_OBJ_UNIFY";

        public in_t_end_cust_unify()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_end_cust_unify(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("DEAL_ID", typeof(int));
            this.Columns.Add("UCD_GLOBAL_ID", typeof(int));
            this.Columns.Add("UCD_GLOBAL_NAME", typeof(string));
            this.Columns.Add("UCD_COUNTRY_CUST_ID", typeof(int));
            this.Columns.Add("UCD_COUNTRY", typeof(string));
            this.Columns.Add("DEAL_END_CUSTOMER_RETAIL", typeof(string));
            this.Columns.Add("DEAL_END_CUSTOMER_COUNTRY", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(UnifyDeal itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["DEAL_ID"] = itm.DEAL_ID;
            r["UCD_GLOBAL_ID"] = itm.UCD_GLOBAL_ID;
            r["UCD_GLOBAL_NAME"] = itm.UCD_GLOBAL_NAME;
            r["UCD_COUNTRY_CUST_ID"] = itm.UCD_COUNTRY_CUST_ID;
            r["UCD_COUNTRY"] = itm.UCD_COUNTRY;
            r["DEAL_END_CUSTOMER_RETAIL"] = itm.DEAL_END_CUSTOMER_RETAIL;
            r["DEAL_END_CUSTOMER_COUNTRY"] = itm.DEAL_END_CUSTOMER_COUNTRY;
            this.Rows.Add(r);
        }


    }
}
