using System;
using System.Configuration;
using System.Data;
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
            DataColumn cpuflr = new DataColumn("CPU_FLR", typeof(int));
            cpuflr.AllowDBNull = true;
            this.Columns.Add(cpuflr);
            DataColumn apacpd = new DataColumn("APAC_PD", typeof(int));
            apacpd.AllowDBNull = true;
            this.Columns.Add(apacpd);
            DataColumn ijkpd = new DataColumn("IJKK_PD", typeof(int));
            ijkpd.AllowDBNull = true;
            this.Columns.Add(ijkpd);
            DataColumn prcpd = new DataColumn("PRC_PD", typeof(int));
            prcpd.AllowDBNull = true;
            this.Columns.Add(prcpd);
            DataColumn emeapd = new DataColumn("EMEA_PD", typeof(int));
            emeapd.AllowDBNull = true;
            this.Columns.Add(emeapd);
            DataColumn asmopd = new DataColumn("ASMO_PD", typeof(int));
            asmopd.AllowDBNull = true;
            this.Columns.Add(asmopd);
            this.Columns.Add("IS_DELETE", typeof(string));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(SDMData itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            if(itm.CPU_FLR == null) r["CPU_FLR"] = DBNull.Value;
            else r["CPU_FLR"] = itm.CPU_FLR;
            if(itm.APAC_PD == null) r["APAC_PD"] = DBNull.Value;
            else r["APAC_PD"] = itm.APAC_PD;
            if(itm.IJKK_PD == null) r["IJKK_PD"] = DBNull.Value;
            else r["IJKK_PD"] = itm.IJKK_PD;
            if(itm.PRC_PD == null) r["PRC_PD"] = DBNull.Value;
            else r["PRC_PD"] = itm.PRC_PD;
            if(itm.EMEA_PD == null) r["EMEA_PD"] = DBNull.Value;
            else r["EMEA_PD"] = itm.EMEA_PD;
            if(itm.ASMO_PD == null) r["ASMO_PD"] = DBNull.Value;
            else r["ASMO_PD"] = itm.ASMO_PD;
            r["CYCLE_NM"] = itm.CYCLE_NM;
            r["CURR_STRT_DT"] = itm.CURR_STRT_DT;
            r["CURR_END_DT"] = itm.CURR_END_DT;
            r["CPU_VRT_NM"] = itm.CPU_VRT_NM;
            r["CPU_SKU_NM"] = itm.CPU_SKU_NM;
            r["CPU_PROCESSOR_NUMBER"] = itm.CPU_PROCESSOR_NUMBER;
            r["IS_DELETE"] = itm.IS_DELETE;
            this.Rows.Add(r);
        }


    }
}
