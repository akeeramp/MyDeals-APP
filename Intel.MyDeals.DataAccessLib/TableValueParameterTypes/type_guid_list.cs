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
    public class type_guid_list : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.type_guid_list";


        public type_guid_list(params Guid?[] itms)
            : base(DATA_TABLE_NAME)
        {
            AddRows(itms);
        }
        public type_guid_list(IEnumerable<Guid?> itms)
            : base(DATA_TABLE_NAME)
        {
            AddRows(itms);
        }
        public type_guid_list(IEnumerable<Guid> itms)
            : base(DATA_TABLE_NAME)
        {
            AddRows(itms);
        }

        public type_guid_list(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            // This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("item", typeof(Guid));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(params Guid?[] itms)
        {
            this.AddRows(itms);
        }

        public void AddRows(IEnumerable<Guid> itms)
        {
            if (itms == null) { return; }

            foreach (Guid itm in itms.Where(g => g != Guid.Empty).Distinct())
            {
                this.Rows.Add(itm);
            }
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<Guid?> itms)
        {
            if (itms == null) { return; }

            foreach (Guid itm in itms.Where(g => g != null && g != Guid.Empty).Distinct())
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
