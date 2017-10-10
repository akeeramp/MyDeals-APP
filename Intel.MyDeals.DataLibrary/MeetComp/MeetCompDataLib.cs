using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class MeetCompDataLib : IMeetCompDataLib
    {
        public List<MeetComp> GetMeetCompData()
        {
            OpLogPerf.Log("GetMeetComp");

            var ret = new List<MeetComp>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @MODE = "SELECT"
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

        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            OpLogPerf.Log("UpdateMeetComp");

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

        public List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID)
        {
            OpLogPerf.Log("GetMeetCompProductDetails");

            var ret = new List<MeetCompResult>();
            var cmd = new Procs.dbo.PR_MYDL_UI_GET_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UI_GET_MEET_COMP
                {
                    @ID = CNTRCT_OBJ_SID,
                    @USR_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    @Role = OpUserStack.MyOpUserToken.Role.RoleTypeCd

                }))
                {
                    int IDX_CNTRCT_OBJ_SID = DB.GetReaderOrdinal(rdr, "CNTRCT_OBJ_SID");
                    int IDX_COMP_BNCH = DB.GetReaderOrdinal(rdr, "COMP_BNCH");
                    int IDX_COMP_OVRRD_FLG = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_FLG");
                    int IDX_COMP_OVRRD_RSN = DB.GetReaderOrdinal(rdr, "COMP_OVRRD_RSN");
                    int IDX_COMP_PRC = DB.GetReaderOrdinal(rdr, "COMP_PRC");
                    int IDX_COMP_SKU = DB.GetReaderOrdinal(rdr, "COMP_SKU");
                    int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
                    int IDX_DEAL_OBJ_SID = DB.GetReaderOrdinal(rdr, "DEAL_OBJ_SID");
                    int IDX_DEAL_PRD_TYPE = DB.GetReaderOrdinal(rdr, "DEAL_PRD_TYPE");
                    int IDX_DEFAULT_FLAG = DB.GetReaderOrdinal(rdr, "DEFAULT_FLAG");
                    int IDX_GRP = DB.GetReaderOrdinal(rdr, "GRP");
                    int IDX_GRP_PRD_NM = DB.GetReaderOrdinal(rdr, "GRP_PRD_NM");
                    int IDX_GRP_PRD_SID = DB.GetReaderOrdinal(rdr, "GRP_PRD_SID");
                    int IDX_IA_BNCH = DB.GetReaderOrdinal(rdr, "IA_BNCH");
                    int IDX_MC_AVG_RPU = DB.GetReaderOrdinal(rdr, "MC_AVG_RPU");
                    int IDX_MC_LAST_RUN = DB.GetReaderOrdinal(rdr, "MC_LAST_RUN");
                    int IDX_MC_NULL = DB.GetReaderOrdinal(rdr, "MC_NULL");
                    int IDX_MEET_COMP_STS = DB.GetReaderOrdinal(rdr, "MEET_COMP_STS");
                    int IDX_MEET_COMP_UPD_FLG = DB.GetReaderOrdinal(rdr, "MEET_COMP_UPD_FLG");
                    int IDX_OBJ_SET_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE");
                    int IDX_PRC_ST_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_ST_OBJ_SID");
                    int IDX_PRC_TBL_OBJ_SID = DB.GetReaderOrdinal(rdr, "PRC_TBL_OBJ_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_RW_NM = DB.GetReaderOrdinal(rdr, "RW_NM");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetCompResult
                        {
                            CNTRCT_OBJ_SID = (IDX_CNTRCT_OBJ_SID < 0 || rdr.IsDBNull(IDX_CNTRCT_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNTRCT_OBJ_SID),
                            COMP_BNCH = (IDX_COMP_BNCH < 0 || rdr.IsDBNull(IDX_COMP_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_BNCH),
                            COMP_OVRRD_FLG = (IDX_COMP_OVRRD_FLG < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_FLG),
                            COMP_OVRRD_RSN = (IDX_COMP_OVRRD_RSN < 0 || rdr.IsDBNull(IDX_COMP_OVRRD_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_OVRRD_RSN),
                            COMP_PRC = (IDX_COMP_PRC < 0 || rdr.IsDBNull(IDX_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_PRC),
                            COMP_SKU = (IDX_COMP_SKU < 0 || rdr.IsDBNull(IDX_COMP_SKU)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COMP_SKU),
                            CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
                            DEAL_OBJ_SID = (IDX_DEAL_OBJ_SID < 0 || rdr.IsDBNull(IDX_DEAL_OBJ_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_OBJ_SID),
                            DEAL_PRD_TYPE = (IDX_DEAL_PRD_TYPE < 0 || rdr.IsDBNull(IDX_DEAL_PRD_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_PRD_TYPE),
                            DEFAULT_FLAG = (IDX_DEFAULT_FLAG < 0 || rdr.IsDBNull(IDX_DEFAULT_FLAG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEFAULT_FLAG),
                            GRP = (IDX_GRP < 0 || rdr.IsDBNull(IDX_GRP)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP),
                            GRP_PRD_NM = (IDX_GRP_PRD_NM < 0 || rdr.IsDBNull(IDX_GRP_PRD_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRP_PRD_NM),
                            GRP_PRD_SID = (IDX_GRP_PRD_SID < 0 || rdr.IsDBNull(IDX_GRP_PRD_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GRP_PRD_SID),
                            IA_BNCH = (IDX_IA_BNCH < 0 || rdr.IsDBNull(IDX_IA_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IA_BNCH),
                            MC_AVG_RPU = (IDX_MC_AVG_RPU < 0 || rdr.IsDBNull(IDX_MC_AVG_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MC_AVG_RPU),
                            MC_LAST_RUN = (IDX_MC_LAST_RUN < 0 || rdr.IsDBNull(IDX_MC_LAST_RUN)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_MC_LAST_RUN),
                            MC_NULL = (IDX_MC_NULL < 0 || rdr.IsDBNull(IDX_MC_NULL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MC_NULL),
                            MEET_COMP_STS = (IDX_MEET_COMP_STS < 0 || rdr.IsDBNull(IDX_MEET_COMP_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_STS),
                            MEET_COMP_UPD_FLG = (IDX_MEET_COMP_UPD_FLG < 0 || rdr.IsDBNull(IDX_MEET_COMP_UPD_FLG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_UPD_FLG),
                            OBJ_SET_TYPE = (IDX_OBJ_SET_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE),
                            PRC_ST_OBJ_SID = (IDX_PRC_ST_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_ST_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_ST_OBJ_SID),
                            PRC_TBL_OBJ_SID = (IDX_PRC_TBL_OBJ_SID < 0 || rdr.IsDBNull(IDX_PRC_TBL_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRC_TBL_OBJ_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            RW_NM = (IDX_RW_NM < 0 || rdr.IsDBNull(IDX_RW_NM)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_RW_NM),
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
    }
}
