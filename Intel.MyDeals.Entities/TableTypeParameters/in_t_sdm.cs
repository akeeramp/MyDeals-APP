using System;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_sdm : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.in_t_sdm";

        public in_t_sdm()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_sdm(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("CYCLE_NM", typeof(string));
            this.Columns.Add("CURR_STRT_DT", typeof(DateTime));
            this.Columns.Add("CURR_END_DT", typeof(DateTime));
            this.Columns.Add("CPU_VRT_NM", typeof(string));
            this.Columns.Add("CPU_SKU_NM", typeof(string));
            this.Columns.Add("CPU_PROCESSOR_NUMBER", typeof(string));
            this.Columns.Add("CPU_FLR", typeof(string));
            this.Columns.Add("APAC_PD", typeof(string));
            this.Columns.Add("IJKK_PD", typeof(int));
            this.Columns.Add("PRC_PD", typeof(string));
            this.Columns.Add("EMEA_PD", typeof(string));
            this.Columns.Add("ASMO_PD", typeof(string));
            this.Columns.Add("IS_DELETE", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(SDMData itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["CYCLE_NM"] = itm.CYCLE_NM;
            r["CURR_STRT_DT"] = itm.CURR_STRT_DT;
            r["CURR_END_DT"] = itm.CURR_END_DT;
            r["CPU_VRT_NM"] = itm.CPU_VRT_NM;
            r["CPU_SKU_NM"] = itm.CPU_SKU_NM;
            r["CPU_PROCESSOR_NUMBER"] = itm.CPU_PROCESSOR_NUMBER;
            r["CPU_FLR"] = itm.CPU_FLR;
            r["APAC_PD"] = itm.APAC_PD;
            r["IJKK_PD"] = itm.IJKK_PD;
            r["PRC_PD"] = itm.PRC_PD;
            r["EMEA_PD"] = itm.EMEA_PD;
            r["ASMO_PD"] = itm.ASMO_PD;
            r["IS_DELETE"] = itm.IS_DELETE;
            this.Rows.Add(r);
        }


    }
}
