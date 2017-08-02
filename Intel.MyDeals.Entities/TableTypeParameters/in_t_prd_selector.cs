using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_prd_selector : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_prd_entry";

        public in_t_prd_selector()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_prd_selector(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)            
            this.Columns.Add("USR_INPUT", typeof(string));            
            this.Columns.Add("EXCLUDE", typeof(string));
            this.Columns.Add("FILTER", typeof(string));
            this.Columns.Add("START_DATE", typeof(string));
            this.Columns.Add("END_DATE", typeof(string));
            this.Columns.Add("GEO_COMBINED", typeof(string));
            this.Columns.Add("PROGRAM_PAYMENT", typeof(string));
            this.Columns.Add("COLUMN_TYPE", typeof(int));
            this.Columns.Add("ROW_NM", typeof(int));
            this.Columns.Add("MOD_USR_INPUT", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(ProductEntryAttribute itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();            
            r["USR_INPUT"] = itm.USR_INPUT;                
            r["EXCLUDE"] = itm.EXCLUDE;
            r["FILTER"] = itm.FILTER;
            r["START_DATE"] = itm.START_DATE;
            r["END_DATE"] = itm.END_DATE;
            r["GEO_COMBINED"] = itm.GEO_COMBINED;
            r["PROGRAM_PAYMENT"] = itm.PROGRAM_PAYMENT;
            r["COLUMN_TYPE"] = itm.COLUMN_TYPE;
            r["ROW_NM"] = itm.ROW_NUMBER;
            r["MOD_USR_INPUT"] = itm.MOD_USR_INPUT;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<ProductEntryAttribute> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();                
                r["USR_INPUT"] = itm.USR_INPUT;                
                r["EXCLUDE"] = itm.EXCLUDE;
                r["FILTER"] = itm.FILTER;
                r["START_DATE"] = itm.START_DATE;
                r["END_DATE"] = itm.END_DATE;
                r["GEO_COMBINED"] = itm.GEO_COMBINED;
                r["PROGRAM_PAYMENT"] = itm.PROGRAM_PAYMENT;
                r["COLUMN_TYPE"] = itm.COLUMN_TYPE;
                r["ROW_NM"] = itm.ROW_NUMBER;
                r["MOD_USR_INPUT"] = itm.MOD_USR_INPUT;
                this.Rows.Add(r);
            }
        }
    }
}