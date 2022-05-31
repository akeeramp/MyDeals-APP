using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class T_DEAL_RECON : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.T_DEAL_RECON";

        public T_DEAL_RECON()
            : base(DATA_TABLE_NAME)
        { }

        public T_DEAL_RECON(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("DEAL ID", typeof(int));
            this.Columns.Add("EXISTING_UCD_GLOBAL_ID", typeof(int));
            this.Columns.Add("EXISTING_UCD_GLOBAL_NAME", typeof(string));
            this.Columns.Add("EXISTING_UCD_COUNTRY_CUST_ID", typeof(int));
            this.Columns.Add("EXISTING_UCD_COUNTRY", typeof(string));
            this.Columns.Add("NEW_UCD_GLOBAL_ID", typeof(int));
            this.Columns.Add("NEW_UCD_GLOBAL_NAME", typeof(string));
            this.Columns.Add("NEW_UCD_COUNTRY_CUST_ID", typeof(int));
            this.Columns.Add("NEW_UCD_COUNTRY", typeof(string));
            this.Columns.Add("RPL_STS_CD", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(DealRecon itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["DEAL ID"] = itm.Deal_ID;
            r["EXISTING_UCD_GLOBAL_ID"] = itm.Unified_Customer_ID;
            r["EXISTING_UCD_GLOBAL_NAME"] = itm.Unified_Customer_Name;
            r["EXISTING_UCD_COUNTRY_CUST_ID"] = itm.Country_Region_Customer_ID;
            r["EXISTING_UCD_COUNTRY"] = itm.Unified_Country_Region;
            r["NEW_UCD_GLOBAL_ID"] = itm.To_be_Unified_Customer_ID;
            r["NEW_UCD_GLOBAL_NAME"] = itm.To_be_Unified_Customer_Name;
            r["NEW_UCD_COUNTRY_CUST_ID"] = itm.To_be_Country_Region_Customer_ID;
            r["NEW_UCD_COUNTRY"] = itm.To_be_Unified_Country_Region;
            r["RPL_STS_CD"] = itm.Rpl_Status_Code;
            this.Rows.Add(r);
        }


    }
}
