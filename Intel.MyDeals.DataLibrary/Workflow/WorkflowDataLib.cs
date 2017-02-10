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
        /// <summary>
        /// Get All Work Flow Stage
        /// </summary>
        /// <returns>List of all work flow stage</returns>
        public List<WorkFlowStg> GetWorkFlowStages()
        {
            var cmd = new Procs.dbo.PR_MYDL_UPD_WFSTG_MSTR
            {
                IDSID = Utils.ThreadUser,
                MODE = CrudModes.Select.ToString()
            };
            var ret = new List<WorkFlowStg>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
                int IDX_WFSTG_ATRB_SID = DB.GetReaderOrdinal(rdr, "WFSTG_ATRB_SID");
                int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
                int IDX_WFSTG_DESC = DB.GetReaderOrdinal(rdr, "WFSTG_DESC");
                int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
                int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
                int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");

                while (rdr.Read())
                {
                    ret.Add(new WorkFlowStg
                    {
                        ALLOW_REDEAL = (IDX_ALLOW_REDEAL < 0 || rdr.IsDBNull(IDX_ALLOW_REDEAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
                        CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                        CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
                        WFSTG_ATRB_SID = (IDX_WFSTG_ATRB_SID < 0 || rdr.IsDBNull(IDX_WFSTG_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ATRB_SID),
                        WFSTG_CD = (IDX_WFSTG_CD < 0 || rdr.IsDBNull(IDX_WFSTG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
                        WFSTG_DESC = (IDX_WFSTG_DESC < 0 || rdr.IsDBNull(IDX_WFSTG_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DESC),
                        WFSTG_LOC = (IDX_WFSTG_LOC < 0 || rdr.IsDBNull(IDX_WFSTG_LOC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
                        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
                        WFSTG_ORD = (IDX_WFSTG_ORD < 0 || rdr.IsDBNull(IDX_WFSTG_ORD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD)
                    });
                }
            }
            return ret;
        }

        /// <summary>
        /// This method will be used to Insert,Update and Delete the workflow stage
        /// </summary>
        /// <param name="mode" type="CrudModes">Mode of the operation like Insert,Update or Delete</param>
        /// <param name="data" type="WorkFlowStg">Requested values of Workflow stage </param>
        /// <returns>List of affected rows</returns>
        public List<WorkFlowStg> SetWorkFlowStages(CrudModes mode, WorkFlowStg data)
        {
            var ret = new List<WorkFlowStg>();
            // TODO: As per analysis CDMS table's this column has constant value 16003. Still it is part of clarification this column has relevant in MyDeals or not.
            data.WFSTG_ATRB_SID = 16003;
            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_WFSTG_MSTR()
            {
                IDSID = Utils.ThreadUser,
                MODE = mode.ToString().ToUpper(),
                WFSTG_MBR_SID = data.WFSTG_MBR_SID,
                WFSTG_ATRB_SID = data.WFSTG_ATRB_SID,
                WFSTG_CD = data.WFSTG_CD,
                WFSTG_DESC = data.WFSTG_DESC,
                ROLE_TIER_CD = data.ROLE_TIER_CD,
                WFSTG_LOC = data.WFSTG_LOC,
                WFSTG_ORD = data.WFSTG_ORD,
                ALLOW_REDEAL = data.ALLOW_REDEAL

            }))
            {
                int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
                int IDX_WFSTG_ATRB_SID = DB.GetReaderOrdinal(rdr, "WFSTG_ATRB_SID");
                int IDX_WFSTG_CD = DB.GetReaderOrdinal(rdr, "WFSTG_CD");
                int IDX_WFSTG_DESC = DB.GetReaderOrdinal(rdr, "WFSTG_DESC");
                int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
                int IDX_WFSTG_LOC = DB.GetReaderOrdinal(rdr, "WFSTG_LOC");
                int IDX_WFSTG_ORD = DB.GetReaderOrdinal(rdr, "WFSTG_ORD");
                int IDX_ALLOW_REDEAL = DB.GetReaderOrdinal(rdr, "ALLOW_REDEAL");
                int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                while (rdr.Read())
                {
                    ret.Add(new WorkFlowStg
                    {
                        ALLOW_REDEAL = (IDX_ALLOW_REDEAL < 0 || rdr.IsDBNull(IDX_ALLOW_REDEAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ALLOW_REDEAL),
                        CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                        CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                        ROLE_TIER_CD = (IDX_ROLE_TIER_CD < 0 || rdr.IsDBNull(IDX_ROLE_TIER_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
                        WFSTG_ATRB_SID = (IDX_WFSTG_ATRB_SID < 0 || rdr.IsDBNull(IDX_WFSTG_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_ATRB_SID),
                        WFSTG_CD = (IDX_WFSTG_CD < 0 || rdr.IsDBNull(IDX_WFSTG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_CD),
                        WFSTG_DESC = (IDX_WFSTG_DESC < 0 || rdr.IsDBNull(IDX_WFSTG_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_DESC),
                        WFSTG_LOC = (IDX_WFSTG_LOC < 0 || rdr.IsDBNull(IDX_WFSTG_LOC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_LOC),
                        WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
                        WFSTG_ORD = (IDX_WFSTG_ORD < 0 || rdr.IsDBNull(IDX_WFSTG_ORD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_ORD)
                    });
                }
            }
            return ret;
        }
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

        public List<WorkFlowAttribute> GetDropDownValues()
        {
            // TODO: This Repository will be replaced by a Master view Created in the DB
            List<WorkFlowAttribute> fake = new List<WorkFlowAttribute>();
            fake.Add(new WorkFlowAttribute { ColumnName = "ROLE_TIER_CD", Key = "Tier_1", Value = "Tier_1" });
            fake.Add(new WorkFlowAttribute { ColumnName = "ROLE_TIER_CD", Key = "Tier_2", Value = "Tier_2" });
            fake.Add(new WorkFlowAttribute { ColumnName = "ROLE_TIER_CD", Key = "Tier_3", Value = "Tier_3" });
            fake.Add(new WorkFlowAttribute { ColumnName = "ROLE_TIER_CD", Key = "Tier_4", Value = "Tier_4" });
            fake.Add(new WorkFlowAttribute { ColumnName = "ROLE_TIER_CD", Key = "Tier_5", Value = "Tier_5" });
            fake.Add(new WorkFlowAttribute { ColumnName = "DEAL_TYPE_CD", Key = "Program Type", Value = "Program Type" });
            fake.Add(new WorkFlowAttribute { ColumnName = "DEAL_TYPE_CD", Key = "ECAP_Deal", Value = "ECAP Deal" });
            fake.Add(new WorkFlowAttribute { ColumnName = "DEAL_TYPE_CD", Key = "Volume_Tier", Value = "Volume Tie" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_ACTN_CD", Key = "Approved", Value = "Approved" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_ACTN_CD", Key = "Rejected", Value = "Rejected" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_CD_SRC_DEST", Key = "Created", Value = "Created" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_CD_SRC_DEST", Key = "Requested", Value = "Requested" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_LOC", Key = "Left", Value = "Left" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_LOC", Key = "Right", Value = "Right" });
            fake.Add(new WorkFlowAttribute { ColumnName = "WFSTG_LOC", Key = "Top", Value = "Top" });
            return fake;
        }
    }
}
