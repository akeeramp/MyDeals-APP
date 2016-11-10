using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
	public class SecurityAttributesDataLib
	{

        #region SecurityActions
        /// <summary>
        /// Delete a Security Action baed on id
        /// </summary>
        /// <returns>  </returns>
        public bool DeleteSecurityAction(int id)
		{
			//OpLogPerf.Log("DeleteToolAction");
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
		/// <returns> List of ToolActions</returns>
		public List<SecurityActions> GetSecurityActions()
		{
			//OpLogPerf.Log("GetSecurityAction");
			return CallManageActionSP(null, CrudModes.Select);
		}

		/// <summary>
		/// Inserts  or Updates a ToolAction
		/// </summary>
		/// <returns> The inserted or updated ToolActions</returns>
		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			//OpLogPerf.Log("ManageSecurityAction");
			return CallManageActionSP(action, state).FirstOrDefault();
		}


		/// <summary>
		///  Calls the PR_MANAGE_ACTIONS SP which performs a CRUD operation depending on the state param
		/// </summary>
		/// <returns> List of ToolActions</returns>
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
					cmd.ACTN_CATGRY_CD = action.ACTN_CATGRY_CD;
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
									   ACTN_CATGRY_CD = Convert.ToString(rw["ACTN_CATGRY_CD"]),
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
                OpLog.EmailError(ex);
                Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Security Actions");
                throw simpleEx;
            }
			return ret;
		}

		#endregion

		#region Admin Applications
		/// <summary>
		/// Delete Admin Application based on id
		/// </summary>
		/// <returns> void </returns>
		public bool DeleteAdminApplication(int id)
		{
			//OpLogPerf.Log("DeleteToolAction");
			DataSet dsCheckConstraintErrors = null;
			try
			{
				DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_APPLICATIONS()
				{
					idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
					mode = CrudModes.Delete.ToString(),
					APPL_SID = id
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
		/// Get Admin Applications
		/// </summary>
		/// <returns> List of Admin Applications</returns>
		public List<AdminApplications> GetAdminApplications()
		{
			//OpLogPerf.Log("GetSecurityAction");
			return CallManageAdminApplicationSP(null, CrudModes.Select);
		}

		/// <summary>
		/// Inserts  or Updates an Admin Application
		/// </summary>
		/// <returns> The inserted or updated Admin Application</returns>
		public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
		{
			//OpLogPerf.Log("ManageSecurityAction");
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
					cmd.APPL_CD = app.APPL_CD;
					cmd.APPL_DESC = app.APPL_DESC;
					cmd.APPL_SID = app.APPL_SID;
					cmd.APPL_SUITE = app.APPL_SUITE;
					cmd.ACTV_IND = app.ACTV_IND;
				}

				using (DataSet data = DataAccess.ExecuteDataSet(cmd))
				{
					ret = (from rw in data.Tables[0].AsEnumerable()
						   select new AdminApplications
						   {
							   APPL_CD = Convert.ToString(rw["APPL_CD"]),
							   APPL_DESC = Convert.ToString(rw["APPL_DESC"]),
							   APPL_SID = Convert.ToByte(rw["APPL_SID"]),
							   APPL_SUITE = Convert.ToString(rw["APPL_SUITE"]),
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
				OpLog.EmailError(ex);
				Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Admin Application");
				throw simpleEx;
			}
			return ret;
		}
		#endregion

		#region Admin DealTypes
		/// <summary>
		/// Delete Application based on id
		/// </summary>
		/// <returns> void </returns>
		public bool DeleteAdminDealType(int id)
		{
			//OpLogPerf.Log("DeleteToolAction");
			DataSet dsCheckConstraintErrors = null;
			try
			{
				DataAccess.ExecuteDataSet(new Procs.dbo.PR_MANAGE_DEAL_TYPES()
				{
					idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
					mode = CrudModes.Delete.ToString(),
					DEAL_TYPE_SID = id
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
		/// Get AdminDealTypes
		/// </summary>
		/// <returns> List of AdminDealTypes</returns>
		public List<AdminDealType> GetAdminDealTypes()
		{
			//OpLogPerf.Log("GetSecurityAction");
			return CallManageAdminDealTypeSP(null, CrudModes.Select);
		}

		/// <summary>
		/// Inserts  or Updates a AdminDealType
		/// </summary>
		/// <returns> The inserted or updated AdminDealType</returns>
		public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
		{
			//OpLogPerf.Log("ManageSecurityAction");
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
					idsid = OpUserStack.MyOpUserToken.Usr.Idsid,
					mode = state.ToString()
				};

				if (state.Equals(CrudModes.Insert) || state.Equals(CrudModes.Update))
				{
					cmd.DEAL_TYPE_CD = dealType.DEAL_TYPE_CD;
					cmd.DEAL_TYPE_SID = dealType.DEAL_TYPE_SID;
					cmd.DEAL_ATRB_SID = dealType.DEAL_ATRB_SID;
					cmd.DEAL_TYPE_DESC = dealType.DEAL_TYPE_DESC;
					cmd.TEMPLT_DEAL_SID = dealType.TEMPLT_DEAL_SID;
					cmd.TEMPLT_DEAL_NBR = dealType.TEMPLT_DEAL_NBR;
					cmd.TRKR_NBR_DT_LTR = dealType.TRKR_NBR_DT_LTR;
					cmd.PERFORM_CTST = dealType.PERFORM_CTST;
					cmd.ACTV_IND = dealType.ACTV_IND;
				}

				using (DataSet data = DataAccess.ExecuteDataSet(cmd))
				{
					ret = (from rw in data.Tables[0].AsEnumerable()
						   select new AdminDealType
						   {
							   DEAL_TYPE_CD = Convert.ToString(rw["DEAL_TYPE_CD"]),
							   DEAL_TYPE_SID = Convert.ToByte(rw["DEAL_TYPE_SID"]),
							   DEAL_ATRB_SID = Convert.ToByte(rw["DEAL_ATRB_SID"]),
							   DEAL_TYPE_DESC = Convert.ToString(rw["DEAL_TYPE_DESC"]),
							   TEMPLT_DEAL_SID = (rw.IsNull("TEMPLT_DEAL_SID") ? default(System.Int32) : Convert.ToInt32(rw["TEMPLT_DEAL_SID"])),
							   TEMPLT_DEAL_NBR = (rw.IsNull("TEMPLT_DEAL_NBR") ? default(System.Int32) : Convert.ToInt32(rw["TEMPLT_DEAL_NBR"])),
							   TRKR_NBR_DT_LTR = Convert.ToString(rw["TRKR_NBR_DT_LTR"]),
							   PERFORM_CTST = (rw.IsNull("PERFORM_CTST") ? default(System.Boolean) : Convert.ToBoolean(rw["PERFORM_CTST"])),
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
				OpLog.EmailError(ex);
				Exception simpleEx = new Exception("Problem " + state.ToString() + "ing Security Attribute - Admin Deal Type");
				throw simpleEx;
			}
			return ret;
		}
		#endregion

		#region Admin RoleTypes
		/// <summary>
		/// Delete RoleType based on id
		/// </summary>
		/// <returns> void </returns>
		public bool DeleteAdminRoleType(int id)
		{
			//OpLogPerf.Log("DeleteToolAction");
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
					// TODO: DO SOME ERROR HANDLING
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
			//OpLogPerf.Log("GetSecurityAction");
			return CallManageAdminRoleTypeSP(null, CrudModes.Select);
		}

		/// <summary>
		/// Inserts  or Updates a RoleType
		/// </summary>
		/// <returns> The inserted or updated RoleType</returns>
		public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
		{
			//OpLogPerf.Log("ManageSecurityAction");
			return CallManageAdminRoleTypeSP(roleType, state).FirstOrDefault();
		}


		/// <summary>
		///  Calls the PR_MANAGE_DEAL_TYPES SP which performs a CRUD operation depending on the state param
		/// </summary>
		/// <returns> List of AdminDealType</returns>
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
					cmd.APPL_SID = dealType.APPL_SID;
					cmd.ROLE_TYPE_SID = dealType.ROLE_TYPE_SID;
					cmd.ROLE_TYPE_CD = dealType.ROLE_TYPE_CD;
					cmd.ROLE_TYPE_DSPLY_CD = dealType.ROLE_TYPE_DSPLY_CD;
					cmd.ROLE_TYPE_DESC = dealType.ROLE_TYPE_DESC;
					cmd.ROLE_TIER_CD = dealType.ROLE_TIER_CD;
					cmd.IS_SINGLE_SELECT = dealType.IS_SINGLE_SELECT;
				}

				using (DataSet data = DataAccess.ExecuteDataSet(cmd))
				{
					ret = (from rw in data.Tables[0].AsEnumerable()
						   select new AdminRoleType
						   {
							   APPL_SID = Convert.ToByte(rw["APPL_SID"]),
							   ROLE_TYPE_SID = Convert.ToByte(rw["ROLE_TYPE_SID"]),
							   ROLE_TYPE_CD = Convert.ToString(rw["ROLE_TYPE_CD"]),
							   ROLE_TYPE_DSPLY_CD = Convert.ToString(rw["ROLE_TYPE_DSPLY_CD"]),
							   ROLE_TYPE_DESC = Convert.ToString(rw["ROLE_TYPE_DESC"]),
							   ROLE_TIER_CD = Convert.ToString(rw["ROLE_TIER_CD"]),
							   IS_SINGLE_SELECT = Convert.ToBoolean(rw["IS_SINGLE_SELECT"]),
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
				OpLog.EmailError(ex);
				Exception simpleEx = new Exception("Problem " + state.ToString() + " Security Attribute - Admin Role Type");
				throw simpleEx;
			}
			return ret;
		}
		#endregion
	}
}
