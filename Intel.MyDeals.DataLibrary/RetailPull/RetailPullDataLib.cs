using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Data;

namespace Intel.MyDeals.DataLibrary
{
    public class RetailPullDataLib : IRetailPullDataLib
    {
        public RetailPullDataLib()
        {
        }

		/// <summary>
		/// Get Retail Pull Cycle and associated Retail Pull $'s 
		/// </summary>
		public List<RetailPull> GetRetailPullFromSDMList()
        {
            var ret = new List<RetailPull>();
            Procs.dbo.PR_MYDL_GET_SDM_RTL_PULL cmd = new Procs.dbo.PR_MYDL_GET_SDM_RTL_PULL();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
				{
					int IDX_APAC_PD = DB.GetReaderOrdinal(rdr, "APAC_PD");
					int IDX_ASMO_PD = DB.GetReaderOrdinal(rdr, "ASMO_PD");
					int IDX_CPU_FLR = DB.GetReaderOrdinal(rdr, "CPU_FLR");
					int IDX_CPU_SKU_NM = DB.GetReaderOrdinal(rdr, "CPU_SKU_NM");
					int IDX_CURR_END_DT = DB.GetReaderOrdinal(rdr, "CURR_END_DT");
					int IDX_CURR_STRT_DT = DB.GetReaderOrdinal(rdr, "CURR_STRT_DT");
					int IDX_CYCLE_NM = DB.GetReaderOrdinal(rdr, "CYCLE_NM");
					int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
					int IDX_EMEA_PD = DB.GetReaderOrdinal(rdr, "EMEA_PD");
					int IDX_IJKK_PD = DB.GetReaderOrdinal(rdr, "IJKK_PD");
					int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
					int IDX_PCSR_NBR = DB.GetReaderOrdinal(rdr, "PCSR_NBR");
					int IDX_PRC_PD = DB.GetReaderOrdinal(rdr, "PRC_PD");
					int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
					int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
					int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
					int IDX_WW_PD = DB.GetReaderOrdinal(rdr, "WW_PD");

					while (rdr.Read())
                    {
                        ret.Add(new RetailPull
						{
							APAC_PD = (IDX_APAC_PD < 0 || rdr.IsDBNull(IDX_APAC_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_APAC_PD),
							ASMO_PD = (IDX_ASMO_PD < 0 || rdr.IsDBNull(IDX_ASMO_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ASMO_PD),
							CPU_FLR = (IDX_CPU_FLR < 0 || rdr.IsDBNull(IDX_CPU_FLR)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_CPU_FLR),
							CPU_SKU_NM = (IDX_CPU_SKU_NM < 0 || rdr.IsDBNull(IDX_CPU_SKU_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CPU_SKU_NM),
							CURR_END_DT = (IDX_CURR_END_DT < 0 || rdr.IsDBNull(IDX_CURR_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_END_DT),
							CURR_STRT_DT = (IDX_CURR_STRT_DT < 0 || rdr.IsDBNull(IDX_CURR_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CURR_STRT_DT),
							CYCLE_NM = (IDX_CYCLE_NM < 0 || rdr.IsDBNull(IDX_CYCLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CYCLE_NM),
							DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
							EMEA_PD = (IDX_EMEA_PD < 0 || rdr.IsDBNull(IDX_EMEA_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_EMEA_PD),
							IJKK_PD = (IDX_IJKK_PD < 0 || rdr.IsDBNull(IDX_IJKK_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IJKK_PD),
							MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
							PCSR_NBR = (IDX_PCSR_NBR < 0 || rdr.IsDBNull(IDX_PCSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PCSR_NBR),
							PRC_PD = (IDX_PRC_PD < 0 || rdr.IsDBNull(IDX_PRC_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_PRC_PD),
							PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
							PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
							PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
							WW_PD = (IDX_WW_PD < 0 || rdr.IsDBNull(IDX_WW_PD)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_WW_PD)
						});
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }
		
    }
}