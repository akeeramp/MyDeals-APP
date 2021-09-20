using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;


namespace Intel.MyDeals.DataLibrary
{
    public class VistexCustomerMappingDataLib : IVistexCustomerMappingDataLib
    {
        /// <summary>
        /// Get All Vistex Customer Mappings 
        /// </summary>
        /// <returns>List of Vistex Customer Mappings Data </returns>
        public List<VistexCustomerMapping> GetVistexCustomerMappings()
        {
            OpLog.Log("GetVistexCustomerMappings");

            var ret = new List<VistexCustomerMapping>();
            var cmd = new Procs.dbo.PR_MYDL_GET_VISTEX_CUST_MAP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DFLT_AR_SETL_LVL = DB.GetReaderOrdinal(rdr, "DFLT_AR_SETL_LVL");
                    int IDX_VISTEX_CUST_FLAG = DB.GetReaderOrdinal(rdr, "VISTEX_CUST_FLAG");
                    int IDX_DFLT_DOUBLE_CONSUMPTION = DB.GetReaderOrdinal(rdr, "DFLT_DOUBLE_CONSUMPTION");
                    int IDX_DFLT_PERD_PRFL = DB.GetReaderOrdinal(rdr, "DFLT_PERD_PRFL");
                    int IDX_DFLT_TNDR_AR_SETL_LVL = DB.GetReaderOrdinal(rdr, "DFLT_TNDR_AR_SETL_LVL");
                    int IDX_DFLT_LOOKBACK_PERD = DB.GetReaderOrdinal(rdr, "DFLT_LOOKBACK_PERD");
                    int IDX_DFLT_CUST_RPT_GEO = DB.GetReaderOrdinal(rdr, "DFLT_CUST_RPT_GEO");
                    int IDX_CUST_CIM_ID = DB.GetReaderOrdinal(rdr, "CUST_CIM_ID");
                    int IDX_DFLT_SETTLEMENT_PARTNER = DB.GetReaderOrdinal(rdr, "DFLT_SETTLEMENT_PARTNER");

                    while (rdr.Read())
                    {
                        ret.Add(new VistexCustomerMapping
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DFLT_AR_SETL_LVL = (IDX_DFLT_AR_SETL_LVL < 0 || rdr.IsDBNull(IDX_DFLT_AR_SETL_LVL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_AR_SETL_LVL),
                            VISTEX_CUST_FLAG = (IDX_VISTEX_CUST_FLAG < 0 || rdr.IsDBNull(IDX_VISTEX_CUST_FLAG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_VISTEX_CUST_FLAG),
                            DFLT_DOUBLE_CONSUMPTION = (IDX_DFLT_DOUBLE_CONSUMPTION < 0 || rdr.IsDBNull(IDX_DFLT_DOUBLE_CONSUMPTION)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_DFLT_DOUBLE_CONSUMPTION),
                            DFLT_PERD_PRFL = (IDX_DFLT_PERD_PRFL < 0 || rdr.IsDBNull(IDX_DFLT_PERD_PRFL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_PERD_PRFL),
                            DFLT_TNDR_AR_SETL_LVL = (IDX_DFLT_TNDR_AR_SETL_LVL < 0 || rdr.IsDBNull(IDX_DFLT_TNDR_AR_SETL_LVL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_TNDR_AR_SETL_LVL),
                            DFLT_LOOKBACK_PERD = (IDX_DFLT_LOOKBACK_PERD < 0 || rdr.IsDBNull(IDX_DFLT_LOOKBACK_PERD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DFLT_LOOKBACK_PERD),
                            DFLT_CUST_RPT_GEO = (IDX_DFLT_CUST_RPT_GEO < 0 || rdr.IsDBNull(IDX_DFLT_CUST_RPT_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_CUST_RPT_GEO),
                            CUST_CIM_ID = (IDX_CUST_CIM_ID < 0 || rdr.IsDBNull(IDX_CUST_CIM_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CIM_ID),
                            DFLT_SETTLEMENT_PARTNER = (IDX_DFLT_SETTLEMENT_PARTNER < 0 || rdr.IsDBNull(IDX_DFLT_SETTLEMENT_PARTNER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_SETTLEMENT_PARTNER),
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

        /// <summary>
        /// Save Is vistex customer flag Changes 
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public List<VistexCustomerMapping> SetVistexCustomerMapping(CrudModes mode, VistexCustomerMapping data)
        {
            var retVstxCustMappings = new List<VistexCustomerMapping>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_VISTEX_CUST_MAP
                {
                    in_cust_mbr_sid = data.CUST_MBR_SID,
                    in_vistex_cust_flag = data.VISTEX_CUST_FLAG,
                    in_dflt_dbl_cnsmptn = data.DFLT_DOUBLE_CONSUMPTION,
                    in_dflt_ar_setl_lvl = data.DFLT_AR_SETL_LVL,
                    in_dflt_tndr_ar_setl_lvl = data.DFLT_TNDR_AR_SETL_LVL,
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    in_dflt_perd_prfl = data.DFLT_PERD_PRFL == null ? string.Empty : data.DFLT_PERD_PRFL,
                    in_dflt_cust_rpt_geo = data.DFLT_CUST_RPT_GEO,
                    in_dflt_lookback_perd = data.DFLT_LOOKBACK_PERD,
                    in_cust_cim_id = data.CUST_CIM_ID,
                    in_dflt_stlmnt_Prtnr = data.DFLT_SETTLEMENT_PARTNER
                }))
                {
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DFLT_AR_SETL_LVL = DB.GetReaderOrdinal(rdr, "DFLT_AR_SETL_LVL");
                    int IDX_VISTEX_CUST_FLAG = DB.GetReaderOrdinal(rdr, "VISTEX_CUST_FLAG");
                    int IDX_DFLT_DOUBLE_CONSUMPTION = DB.GetReaderOrdinal(rdr, "DFLT_DOUBLE_CONSUMPTION");
                    int IDX_DFLT_PERD_PRFL = DB.GetReaderOrdinal(rdr, "DFLT_PERD_PRFL");
                    int IDX_DFLT_TNDR_AR_SETL_LVL = DB.GetReaderOrdinal(rdr, "DFLT_TNDR_AR_SETL_LVL");
                    int IDX_DFLT_CUST_RPT_GEO = DB.GetReaderOrdinal(rdr, "DFLT_CUST_RPT_GEO");
                    int IDX_DFLT_LOOKBACK_PERD = DB.GetReaderOrdinal(rdr, "DFLT_LOOKBACK_PERD");
                    int IDX_CUST_CIM_ID = DB.GetReaderOrdinal(rdr, "CUST_CIM_ID");
                    int IDX_DFLT_SETTLEMENT_PARTNER = DB.GetReaderOrdinal(rdr, "DFLT_SETTLEMENT_PARTNER");

                    while (rdr.Read())
                    {
                        retVstxCustMappings.Add(new VistexCustomerMapping
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DFLT_AR_SETL_LVL = (IDX_DFLT_AR_SETL_LVL < 0 || rdr.IsDBNull(IDX_DFLT_AR_SETL_LVL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_AR_SETL_LVL),
                            VISTEX_CUST_FLAG = (IDX_VISTEX_CUST_FLAG < 0 || rdr.IsDBNull(IDX_VISTEX_CUST_FLAG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_VISTEX_CUST_FLAG),
                            DFLT_DOUBLE_CONSUMPTION = (IDX_DFLT_DOUBLE_CONSUMPTION < 0 || rdr.IsDBNull(IDX_DFLT_DOUBLE_CONSUMPTION)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_DFLT_DOUBLE_CONSUMPTION),
                            DFLT_PERD_PRFL = (IDX_DFLT_PERD_PRFL < 0 || rdr.IsDBNull(IDX_DFLT_PERD_PRFL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_PERD_PRFL),
                            DFLT_TNDR_AR_SETL_LVL = (IDX_DFLT_TNDR_AR_SETL_LVL < 0 || rdr.IsDBNull(IDX_DFLT_TNDR_AR_SETL_LVL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_TNDR_AR_SETL_LVL),
                            DFLT_CUST_RPT_GEO = (IDX_DFLT_CUST_RPT_GEO < 0 || rdr.IsDBNull(IDX_DFLT_CUST_RPT_GEO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_CUST_RPT_GEO),
                            DFLT_LOOKBACK_PERD = (IDX_DFLT_LOOKBACK_PERD < 0 || rdr.IsDBNull(IDX_DFLT_LOOKBACK_PERD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DFLT_LOOKBACK_PERD),
                            CUST_CIM_ID = (IDX_CUST_CIM_ID < 0 || rdr.IsDBNull(IDX_CUST_CIM_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_CIM_ID),
                            DFLT_SETTLEMENT_PARTNER = (IDX_DFLT_SETTLEMENT_PARTNER < 0 || rdr.IsDBNull(IDX_DFLT_SETTLEMENT_PARTNER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DFLT_SETTLEMENT_PARTNER),
                        });
                    }

                    DataCollections.RecycleCache("_getVistexCustomerMappings");
                    DataCollections.RecycleCache("_getMyCustomers");
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retVstxCustMappings;
        }
    }
}
