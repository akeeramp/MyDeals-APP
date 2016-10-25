namespace Intel.MyDeals.Entities
{
    public static class MyDealsTools
    {
        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="sourceData"></param>
        public static void EnsureObjSetIdAtrb(MyDealsData data, AttributeCollection sourceData)
        {
            foreach (var kvp in data)
            {
                foreach (var dc in kvp.Value.AllDataCollectors)
                {
                    dc.EnsureObjSetIdAtrb(sourceData);
                }
            }
        }

        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="sourceData"></param>
        public static void EnsureDcType(MyDealsData data, AttributeCollection sourceData)
        {
            foreach (var kvp in data)
            {
                foreach (var dc in kvp.Value.AllDataCollectors)
                {
                    dc.EnsureDcType(sourceData);
                }
            }
        }
        
    }
}
