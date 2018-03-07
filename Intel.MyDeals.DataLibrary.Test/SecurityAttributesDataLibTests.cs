using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Intel.MyDeals.DataLibrary.Test
{
	[TestClass]
	public class SecurityAttributesDataLibTests
	{
		public SecurityAttributesDataLibTests()
		{
			OpUserStack.EmulateUnitTester(); 
			UnitTestHelpers.SetDbConnection();
		}

		#region Security Mapping
		[TestMethod]
		public void GetSecurityWrapper()
		{
			SecurityWrapper result = new SecurityAttributesDataLib().GetSecurityWrapper();
			Assert.IsTrue(result.SecurityAttributes.Any());
		}

		[TestMethod]
		public void SecurityEngineObjAtrbsGet()
		{
			List<SecurityAttributesDropDown> results = new SecurityAttributesDataLib().GetSecurityAttributesDropDownData();
			Assert.IsTrue(results.Any());
		}

		[TestMethod]
		public void SecurityMappingsSave()

		{
			List<SecurityMapSave> saveMappings = new List<SecurityMapSave>();

			// INSERT
			SecurityMapSave mapping = new SecurityMapSave
			{
				ATRB_SID = 1, // hard-coded value for 
				OBJ_TYPE_SID = (int)OpDataElementType.PRC_TBL,
				OBJ_SET_TYPE_SID = (int)OpDataElementSetType.ECAP,
				ROLE_TYPE_SID = 2, // hard-coded value for CBA
				SECUR_ACTN_SID = 1, // hard-coded value for C_ADD_ATTACHMENTS
				WFSTG_MBR_SID = 3 // hard-coded value for Cancelled
			};
			saveMappings.Add(mapping);

			bool insertResult = new SecurityAttributesDataLib().SaveSecurityMappings(saveMappings);
			Assert.IsTrue(insertResult);

			// DELETE / reset mappings (this is done via db)
			bool deleteResult = new SecurityAttributesDataLib().SaveSecurityMappings(saveMappings);
			Assert.IsTrue(deleteResult);
		}
        #endregion

        #region SecurityActions

        ////DEV_REBUILD_REMOVALS
        //[TestMethod]
        //public void AdminSecurityActionsGet()
        //{
        //	IEnumerable<SecurityActions> results = new SecurityAttributesDataLib().GetSecurityActions();
        //	Assert.IsTrue(results.Any());
        //}

        //[TestMethod]
        //public void AdminSecurityActionsManage()
        //{
        //          //INSERT
        //	string testString = "UNIT TEST - InsertSecurityActions";
        //          //string testStringShort = "TEST";

        //	SecurityActions action = new SecurityActions
        //	{
        //              ACTN_CAT_CD = testString,
        //		ACTN_NM = testString,
        //		ACTN_DESC = testString,
        //		SRT_ORD = 0,
        //		//WFSTG_ACTN_CD = testStringShort
        //          };
        //	SecurityActions insertResult = new SecurityAttributesDataLib().ManageSecurityAction(action, CrudModes.Insert);

        //	Assert.IsTrue(
        //              insertResult.ACTN_CAT_CD == action.ACTN_CAT_CD
        //		&& insertResult.ACTN_NM == action.ACTN_NM
        //              && insertResult.ACTN_DESC == action.ACTN_DESC
        //		&& insertResult.SRT_ORD == action.SRT_ORD
        //		//&& insertResult.WFSTG_ACTN_CD == action.WFSTG_ACTN_CD
        //		);

        //          //UPDATE
        //          testString = "UNIT TEST - UpdateSecurityActions";
        //          insertResult.ACTN_CAT_CD = testString;
        //          insertResult.ACTN_NM = testString;
        //          insertResult.ACTN_DESC = testString;

        //          SecurityActions updateResult = new SecurityAttributesDataLib().ManageSecurityAction(insertResult, CrudModes.Update);

        //          Assert.IsTrue(
        //              updateResult.ACTN_CAT_CD == insertResult.ACTN_CAT_CD
        //              && updateResult.ACTN_NM == insertResult.ACTN_NM
        //              && updateResult.ACTN_DESC == insertResult.ACTN_DESC
        //              && updateResult.SRT_ORD == insertResult.SRT_ORD
        //              //&& updateResult.WFSTG_ACTN_CD == insertResult.WFSTG_ACTN_CD
        //              );

        //          //DELETE
        //          bool deleteResult = new SecurityAttributesDataLib().DeleteSecurityAction(updateResult.SECUR_ACTN_SID);
        //          Assert.IsTrue(deleteResult);
        //      }

        #endregion

        #region Applications

        ////DEV_REBUILD_REMOVALS
        //[TestMethod]
        //public void AdminApplicationsGet()
        //{
        //    IEnumerable<AdminApplications> results = new SecurityAttributesDataLib().GetAdminApplications();
        //    Assert.IsTrue(results.Any());
        //}

        //[TestMethod]
        //public void AdminApplicationsManage()
        //{
        //    //INSERT
        //    string testString = "UNIT TEST - InsertAdminApplications";
        //    string testStringShort = "TEST";

        //    AdminApplications app = new AdminApplications
        //    {
        //        APP_NM = testStringShort,
        //        APP_DESC = testString,
        //        APP_SID = 0,
        //        APP_SUITE = testString,
        //        ACTV_IND = false
        //};
        //    AdminApplications insertResult = new SecurityAttributesDataLib().ManageAdminApplication(app, CrudModes.Insert);

        //    Assert.IsTrue(
        //        insertResult.APP_NM == app.APP_NM
        //        && insertResult.APP_DESC == app.APP_DESC
        //        && insertResult.APP_SID != 0
        //        && insertResult.APP_SUITE == app.APP_SUITE
        //        && insertResult.ACTV_IND == app.ACTV_IND
        //        );

        //    //UPDATE
        //    testString = "UNIT TEST - UpdateAdminApplications";
        //    insertResult.APP_DESC = testString;

        //    AdminApplications updateResult = new SecurityAttributesDataLib().ManageAdminApplication(insertResult, CrudModes.Update);

        //    Assert.IsTrue(
        //        updateResult.APP_NM == insertResult.APP_NM
        //        && updateResult.APP_DESC == insertResult.APP_DESC
        //        && updateResult.APP_SID == insertResult.APP_SID
        //        && updateResult.APP_SUITE == insertResult.APP_SUITE
        //        && updateResult.ACTV_IND == insertResult.ACTV_IND
        //        );

        //    //DELETE
        //    bool deleteResult = new SecurityAttributesDataLib().DeleteAdminApplication(updateResult.APP_SID);
        //    Assert.IsTrue(deleteResult);
        //}

        #endregion

        #region DealTypes

        [TestMethod]
        public void AdminDealTypesGet()
        {
            IEnumerable<AdminDealType> results = new SecurityAttributesDataLib().GetAdminDealTypes();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void AdminDealTypesManage()
        {
            //INSERT
            string testString = "UNIT TEST - InsertAdminDealTypes";
            string testStringShort = "TEST";

            AdminDealType dealType = new AdminDealType
            {
                OBJ_SET_TYPE_CD = testStringShort,
                OBJ_SET_TYPE_DESC = testString,
                OBJ_SET_TYPE_SID = 0,
                OBJ_ATRB_SID = 0,
                TEMPLT_DEAL_SID = 0,
                TEMPLT_DEAL_NBR = 0,
                TRKR_NBR_DT_LTR = testStringShort,
                //PERFORM_CTST = false,
                ACTV_IND = false
        };
            AdminDealType insertResult = new SecurityAttributesDataLib().ManageAdminDealType(dealType, CrudModes.Insert);

            Assert.IsTrue(
                insertResult.OBJ_SET_TYPE_CD == dealType.OBJ_SET_TYPE_CD
                && insertResult.OBJ_SET_TYPE_DESC == dealType.OBJ_SET_TYPE_DESC
                && insertResult.OBJ_SET_TYPE_SID != 0
                && insertResult.OBJ_ATRB_SID == dealType.OBJ_ATRB_SID
                && insertResult.TEMPLT_DEAL_SID == dealType.TEMPLT_DEAL_SID
                && insertResult.TEMPLT_DEAL_NBR == dealType.TEMPLT_DEAL_NBR
                && insertResult.TRKR_NBR_DT_LTR == dealType.TRKR_NBR_DT_LTR
                //&& insertResult.PERFORM_CTST == dealType.PERFORM_CTST
                && insertResult.ACTV_IND == dealType.ACTV_IND
                );

            //UPDATE
            testString = "UNIT TEST - UpdateAdminDealTypes";
            insertResult.OBJ_SET_TYPE_DESC = testString;

            AdminDealType updateResult = new SecurityAttributesDataLib().ManageAdminDealType(insertResult, CrudModes.Update);

            Assert.IsTrue(
                updateResult.OBJ_SET_TYPE_CD == insertResult.OBJ_SET_TYPE_CD
                && updateResult.OBJ_SET_TYPE_DESC == insertResult.OBJ_SET_TYPE_DESC
                && updateResult.OBJ_SET_TYPE_SID == insertResult.OBJ_SET_TYPE_SID
                && updateResult.OBJ_ATRB_SID == insertResult.OBJ_ATRB_SID
                && updateResult.TEMPLT_DEAL_SID == insertResult.TEMPLT_DEAL_SID
                && updateResult.TEMPLT_DEAL_NBR == insertResult.TEMPLT_DEAL_NBR
                && updateResult.TRKR_NBR_DT_LTR == insertResult.TRKR_NBR_DT_LTR
                //&& updateResult.PERFORM_CTST == insertResult.PERFORM_CTST
                && updateResult.ACTV_IND == insertResult.ACTV_IND
                );

            //DELETE
            bool deleteResult = new SecurityAttributesDataLib().DeleteAdminDealType(updateResult.OBJ_SET_TYPE_SID);
            Assert.IsTrue(deleteResult);
        }

        #endregion

        #region RoleTypes

        ////DEV_REBUILD_REMOVALS
        //[TestMethod]
        //public void AdminRoleTypesGet()
        //{
        //    IEnumerable<AdminRoleType> results = new SecurityAttributesDataLib().GetAdminRoleTypes();
        //    Assert.IsTrue(results.Any());
        //}

        //[TestMethod]
        //public void AdminRoleTypesManage()
        //{
        //    //INSERT
        //    string testString = "UNIT TEST - InsertAdminRoleTypes";
        //    string testStringShort = "TEST";

        //    AdminRoleType roleType = new AdminRoleType
        //    {
        //        ROLE_SID = 0,
        //        ROLE_NM = testStringShort,
        //        ROLE_DSPLY_NM = testStringShort,
        //        ROLE_DESC = testString,
        //        ROLE_TIER_NM = testStringShort,
        //        IS_SNGL_SLCT = false,
        //        ACTV_IND = false,
        //        APP_SID = 1
        //        //TODO: Need to generate and ensure existance of a TEST APP due to APP_SID FK Constraint. Right now, app with SID=1 not guaranteed to exist.
        //};
        //    AdminRoleType insertResult = new SecurityAttributesDataLib().ManageAdminRoleType(roleType, CrudModes.Insert);

        //    Assert.IsTrue(
        //        insertResult.ROLE_NM == roleType.ROLE_NM
        //        && insertResult.ROLE_DSPLY_NM == roleType.ROLE_DSPLY_NM
        //        && insertResult.ROLE_SID != 0
        //        && insertResult.ROLE_DESC == roleType.ROLE_DESC
        //        && insertResult.ROLE_TIER_NM == roleType.ROLE_TIER_NM
        //        && insertResult.IS_SNGL_SLCT == roleType.IS_SNGL_SLCT
        //        && insertResult.ACTV_IND == roleType.ACTV_IND
        //        && insertResult.APP_SID == roleType.APP_SID
        //        );

        //    //UPDATE
        //    testString = "UNIT TEST - UpdateAdminRoleTypes";
        //    insertResult.ROLE_DESC = testString;

        //    AdminRoleType updateResult = new SecurityAttributesDataLib().ManageAdminRoleType(insertResult, CrudModes.Update);

        //    Assert.IsTrue(
        //        updateResult.ROLE_NM == insertResult.ROLE_NM
        //        && updateResult.ROLE_DSPLY_NM == insertResult.ROLE_DSPLY_NM
        //        && updateResult.ROLE_SID == insertResult.ROLE_SID
        //        && updateResult.ROLE_DESC == insertResult.ROLE_DESC
        //        && updateResult.ROLE_NM == insertResult.ROLE_NM
        //        && updateResult.IS_SNGL_SLCT == insertResult.IS_SNGL_SLCT
        //        && updateResult.ACTV_IND == insertResult.ACTV_IND
        //        && updateResult.APP_SID == insertResult.APP_SID
        //        );

        //    //DELETE
        //    bool deleteResult = new SecurityAttributesDataLib().DeleteAdminRoleType(updateResult.ROLE_SID);
        //    Assert.IsTrue(deleteResult);
        //}

        #endregion
    }
}
