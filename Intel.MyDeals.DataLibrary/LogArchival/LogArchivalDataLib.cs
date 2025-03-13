using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class LogArchivalDataLib: ILogArchivalDataLib
    {

        public List<LogArchivalDetails> GetLogArchivalDetails()
        {
            OpLog.Log("GetLogArchivalDetails");

            var ret = new List<LogArchivalDetails>();

            var cmd = new Procs.dbo.PR_MANAGE_LOG_ARCHIVAL_ACTNS { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_LOG_ARCHVL_PRG_TBL_DTL_SID = DB.GetReaderOrdinal(rdr, "LOG_ARCHVL_PRG_TBL_DTL_SID");
                    int IDX_SRT_ORDR = DB.GetReaderOrdinal(rdr, "SRT_ORDR");
                    int IDX_DB_NAME = DB.GetReaderOrdinal(rdr, "DB_NAME");
                    int IDX_SCHEMA = DB.GetReaderOrdinal(rdr, "SCHEMA");
                    int IDX_LOG_TBL_NM = DB.GetReaderOrdinal(rdr, "LOG_TBL_NM");
                    int IDX_IS_PURGE = DB.GetReaderOrdinal(rdr, "IS_PURGE");
                    int IDX_IS_ARCHV = DB.GetReaderOrdinal(rdr, "IS_ARCHV");
                    int IDX_ARCHV_DB_NAME = DB.GetReaderOrdinal(rdr, "ARCHV_DB_NAME");
                    int IDX_ARCHV_SCHEMA = DB.GetReaderOrdinal(rdr, "ARCHV_SCHEMA");
                    int IDX_ARCHV_TBL_NM = DB.GetReaderOrdinal(rdr, "ARCHV_TBL_NM"); 
                    int IDX_VIEW_NM = DB.GetReaderOrdinal(rdr, "VIEW_NM");
                    int IDX_JSON_COND = DB.GetReaderOrdinal(rdr, "JSON_COND");
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "STATUS");
                    int IDX_LST_RUN = DB.GetReaderOrdinal(rdr, "LST_RUN");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");

                    while (rdr.Read())
                    {
                        ret.Add(new LogArchivalDetails
                        {
                            LOG_ARCHVL_PRG_TBL_DTL_SID = (IDX_LOG_ARCHVL_PRG_TBL_DTL_SID < 0 || rdr.IsDBNull(IDX_LOG_ARCHVL_PRG_TBL_DTL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_LOG_ARCHVL_PRG_TBL_DTL_SID),
                            SRT_ORDR = (IDX_SRT_ORDR < 0 || rdr.IsDBNull(IDX_SRT_ORDR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SRT_ORDR),
                            DB_NAME = (IDX_DB_NAME < 0 || rdr.IsDBNull(IDX_DB_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DB_NAME),
                            SCHEMA = (IDX_SCHEMA < 0 || rdr.IsDBNull(IDX_SCHEMA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SCHEMA),
                            LOG_TBL_NM = (IDX_LOG_TBL_NM < 0 || rdr.IsDBNull(IDX_LOG_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LOG_TBL_NM),
                            IS_PURGE = rdr.IsDBNull(IDX_IS_PURGE) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_PURGE),
                            IS_ARCHV = rdr.IsDBNull(IDX_IS_ARCHV) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_ARCHV),
                            ARCHV_DB_NAME = (IDX_ARCHV_DB_NAME < 0 || rdr.IsDBNull(IDX_ARCHV_DB_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ARCHV_DB_NAME),
                            ARCHV_SCHEMA = (IDX_ARCHV_SCHEMA < 0 || rdr.IsDBNull(IDX_ARCHV_SCHEMA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ARCHV_SCHEMA),
                            ARCHV_TBL_NM = (IDX_ARCHV_TBL_NM < 0 || rdr.IsDBNull(IDX_ARCHV_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ARCHV_TBL_NM),
                            VIEW_NM = (IDX_VIEW_NM < 0 || rdr.IsDBNull(IDX_VIEW_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VIEW_NM),
                            JSON_COND = (IDX_JSON_COND < 0 || rdr.IsDBNull(IDX_JSON_COND)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_COND),
                            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            STATUS = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_STATUS),
                            LST_RUN = (IDX_LST_RUN < 0 || rdr.IsDBNull(IDX_LST_RUN)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LST_RUN),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
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


        public List<LogArchival> SetLogArchival(string mode, List<LogArchival> logArchValues)
        {
            OpLog.Log("SetLogArchival");

            in_t_log_archival dt = new in_t_log_archival();
            logArchValues.ForEach(x =>
                dt.AddRow(x)
            );
            var ret = new List<LogArchival>();

            var cmd = new Procs.dbo.PR_MANAGE_LOG_ARCHIVAL_ACTNS()
            {
                @logarch_inp = dt,
                @mode = mode.ToString(),
                @emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID == 0  ? 99999999 : OpUserStack.MyOpUserToken.Usr.WWID
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_srt_ordr = DB.GetReaderOrdinal(rdr, "SRT_ORDR");
                    int IDX_db_name = DB.GetReaderOrdinal(rdr, "DB_NAME");
                    int IDX_schema = DB.GetReaderOrdinal(rdr, "SCHEMA");
                    int IDX_log_tbl_nm = DB.GetReaderOrdinal(rdr, "LOG_TBL_NM");
                    int IDX_is_purge = DB.GetReaderOrdinal(rdr, "IS_PURGE");
                    int IDX_is_archv = DB.GetReaderOrdinal(rdr, "IS_ARCHV");
                    int IDX_archv_db_name = DB.GetReaderOrdinal(rdr, "ARCHV_DB_NAME");
                    int IDX_archv_schema = DB.GetReaderOrdinal(rdr, "ARCHV_SCHEMA");
                    int IDX_json_cond = DB.GetReaderOrdinal(rdr, "JSON_COND");
                    int IDX_actv_ind = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_logarchival_sid = DB.GetReaderOrdinal(rdr, "LOG_ARCHVL_PRG_TBL_DTL_SID");
                    
                    while (rdr.Read())
                    {
                        ret.Add(new LogArchival
                        {
                            LOG_ARCHVL_PRG_TBL_DTL_SID = (IDX_logarchival_sid < 0 || rdr.IsDBNull(IDX_logarchival_sid)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_logarchival_sid),
                            SRT_ORDR = (IDX_srt_ordr < 0 || rdr.IsDBNull(IDX_srt_ordr)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_srt_ordr),
                            DB_NAME = (IDX_db_name < 0 || rdr.IsDBNull(IDX_db_name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_db_name),
                            SCHEMA = (IDX_schema < 0 || rdr.IsDBNull(IDX_schema)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_schema),
                            LOG_TBL_NM = (IDX_schema < 0 || rdr.IsDBNull(IDX_log_tbl_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_log_tbl_nm),
                            IS_PURGE = rdr.IsDBNull(IDX_is_purge) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_is_purge),
                            IS_ARCHV = rdr.IsDBNull(IDX_is_archv) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_is_archv),
                            ARCHV_DB_NAME = (IDX_archv_db_name < 0 || rdr.IsDBNull(IDX_archv_db_name)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_archv_db_name),
                            ARCHV_SCHEMA = (IDX_archv_schema < 0 || rdr.IsDBNull(IDX_archv_schema)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_archv_schema),
                            JSON_COND = (IDX_json_cond < 0 || rdr.IsDBNull(IDX_json_cond)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_json_cond),
                            ACTV_IND = rdr.IsDBNull(IDX_actv_ind) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_actv_ind),
                        });
                    } 
                }
                DataCollections.RecycleCache("_getToolConstants");
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