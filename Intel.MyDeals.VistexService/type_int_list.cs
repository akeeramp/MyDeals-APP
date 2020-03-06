using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using System.Data;

namespace Intel.MyDeals.DataAccessLib 
{
    public class type_int_list : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.type_int_list";


        public type_int_list(params int[] itms)
            : base(DATA_TABLE_NAME)
        {
            AddRows(itms);
        }

        public type_int_list(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            // This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("item", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(params int[] itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms) 
            { 
                this.Rows.Add(itm);
            }
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<int> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                this.Rows.Add(itm);
            }
        }

        public override string ToString()
        {
            return String.Join(",", base.Rows.Cast<DataRow>().Select(r => String.Format("{0}", r[0])));
        }
    }
}
