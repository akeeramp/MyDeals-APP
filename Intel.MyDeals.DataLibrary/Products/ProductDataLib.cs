using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ProductDataLib
    {
        /// <summary>
        /// Get All Products
        /// </summary>
        /// <returns>list of product data</returns>
        public List<Product> GetProducts()
        {
            OpLogPerf.Log("GetProducts");

            var ret = new List<Product>();
            var cmd = new Procs.dbo.PR_MYDL_GET_PRD_DTL { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_ALL_PRD_NM = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM");
                    int IDX_ALL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "ALL_PRD_NM_SID");
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_BRND_NM_SID = DB.GetReaderOrdinal(rdr, "BRND_NM_SID");
                    int IDX_DEAL_PRD_NM = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM");
                    int IDX_DEAL_PRD_NM_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_NM_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_PRD_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE_SID");
                    int IDX_FMLY_NM = DB.GetReaderOrdinal(rdr, "FMLY_NM");
                    int IDX_FMLY_NM_SID = DB.GetReaderOrdinal(rdr, "FMLY_NM_SID");
                    int IDX_MTRL_ID = DB.GetReaderOrdinal(rdr, "MTRL_ID");
                    int IDX_MTRL_ID_SID = DB.GetReaderOrdinal(rdr, "MTRL_ID_SID");
                    int IDX_PRCSSR_NBR = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR");
                    int IDX_PRCSSR_NBR_SID = DB.GetReaderOrdinal(rdr, "PRCSSR_NBR_SID");
                    int IDX_PRD_ATRB_SID = DB.GetReaderOrdinal(rdr, "PRD_ATRB_SID");
                    int IDX_PRD_CATGRY_NM = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM");
                    int IDX_PRD_CATGRY_NM_SID = DB.GetReaderOrdinal(rdr, "PRD_CATGRY_NM_SID");
                    int IDX_PRD_END_DTM = DB.GetReaderOrdinal(rdr, "PRD_END_DTM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                    int IDX_PRD_STRT_DTM = DB.GetReaderOrdinal(rdr, "PRD_STRT_DTM");

                    while (rdr.Read())
                    {
                        ret.Add(new Product
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            ALL_PRD_NM = (IDX_ALL_PRD_NM < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALL_PRD_NM),
                            ALL_PRD_NM_SID = (IDX_ALL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_ALL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ALL_PRD_NM_SID),
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            BRND_NM_SID = (IDX_BRND_NM_SID < 0 || rdr.IsDBNull(IDX_BRND_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BRND_NM_SID),
                            DEAL_PRD_NM = (IDX_DEAL_PRD_NM < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_NM),
                            DEAL_PRD_NM_SID = (IDX_DEAL_PRD_NM_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_NM_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_PRD_TYPE_SID = (IDX_DEAL_PRD_TYPE_SID < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_PRD_TYPE_SID),
                            FMLY_NM = (IDX_FMLY_NM < 0 || rdr.IsDBNull(IDX_FMLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMLY_NM),
                            FMLY_NM_SID = (IDX_FMLY_NM_SID < 0 || rdr.IsDBNull(IDX_FMLY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FMLY_NM_SID),
                            MTRL_ID = (IDX_MTRL_ID < 0 || rdr.IsDBNull(IDX_MTRL_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MTRL_ID),
                            MTRL_ID_SID = (IDX_MTRL_ID_SID < 0 || rdr.IsDBNull(IDX_MTRL_ID_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MTRL_ID_SID),
                            PRCSSR_NBR = (IDX_PRCSSR_NBR < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRCSSR_NBR),
                            PRCSSR_NBR_SID = (IDX_PRCSSR_NBR_SID < 0 || rdr.IsDBNull(IDX_PRCSSR_NBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRCSSR_NBR_SID),
                            PRD_ATRB_SID = (IDX_PRD_ATRB_SID < 0 || rdr.IsDBNull(IDX_PRD_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_ATRB_SID),
                            PRD_CATGRY_NM = (IDX_PRD_CATGRY_NM < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CATGRY_NM),
                            PRD_CATGRY_NM_SID = (IDX_PRD_CATGRY_NM_SID < 0 || rdr.IsDBNull(IDX_PRD_CATGRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_CATGRY_NM_SID),
                            PRD_END_DTM = (IDX_PRD_END_DTM < 0 || rdr.IsDBNull(IDX_PRD_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_END_DTM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                            PRD_STRT_DTM = (IDX_PRD_STRT_DTM < 0 || rdr.IsDBNull(IDX_PRD_STRT_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PRD_STRT_DTM)
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
