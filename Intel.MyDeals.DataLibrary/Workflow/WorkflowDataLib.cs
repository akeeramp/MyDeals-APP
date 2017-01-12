using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public class WorkflowDataLib
    {

        #region WorkFlowStages
        public List<WorkFlowStage> GetWorkFlowStages()
        {
            return new List<WorkFlowStage>();
            ////var ret = new List<WorkFlowStage>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_STAGES { mode = "Select" }))
            ////{
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_ALL_WF_STG = DB.GetReaderOrdinal(rdr, "ALL_WF_STG");
            ////    int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
            ////    int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
            ////    int IDX_WFSTG_ATRB_SID = DB.GetReaderOrdinal(rdr, "WFSTG_ATRB_SID");
            ////    int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
            ////    int IDX_WFSTG_DESC = DB.GetReaderOrdinal(rdr, "WFSTG_DESC");
            ////    int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
            ////    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
            ////    int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
            ////    int IDX_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_STS");
            ////    int IDX_WFSTG_TIER = DB.GetReaderOrdinal(rdr, "WFSTG_TIER");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new WorkFlowStage
            ////        {
            ////            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            ALL_WF_STG = rdr.IsDBNull(IDX_ALL_WF_STG) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ALL_WF_STG),
            ////            ALLOW_REDEAL = rdr.IsDBNull(IDX_ALLOW_REDEAL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
            ////            DIM_SID = rdr.IsDBNull(IDX_DIM_SID) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_DIM_SID),
            ////            WFSTG_ATRB_SID = rdr.IsDBNull(IDX_WFSTG_ATRB_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ATRB_SID),
            ////            WFSTG_CD = rdr.IsDBNull(IDX_WFSTG_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
            ////            WFSTG_DESC = rdr.IsDBNull(IDX_WFSTG_DESC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DESC),
            ////            WFSTG_LOC = rdr.IsDBNull(IDX_WFSTG_LOC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
            ////            WFSTG_MBR_SID = rdr.IsDBNull(IDX_WFSTG_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
            ////            WFSTG_ORD = rdr.IsDBNull(IDX_WFSTG_ORD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD),
            ////            WFSTG_STS = rdr.IsDBNull(IDX_WFSTG_STS) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_STS),
            ////            WFSTG_TIER = rdr.IsDBNull(IDX_WFSTG_TIER) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_TIER)
            ////        });
            ////    } // while
            ////}

            ////return ret;
        }

        public WorkFlowStage SetWorkFlowStages(string mode, WorkFlowStage data)
        {
            return new WorkFlowStage();
            ////var ret = new List<WorkFlowStage>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_STAGES()
            ////{
            ////    idsid = Utils.ThreadUser,
            ////    mode = mode,
            ////    WFSTG_MBR_SID = data.WFSTG_MBR_SID,
            ////    DIM_SID = data.DIM_SID,
            ////    WFSTG_ATRB_SID = data.WFSTG_ATRB_SID,
            ////    ALL_WF_STG = data.ALL_WF_STG,
            ////    WFSTG_CD = data.WFSTG_CD,
            ////    WFSTG_DESC = data.WFSTG_DESC,
            ////    WFSTG_TIER = data.WFSTG_TIER,
            ////    WFSTG_LOC = data.WFSTG_LOC,
            ////    WFSTG_STS = data.WFSTG_STS,
            ////    WFSTG_ORD = int.Parse(data.WFSTG_ORD),
            ////    ALLOW_REDEAL = data.ALLOW_REDEAL == "1",
            ////    ACTV_IND = data.ACTV_IND
            ////}))
            ////{
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_ALL_WF_STG = DB.GetReaderOrdinal(rdr, "ALL_WF_STG");
            ////    int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
            ////    int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
            ////    int IDX_WFSTG_ATRB_SID = DB.GetReaderOrdinal(rdr, "WFSTG_ATRB_SID");
            ////    int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
            ////    int IDX_WFSTG_DESC = DB.GetReaderOrdinal(rdr, "WFSTG_DESC");
            ////    int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
            ////    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
            ////    int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
            ////    int IDX_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_STS");
            ////    int IDX_WFSTG_TIER = DB.GetReaderOrdinal(rdr, "WFSTG_TIER");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new WorkFlowStage
            ////        {
            ////            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            ALL_WF_STG = rdr.IsDBNull(IDX_ALL_WF_STG) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ALL_WF_STG),
            ////            ALLOW_REDEAL = rdr.IsDBNull(IDX_ALLOW_REDEAL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
            ////            DIM_SID = rdr.IsDBNull(IDX_DIM_SID) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_DIM_SID),
            ////            WFSTG_ATRB_SID = rdr.IsDBNull(IDX_WFSTG_ATRB_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ATRB_SID),
            ////            WFSTG_CD = rdr.IsDBNull(IDX_WFSTG_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
            ////            WFSTG_DESC = rdr.IsDBNull(IDX_WFSTG_DESC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DESC),
            ////            WFSTG_LOC = rdr.IsDBNull(IDX_WFSTG_LOC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
            ////            WFSTG_MBR_SID = rdr.IsDBNull(IDX_WFSTG_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
            ////            WFSTG_ORD = rdr.IsDBNull(IDX_WFSTG_ORD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD),
            ////            WFSTG_STS = rdr.IsDBNull(IDX_WFSTG_STS) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_STS),
            ////            WFSTG_TIER = rdr.IsDBNull(IDX_WFSTG_TIER) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_TIER)
            ////        });
            ////    } // while
            ////}

            ////return ret.FirstOrDefault();
        }
        #endregion

        #region WorkFlowItem
        public List<WorkFlowItem> GetWorkFlowItems()
        {
            return new List<WorkFlowItem>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.deal.PR_USER_DEAL_WF()))
            ////{
            ////    int IDX_ACT_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACT_ACTV_IND");
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
            ////    int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
            ////    int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
            ////    int IDX_DEAL_TYPE_SID = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_SID");
            ////    int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
            ////    int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
            ////    int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
            ////    int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
            ////    int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
            ////    int IDX_WFSTG_ACTV_IND = DB.GetReaderOrdinal(rdr, "WFSTG_ACTV_IND");
            ////    int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
            ////    int IDX_WFSTG_DEST_ACTV_IND = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_ACTV_IND");
            ////    int IDX_WFSTG_DEST_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_ALLOW_REDEAL");
            ////    int IDX_WFSTG_DEST_CD = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_CD");
            ////    int IDX_WFSTG_DEST_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_MBR_SID");
            ////    int IDX_WFSTG_DEST_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_LOC");
            ////    int IDX_WFSTG_DEST_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_ORD");
            ////    int IDX_WFSTG_DEST_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_WFSTG_STS");
            ////    int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
            ////    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
            ////    int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
            ////    int IDX_WFSTG_STS = DB.GetReaderOrdinal(rdr, "WFSTG_STS");
            ////    int IDX_WFSTG_TIER = DB.GetReaderOrdinal(rdr, "WFSTG_TIER");
            ////    int IDX_WORK_FLOW_ACTV_IND = DB.GetReaderOrdinal(rdr, "WORK_FLOW_ACTV_IND");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new WorkFlowItem
            ////        {
            ////            ACT_ACTV_IND = rdr.IsDBNull(IDX_ACT_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACT_ACTV_IND),
            ////            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            ALLOW_REDEAL = rdr.IsDBNull(IDX_ALLOW_REDEAL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
            ////            DEAL_MBR_SID = rdr.IsDBNull(IDX_DEAL_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
            ////            DEAL_TYPE_CD = rdr.IsDBNull(IDX_DEAL_TYPE_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
            ////            DEAL_TYPE_SID = rdr.IsDBNull(IDX_DEAL_TYPE_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_TYPE_SID),
            ////            ROLE_TIER_CD = rdr.IsDBNull(IDX_ROLE_TIER_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
            ////            TRKR_NBR_UPD = rdr.IsDBNull(IDX_TRKR_NBR_UPD) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRKR_NBR_UPD),
            ////            WF_NAME = rdr.IsDBNull(IDX_WF_NAME) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
            ////            WF_SID = rdr.IsDBNull(IDX_WF_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
            ////            WFSTG_ACTN_CD = rdr.IsDBNull(IDX_WFSTG_ACTN_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
            ////            WFSTG_ACTV_IND = rdr.IsDBNull(IDX_WFSTG_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_WFSTG_ACTV_IND),
            ////            WFSTG_CD = rdr.IsDBNull(IDX_WFSTG_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
            ////            WFSTG_DEST_ACTV_IND = rdr.IsDBNull(IDX_WFSTG_DEST_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_WFSTG_DEST_ACTV_IND),
            ////            WFSTG_DEST_ALLOW_REDEAL = rdr.IsDBNull(IDX_WFSTG_DEST_ALLOW_REDEAL) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_ALLOW_REDEAL),
            ////            WFSTG_DEST_CD = rdr.IsDBNull(IDX_WFSTG_DEST_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_CD),
            ////            WFSTG_DEST_MBR_SID = rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
            ////            WFSTG_DEST_WFSTG_LOC = rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_LOC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_LOC),
            ////            WFSTG_DEST_WFSTG_ORD = rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_ORD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_ORD),
            ////            WFSTG_DEST_WFSTG_STS = rdr.IsDBNull(IDX_WFSTG_DEST_WFSTG_STS) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_DEST_WFSTG_STS),
            ////            WFSTG_LOC = rdr.IsDBNull(IDX_WFSTG_LOC) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
            ////            WFSTG_MBR_SID = rdr.IsDBNull(IDX_WFSTG_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
            ////            WFSTG_ORD = rdr.IsDBNull(IDX_WFSTG_ORD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD),
            ////            WFSTG_STS = rdr.IsDBNull(IDX_WFSTG_STS) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_STS),
            ////            WFSTG_TIER = rdr.IsDBNull(IDX_WFSTG_TIER) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_TIER),
            ////            WORK_FLOW_ACTV_IND = rdr.IsDBNull(IDX_WORK_FLOW_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_WORK_FLOW_ACTV_IND)
            ////        });
            ////    } // while
            ////}

            ////return ret;
        }
        #endregion

        #region WorkFlow
        public List<WorkFlow> GetWorkFlows()
        {
            return new List<WorkFlow>();
            ////var ret = new List<WorkFlow>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_WORK_FLOW { mode = "Select" }))
            ////{
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
            ////    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
            ////    int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
            ////    int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
            ////    int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
            ////    int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
            ////    int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
            ////    int IDX_WFSTG_DEST_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_MBR_SID");
            ////    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new WorkFlow
            ////        {
            ////            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            DEAL_MBR_SID = rdr.IsDBNull(IDX_DEAL_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
            ////            PRD_MBR_SID = rdr.IsDBNull(IDX_PRD_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
            ////            ROLE_TIER_CD = rdr.IsDBNull(IDX_ROLE_TIER_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
            ////            TRKR_NBR_UPD = rdr.IsDBNull(IDX_TRKR_NBR_UPD) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRKR_NBR_UPD),
            ////            WF_NAME = rdr.IsDBNull(IDX_WF_NAME) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
            ////            WF_SID = rdr.IsDBNull(IDX_WF_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
            ////            WFSTG_ACTN_CD = rdr.IsDBNull(IDX_WFSTG_ACTN_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
            ////            WFSTG_DEST_MBR_SID = rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
            ////            WFSTG_MBR_SID = rdr.IsDBNull(IDX_WFSTG_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID)
            ////        });
            ////    } // while
            ////}

            ////return ret;
        }

        public WorkFlow SetWorkFlows(string mode, WorkFlow data)
        {
            return new WorkFlow();
            ////var ret = new List<WorkFlow>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_WORK_FLOW
            ////{
            ////    idsid = Utils.ThreadUser,
            ////    mode = mode,
            ////    WF_SID = data.WF_SID,
            ////    WF_NAME = data.WF_NAME,
            ////    ROLE_TIER_CD = data.ROLE_TIER_CD,
            ////    WFSTG_MBR_SID = data.WFSTG_MBR_SID,
            ////    WFSTG_ACTN_CD = data.WFSTG_ACTN_CD,
            ////    DEAL_MBR_SID = data.DEAL_MBR_SID,
            ////    PRD_MBR_SID = data.PRD_MBR_SID,
            ////    WFSTG_DEST_MBR_SID = data.WFSTG_DEST_MBR_SID,
            ////    TRKR_NBR_UPD = data.TRKR_NBR_UPD.ToString() == "true" ? 1 : 0,
            ////    ACTV_IND = data.ACTV_IND,
            ////}))
            ////{
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_DEAL_MBR_SID = DB.GetReaderOrdinal(rdr, "DEAL_MBR_SID");
            ////    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
            ////    int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
            ////    int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
            ////    int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
            ////    int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
            ////    int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
            ////    int IDX_WFSTG_DEST_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_DEST_MBR_SID");
            ////    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new WorkFlow
            ////        {
            ////            ACTV_IND = rdr.IsDBNull(IDX_ACTV_IND) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            DEAL_MBR_SID = rdr.IsDBNull(IDX_DEAL_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_MBR_SID),
            ////            PRD_MBR_SID = rdr.IsDBNull(IDX_PRD_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
            ////            ROLE_TIER_CD = rdr.IsDBNull(IDX_ROLE_TIER_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
            ////            TRKR_NBR_UPD = rdr.IsDBNull(IDX_TRKR_NBR_UPD) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRKR_NBR_UPD),
            ////            WF_NAME = rdr.IsDBNull(IDX_WF_NAME) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
            ////            WF_SID = rdr.IsDBNull(IDX_WF_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
            ////            WFSTG_ACTN_CD = rdr.IsDBNull(IDX_WFSTG_ACTN_CD) ? default(System.String) : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
            ////            WFSTG_DEST_MBR_SID = rdr.IsDBNull(IDX_WFSTG_DEST_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_DEST_MBR_SID),
            ////            WFSTG_MBR_SID = rdr.IsDBNull(IDX_WFSTG_MBR_SID) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID)
            ////        });
            ////    } // while
            ////}

            ////return ret.FirstOrDefault();
        }
        #endregion

    }
}
