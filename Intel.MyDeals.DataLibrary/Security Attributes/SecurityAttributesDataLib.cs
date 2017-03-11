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


		#region SecurityEngine Mappings

		/// <summary>
		/// Gets the Security Actions, Security Masks, and RoleTypes(TODO), then wraps them in a SecurityWrapper obj
		/// </summary>
		/// <returns> Security Wrapper containing the  Security Actions, Security Masks, and RoleTypes(TODO) </returns>
		public SecurityWrapper GetSecurityWrapper()
		{
			try
			{
				Procs.dbo.PR_MYDL_GET_SECUR_MSK cmd = new Procs.dbo.PR_MYDL_GET_SECUR_MSK(); //PR_MYDL_GET_SECUR_MSK

				using (DataSet data = DataAccess.ExecuteDataSet(cmd))
				{
					List<SecurityAttribute> securityAttributes = (from rw in data.Tables[0].AsEnumerable()
															   select new SecurityAttribute
															   {
																   ATRB_BIT = Convert.ToInt64(rw["ATRB_BIT"]),
																   ATRB_MAGNITUDE = Convert.ToInt64(rw["ATRB_MAGNITUDE"]),
																   ATRB_CD = Convert.ToString(rw["ATRB_CD"]), // todo
																   ATRB_SID = Convert.ToInt32(rw["ATRB_SID"]) // todo

															   }).ToList();

					List<SecurityMask> securityMasks = (from rw in data.Tables[1].AsEnumerable()
														select new SecurityMask
														{
															ACTN_NM = Convert.ToString(rw["ACTN_NM"]), // TODO: Rename when db column gets renamed
															SECUR_ACTN_SID = Convert.ToInt32(rw["SECUR_ACTN_SID"]), // TODO: Rename when db column gets renamed
															OBJ_TYPE_SID = Convert.ToInt32(rw["OBJ_TYPE_SID"]), // TODO: Rename when db column gets renamed
															//OBJ_TYPE_CD = Convert.ToString(rw["OBJ_SET_TYPE_NM"]), // TODO: Rename when db column gets renamed
															OBJ_SET_TYPE_CD = Convert.ToString(rw["OBJ_SET_TYPE_CD"]), // TODO: Rename when db column gets renamed
															PERMISSION_MASK = Convert.ToString(rw["PERMISSION_MASK"]),
															ROLE_NM = Convert.ToString(rw["ROLE_NM"]), // TODO: Rename when db column gets renamed
															ROLE_SID = Convert.ToInt32(rw["ROLE_SID"]), // TODO: Rename when db column gets renamed
															WFSTG_NM = Convert.ToString(rw["WFSTG_NM"]),
															WFSTG_MBR_SID = Convert.ToInt32(rw["WFSTG_MBR_SID"])
														}).ToList();

					// TODO: Hook this up when we get roles hooked up on db side 
					// TODO: re-evaluate if we need the roletypes in here vs getting role types via pr_get_dropdowns?				
					List<OpRoleType> tmpRoleType = null;
					//List<OpRoleType> tmpRoleType = DataCollections.GetAppRoleTiers().Where(r => r.APPL_CD.ToUpper() == "IDMS").Select(appRoleTier => new OpRoleType
					//{
					//	RoleTypeId = appRoleTier.ROLE_TYPE_SID,
					//	RoleTypeCd = appRoleTier.ROLE_TYPE_CD,
					//	RoleTypeDescription = appRoleTier.ROLE_TYPE_DESC,
					//	RoleTypeDisplayName = appRoleTier.ROLE_TYPE_DSPLY_CD,
					//	RoleTier = appRoleTier.ROLE_TIER_CD
					//}).ToList();

					return new SecurityWrapper(tmpRoleType, securityAttributes, securityMasks);
				}
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				Exception simpleEx = new Exception("Problem Security Attribute - GetSecurityWrapper");
				throw simpleEx;
			}
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

		/// <summary>
		/// Gets a list of Attributes used for the Secruity Engine
		/// </summary>
		/// <returns> A list of Attributes </returns>
		public List<SecurityAttributesDropDown> GetObjAtrbs()
		{
			var ret = new List<SecurityAttributesDropDown>();
			try
			{
				Procs.dbo.PR_MYDL_GET_SECUR_DROPDOWNS cmd = new Procs.dbo.PR_MYDL_GET_SECUR_DROPDOWNS { };
				
				using (DataSet data = DataAccess.ExecuteDataSet(cmd))
				{
					ret = (from rw in data.Tables[0].AsEnumerable()
						   select new SecurityAttributesDropDown
						   {
							   ATRB_COL_NM = Convert.ToString(rw["ATRB_COL_NM"]),
							   ATRB_SID = Convert.ToInt32(rw["ATRB_SID"]),
							   OBJ_SET_TYPE = Convert.ToString(rw["OBJ_SET_TYPE"]),
							   OBJ_SET_TYPE_SID = Convert.ToInt32(rw["OBJ_SET_TYPE_SID"]),
							   OBJ_TYPE = Convert.ToString(rw["OBJ_TYPE"]),
							   OBJ_TYPE_SID = Convert.ToInt32(rw["OBJ_TYPE_SID"])
						   }).ToList();
				}
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				Exception simpleEx = new Exception("Problem Security Attribute - GetObjAtrbs");
				throw simpleEx;
			}			
			return ret;
		}

		/// <summary>
		/// Sends a list of security mappings which will be inserted or deleted in the db.
		/// Rows that are already in the db are deleted. Rows not in the db already are inserted.
		/// Note that the logic for if whether a row is inserted or deleted is in the SP.
		/// </summary>
		/// <returns> boolean depending on if the SP failed or not </returns>
		public bool SaveSecurityMappings(List<SecurityMapSave> saveMappings)
		{
			try
			{
				// Make datatable
				t_secur_info dt = new t_secur_info();
				dt.AddRows(saveMappings);

				// Call Proc
				Procs.dbo.PR_MYDL_SAVE_SECURITY_INFO cmd = new Procs.dbo.PR_MYDL_SAVE_SECURITY_INFO
				{
					SecurInfo = dt,
					wwid = OpUserStack.MyOpUserToken.Usr.WWID
				};

				DataAccess.ExecuteDataSet(cmd);
				
				// Update db cook table
				UpdateDbSecurityMask();

				// Update Cache
				DataCollections.RecycleCache("_getSecurityWrapper");

				return true;
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw;
			}
		}

		/// <summary>
		/// Calls a SP which will update the Cook table for Security Masks
		/// </summary>
		/// <returns> void </returns>
		public void UpdateDbSecurityMask()
		{
			try
			{
				Procs.dbo.PR_MYDL_UPD_CK_SECUR_MSK cmd = new Procs.dbo.PR_MYDL_UPD_CK_SECUR_MSK { };
				DataAccess.ExecuteDataSet(cmd);
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw;
			}
		}
		#endregion

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
            catch (Exception)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    // TODO: DO SOME ERROR HANDLING
                }
                throw;
            }

			// Update Cache
			DataCollections.ClearCache("_getSecurityActions");
			DataCollections.LoadCache("_getSecurityActions");
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
            SecurityActions result = CallManageActionSP(action, state).FirstOrDefault();

			// Update Cache
			DataCollections.ClearCache("_getSecurityActions");
			DataCollections.LoadCache("_getSecurityActions");

			return result;
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
					//cmd.ACTV_IND = action.ACTV_IND;
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
							  //, ACTV_IND = Convert.ToString(rw["ACTV_IND"])
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

			// Update Cache
			DataCollections.ClearCache("_getAdminApplications");
			DataCollections.LoadCache("_getAdminApplications");
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
			AdminApplications result = CallManageAdminApplicationSP(app, state).FirstOrDefault();

			// Update Cache
			DataCollections.ClearCache("_getAdminApplications");
			DataCollections.LoadCache("_getAdminApplications");

			return result;
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
			// Update Cache
			DataCollections.ClearCache("_getAdminDealTypes");
			DataCollections.LoadCache("_getAdminDealTypes");
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
            AdminDealType result = CallManageAdminDealTypeSP(dealType, state).FirstOrDefault();
			
			// Update Cache
			DataCollections.ClearCache("_getAdminDealTypes");
			DataCollections.LoadCache("_getAdminDealTypes");

			return result;
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
			// Update Cache
			DataCollections.ClearCache("_getAdminRoleTypes");
			DataCollections.LoadCache("_getAdminRoleTypes");
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
            AdminRoleType result = CallManageAdminRoleTypeSP(roleType, state).FirstOrDefault();
			
			// Update Cache
			DataCollections.ClearCache("_getAdminRoleTypes");
			DataCollections.LoadCache("_getAdminRoleTypes");

			return result;
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