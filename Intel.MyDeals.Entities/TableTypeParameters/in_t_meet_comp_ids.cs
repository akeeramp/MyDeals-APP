using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_meet_comp_ids : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.type_int_list";

        public in_t_meet_comp_ids()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_meet_comp_ids(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)            
            this.Columns.Add("item", typeof(int));            
            
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(int itm)
        {            
            var r = this.NewRow();            
            r["item"] = itm;                
                
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
       
    }
}