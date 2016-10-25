using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using Intel.Opaque.Tools;
using System.Data;

namespace Intel.MyDeals.DataAccessLib 
{
    public class type_int_pair : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.type_int_pair";


        public type_int_pair()
            : base(DATA_TABLE_NAME)
        {
        }

        public type_int_pair(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            // This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("first", typeof(int));
            this.Columns.Add("second", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<OpPair<int, int>> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                this.Rows.Add(itm.First, itm.Second);
            }
        }

        public override string ToString()
        {
            return String.Join(",", base.Rows.Cast<DataRow>().Select(r => String.Format("{0}:{1}", r[0], r[1])));
        }
    }
}
