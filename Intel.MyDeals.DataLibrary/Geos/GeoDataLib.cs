using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public class GeoDataLib
    {
        /// <summary>
        /// Get All Geo Dimensions
        /// </summary>
        /// <returns>list of geo dimension data</returns>
        public List<GeoDimension> GetGeoDimensions()
        {
            OpLogPerf.Log("GetGeoDimensions");

            var ret = new List<GeoDimension>();
            var cmd = new Procs.dbo.PR_MYDL_GET_GEO_DIM { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CTRY_NM = DB.GetReaderOrdinal(rdr, "CTRY_NM");
                    int IDX_CTRY_NM_SID = DB.GetReaderOrdinal(rdr, "CTRY_NM_SID");
                    int IDX_GEO_ATRB_SID = DB.GetReaderOrdinal(rdr, "GEO_ATRB_SID");
                    int IDX_GEO_MBR_SID = DB.GetReaderOrdinal(rdr, "GEO_MBR_SID");
                    int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");
                    int IDX_GEO_NM_SID = DB.GetReaderOrdinal(rdr, "GEO_NM_SID");
                    int IDX_RGN_NM = DB.GetReaderOrdinal(rdr, "RGN_NM");
                    int IDX_RGN_NM_SID = DB.GetReaderOrdinal(rdr, "RGN_NM_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new GeoDimension
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CTRY_NM = (IDX_CTRY_NM < 0 || rdr.IsDBNull(IDX_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRY_NM),
                            CTRY_NM_SID = (IDX_CTRY_NM_SID < 0 || rdr.IsDBNull(IDX_CTRY_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CTRY_NM_SID),
                            GEO_ATRB_SID = (IDX_GEO_ATRB_SID < 0 || rdr.IsDBNull(IDX_GEO_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_ATRB_SID),
                            GEO_MBR_SID = (IDX_GEO_MBR_SID < 0 || rdr.IsDBNull(IDX_GEO_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_MBR_SID),
                            GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM),
                            GEO_NM_SID = (IDX_GEO_NM_SID < 0 || rdr.IsDBNull(IDX_GEO_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_NM_SID),
                            RGN_NM = (IDX_RGN_NM < 0 || rdr.IsDBNull(IDX_RGN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RGN_NM),
                            RGN_NM_SID = (IDX_RGN_NM_SID < 0 || rdr.IsDBNull(IDX_RGN_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RGN_NM_SID)
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
