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
		public List<SecurityActions> GetSecurityAction()
		{
			//OpLogPerf.Log("GetSecurityAction");
			return CallManageActionsSP(null, CrudModes.Select);
		}

		/// <summary>
		/// Inserts  or Updates a ToolAction
		/// </summary>
		/// <returns> The inserted or updated ToolActions</returns>
		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			//OpLogPerf.Log("ManageSecurityAction");
			return CallManageActionsSP(action, state).FirstOrDefault();
		}


		/// <summary>
		///  Calls the PR_MANAGE_ACTIONS SP which performs a CRUD operation depending on the state param
		/// </summary>
		/// <returns> List of ToolActions</returns>
		public List<SecurityActions> CallManageActionsSP(SecurityActions action, CrudModes state)
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
                Exception simpleEx = new Exception("Problem retrieving Security Attribute - Security Actions");
                throw simpleEx;
            }
			return ret;
		}

        #endregion

        #region Applications
        //TODO: Copy Paste Edit
        #endregion

        #region DealTypes
        //TODO: Copy Paste Edit
        #endregion

        #region RoleTypes
        //TODO: Copy Paste Edit
        #endregion
    }
}
