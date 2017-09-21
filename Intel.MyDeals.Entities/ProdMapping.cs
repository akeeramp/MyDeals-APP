namespace Intel.MyDeals.Entities
{
    public class ProdMapping
    {
        public string PRD_MBR_SID { get; set; }
        public string HIER_VAL_NM { get; set; }
        public string CAP { get; set; }
        public string CAP_START { get; set; }
        public string CAP_END { get; set; }
        public string DERIVED_USR_INPUT { get; set; }
        public string YCS2 { get; set; }
        public string YCS2_START { get; set; }
        public string YCS2_END { get; set; }
        public double PRD_COST { get; set; }
        public string PRD_STRT_DTM { get; set; }
        public string PRD_END_DTM { get; set; }
        public string HAS_L1 { get; set; }
        public string HAS_L2 { get; set; }
        public string PRD_CAT_NM { get; set; }

        /// <summary>
        /// Include or Exclude
        /// </summary>
        public bool EXCLUDE { get; set; }
    }
}