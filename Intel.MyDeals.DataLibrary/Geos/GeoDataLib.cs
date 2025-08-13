using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class GeoDataLib : IGeoDataLib
    {           
        
        /// <summary>
        /// Get Geo Dimensions with filter and paging
        /// </summary>
        /// <returns>list of geo dimension data</returns>
        public GeoDetails GetGeoDimensions(GeoFilters data = null)
        {
            OpLog.Log("GetGeoDimensions");

            var ret = new List<GeoDimension>();
            int RowCount = 0;
            if (data == null) {
                data = new GeoFilters
                {
                    InFilters = String.Empty,
                    Sort = String.Empty,
                    Take = -1,
                    Skip = 0,                    
                    FtchCnt = false
                };
            }
            var cmd = new Procs.dbo.PR_MYDL_GET_GEO_DIM
            {
                FILTER = data.InFilters,
                SORT = data.Sort,
                TAKE = data.Take,
                SKIP = data.Skip,
                FTHCNT = !(data.FtchCnt)
            };

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
                    if (rdr.NextResult() && rdr.Read())
                    {
                        RowCount = rdr.GetFieldValue<System.Int32>(0);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            } 
            
            return new GeoDetails { Items = ret, TotalRows = RowCount }; 
            
        }

        public IEnumerable<DcsSoldTo> GetSoldTos()
        {
            return new List<DcsSoldTo>();
            //var cmd = new Procs.CDMS_MYDEALS.app.PR_GET_SOLD_TO();

            //List<DcsSoldTo> returnDcsSoldTosList = new List<DcsSoldTo>();
            //using (var rdr = DataAccess.ExecuteReader(cmd))
            //{
            //    int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
            //    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
            //    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
            //    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
            //    int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");
            //    int IDX_SOLD_TO_ID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID");
            //    while (rdr.Read())
            //    {
            //        returnDcsSoldTosList.Add(new DcsSoldTo
            //        {
            //            CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
            //            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
            //            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
            //            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
            //            GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM),
            //            SOLD_TO_ID = (IDX_SOLD_TO_ID < 0 || rdr.IsDBNull(IDX_SOLD_TO_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SOLD_TO_ID)
            //        });
            //    }
            //}
            //return returnDcsSoldTosList;
        }
    }
}