using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_lgl_excpt_dwnld : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_lgl_excpt_dwnld";

        public in_t_lgl_excpt_dwnld()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_lgl_excpt_dwnld(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("excpt_SID", typeof(int));
           
        }


        /// <summary>
        /// Add  rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<int> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["excpt_SID"] = itm;
                this.Rows.Add(r);
            }
        }
    }
}