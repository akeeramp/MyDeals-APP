using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_trkr_atrb : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_trkr_atrb";

        public in_t_trkr_atrb()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_trkr_atrb(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("CUST_MBR_SID", typeof(int));       
            this.Columns.Add("PRD_MBR_SID", typeof(int));  
            this.Columns.Add("GEO_NMS", typeof(string));
            this.Columns.Add("DEAL_ST_DT", typeof(string));            
            this.Columns.Add("DEAL_END_DT", typeof(string));
            //this.Columns.Add("ORIG_ECAP_TRKR_NBR", typeof(string));
            //this.Columns.Add("DC_ID", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(EcapTrackerFilterData itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();            
            r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
            r["PRD_MBR_SID"] = itm.PRD_MBR_SID;
            r["GEO_NMS"] = itm.GEO_COMBINED;
            r["DEAL_ST_DT"] = itm.DEAL_STRT_DT;                
            r["DEAL_END_DT"] = itm.DEAL_END_DT;
            //r["ORIG_ECAP_TRKR_NBR"] = itm.ORIG_ECAP_TRKR_NBR;
            //r["DC_ID"] = itm.DC_ID;
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<EcapTrackerFilterData> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
				r["CUST_MBR_SID"] = itm.CUST_MBR_SID;
				r["PRD_MBR_SID"] = itm.PRD_MBR_SID;
				r["GEO_NMS"] = itm.GEO_COMBINED;
				r["DEAL_ST_DT"] = itm.DEAL_STRT_DT;
				r["DEAL_END_DT"] = itm.DEAL_END_DT;
				//r["ORIG_ECAP_TRKR_NBR"] = itm.ORIG_ECAP_TRKR_NBR;
				//r["DC_ID"] = itm.DC_ID;
				this.Rows.Add(r);
            }
        }
    }
}