using System;

namespace Intel.MyDeals.Entities
{
    public class Qtr
    {
        public short? QtrNbr { set; get; }
        
        public short? YrNbr { set; get; }

        public string Display => QtrNbr == null ? string.Empty : $"{YrNbr}Q{QtrNbr}";
    }
}