using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;

namespace Intel.MyDeals.DataLibrary
{
    public class MeetCompDataLib : IMeetCompDataLib
    {
        public List<MeetComp> GetMeetCompData(int CUST_MBR_SID, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM)
        {
            OpLog.Log("GetMeetComp");

            var ret = new List<MeetComp>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @CUST_MBR_SID = CUST_MBR_SID,
                    @CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    @MODE = "SELECT",
                    @PRD_CAT_NM = PRD_CAT_NM,
                    @BRND_NM = BRND_NM,
                    @HIER_VAL_NM = HIER_VAL_NM
                }))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_NM = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_COMP_BNCH = DB.GetReaderOrdinal(rdr, "COMP_BNCH");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_NM = DB.GetReaderOrdinal(rdr, "CRE_EMP_NM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_IA_BNCH = DB.GetReaderOrdinal(rdr, "IA_BNCH");
                    int IDX_MEET_COMP_PRC = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRC");
                    int IDX_MEET_COMP_PRD = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRD");
                    int IDX_MEET_COMP_SID = DB.GetReaderOrdinal(rdr, "MEET_COMP_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetComp
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_NM = (IDX_CHG_EMP_NM < 0 || rdr.IsDBNull(IDX_CHG_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            COMP_BNCH = (IDX_COMP_BNCH < 0 || rdr.IsDBNull(IDX_COMP_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_BNCH),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_NM = (IDX_CRE_EMP_NM < 0 || rdr.IsDBNull(IDX_CRE_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRE_EMP_NM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            IA_BNCH = (IDX_IA_BNCH < 0 || rdr.IsDBNull(IDX_IA_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IA_BNCH),
                            MEET_COMP_PRC = (IDX_MEET_COMP_PRC < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MEET_COMP_PRC),
                            MEET_COMP_PRD = (IDX_MEET_COMP_PRD < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_PRD),
                            MEET_COMP_SID = (IDX_MEET_COMP_SID < 0 || rdr.IsDBNull(IDX_MEET_COMP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MEET_COMP_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID)
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

        public List<MEET_COMP_DIM> GetMeetCompDIMData(int CUST_MBR_SID, string MODE)
        {
            OpLog.Log("GetMeetComp");

            var ret = new List<MEET_COMP_DIM>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @CUST_MBR_SID = CUST_MBR_SID,
                    @CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    @MODE = MODE.ToUpper()
                }))
                {
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_BRND_NM = DB.GetReaderOrdinal(rdr, "BRND_NM");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new MEET_COMP_DIM
                        {
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            BRND_NM = (IDX_BRND_NM < 0 || rdr.IsDBNull(IDX_BRND_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_NM),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM)
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

        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            OpLog.Log("UpdateMeetComp");

            var ret = new List<MeetComp>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @MODE = "UPDATE",
                    @MEET_COMP_SID = MEET_COMP_SID,
                    @ACTV_IND = ACTV_IND,
                    @CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                }))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_MEET_COMP_SID = DB.GetReaderOrdinal(rdr, "MEET_COMP_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetComp
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            MEET_COMP_SID = (IDX_MEET_COMP_SID < 0 || rdr.IsDBNull(IDX_MEET_COMP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MEET_COMP_SID)
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

        public List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE, int OBJ_TYPE_ID)
        {
            OpLog.Log("GetMeetCompProductDetails");

            var ret = new List<MeetCompResult>();
            var cmd = new Procs.dbo.PR_MYDL_GET_MEET_COMP { };

            try
            {
                in_t_meet_comp_ids dt = new in_t_meet_comp_ids();
                dt.AddRow(CNTRCT_OBJ_SID);

                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_MEET_COMP
                {
                    @obj_sids = dt,
                    obj_type_id = OBJ_TYPE_ID,
                    usr_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    role = OpUserStack.MyOpUserToken.Role.RoleTypeCd,
                    mode = MODE
                }))
                {
                    int IDX_BRND_FMLY = DB.GetReaderOrdinal(rdr, "BRND_FMLY");
                    int IDX_CAP = DB.GetReaderOrdinal(rdr, "CAP");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_COMP_BNCH = DB.GetReaderOrdinal(rdr, "COMP_BNCH");
                    int IDX_COMP_OVRRD_FLG = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_FLG");
                    int IDX_COMP_OVRRD_RSN = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_RSN");
                    int IDX_COMP_PRC = DB.GetReaderOrdinal(rdr, "COMP_PRC");
                    int IDX_COMP_SKU = DB.GetReaderOrdinal(rdr, "COMP_SKU");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_DEAL_DESC = DB.GetReaderOrdinal(rdr, "DEAL_DESC");
                    int IDX_DEAL_OBJ_SID = DB.GetReaderOrdinal(rdr, "DEAL_OBJ_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_STATUS = DB.GetReaderOrdinal(rdr, "DEAL_STATUS");
                    int IDX_DEFAULT_FLAG = DB.GetReaderOrdinal(rdr, "DEFAULT_FLAG");
                    int IDX_ECAP_PRC = DB.GetReaderOrdinal(rdr, "ECAP_PRC");
                    int IDX_END_CUST_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUST_RETAIL");
                    int IDX_GRP = DB.GetReaderOrdinal(rdr, "GRP");
                    int IDX_GRP_PRD_NM = DB.GetReaderOrdinal(rdr, "GRP_PRD_NM");
                    int IDX_GRP_PRD_SID = DB.GetReaderOrdinal(rdr, "GRP_PRD_SID");
                    int IDX_IA_BNCH = DB.GetReaderOrdinal(rdr, "IA_BNCH");
                    int IDX_MC_AVG_RPU = DB.GetReaderOrdinal(rdr, "MC_AVG_RPU");
                    int IDX_MC_LAST_RUN = DB.GetReaderOrdinal(rdr, "MC_LAST_RUN");
                    int IDX_MC_NULL = DB.GetReaderOrdinal(rdr, "MC_NULL");
                    int IDX_MEET_COMP_ANALYSIS = DB.GetReaderOrdinal(rdr, "MEET_COMP_ANALYSIS");
                    int IDX_MEET_COMP_FRMULA = DB.GetReaderOrdinal(rdr, "MEET_COMP_FRMULA");
                    int IDX_MEET_COMP_OVERRIDE_UPD_FLG = DB.GetReaderOrdinal(rdr, "MEET_COMP_OVERRIDE_UPD_FLG");
                    int IDX_MEET_COMP_STS = DB.GetReaderOrdinal(rdr, "MEET_COMP_STS");
                    int IDX_MEET_COMP_UPD_FLG = DB.GetReaderOrdinal(rdr, "MEET_COMP_UPD_FLG");
                    int IDX_OBJ_SET_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE");
                    int IDX_PRC_ST_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_ST_OBJ_SID");
                    int IDX_PRC_TBL_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_TBL_OBJ_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PS_STATUS = DB.GetReaderOrdinal(rdr, "PS_STATUS");
                    int IDX_RW_NM = DB.GetReaderOrdinal(rdr, "RW_NM");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");
                    int IDX_YCS2 = DB.GetReaderOrdinal(rdr, "YCS2");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetCompResult
                        {
                            BRND_FMLY = (IDX_BRND_FMLY < 0 || rdr.IsDBNull(IDX_BRND_FMLY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_FMLY),
                            CAP = (IDX_CAP < 0 || rdr.IsDBNull(IDX_CAP)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_CAP),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            COMP_BNCH = (IDX_COMP_BNCH < 0 || rdr.IsDBNull(IDX_COMP_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_BNCH),
                            COMP_OVRRD_FLG = (IDX_COMP_OVRRD_FLG < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_FLG),
                            COMP_OVRRD_RSN = (IDX_COMP_OVRRD_RSN < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_RSN),
                            COMP_PRC = (IDX_COMP_PRC < 0 || rdr.IsDBNull(IDX_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_PRC),
                            COMP_SKU = (IDX_COMP_SKU < 0 || rdr.IsDBNull(IDX_COMP_SKU)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_SKU),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            DEAL_DESC = (IDX_DEAL_DESC < 0 || rdr.IsDBNull(IDX_DEAL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_DESC),
                            DEAL_OBJ_SID = (IDX_DEAL_OBJ_SID < 0 || rdr.IsDBNull(IDX_DEAL_OBJ_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_OBJ_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_STATUS = (IDX_DEAL_STATUS < 0 || rdr.IsDBNull(IDX_DEAL_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_STATUS),
                            DEFAULT_FLAG = (IDX_DEFAULT_FLAG < 0 || rdr.IsDBNull(IDX_DEFAULT_FLAG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEFAULT_FLAG),
                            ECAP_PRC = (IDX_ECAP_PRC < 0 || rdr.IsDBNull(IDX_ECAP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ECAP_PRC),
                            END_CUST_RETAIL = (IDX_END_CUST_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUST_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_RETAIL),
                            GRP = (IDX_GRP < 0 || rdr.IsDBNull(IDX_GRP)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP),
                            GRP_PRD_NM = (IDX_GRP_PRD_NM < 0 || rdr.IsDBNull(IDX_GRP_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP_PRD_NM),
                            GRP_PRD_SID = (IDX_GRP_PRD_SID < 0 || rdr.IsDBNull(IDX_GRP_PRD_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GRP_PRD_SID),
                            IA_BNCH = (IDX_IA_BNCH < 0 || rdr.IsDBNull(IDX_IA_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IA_BNCH),
                            MC_AVG_RPU = (IDX_MC_AVG_RPU < 0 || rdr.IsDBNull(IDX_MC_AVG_RPU)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MC_AVG_RPU),
                            MC_LAST_RUN = (IDX_MC_LAST_RUN < 0 || rdr.IsDBNull(IDX_MC_LAST_RUN)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_MC_LAST_RUN),
                            MC_NULL = (IDX_MC_NULL < 0 || rdr.IsDBNull(IDX_MC_NULL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MC_NULL),
                            MEET_COMP_ANALYSIS = (IDX_MEET_COMP_ANALYSIS < 0 || rdr.IsDBNull(IDX_MEET_COMP_ANALYSIS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_ANALYSIS),
                            MEET_COMP_FRMULA = (IDX_MEET_COMP_FRMULA < 0 || rdr.IsDBNull(IDX_MEET_COMP_FRMULA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_FRMULA),
                            MEET_COMP_OVERRIDE_UPD_FLG = (IDX_MEET_COMP_OVERRIDE_UPD_FLG < 0 || rdr.IsDBNull(IDX_MEET_COMP_OVERRIDE_UPD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_OVERRIDE_UPD_FLG),
                            MEET_COMP_STS = (IDX_MEET_COMP_STS < 0 || rdr.IsDBNull(IDX_MEET_COMP_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_STS),
                            MEET_COMP_UPD_FLG = (IDX_MEET_COMP_UPD_FLG < 0 || rdr.IsDBNull(IDX_MEET_COMP_UPD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_UPD_FLG),
                            OBJ_SET_TYPE = (IDX_OBJ_SET_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE),
                            PRC_ST_OBJ_SID = (IDX_PRC_ST_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_ST_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_ST_OBJ_SID),
                            PRC_TBL_OBJ_SID = (IDX_PRC_TBL_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_TBL_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_TBL_OBJ_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PS_STATUS = (IDX_PS_STATUS < 0 || rdr.IsDBNull(IDX_PS_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PS_STATUS),
                            RW_NM = (IDX_RW_NM < 0 || rdr.IsDBNull(IDX_RW_NM)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_RW_NM),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD),
                            YCS2 = (IDX_YCS2 < 0 || rdr.IsDBNull(IDX_YCS2)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_YCS2)
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

        public List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, int OBJ_TYPE_ID, List<MeetCompUpdate> mcu)
        {
            OpLog.Log("GetMeetCompProductDetails");

            var ret = new List<MeetCompResult>();

            try
            {
                in_t_meet_comp dt = new in_t_meet_comp();
                dt.AddRows(mcu);

                Procs.dbo.PR_MYDL_UI_SAVE_MEET_COMP cmd = new Procs.dbo.PR_MYDL_UI_SAVE_MEET_COMP
                {
                    @ID = CNTRCT_OBJ_SID,
                    @OBJ_TYPE_ID = @OBJ_TYPE_ID,
                    @USR_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    @Role = OpUserStack.MyOpUserToken.Role.RoleTypeCd,
                    @var_meet_comp = dt
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BRND_FMLY = DB.GetReaderOrdinal(rdr, "BRND_FMLY");
                    int IDX_CAP = DB.GetReaderOrdinal(rdr, "CAP");
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_COMP_BNCH = DB.GetReaderOrdinal(rdr, "COMP_BNCH");
                    int IDX_COMP_OVRRD_FLG = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_FLG");
                    int IDX_COMP_OVRRD_RSN = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_RSN");
                    int IDX_COMP_PRC = DB.GetReaderOrdinal(rdr, "COMP_PRC");
                    int IDX_COMP_SKU = DB.GetReaderOrdinal(rdr, "COMP_SKU");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_DEAL_DESC = DB.GetReaderOrdinal(rdr, "DEAL_DESC");
                    int IDX_DEAL_OBJ_SID = DB.GetReaderOrdinal(rdr, "DEAL_OBJ_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEAL_STATUS = DB.GetReaderOrdinal(rdr, "DEAL_STATUS");
                    int IDX_DEFAULT_FLAG = DB.GetReaderOrdinal(rdr, "DEFAULT_FLAG");
                    int IDX_ECAP_PRC = DB.GetReaderOrdinal(rdr, "ECAP_PRC");
                    int IDX_END_CUST_RETAIL = DB.GetReaderOrdinal(rdr, "END_CUST_RETAIL");
                    int IDX_GRP = DB.GetReaderOrdinal(rdr, "GRP");
                    int IDX_GRP_PRD_NM = DB.GetReaderOrdinal(rdr, "GRP_PRD_NM");
                    int IDX_GRP_PRD_SID = DB.GetReaderOrdinal(rdr, "GRP_PRD_SID");
                    int IDX_IA_BNCH = DB.GetReaderOrdinal(rdr, "IA_BNCH");
                    int IDX_MC_AVG_RPU = DB.GetReaderOrdinal(rdr, "MC_AVG_RPU");
                    int IDX_MC_LAST_RUN = DB.GetReaderOrdinal(rdr, "MC_LAST_RUN");
                    int IDX_MC_NULL = DB.GetReaderOrdinal(rdr, "MC_NULL");
                    int IDX_MEET_COMP_ANALYSIS = DB.GetReaderOrdinal(rdr, "MEET_COMP_ANALYSIS");
                    int IDX_MEET_COMP_FRMULA = DB.GetReaderOrdinal(rdr, "MEET_COMP_FRMULA");
                    int IDX_MEET_COMP_OVERRIDE_UPD_FLG = DB.GetReaderOrdinal(rdr, "MEET_COMP_OVERRIDE_UPD_FLG");
                    int IDX_MEET_COMP_STS = DB.GetReaderOrdinal(rdr, "MEET_COMP_STS");
                    int IDX_MEET_COMP_UPD_FLG = DB.GetReaderOrdinal(rdr, "MEET_COMP_UPD_FLG");
                    int IDX_OBJ_SET_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE");
                    int IDX_PRC_ST_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_ST_OBJ_SID");
                    int IDX_PRC_TBL_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_TBL_OBJ_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PS_STATUS = DB.GetReaderOrdinal(rdr, "PS_STATUS");
                    int IDX_RW_NM = DB.GetReaderOrdinal(rdr, "RW_NM");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");
                    int IDX_YCS2 = DB.GetReaderOrdinal(rdr, "YCS2");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetCompResult
                        {
                            BRND_FMLY = (IDX_BRND_FMLY < 0 || rdr.IsDBNull(IDX_BRND_FMLY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BRND_FMLY),
                            CAP = (IDX_CAP < 0 || rdr.IsDBNull(IDX_CAP)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_CAP),
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            COMP_BNCH = (IDX_COMP_BNCH < 0 || rdr.IsDBNull(IDX_COMP_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_BNCH),
                            COMP_OVRRD_FLG = (IDX_COMP_OVRRD_FLG < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_FLG),
                            COMP_OVRRD_RSN = (IDX_COMP_OVRRD_RSN < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_RSN),
                            COMP_PRC = (IDX_COMP_PRC < 0 || rdr.IsDBNull(IDX_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_PRC),
                            COMP_SKU = (IDX_COMP_SKU < 0 || rdr.IsDBNull(IDX_COMP_SKU)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_SKU),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            DEAL_DESC = (IDX_DEAL_DESC < 0 || rdr.IsDBNull(IDX_DEAL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_DESC),
                            DEAL_OBJ_SID = (IDX_DEAL_OBJ_SID < 0 || rdr.IsDBNull(IDX_DEAL_OBJ_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_OBJ_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEAL_STATUS = (IDX_DEAL_STATUS < 0 || rdr.IsDBNull(IDX_DEAL_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_STATUS),
                            DEFAULT_FLAG = (IDX_DEFAULT_FLAG < 0 || rdr.IsDBNull(IDX_DEFAULT_FLAG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEFAULT_FLAG),
                            ECAP_PRC = (IDX_ECAP_PRC < 0 || rdr.IsDBNull(IDX_ECAP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ECAP_PRC),
                            END_CUST_RETAIL = (IDX_END_CUST_RETAIL < 0 || rdr.IsDBNull(IDX_END_CUST_RETAIL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_CUST_RETAIL),
                            GRP = (IDX_GRP < 0 || rdr.IsDBNull(IDX_GRP)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP),
                            GRP_PRD_NM = (IDX_GRP_PRD_NM < 0 || rdr.IsDBNull(IDX_GRP_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP_PRD_NM),
                            GRP_PRD_SID = (IDX_GRP_PRD_SID < 0 || rdr.IsDBNull(IDX_GRP_PRD_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GRP_PRD_SID),
                            IA_BNCH = (IDX_IA_BNCH < 0 || rdr.IsDBNull(IDX_IA_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IA_BNCH),
                            MC_AVG_RPU = (IDX_MC_AVG_RPU < 0 || rdr.IsDBNull(IDX_MC_AVG_RPU)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MC_AVG_RPU),
                            MC_LAST_RUN = (IDX_MC_LAST_RUN < 0 || rdr.IsDBNull(IDX_MC_LAST_RUN)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_MC_LAST_RUN),
                            MC_NULL = (IDX_MC_NULL < 0 || rdr.IsDBNull(IDX_MC_NULL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MC_NULL),
                            MEET_COMP_ANALYSIS = (IDX_MEET_COMP_ANALYSIS < 0 || rdr.IsDBNull(IDX_MEET_COMP_ANALYSIS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_ANALYSIS),
                            MEET_COMP_FRMULA = (IDX_MEET_COMP_FRMULA < 0 || rdr.IsDBNull(IDX_MEET_COMP_FRMULA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_FRMULA),
                            MEET_COMP_OVERRIDE_UPD_FLG = (IDX_MEET_COMP_OVERRIDE_UPD_FLG < 0 || rdr.IsDBNull(IDX_MEET_COMP_OVERRIDE_UPD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_OVERRIDE_UPD_FLG),
                            MEET_COMP_STS = (IDX_MEET_COMP_STS < 0 || rdr.IsDBNull(IDX_MEET_COMP_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_STS),
                            MEET_COMP_UPD_FLG = (IDX_MEET_COMP_UPD_FLG < 0 || rdr.IsDBNull(IDX_MEET_COMP_UPD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_UPD_FLG),
                            OBJ_SET_TYPE = (IDX_OBJ_SET_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE),
                            PRC_ST_OBJ_SID = (IDX_PRC_ST_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_ST_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_ST_OBJ_SID),
                            PRC_TBL_OBJ_SID = (IDX_PRC_TBL_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_TBL_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_TBL_OBJ_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PS_STATUS = (IDX_PS_STATUS < 0 || rdr.IsDBNull(IDX_PS_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PS_STATUS),
                            RW_NM = (IDX_RW_NM < 0 || rdr.IsDBNull(IDX_RW_NM)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_RW_NM),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD),
                            YCS2 = (IDX_YCS2 < 0 || rdr.IsDBNull(IDX_YCS2)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_YCS2)
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

        public List<DealDeatils> GetDealDetails(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE)
        {
            OpLog.Log("GetDealDetails");

            var ret = new List<DealDeatils>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DEAL_GRP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_DEAL_GRP
                {
                    @in_Deal_ID = DEAL_OBJ_SID,
                    @in_prd_mbr_sid = GRP_PRD_SID,
                    @in_DEAL_PRD_TYPE = DEAL_PRD_TYPE
                }))
                {
                    int IDX_CNSMPTN_RSN = DB.GetReaderOrdinal(rdr, "CNSMPTN_RSN");
                    int IDX_CTRCT_NM = DB.GetReaderOrdinal(rdr, "CTRCT_NM");
                    int IDX_DEAL_CMBN_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_CMBN_TYPE");
                    int IDX_DEAL_OBJ_SID = DB.GetReaderOrdinal(rdr, "DEAL_OBJ_SID");
                    int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");
                    int IDX_OBJ_SET_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE");
                    int IDX_REBT_TYPE = DB.GetReaderOrdinal(rdr, "REBT_TYPE");
                    int IDX_STRT_DT = DB.GetReaderOrdinal(rdr, "STRT_DT");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new DealDeatils
                        {
                            CNSMPTN_RSN = (IDX_CNSMPTN_RSN < 0 || rdr.IsDBNull(IDX_CNSMPTN_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNSMPTN_RSN),
                            CTRCT_NM = (IDX_CTRCT_NM < 0 || rdr.IsDBNull(IDX_CTRCT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CTRCT_NM),
                            DEAL_CMBN_TYPE = (IDX_DEAL_CMBN_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_CMBN_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_CMBN_TYPE),
                            DEAL_OBJ_SID = (IDX_DEAL_OBJ_SID < 0 || rdr.IsDBNull(IDX_DEAL_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_OBJ_SID),
                            END_DT = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DT),
                            OBJ_SET_TYPE = (IDX_OBJ_SET_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE),
                            REBT_TYPE = (IDX_REBT_TYPE < 0 || rdr.IsDBNull(IDX_REBT_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_REBT_TYPE),
                            STRT_DT = (IDX_STRT_DT < 0 || rdr.IsDBNull(IDX_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_STRT_DT),
                            WF_STG_CD = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD)
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

        public List<MeetCompProductValidation> GetValidProducts(List<string> lstProducts)
        {
            lstProducts.ForEach(x => x = x.Trim().ToLower());
            lstProducts.RemoveAll(x => x == string.Empty);
            List<MeetCompProductValidation> lstValidProducts = new List<MeetCompProductValidation>();
            Procs.dbo.PR_MYDL_MEET_COMP_PRD_VLD cmd = new Procs.dbo.PR_MYDL_MEET_COMP_PRD_VLD()
            {
                in_prd_nm_list = new type_list(lstProducts.ToArray())
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
                int IDX_PRD_NM = DB.GetReaderOrdinal(rdr, "PRD_NM");
                int IDX_SRV_TYP = DB.GetReaderOrdinal(rdr, "SVR_TYP");

                while (rdr.Read())
                {
                    lstValidProducts.Add(new MeetCompProductValidation
                    {
                        ProductId = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
                        ProductName = ((IDX_PRD_NM < 0 || rdr.IsDBNull(IDX_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_NM)).ToLower(),
                        IsServerProduct = ((IDX_SRV_TYP < 0 || rdr.IsDBNull(IDX_SRV_TYP)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SRV_TYP)) > 0
                    });
                } // while
            }

            return lstValidProducts;
        }

        public bool UploadMeetComp(List<MeetComp> lstMeetComp)
        {
            bool isProccessed = false;
            try
            {
                List<MeetCompProductValidation> lstValidProducts = GetValidProducts(lstMeetComp.Select(x => x.HIER_VAL_NM.Trim().ToLower()).ToList());
                List<MyCustomersInformation> lstMyCustomersInformation = DataCollections.GetMyCustomers().CustomerInfo;
                in_t_meet_comp dt = new in_t_meet_comp();
                lstMeetComp.ForEach(x =>
                {
                    //Allow to all customer if cutomer name is empty
                    x.CUST_MBR_SID = x.CUST_NM.Trim() == string.Empty ? 1 : lstMyCustomersInformation.Where(y => y.CUST_NM.ToLower() == x.CUST_NM.Trim().ToLower()).First().CUST_SID;
                    foreach (var product in lstValidProducts.Where(y => y.ProductName == x.HIER_VAL_NM.Trim().ToLower()))
                    {
                        decimal? dblCompBench = product.IsServerProduct ? Math.Round(x.COMP_BNCH, 0) : default(System.Decimal?);
                        decimal? dblIABench = product.IsServerProduct ? Math.Round(x.IA_BNCH, 0) : default(System.Decimal?);
                        dt.AddRow(new MeetCompUpdate
                        {
                            COMP_BNCH = dblCompBench,
                            IA_BNCH = dblIABench,
                            COMP_PRC = x.MEET_COMP_PRC,
                            COMP_SKU = x.MEET_COMP_PRD,
                            CUST_NM_SID = x.CUST_MBR_SID,
                            GRP_PRD_SID = product.ProductId.ToString(),
                            GRP = string.Empty, //Dummy value since type is not null
                            DEAL_PRD_TYPE = string.Empty, //Dummy value since type is not null
                            PRD_CAT_NM = string.Empty, //Dummy value since type is not null
                            GRP_PRD_NM = string.Empty, //Dummy value since type is not null
                            DEAL_OBJ_SID = 0, //Dummy value since type is not null
                            MEET_COMP_UPD_FLG = 'T', //Dummy value since type is not null
                        });
                    }
                });

                Procs.dbo.PR_MYDL_BLK_UPD_MEET_COMP cmd = new Procs.dbo.PR_MYDL_BLK_UPD_MEET_COMP()
                {
                    l_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    var_meet_comp = dt
                };

                DataAccess.ExecuteNonQuery(cmd);
                isProccessed = true;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            };
            return isProccessed;
        }

    }

    public class DistinctItemComparerMeetComp : IEqualityComparer<MeetComp>
    {
        public bool Equals(MeetComp x, MeetComp y)
        {
            return x.CUST_NM == y.CUST_NM && x.HIER_VAL_NM == y.HIER_VAL_NM && x.MEET_COMP_PRD == y.MEET_COMP_PRD && x.MEET_COMP_PRC == y.MEET_COMP_PRC && x.IA_BNCH == y.IA_BNCH && x.COMP_BNCH == y.COMP_BNCH;
        }

        public int GetHashCode(MeetComp obj)
        {
            return obj.CUST_NM.GetHashCode() ^ obj.HIER_VAL_NM.GetHashCode() ^ obj.MEET_COMP_PRD.GetHashCode() ^ obj.MEET_COMP_PRC.GetHashCode() ^ obj.IA_BNCH.GetHashCode() ^ obj.COMP_BNCH.GetHashCode();
        }
    }
}