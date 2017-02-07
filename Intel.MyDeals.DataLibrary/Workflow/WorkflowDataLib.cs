using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    public class WorkflowDataLib : IWorkFlowDataLib
    {

        #region WorkFlowStages
        public List<WorkFlowStg> GetWorkFlowStages()
        {
            return new List<WorkFlowStg>();
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

        public List<WorkFlowStg> SetWorkFlowStages(CrudModes mode, WorkFlowStg data)
        {
            return new List<WorkFlowStg>();
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
        #endregion

        #region WorkFlow
        /// <summary>
        /// This will return all the Workflow item
        /// </summary>
        /// <returns></returns>
        public List<WorkFlows> GetWorkFlowItems()
        {
            var cmd = new Procs.dbo.PR_MYDL_UPD_WORKFL_MSTR
            {
                IDSID = Utils.ThreadUser,
                MODE = CrudModes.Select.ToString().ToUpper()
            };
            List<WorkFlows> ret = new List<WorkFlows>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
                int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
                int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
                int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
                int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
                int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
                int IDX_WFSTG_CD_DEST = DB.GetReaderOrdinal(rdr, "WFSTG_CD_DEST");
                int IDX_WFSTG_CD_SRC = DB.GetReaderOrdinal(rdr, "WFSTG_CD_SRC");

                while (rdr.Read())
                {
                    ret.Add(new WorkFlows
                    {
                        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
                        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
                        TRKR_NBR_UPD = (IDX_TRKR_NBR_UPD < 0 || rdr.IsDBNull(IDX_TRKR_NBR_UPD)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRKR_NBR_UPD),
                        WF_NAME = (IDX_WF_NAME < 0 || rdr.IsDBNull(IDX_WF_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
                        WF_SID = (IDX_WF_SID < 0 || rdr.IsDBNull(IDX_WF_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
                        WFSTG_ACTN_CD = (IDX_WFSTG_ACTN_CD < 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
                        WFSTG_CD_DEST = (IDX_WFSTG_CD_DEST < 0 || rdr.IsDBNull(IDX_WFSTG_CD_DEST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_DEST),
                        WFSTG_CD_SRC = (IDX_WFSTG_CD_SRC < 0 || rdr.IsDBNull(IDX_WFSTG_CD_SRC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_SRC)
                    });
                } // while
            }

            return ret;
        }

        /// <summary>
        /// This will help to INSERT, UPDATE, DELETE from WorkFlow table
        /// </summary>
        /// <param name="mode"></param> // CrudModes - Insert / Update / Delete
        /// <param name="data"></param>
        /// <returns></returns>
        public List<WorkFlows> SetWorkFlows(CrudModes mode, WorkFlows data)
        {
            var retWorkflow = new List<WorkFlows>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_WORKFL_MSTR
            {
                IDSID = Utils.ThreadUser,
                MODE = mode.ToString().ToUpper(),
                WF_SID = data.WF_SID,
                WF_NAME = data.WF_NAME,
                ROLE_TIER_CD = data.ROLE_TIER_CD,
                WFSTG_ACTN_CD = data.WFSTG_ACTN_CD,
                DEAL_TYPE_CD = data.DEAL_TYPE_CD,
                WFSTG_CD_SRC = data.WFSTG_CD_SRC,
                WFSTG_CD_DEST = data.WFSTG_CD_DEST,
                TRKR_NBR_UPD = data.TRKR_NBR_UPD
               
            }))
            {
                int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
                int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
                int IDX_TRKR_NBR_UPD = DB.GetReaderOrdinal(rdr, "TRKR_NBR_UPD");
                int IDX_WF_NAME = DB.GetReaderOrdinal(rdr, "WF_NAME");
                int IDX_WF_SID = DB.GetReaderOrdinal(rdr, "WF_SID");
                int IDX_WFSTG_ACTN_CD = DB.GetReaderOrdinal(rdr, "WFSTG_ACTN_CD");
                int IDX_WFSTG_CD_DEST = DB.GetReaderOrdinal(rdr, "WFSTG_CD_DEST");
                int IDX_WFSTG_CD_SRC = DB.GetReaderOrdinal(rdr, "WFSTG_CD_SRC");

                while (rdr.Read())
                {
                    retWorkflow.Add(new WorkFlows
                    {
                        DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
                        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
                        TRKR_NBR_UPD = (IDX_TRKR_NBR_UPD < 0 || rdr.IsDBNull(IDX_TRKR_NBR_UPD)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_TRKR_NBR_UPD),
                        WF_NAME = (IDX_WF_NAME < 0 || rdr.IsDBNull(IDX_WF_NAME)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_NAME),
                        WF_SID = (IDX_WF_SID < 0 || rdr.IsDBNull(IDX_WF_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WF_SID),
                        WFSTG_ACTN_CD = (IDX_WFSTG_ACTN_CD < 0 || rdr.IsDBNull(IDX_WFSTG_ACTN_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ACTN_CD),
                        WFSTG_CD_DEST = (IDX_WFSTG_CD_DEST < 0 || rdr.IsDBNull(IDX_WFSTG_CD_DEST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_DEST),
                        WFSTG_CD_SRC = (IDX_WFSTG_CD_SRC < 0 || rdr.IsDBNull(IDX_WFSTG_CD_SRC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD_SRC)
                    });
                } // while
            }

            return retWorkflow;
        }
        #endregion

    }
}
