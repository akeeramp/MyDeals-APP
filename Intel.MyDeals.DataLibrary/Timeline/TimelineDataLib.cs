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
    public class TimelineDataLib : ITimelineDataLib
    {
        public List<Timeline> GetTimelineDetails(int id)
        {
            OpLogPerf.Log("Timeline");
            List<Timeline> ret = new List<Timeline>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_CL_OBJ_HIST
                {
                    ContractNumber = id
                };                

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ATRB_DESC = DB.GetReaderOrdinal(rdr, "ATRB_DESC");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "ATRB_VAL");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_FLAG = DB.GetReaderOrdinal(rdr, "FLAG");
                    int IDX_FRST_NM = DB.GetReaderOrdinal(rdr, "FRST_NM");
                    int IDX_HIST_EFF_FR_DTM = DB.GetReaderOrdinal(rdr, "HIST_EFF_FR_DTM");
                    int IDX_HIST_EFF_TO_DTM = DB.GetReaderOrdinal(rdr, "HIST_EFF_TO_DTM");
                    int IDX_LST_NM = DB.GetReaderOrdinal(rdr, "LST_NM");
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_PARNT_OBJ_SID = DB.GetReaderOrdinal(rdr, "PARNT_OBJ_SID");
                    int IDX_USR_ROLES = DB.GetReaderOrdinal(rdr, "USR_ROLES");

                    while (rdr.Read())
                    {
                        ret.Add(new Timeline
                        {
                            ATRB_DESC = (IDX_ATRB_DESC < 0 || rdr.IsDBNull(IDX_ATRB_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_DESC),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                            ATRB_VAL = (IDX_ATRB_VAL < 0 || rdr.IsDBNull(IDX_ATRB_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            FLAG = (IDX_FLAG < 0 || rdr.IsDBNull(IDX_FLAG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FLAG),
                            FRST_NM = (IDX_FRST_NM < 0 || rdr.IsDBNull(IDX_FRST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRST_NM),
                            HIST_EFF_FR_DTM = (IDX_HIST_EFF_FR_DTM < 0 || rdr.IsDBNull(IDX_HIST_EFF_FR_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_HIST_EFF_FR_DTM),
                            HIST_EFF_TO_DTM = (IDX_HIST_EFF_TO_DTM < 0 || rdr.IsDBNull(IDX_HIST_EFF_TO_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_HIST_EFF_TO_DTM),
                            LST_NM = (IDX_LST_NM < 0 || rdr.IsDBNull(IDX_LST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_NM),
                            OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            PARNT_OBJ_SID = (IDX_PARNT_OBJ_SID < 0 || rdr.IsDBNull(IDX_PARNT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PARNT_OBJ_SID),
                            USR_ROLES = (IDX_USR_ROLES < 0 || rdr.IsDBNull(IDX_USR_ROLES)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_ROLES)
                        });
                    } // while
                    
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
