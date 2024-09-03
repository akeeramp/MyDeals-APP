using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class SDMMasterProductDetails
    {
        public SDMMasterProductDetails()
        {
            Data = new List<MstrPrdDtlSmry>();
        }

        public List<MstrPrdDtlSmry> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
