using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.DataLibrary.Test
{
    public class OpDeTestItem
    {
        public OpDeTestItem(MyDealsAttribute atrb, object val)
        {
            Atrb = atrb;
            Val = val;
        }

        public OpDeTestItem(MyDealsAttribute atrb, object val, OpAtrbMapCollection dimKey)
        {
            Atrb = atrb;
            Val = val;
            DimKey = dimKey;
        }

        public MyDealsAttribute Atrb { get; set; }

        public object Val { get; set; }

        public OpAtrbMapCollection DimKey { get; set; }
    }
}
