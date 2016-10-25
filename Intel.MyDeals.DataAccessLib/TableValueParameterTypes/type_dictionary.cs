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
    public class type_dictionary : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.type_dictionary";


        public type_dictionary()
            : base(DATA_TABLE_NAME)
        {
        }

        public type_dictionary(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            // This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("key", typeof(string));
            this.Columns.Add("value", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<KeyValuePair<string, string>> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                this.Rows.Add(itm.Key, itm.Value);
            }
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<OpPair<string, string>> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                this.Rows.Add(itm.First, itm.Second);
            }
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IDictionary<string, string> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                this.Rows.Add(itm.Key, itm.Value);
            }
        }

        public override string ToString()
        {
            return String.Join(",", base.Rows.Cast<DataRow>().Select(r => String.Format("{0}:{1}", r[0], r[1])));
        }
    }
}
