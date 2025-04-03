using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary
{
    public class ConstantLookupDataLib : IConstantLookupDataLib
    {
        public List<LookupItem> GetLookups()
        {
            List<LookupItem> fake = new List<LookupItem>();
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 1" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 2" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 3" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 4" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 5" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 1" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 2" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 3" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 4" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 5" });

            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "1" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "2" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "3" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "4" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "5" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "6" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "7" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "8" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "9" });

            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 1" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 2" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 3" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 4" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 5" });

            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 1" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 2" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 3" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 4" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 5" });

            return fake;
            ////var cmd = new Procs.CDMS_MYDEALS.app.PR_GET_LOOKUPS();

            ////List<LookupItem> returnLookupsList = new List<LookupItem>();
            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
            ////    int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
            ////    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
            ////    int IDX_DROP_DOWN_DB = DB.GetReaderOrdinal(rdr, "DROP_DOWN_DB");
            ////    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");
            ////    while (rdr.Read())
            ////    {
            ////        returnLookupsList.Add(new LookupItem
            ////        {
            ////            ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
            ////            DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
            ////            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
            ////            DROP_DOWN_DB = (IDX_DROP_DOWN_DB < 0 || rdr.IsDBNull(IDX_DROP_DOWN_DB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN_DB),
            ////            ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
            ////        });
            ////    }
            ////}
            ////return returnLookupsList;
        }

        #region Constants Admin

        public int GetAdminToolConstInt(string cnstLookup, int defaultValue = 0)
        {
            int constRetValue;
            if (!int.TryParse(GetAdminToolConst(cnstLookup, defaultValue.ToString()), out constRetValue)) constRetValue = defaultValue;

            return constRetValue;
        }

        public string GetAdminToolConst(string cnstLookup, string defaultValue = "")
        {
            return GetAdminConstants().Where(c => c.CNST_NM == cnstLookup).Select(c => c.CNST_VAL_TXT).FirstOrDefault() ?? defaultValue;
        }

        public List<AdminConstant> GetAdminConstants()
        {
            var cmd = new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
            {
                emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                mode = CrudModes.Select.ToString()
            };

            List<AdminConstant> returnConstantsList = new List<AdminConstant>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CNST_DESC = DB.GetReaderOrdinal(rdr, "CNST_DESC");
                int IDX_CNST_NM = DB.GetReaderOrdinal(rdr, "CNST_NM");
                int IDX_CNST_SID = DB.GetReaderOrdinal(rdr, "CNST_SID");
                int IDX_CNST_VAL_TXT = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
                int IDX_TRK_HIST_FLG = DB.GetReaderOrdinal(rdr, "TRK_HIST_FLG");
                int IDX_UI_UPD_FLG = DB.GetReaderOrdinal(rdr, "UI_UPD_FLG");

                while (rdr.Read())
                {
                    returnConstantsList.Add(new AdminConstant
                    {
                        CNST_DESC = (IDX_CNST_DESC < 0 || rdr.IsDBNull(IDX_CNST_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_DESC),
                        CNST_NM = (IDX_CNST_NM < 0 || rdr.IsDBNull(IDX_CNST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_NM),
                        CNST_SID = (IDX_CNST_SID < 0 || rdr.IsDBNull(IDX_CNST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNST_SID),
                        CNST_VAL_TXT = (IDX_CNST_VAL_TXT < 0 || rdr.IsDBNull(IDX_CNST_VAL_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_VAL_TXT),
                        TRK_HIST_FLG = (IDX_TRK_HIST_FLG < 0 || rdr.IsDBNull(IDX_TRK_HIST_FLG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRK_HIST_FLG),
                        UI_UPD_FLG = rdr.IsDBNull(IDX_UI_UPD_FLG) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_UI_UPD_FLG),
                    });
                }
            }

            return returnConstantsList;
        }

        public AdminConstant SetAdminConstants(CrudModes mode, AdminConstant adminValues)
        {
            OpLog.Log("SetAdminConstants");
            var ret = new List<AdminConstant>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
                {
                    emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    mode = mode.ToString(),
                    cnst_nm = adminValues.CNST_NM,
                    cnst_sid = adminValues.CNST_SID,
                    cnst_desc = adminValues.CNST_DESC,
                    cnst_val_txt = adminValues.CNST_VAL_TXT,
                    trk_hist_flg = adminValues.TRK_HIST_FLG,
                    ui_upd_flg = adminValues.UI_UPD_FLG,
                }))
                {
                    int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "CNST_DESC");
                    int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "CNST_NM");
                    int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "CNST_SID");
                    int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
                    int IDX_TRK_HIST_FLG = DB.GetReaderOrdinal(rdr, "TRK_HIST_FLG");
                    int IDX_UI_UPD_FLG = DB.GetReaderOrdinal(rdr, "UI_UPD_FLG");

                    while (rdr.Read())
                    {
                        ret.Add(new AdminConstant
                        {
                            CNST_DESC = rdr.IsDBNull(IDX_cnst_desc) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_desc),
                            CNST_NM = rdr.IsDBNull(IDX_cnst_nm) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_nm),
                            CNST_SID = rdr.IsDBNull(IDX_cnst_sid) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_cnst_sid),
                            CNST_VAL_TXT = rdr.IsDBNull(IDX_cnst_val_txt) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_val_txt),
                            TRK_HIST_FLG = (IDX_TRK_HIST_FLG < 0 || rdr.IsDBNull(IDX_TRK_HIST_FLG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRK_HIST_FLG),
                            UI_UPD_FLG = rdr.IsDBNull(IDX_UI_UPD_FLG) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_UI_UPD_FLG)
                        });
                    } // while
                }
                DataCollections.RecycleCache("_getToolConstants");
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret.FirstOrDefault();
        }

        public void UpdateRecycleCacheConstants(string cnstName, string cnstVal)
        {
            OpLog.Log("UpdateRecycleCacheConstants");
            try
            {
                DataAccess.ExecuteNonQuery(new Procs.dbo.PR_MYDL_UPD_CACHE_CNST
                {
                   CNST_NM = cnstName,
                   CNST_VAL = cnstVal,
                   USR_WWID = 999999
                });
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }
        public List<BatchJobConstants> SetBatchJobConstants(string mode, BatchJobConstants batchJobConstants)
        {
            OpLog.Log("SetBatchJobConstants");
            var ret = new List<BatchJobConstants>();
            try
            {
                batchJobConstants.EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID;
                batchJobConstants.LST_RUN = DateTime.Now;
                in_t_mydl_btch_dtl dt = new in_t_mydl_btch_dtl();
                dt.AddRow(batchJobConstants);
                Procs.dbo.PR_MYDL_SSIS_MYDL_BTCH_DTL cmd = new Procs.dbo.PR_MYDL_SSIS_MYDL_BTCH_DTL
                {
                    MODE = mode,
                    MYDL_BTCH_DTL = dt
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BTCH_SID = DB.GetReaderOrdinal(rdr, "BTCH_SID");
                    int IDX_BTCH_NM = DB.GetReaderOrdinal(rdr, "BTCH_NM");
                    int IDX_BTCH_DSC = DB.GetReaderOrdinal(rdr, "BTCH_DSC");
                    int IDX_RUN_SCHDL = DB.GetReaderOrdinal(rdr, "RUN_SCHDL");
                    int IDX_ADHC_RUN = DB.GetReaderOrdinal(rdr, "ADHC_RUN");
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "STATUS");
                    int IDX_LST_RUN = DB.GetReaderOrdinal(rdr, "LST_RUN");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_TRGRD_BY = DB.GetReaderOrdinal(rdr, "TRGRD_BY");
                    int IDX_JOB_HLTH_CNFG_DTL = DB.GetReaderOrdinal(rdr, "JOB_HLTH_CNFG_DTL");
                    int IDX_PREDECESSOR_COND = DB.GetReaderOrdinal(rdr, "PREDECESSOR_COND");
                    int IDX_ALRT_MAIL_CNT = DB.GetReaderOrdinal(rdr, "ALRT_MAIL_CNT");
                    int IDX_SSIS_ALERT_TRGER_FLAG = DB.GetReaderOrdinal(rdr, "SSIS_ALERT_TRGER_FLAG");
                    int IDX_SRT_ORDR = DB.GetReaderOrdinal(rdr, "SRT_ORDR");
                    int IDX_BTCH_TYPE = DB.GetReaderOrdinal(rdr, "BTCH_TYPE");



                    while (rdr.Read())
                    {
                        ret.Add(new BatchJobConstants
                        {
                            BTCH_SID = (IDX_BTCH_SID < 0 || rdr.IsDBNull(IDX_BTCH_SID)) ? default(int) : rdr.GetFieldValue<int>(IDX_BTCH_SID),
                            BTCH_NM = (IDX_BTCH_NM < 0 || rdr.IsDBNull(IDX_BTCH_NM)) ? default(string) : rdr.GetFieldValue<string>(IDX_BTCH_NM),
                            BTCH_DSC = (IDX_BTCH_DSC < 0 || rdr.IsDBNull(IDX_BTCH_DSC)) ? default(string) : rdr.GetFieldValue<string>(IDX_BTCH_DSC),
                            RUN_SCHDL = (IDX_RUN_SCHDL < 0 || rdr.IsDBNull(IDX_RUN_SCHDL)) ? default(string) : rdr.GetFieldValue<string>(IDX_RUN_SCHDL),
                            ADHC_RUN = (IDX_ADHC_RUN < 0 || rdr.IsDBNull(IDX_ADHC_RUN)) ? default(bool) : rdr.GetFieldValue<bool>(IDX_ADHC_RUN),
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(bool) : rdr.GetFieldValue<bool>(IDX_ACTV_IND),
                            STATUS = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? default(string) : rdr.GetFieldValue<string>(IDX_STATUS),
                            LST_RUN = (IDX_LST_RUN < 0 || rdr.IsDBNull(IDX_LST_RUN)) ? default(DateTime) : rdr.GetFieldValue<DateTime>(IDX_LST_RUN),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(int) : rdr.GetFieldValue<int>(IDX_EMP_WWID),
                            TRGRD_BY = (IDX_TRGRD_BY < 0 || rdr.IsDBNull(IDX_TRGRD_BY)) ? default(string) : rdr.GetFieldValue<string>(IDX_TRGRD_BY),
                            JOB_HLTH_CNFG_DTL = (IDX_JOB_HLTH_CNFG_DTL < 0 || rdr.IsDBNull(IDX_JOB_HLTH_CNFG_DTL)) ? default(string) : rdr.GetFieldValue<string>(IDX_JOB_HLTH_CNFG_DTL),
                            SSIS_ALERT_TRGER_FLAG = (IDX_SSIS_ALERT_TRGER_FLAG < 0 || rdr.IsDBNull(IDX_SSIS_ALERT_TRGER_FLAG)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_SSIS_ALERT_TRGER_FLAG),
                            ALRT_MAIL_CNT = (IDX_ALRT_MAIL_CNT < 0 || rdr.IsDBNull(IDX_ALRT_MAIL_CNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ALRT_MAIL_CNT),
                            PREDECESSOR_COND = (IDX_PREDECESSOR_COND < 0 || rdr.IsDBNull(IDX_PREDECESSOR_COND)) ? default(string) : rdr.GetFieldValue<string>(IDX_PREDECESSOR_COND),
                            SRT_ORDR = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(int) : rdr.GetFieldValue<int>(IDX_SRT_ORDR),
                            BTCH_TYPE = (IDX_BTCH_TYPE < 0 || rdr.IsDBNull(IDX_BTCH_TYPE)) ? default(string) : rdr.GetFieldValue<string>(IDX_BTCH_TYPE)

                        }); ;
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

        public List<BatchJobStepConstants> SetBatchJobStepConstants(string mode, int batchSid, string batchJobConstants)
        {
            OpLog.Log("SetBatchJobStepConstants");
            var ret = new List<BatchJobStepConstants>();
            try
            {
                Procs.dbo.PR_MYDL_SSIS_MYDL_BTCH_STEP_DTL cmd = new Procs.dbo.PR_MYDL_SSIS_MYDL_BTCH_STEP_DTL
                {
                    MODE = mode,
                    BTCH_SID = batchSid,
                    WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    JSONDATA = batchJobConstants
                };
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    if (mode.ToUpper() == "UPDATE")
                    {
                        int ERR_MSG = DB.GetReaderOrdinal(rdr, "ERROR");
                        while (rdr.Read())
                        {
                            throw new Exception(rdr.GetFieldValue<string>(ERR_MSG));
                        }

                    }
                    else
                    {
                        int IDX_BTCH_STEP_SID = DB.GetReaderOrdinal(rdr, "BTCH_STEP_SID");
                        int IDX_BTCH_SID = DB.GetReaderOrdinal(rdr, "BTCH_SID");
                        int IDX_STEP_SRT_ORDR = DB.GetReaderOrdinal(rdr, "STEP_SRT_ORDR");
                        int IDX_STEP_NM = DB.GetReaderOrdinal(rdr, "STEP_NM");
                        int IDX_STEP_TYPE = DB.GetReaderOrdinal(rdr, "STEP_TYPE");
                        int IDX_ADHC_RUN = DB.GetReaderOrdinal(rdr, "ADHC_RUN");
                        int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                        int IDX_JOB_HLTH_CNFG_DTL = DB.GetReaderOrdinal(rdr, "JOB_HLTH_CNFG_DTL");

                        while (rdr.Read())
                        {
                            ret.Add(new BatchJobStepConstants
                            {
                                BTCH_STEP_SID = (IDX_BTCH_STEP_SID < 0 || rdr.IsDBNull(IDX_BTCH_STEP_SID)) ? default(int) : rdr.GetFieldValue<int>(IDX_BTCH_STEP_SID),
                                BTCH_SID = (IDX_BTCH_SID < 0 || rdr.IsDBNull(IDX_BTCH_SID)) ? default(int) : rdr.GetFieldValue<int>(IDX_BTCH_SID),
                                STEP_SRT_ORDR = (IDX_STEP_SRT_ORDR < 0 || rdr.IsDBNull(IDX_STEP_SRT_ORDR)) ? default(int) : rdr.GetFieldValue<int>(IDX_STEP_SRT_ORDR),
                                STEP_NM = (IDX_STEP_NM < 0 || rdr.IsDBNull(IDX_STEP_NM)) ? default(string) : rdr.GetFieldValue<string>(IDX_STEP_NM),
                                STEP_TYPE = (IDX_STEP_TYPE < 0 || rdr.IsDBNull(IDX_STEP_TYPE)) ? default(string) : rdr.GetFieldValue<string>(IDX_STEP_TYPE),
                                ADHC_RUN = (IDX_ADHC_RUN < 0 || rdr.IsDBNull(IDX_ADHC_RUN)) ? default(bool) : rdr.GetFieldValue<bool>(IDX_ADHC_RUN),
                                ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(bool) : rdr.GetFieldValue<bool>(IDX_ACTV_IND),
                                JOB_HLTH_CNFG_DTL = (IDX_JOB_HLTH_CNFG_DTL < 0 || rdr.IsDBNull(IDX_JOB_HLTH_CNFG_DTL)) ? default(string) : rdr.GetFieldValue<string>(IDX_JOB_HLTH_CNFG_DTL)
                            });
                        }
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

        #endregion Constants Admin
    }
}