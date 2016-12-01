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
                    int IDX_GEO_MBR_SID = DB.GetReaderOrdinal(rdr, "GEO_MBR_SID");
                    int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");
                    int IDX_SRT_ORD = DB.GetReaderOrdinal(rdr, "SRT_ORD");

                    while (rdr.Read())
                    {
                        ret.Add(new GeoDimension
                        {
                            GEO_MBR_SID = (IDX_GEO_MBR_SID < 0 || rdr.IsDBNull(IDX_GEO_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GEO_MBR_SID),
                            GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM),
                            SRT_ORD = (IDX_SRT_ORD < 0 || rdr.IsDBNull(IDX_SRT_ORD)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_SRT_ORD)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw;
            }
            return ret;
        }
    }
}
