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

namespace Intel.MyDeals.DataLibrary
{
    public class JobMonitorDataLib: IJobMonitorDataLib
    {

        public List<BatchRunHealthSts> GetBatchRunHealthStatus()
        {
            OpLog.Log("GetBatchRunHealthStatus");

            var ret = new List<BatchRunHealthSts>();

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_BTCH_RUN_HLTH_STS
            {
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BATCH_RUN_ID = DB.GetReaderOrdinal(rdr, "JOB_SID");
                    int IDX_BATCH_DSC = DB.GetReaderOrdinal(rdr, "BTCH_DSC");
                    int IDX_BATCH_SCHDL = DB.GetReaderOrdinal(rdr, "SCHDL");
                    int IDX_BATCH_RUN_STATUS = DB.GetReaderOrdinal(rdr, "STATUS");
                    int IDX_HEALTH = DB.GetReaderOrdinal(rdr, "HEALTH");
                    int IDX_END_DTM = DB.GetReaderOrdinal(rdr, "PKG_END_DTM");
                    int IDX_START_DTM = DB.GetReaderOrdinal(rdr, "CNTN_STRT_DTM");
                    int IDX_TIMEDIFF = DB.GetReaderOrdinal(rdr, "TIMEDIFF");
                    int IDX_MCHN_NM = DB.GetReaderOrdinal(rdr, "MCHN_NM");
                    int IDX_PKG_NM = DB.GetReaderOrdinal(rdr, "PKG");
                    int IDX_THRESHOLD = DB.GetReaderOrdinal(rdr, "THRESHOLD");
                    int IDX_LST_RUN_DTM = DB.GetReaderOrdinal(rdr, "LST_RUN");
                    int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");

                    while (rdr.Read())
                    {
                        ret.Add(new BatchRunHealthSts
                        {
                            BATCH_RUN_ID = (IDX_BATCH_RUN_ID < 0 || rdr.IsDBNull(IDX_BATCH_RUN_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BATCH_RUN_ID),
                            BATCH_DSC = (IDX_BATCH_DSC < 0 || rdr.IsDBNull(IDX_BATCH_DSC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BATCH_DSC),
                            BATCH_SCHDL = (IDX_BATCH_SCHDL < 0 || rdr.IsDBNull(IDX_BATCH_SCHDL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BATCH_SCHDL),
                            BATCH_RUN_STATUS = (IDX_BATCH_RUN_STATUS < 0 || rdr.IsDBNull(IDX_BATCH_RUN_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BATCH_RUN_STATUS),
                            HEALTH = (IDX_HEALTH < 0 || rdr.IsDBNull(IDX_HEALTH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HEALTH),
                            END_DTM = (IDX_END_DTM < 0 || rdr.IsDBNull(IDX_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DTM),
                            START_DTM = (IDX_START_DTM < 0 || rdr.IsDBNull(IDX_START_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DTM),
                            TIMEDIFF = (IDX_TIMEDIFF < 0 || rdr.IsDBNull(IDX_TIMEDIFF)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TIMEDIFF),
                            MCHN_NM = (IDX_MCHN_NM < 0 || rdr.IsDBNull(IDX_MCHN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MCHN_NM),
                            PKG_NM = (IDX_PKG_NM < 0 || rdr.IsDBNull(IDX_PKG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PKG_NM),
                            THRESHOLD = (IDX_THRESHOLD < 0 || rdr.IsDBNull(IDX_THRESHOLD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_THRESHOLD),
                            LST_RUN_DTM = (IDX_LST_RUN_DTM < 0 || rdr.IsDBNull(IDX_LST_RUN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LST_RUN_DTM),
                            ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG)
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


        /// <summary>
        /// 

        public List<BatchRunHealthSts> GetBatchStepsRunHealthStatus(string jobNm)
        {
            OpLog.Log("GetBatchStepsRunHealthStatus");

            var ret = new List<BatchRunHealthSts>();

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_BTCH_STEPS_RUN_HLTH_STS
            {
                in_job_nm = jobNm
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BATCH_RUN_ID = DB.GetReaderOrdinal(rdr, "JOB_SID");
                    int IDX_BATCH_RUN_STATUS = DB.GetReaderOrdinal(rdr, "RUN_STS");
                    int IDX_HEALTH = DB.GetReaderOrdinal(rdr, "HEALTH");
                    int IDX_END_DTM = DB.GetReaderOrdinal(rdr, "PKG_END_DTM");
                    int IDX_START_DTM = DB.GetReaderOrdinal(rdr, "PKG_STRT_DTM");
                    int IDX_TIMEDIFF = DB.GetReaderOrdinal(rdr, "TIMEDIFF");
                    int IDX_MCHN_NM = DB.GetReaderOrdinal(rdr, "MCHN_NM");
                    int IDX_PKG_NM = DB.GetReaderOrdinal(rdr, "STEP_NM");
                    int IDX_THRESHOLD = DB.GetReaderOrdinal(rdr, "THRESHOLD");
                    int IDX_LST_RUN_DTM = DB.GetReaderOrdinal(rdr, "CNTN_STRT_DTM");
                    int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");

                    while (rdr.Read())
                    {
                        ret.Add(new BatchRunHealthSts
                        {
                            BATCH_RUN_ID = (IDX_BATCH_RUN_ID < 0 || rdr.IsDBNull(IDX_BATCH_RUN_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BATCH_RUN_ID),
                            BATCH_RUN_STATUS = (IDX_BATCH_RUN_STATUS < 0 || rdr.IsDBNull(IDX_BATCH_RUN_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BATCH_RUN_STATUS),
                            HEALTH = (IDX_HEALTH < 0 || rdr.IsDBNull(IDX_HEALTH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HEALTH),
                            END_DTM = (IDX_END_DTM < 0 || rdr.IsDBNull(IDX_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DTM),
                            START_DTM = (IDX_START_DTM < 0 || rdr.IsDBNull(IDX_START_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DTM),
                            TIMEDIFF = (IDX_TIMEDIFF < 0 || rdr.IsDBNull(IDX_TIMEDIFF)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TIMEDIFF),
                            MCHN_NM = (IDX_MCHN_NM < 0 || rdr.IsDBNull(IDX_MCHN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MCHN_NM),
                            PKG_NM = (IDX_PKG_NM < 0 || rdr.IsDBNull(IDX_PKG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PKG_NM),
                            THRESHOLD = (IDX_THRESHOLD < 0 || rdr.IsDBNull(IDX_THRESHOLD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_THRESHOLD),
                            LST_RUN_DTM = (IDX_LST_RUN_DTM < 0 || rdr.IsDBNull(IDX_LST_RUN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LST_RUN_DTM),
                            ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG)
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

        /// <summary>
        /// 

        public List<BatchRunHealthSts> GetBatchStepRunHistory(string btchNm, string stepNm, int take)
        {
            OpLog.Log("GetBatchStepRunHistory");

            var ret = new List<BatchRunHealthSts>();

            var cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_MYDL_GET_BTCH_STEP_RUN_HLTH_STS_HIST
            {
                in_btch_nm = btchNm,
                in_step_nm = stepNm,
                take = take
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BATCH_RUN_ID = DB.GetReaderOrdinal(rdr, "JOB_SID");
                    int IDX_BATCH_RUN_STATUS = DB.GetReaderOrdinal(rdr, "RUN_STS");
                    int IDX_HEALTH = DB.GetReaderOrdinal(rdr, "HEALTH");
                    int IDX_END_DTM = DB.GetReaderOrdinal(rdr, "PKG_END_DTM");
                    int IDX_START_DTM = DB.GetReaderOrdinal(rdr, "PKG_STRT_DTM");
                    int IDX_TIMEDIFF = DB.GetReaderOrdinal(rdr, "TIMEDIFF");
                    int IDX_MCHN_NM = DB.GetReaderOrdinal(rdr, "MCHN_NM");
                    int IDX_PKG_NM = DB.GetReaderOrdinal(rdr, "STEP_NM");
                    int IDX_THRESHOLD = DB.GetReaderOrdinal(rdr, "THRESHOLD");
                    int IDX_LST_RUN_DTM = DB.GetReaderOrdinal(rdr, "CNTN_STRT_DTM");
                    int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");

                    while (rdr.Read())
                    {
                        ret.Add(new BatchRunHealthSts
                        {
                            BATCH_RUN_ID = (IDX_BATCH_RUN_ID < 0 || rdr.IsDBNull(IDX_BATCH_RUN_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_BATCH_RUN_ID),
                            BATCH_RUN_STATUS = (IDX_BATCH_RUN_STATUS < 0 || rdr.IsDBNull(IDX_BATCH_RUN_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BATCH_RUN_STATUS),
                            HEALTH = (IDX_HEALTH < 0 || rdr.IsDBNull(IDX_HEALTH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HEALTH),
                            END_DTM = (IDX_END_DTM < 0 || rdr.IsDBNull(IDX_END_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DTM),
                            START_DTM = (IDX_START_DTM < 0 || rdr.IsDBNull(IDX_START_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DTM),
                            TIMEDIFF = (IDX_TIMEDIFF < 0 || rdr.IsDBNull(IDX_TIMEDIFF)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TIMEDIFF),
                            MCHN_NM = (IDX_MCHN_NM < 0 || rdr.IsDBNull(IDX_MCHN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MCHN_NM),
                            PKG_NM = (IDX_PKG_NM < 0 || rdr.IsDBNull(IDX_PKG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PKG_NM),
                            THRESHOLD = (IDX_THRESHOLD < 0 || rdr.IsDBNull(IDX_THRESHOLD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_THRESHOLD),
                            LST_RUN_DTM = (IDX_LST_RUN_DTM < 0 || rdr.IsDBNull(IDX_LST_RUN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LST_RUN_DTM),
                            ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG)
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