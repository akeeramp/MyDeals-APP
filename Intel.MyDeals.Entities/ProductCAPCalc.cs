using System;

namespace Intel.MyDeals.Entities
{
    public class ProductCAPYCS2Calc
    {
        public int CUST_MBR_SID { get; set; }

        public string GEO_MBR_SID { get; set; }

        public int PRD_MBR_SID { get; set; }

        public DateTime DEAL_STRT_DT { get; set; }

        public DateTime DEAL_END_DT { get; set; }

        /// <summary>
        /// Used within Translator proc for direct CAP proc change default value (0) will be sent
        /// </summary>
        public int ROW_NM { get; set; }
    }
}