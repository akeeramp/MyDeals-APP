using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class SecurityAttributesDataLib : ISecurityAttributesDataLib
    {
        public List<AppRoleTier> GetAppRoleTiers( /*string app_nm, int? app_id*/)
        {
            return new List<AppRoleTier>();
            ////var cmd = new Procs.CDMS_MYDEALS.meta.PR_GET_ROLE_TIER();

            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    // This helper method is template generated when CustomerCalendar is generated.
            ////    // Refer to that template for details to modify this code.

            ////    var ret = new List<AppRoleTier>();
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            ////    int IDX_APPL_ACTV_IND = DB.GetReaderOrdinal(rdr, "APPL_ACTV_IND");
            ////    int IDX_APPL_CD = DB.GetReaderOrdinal(rdr, "APPL_CD");
            ////    int IDX_APPL_DESC = DB.GetReaderOrdinal(rdr, "APPL_DESC");
            ////    int IDX_APPL_SID = DB.GetReaderOrdinal(rdr, "APPL_SID");
            ////    int IDX_APPL_SUITE = DB.GetReaderOrdinal(rdr, "APPL_SUITE");
            ////    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
            ////    int IDX_IS_SINGLE_SELECT = DB.GetReaderOrdinal(rdr, "IS_SINGLE_SELECT");
            ////    int IDX_ROLE_ACTV_IND = DB.GetReaderOrdinal(rdr, "ROLE_ACTV_IND");
            ////    int IDX_ROLE_TIER_CD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_CD");
            ////    int IDX_ROLE_TIER_SID = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SID");
            ////    int IDX_ROLE_TIER_SRT_ORD = DB.GetReaderOrdinal(rdr, "ROLE_TIER_SRT_ORD");
            ////    int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
            ////    int IDX_ROLE_TYPE_DESC = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DESC");
            ////    int IDX_ROLE_TYPE_DSPLY_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_DSPLY_CD");
            ////    int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new AppRoleTier
            ////        {
            ////            ACTV_IND =
            ////                rdr.IsDBNull(IDX_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
            ////            APPL_ACTV_IND =
            ////                rdr.IsDBNull(IDX_APPL_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_APPL_ACTV_IND),
            ////            APPL_CD =
            ////                rdr.IsDBNull(IDX_APPL_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_APPL_CD),
            ////            APPL_DESC =
            ////                rdr.IsDBNull(IDX_APPL_DESC)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_APPL_DESC),
            ////            APPL_SID =
            ////                rdr.IsDBNull(IDX_APPL_SID)
            ////                    ? default(System.Byte)
            ////                    : rdr.GetFieldValue<System.Byte>(IDX_APPL_SID),
            ////            APPL_SUITE =
            ////                rdr.IsDBNull(IDX_APPL_SUITE)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_APPL_SUITE),
            ////            CHG_DTM =
            ////                rdr.IsDBNull(IDX_CHG_DTM)
            ////                    ? default(System.DateTime)
            ////                    : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
            ////            IS_SINGLE_SELECT =
            ////                rdr.IsDBNull(IDX_IS_SINGLE_SELECT)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_IS_SINGLE_SELECT),
            ////            ROLE_ACTV_IND =
            ////                rdr.IsDBNull(IDX_ROLE_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ROLE_ACTV_IND),
            ////            ROLE_TIER_CD =
            ////                rdr.IsDBNull(IDX_ROLE_TIER_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TIER_CD),
            ////            ROLE_TIER_SID =
            ////                rdr.IsDBNull(IDX_ROLE_TIER_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SID),
            ////            ROLE_TIER_SRT_ORD =
            ////                rdr.IsDBNull(IDX_ROLE_TIER_SRT_ORD)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TIER_SRT_ORD),
            ////            ROLE_TYPE_CD =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
            ////            ROLE_TYPE_DESC =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_DESC)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DESC),
            ////            ROLE_TYPE_DSPLY_CD =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_DSPLY_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_DSPLY_CD),
            ////            ROLE_TYPE_SID =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID)
            ////        });
            ////    } // while

            ////    return ret;
            ////}
        }

        public SecurityWrapper GetSecurityWrapper()
        {
            return new SecurityWrapper(new List<OpRoleType>(), new List<SecurityAttribute>(), new List<SecurityMask>() );
            ////var cmd = new Procs.CDMS_MYDEALS.core.PR_GET_SECURITY_MASK();

            ////using (DataSet data = DataAccess.ExecuteDataSet(cmd))
            ////{

            ////    List<SecurityAction> securityActions = (from rw in data.Tables[0].AsEnumerable()
            ////                                            select new SecurityAction
            ////                                            {
            ////                                                ATRB_BIT = Convert.ToInt64(rw["ATRB_BIT"]),
            ////                                                ATRB_MAGNITUDE = Convert.ToInt64(rw["ATRB_MAGNITUDE"]),
            ////                                                FACT_ATRB_CD = Convert.ToString(rw["FACT_ATRB_CD"]),
            ////                                                FACT_ATRB_SID = Convert.ToInt32(rw["FACT_ATRB_SID"])

            ////                                            }).ToList();

            ////    List<SecurityMask> securityMasks = (from rw in data.Tables[1].AsEnumerable()
            ////                                        select new SecurityMask
            ////                                        {
            ////                                            ACTN_CD = Convert.ToString(rw["ACTN_CD"]),
            ////                                            ACTN_SID = Convert.ToInt32(rw["ACTN_SID"]),
            ////                                            DEAL_MBR_SID = Convert.ToInt32(rw["DEAL_MBR_SID"]),
            ////                                            DEAL_TYPE_CD = Convert.ToString(rw["DEAL_TYPE_CD"]),
            ////                                            PERMISSION_MASK = Convert.ToString(rw["PERMISSION_MASK"]),
            ////                                            ROLE_TYPE_CD = Convert.ToString(rw["ROLE_TYPE_CD"]),
            ////                                            ROLE_TYPE_SID = Convert.ToInt32(rw["ROLE_TYPE_SID"]),
            ////                                            WFSTG_CD = Convert.ToString(rw["WFSTG_CD"]),
            ////                                            WFSTG_MBR_SID = Convert.ToInt32(rw["WFSTG_MBR_SID"])
            ////                                        }).ToList();


            ////    List<OpRoleType> tmpRoleType = DataCollections.GetAppRoleTiers().Where(r => r.APPL_CD.ToUpper() == "IDMS").Select(appRoleTier => new OpRoleType
            ////    {
            ////        RoleTypeId = appRoleTier.ROLE_TYPE_SID,
            ////        RoleTypeCd = appRoleTier.ROLE_TYPE_CD,
            ////        RoleTypeDescription = appRoleTier.ROLE_TYPE_DESC,
            ////        RoleTypeDisplayName = appRoleTier.ROLE_TYPE_DSPLY_CD,
            ////        RoleTier = appRoleTier.ROLE_TIER_CD
            ////    }).ToList();

            ////    return new SecurityWrapper(tmpRoleType, securityActions, securityMasks);
            ////}
        }

        public List<MyDealsActionItem> GetDealActions()
        {
            return new List<MyDealsActionItem>();
            ////OpLogPerf.Log("Loading Actions");

            ////SecurityWrapper securityWrapper = DataCollections.GetSecurityWrapper();
            ////List<string> stages = DataCollections.GetWorkFlowStages().Where(s => s.ACTV_IND).Select(s => s.WFSTG_CD).ToList();
            ////string[] actions = { "C_APPROVE", "C_REJECT_DEAL", "C_CANCEL_DEAL" };
            ////List<DealType> dealTypes = DataCollections.GetTemplateData().DealTypeData;

            ////List<MyDealsActionItem> items = new List<MyDealsActionItem>();

            ////foreach (OpRoleType opRoleType in securityWrapper.RoleTypes.Where(r => r.RoleTypeCd != "All Role Types"))
            ////{
            ////    items.AddRange(from dealType in dealTypes
            ////                   from stage in stages
            ////                   select new MyDealsActionItem
            ////                   {
            ////                       ObjsetType = dealType.DEAL_TYPE_CD,
            ////                       Role = opRoleType.RoleTypeCd,
            ////                       Stage = stage
            ////                   });
            ////}

            ////// now populate the actions
            ////foreach (MyDealsActionItem dealActionItem in items)
            ////{
            ////    foreach (string actn in actions)
            ////    {
            ////        dealActionItem.Actions[actn] = securityWrapper.ChkDealRules(dealActionItem.ObjsetType, dealActionItem.Role, dealActionItem.Stage, actn);
            ////    }
            ////}

            ////return items;


        }
        #region SecurityActions
        /// <summary>
        /// Delete a Security Action based on id
        /// </summary>
        /// <returns> void </returns>
        public bool DeleteSecurityAction(int id)
        {
            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_ACTIONS()
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = CrudModes.Delete.ToString(),
                    ACTN_SID = id
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    // TODO: DO SOME ERROR HANDLING
                }
                throw;
            }
            return true;
        }

        /// <summary>
        /// Get Security Action
        /// </summary>
        /// <returns> List of Security Actions</returns>
        public List<SecurityActions> GetSecurityActions()
        {
            return CallManageActionSP(null, CrudModes.Select);
        }

        /// <summary>
        /// Inserts  or Updates a Security Action
        /// </summary>
        /// <returns> The inserted or updated Security Actions</returns>
        public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
        {
            return CallManageActionSP(action, state).FirstOrDefault();
        }

        /// <summary>
        ///  Calls the PR_MANAGE_ACTIONS SP which performs a CRUD operation depending on the state param
        /// </summary>
        /// <returns> List of Security Actions</returns>
        public List<SecurityActions> CallManageActionSP(SecurityActions action, CrudModes state)
        {
            var ret = new List<SecurityActions>();
            try
            {
                Procs.dbo.PR_MANAGE_ACTIONS cmd = new Procs.dbo.PR_MANAGE_ACTIONS
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = state.ToString()
                };

                if (state.Equals(CrudModes.Insert) || state.Equals(CrudModes.Update))
                {
                    cmd.ACTN_CATGRY_CD = action.ACTN_CAT_CD;
                    cmd.ACTN_CD = action.ACTN_CD;
                    cmd.ACTN_DESC = action.ACTN_DESC;
                    cmd.ACTN_SID = action.ACTN_SID;
                    cmd.SRT_ORD = action.SRT_ORD;
                    cmd.WFSTG_ACTN_CD = action.WFSTG_ACTN_CD;
                }

                using (DataSet data = DataAccess.ExecuteDataSet(cmd))
                {
                    ret = (from rw in data.Tables[0].AsEnumerable()
                           select new SecurityActions
                           {
                               ACTN_CAT_CD = Convert.ToString(rw["ACTN_CAT_CD"]),
                               ACTN_CD = Convert.ToString(rw["ACTN_CD"]),
                               ACTN_DESC = Convert.ToString(rw["ACTN_DESC"]),
                               ACTN_SID = Convert.ToInt32(rw["ACTN_SID"]),
                               CHG_DTM = Convert.ToDateTime(rw["CHG_DTM"]),
                               CHG_EMP_WWID = Convert.ToInt32(rw["CHG_EMP_WWID"]),
                               CRE_DTM = Convert.ToDateTime(rw["CRE_DTM"]),
                               CRE_EMP_WWID = Convert.ToInt32(rw["CRE_EMP_WWID"]),
                               SRT_ORD = Convert.ToInt32(rw["SRT_ORD"]),
                               WFSTG_ACTN_CD = Convert.ToString(rw["WFSTG_ACTN_CD"])
                           }).ToList();
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Security Actions");
                throw simpleEx;
            }
            return ret;
        }

        #endregion SecurityActions

        #region Admin Applications

        /// <summary>
        /// Delete Admin Application based on id
        /// </summary>
        /// <returns> void </returns>
        public bool DeleteAdminApplication(int id)
        {
            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_APPLICATIONS()
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = CrudModes.Delete.ToString(),
                    APP_SID = id
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    OpLogPerf.Log(ex);
                }
                throw;
            }
            return true;
        }

        /// <summary>
        /// Get Admin Applications
        /// </summary>
        /// <returns> List of Admin Applications</returns>
        public List<AdminApplications> GetAdminApplications()
        {
            return CallManageAdminApplicationSP(null, CrudModes.Select);
        }

        /// <summary>
        /// Inserts  or Updates an Admin Application
        /// </summary>
        /// <returns> The inserted or updated Admin Application</returns>
        public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
        {
            return CallManageAdminApplicationSP(app, state).FirstOrDefault();
        }

        /// <summary>
        ///  Calls the PR_MANAGE_APPLICATIONS SP which performs a CRUD operation depending on the state param
        /// </summary>
        /// <returns> List of Admin Applications</returns>
        public List<AdminApplications> CallManageAdminApplicationSP(AdminApplications app, CrudModes state)
        {
            var ret = new List<AdminApplications>();
            try
            {
                Procs.dbo.PR_MANAGE_APPLICATIONS cmd = new Procs.dbo.PR_MANAGE_APPLICATIONS
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = state.ToString()
                };

                if (state.Equals(CrudModes.Insert) || state.Equals(CrudModes.Update))
                {
                    cmd.APP_CD = app.APP_CD;
                    cmd.APP_DESC = app.APP_DESC;
                    cmd.APP_SID = app.APP_SID;
                    cmd.APP_SUITE = app.APP_SUITE;
                    cmd.ACTV_IND = app.ACTV_IND;
                }

                using (DataSet data = DataAccess.ExecuteDataSet(cmd))
                {
                    ret = (from rw in data.Tables[0].AsEnumerable()
                           select new AdminApplications
                           {
                               APP_CD = Convert.ToString(rw["APP_CD"]),
                               APP_DESC = Convert.ToString(rw["APP_DESC"]),
                               APP_SID = Convert.ToByte(rw["APP_SID"]),
                               APP_SUITE = Convert.ToString(rw["APP_SUITE"]),
                               ACTV_IND = Convert.ToBoolean(rw["ACTV_IND"]),
                               CHG_DTM = Convert.ToDateTime(rw["CHG_DTM"]),
                               CHG_EMP_WWID = Convert.ToInt32(rw["CHG_EMP_WWID"]),
                               CRE_DTM = Convert.ToDateTime(rw["CRE_DTM"]),
                               CRE_EMP_WWID = Convert.ToInt32(rw["CRE_EMP_WWID"])
                           }).ToList();
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Admin Application");
                throw simpleEx;
            }
            return ret;
        }

        #endregion Admin Applications

        #region Admin DealTypes

        /// <summary>
        /// Delete Application based on id
        /// </summary>
        /// <returns> void </returns>
        public bool DeleteAdminDealType(int id)
        {
            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_DEAL_TYPES()
                {
                    WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = CrudModes.Delete.ToString(),
                    OBJ_SET_TYPE_SID = id
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    OpLogPerf.Log(ex);
                }
                throw;
            }
            return true;
        }

        /// <summary>
        /// Get AdminDealTypes
        /// </summary>
        /// <returns> List of AdminDealTypes</returns>
        public List<AdminDealType> GetAdminDealTypes()
        {
            return CallManageAdminDealTypeSP(null, CrudModes.Select);
        }

        /// <summary>
        /// Inserts  or Updates a AdminDealType
        /// </summary>
        /// <returns> The inserted or updated AdminDealType</returns>
        public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
        {
            return CallManageAdminDealTypeSP(dealType, state).FirstOrDefault();
        }

        /// <summary>
        ///  Calls the PR_MANAGE_DEAL_TYPES SP which performs a CRUD operation depending on the state param
        /// </summary>
        /// <returns> List of AdminDealType</returns>
        public List<AdminDealType> CallManageAdminDealTypeSP(AdminDealType dealType, CrudModes state)
        {
            var ret = new List<AdminDealType>();
            try
            {
                Procs.dbo.PR_MANAGE_DEAL_TYPES cmd = new Procs.dbo.PR_MANAGE_DEAL_TYPES
                {
                    WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    MODE = state.ToString()
                };

                if (state.Equals(CrudModes.Insert) || state.Equals(CrudModes.Update))
                {
                    cmd.OBJ_SET_TYPE_CD = dealType.OBJ_SET_TYPE_CD;
                    cmd.OBJ_SET_TYPE_SID = dealType.OBJ_SET_TYPE_SID;
                    cmd.OBJ_ATRB_SID = dealType.OBJ_ATRB_SID;
                    cmd.OBJ_SET_TYPE_DESC = dealType.OBJ_SET_TYPE_DESC;
                    cmd.TEMPLT_DEAL_SID = dealType.TEMPLT_DEAL_SID;
                    cmd.TEMPLT_DEAL_NBR = dealType.TEMPLT_DEAL_NBR;
                    cmd.TRKR_NBR_DT_LTR = dealType.TRKR_NBR_DT_LTR;
                    //cmd.PERFORM_CTST = dealType.PERFORM_CTST;
                    cmd.ACTV_IND = dealType.ACTV_IND;
                }

                using (DataSet data = DataAccess.ExecuteDataSet(cmd))
                {
                    ret = (from rw in data.Tables[0].AsEnumerable()
                           select new AdminDealType
                           {
                               OBJ_SET_TYPE_CD = Convert.ToString(rw["OBJ_SET_TYPE_CD"]),
                               OBJ_SET_TYPE_SID = Convert.ToByte(rw["OBJ_SET_TYPE_SID"]),
                               OBJ_ATRB_SID = Convert.ToInt32(rw["OBJ_ATRB_SID"]),
                               OBJ_SET_TYPE_DESC = Convert.ToString(rw["OBJ_SET_TYPE_DESC"]),
                               TEMPLT_DEAL_SID = (rw.IsNull("TEMPLT_DEAL_SID") ? default(System.Int32) : Convert.ToInt32(rw["TEMPLT_DEAL_SID"])),
                               TEMPLT_DEAL_NBR = (rw.IsNull("TEMPLT_DEAL_NBR") ? default(System.Int32) : Convert.ToInt32(rw["TEMPLT_DEAL_NBR"])),
                               TRKR_NBR_DT_LTR = Convert.ToString(rw["TRKR_NBR_DT_LTR"]),
                               //PERFORM_CTST = (rw.IsNull("PERFORM_CTST") ? default(System.Boolean) : Convert.ToBoolean(rw["PERFORM_CTST"])),
                               ACTV_IND = Convert.ToBoolean(rw["ACTV_IND"]),
                               CHG_DTM = Convert.ToDateTime(rw["CHG_DTM"]),
                               CHG_EMP_WWID = Convert.ToInt32(rw["CHG_EMP_WWID"]),
                               CRE_DTM = Convert.ToDateTime(rw["CRE_DTM"]),
                               CRE_EMP_WWID = Convert.ToInt32(rw["CRE_EMP_WWID"])
                           }).ToList();
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception simpleEx = new Exception("Problem " + state.ToString() + "ing Security Attribute - Admin Deal Type");
                throw simpleEx;
            }
            return ret;
        }

        #endregion Admin DealTypes

        #region Admin RoleTypes

        /// <summary>
        /// Delete RoleType based on id
        /// </summary>
        /// <returns> void </returns>
        public bool DeleteAdminRoleType(int id)
        {
            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_ROLE_TYPES()
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = CrudModes.Delete.ToString(),
                    ROLE_TYPE_SID = id
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    OpLogPerf.Log(ex);
                }
                throw;
            }
            return true;
        }

        /// <summary>
        /// Get RoleTypes
        /// </summary>
        /// <returns> List of RoleTypes</returns>
        public List<AdminRoleType> GetAdminRoleTypes()
        {
            return CallManageAdminRoleTypeSP(null, CrudModes.Select);
        }

        /// <summary>
        /// Inserts  or Updates a RoleType
        /// </summary>
        /// <returns> The inserted or updated RoleType</returns>
        public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
        {
            return CallManageAdminRoleTypeSP(roleType, state).FirstOrDefault();
        }

        /// <summary>
        ///  Calls the PR_MANAGE_DEAL_TYPES SP which performs a CRUD operation depending on the state param
        /// </summary>
        /// <returns> List of AdminRoleTypes</returns>
        public List<AdminRoleType> CallManageAdminRoleTypeSP(AdminRoleType dealType, CrudModes state)
        {
            var ret = new List<AdminRoleType>();
            try
            {
                Procs.dbo.PR_MANAGE_ROLE_TYPES cmd = new Procs.dbo.PR_MANAGE_ROLE_TYPES
                {
                    idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
                    mode = state.ToString()
                };

                if (state.Equals(CrudModes.Insert) || state.Equals(CrudModes.Update))
                {
                    cmd.ACTV_IND = dealType.ACTV_IND;
                    cmd.APP_SID = dealType.APP_SID;
                    cmd.ROLE_TYPE_SID = dealType.ROLE_TYPE_SID;
                    cmd.ROLE_TYPE_CD = dealType.ROLE_TYPE_CD;
                    cmd.ROLE_TYPE_DSPLY_CD = dealType.ROLE_TYPE_DSPLY_CD;
                    cmd.ROLE_TYPE_DESC = dealType.ROLE_TYPE_DESC;
                    cmd.ROLE_TIER_CD = dealType.ROLE_TIER_CD;
                    cmd.IS_SNGL_SLCT = dealType.IS_SNGL_SLCT;
                }

                using (DataSet data = DataAccess.ExecuteDataSet(cmd))
                {
                    ret = (from rw in data.Tables[0].AsEnumerable()
                           select new AdminRoleType
                           {
                               APP_SID = Convert.ToByte(rw["APP_SID"]),
                               ROLE_TYPE_SID = Convert.ToByte(rw["ROLE_TYPE_SID"]),
                               ROLE_TYPE_CD = Convert.ToString(rw["ROLE_TYPE_CD"]),
                               ROLE_TYPE_DSPLY_CD = Convert.ToString(rw["ROLE_TYPE_DSPLY_CD"]),
                               ROLE_TYPE_DESC = Convert.ToString(rw["ROLE_TYPE_DESC"]),
                               ROLE_TIER_CD = Convert.ToString(rw["ROLE_TIER_CD"]),
                               IS_SNGL_SLCT = Convert.ToBoolean(rw["IS_SNGL_SLCT"]),
                               ACTV_IND = Convert.ToBoolean(rw["ACTV_IND"]),
                               CHG_DTM = Convert.ToDateTime(rw["CHG_DTM"]),
                               CHG_EMP_WWID = Convert.ToInt32(rw["CHG_EMP_WWID"]),
                               CRE_DTM = Convert.ToDateTime(rw["CRE_DTM"]),
                               CRE_EMP_WWID = Convert.ToInt32(rw["CRE_EMP_WWID"])
                           }).ToList();
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Admin Role Type");
                throw simpleEx;
            }
            return ret;
        }

        #endregion Admin RoleTypes
    }
}