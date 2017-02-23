using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class SecurityAttributesLibTest
	{
        public SecurityAttributesLibTest()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
        
		#region SecurityActions

		[TestMethod]
		public void AdminSecurityActionsGet()
		{
			List<SecurityActions> results = new SecurityAttributesLib().GetSecurityActions();
			Assert.IsTrue(results.Any());
		}

		[TestMethod]
		public void AdminSecurityActionsManage()
		{
            //INSERT
            string testString = "UNIT TEST - InsertSecurityActions";
            string testStringShort = "TEST";

            SecurityActions action = new SecurityActions
            {
                ACTN_CAT_CD = testString,
                ACTN_CD = testString,
                ACTN_DESC = testString,
                SRT_ORD = 0,
                WFSTG_ACTN_CD = testStringShort
            };
            SecurityActions insertResult = new SecurityAttributesLib().ManageSecurityAction(action, CrudModes.Insert);

            Assert.IsTrue(
                insertResult.ACTN_CAT_CD == action.ACTN_CAT_CD
                && insertResult.ACTN_CD == action.ACTN_CD
                && insertResult.ACTN_DESC == action.ACTN_DESC
                && insertResult.SRT_ORD == action.SRT_ORD
                && insertResult.WFSTG_ACTN_CD == action.WFSTG_ACTN_CD
                );

            //UPDATE
            testString = "UNIT TEST - UpdateSecurityActions";
            insertResult.ACTN_CAT_CD = testString;
            insertResult.ACTN_CD = testString;
            insertResult.ACTN_DESC = testString;

            SecurityActions updateResult = new SecurityAttributesLib().ManageSecurityAction(insertResult, CrudModes.Update);

            Assert.IsTrue(
                updateResult.ACTN_CAT_CD == insertResult.ACTN_CAT_CD
                && updateResult.ACTN_CD == insertResult.ACTN_CD
                && updateResult.ACTN_DESC == insertResult.ACTN_DESC
                && updateResult.SRT_ORD == insertResult.SRT_ORD
                && updateResult.WFSTG_ACTN_CD == insertResult.WFSTG_ACTN_CD
                );

            //DELETE
            bool deleteResult = new SecurityAttributesLib().DeleteSecurityAction(updateResult.ACTN_SID);
            Assert.IsTrue(deleteResult);
        }


        #endregion

        #region Applications

        [TestMethod]
        public void AdminApplicationsGet()
        {
            IEnumerable<AdminApplications> results = new SecurityAttributesLib().GetAdminApplications();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void AdminApplicationsManage()
        {
            //INSERT
            string testString = "UNIT TEST - InsertAdminApplications";
            string testStringShort = "TEST";

            AdminApplications app = new AdminApplications
            {
                APP_CD = testStringShort,
                APP_DESC = testString,
                APP_SID = 0,
                APP_SUITE = testString,
                ACTV_IND = false
            };
            AdminApplications insertResult = new SecurityAttributesLib().ManageAdminApplication(app, CrudModes.Insert);

            Assert.IsTrue(
                insertResult.APP_CD == app.APP_CD
                && insertResult.APP_DESC == app.APP_DESC
                && insertResult.APP_SID != 0
                && insertResult.APP_SUITE == app.APP_SUITE
                && insertResult.ACTV_IND == app.ACTV_IND
                );

            //UPDATE
            testString = "UNIT TEST - UpdateAdminApplications";
            insertResult.APP_DESC = testString;

            AdminApplications updateResult = new SecurityAttributesLib().ManageAdminApplication(insertResult, CrudModes.Update);

            Assert.IsTrue(
                updateResult.APP_CD == insertResult.APP_CD
                && updateResult.APP_DESC == insertResult.APP_DESC
                && updateResult.APP_SID == insertResult.APP_SID
                && updateResult.APP_SUITE == insertResult.APP_SUITE
                && updateResult.ACTV_IND == insertResult.ACTV_IND
                );

            //DELETE
            bool deleteResult = new SecurityAttributesLib().DeleteAdminApplication(updateResult.APP_SID);
            Assert.IsTrue(deleteResult);
        }

        #endregion

        #region DealTypes

        [TestMethod]
        public void AdminDealTypesGet()
        {
            IEnumerable<AdminDealType> results = new SecurityAttributesLib().GetAdminDealTypes();
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
                DEAL_TYPE_CD = testStringShort,
                DEAL_TYPE_DESC = testString,
                DEAL_TYPE_SID = 0,
                DEAL_ATRB_SID = 0,
                TEMPLT_DEAL_SID = 0,
                TEMPLT_DEAL_NBR = 0,
                TRKR_NBR_DT_LTR = testStringShort,
                //PERFORM_CTST = false,
                ACTV_IND = false
            };
            AdminDealType insertResult = new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Insert);

            Assert.IsTrue(
                insertResult.DEAL_TYPE_CD == dealType.DEAL_TYPE_CD
                && insertResult.DEAL_TYPE_DESC == dealType.DEAL_TYPE_DESC
                && insertResult.DEAL_TYPE_SID != 0
                && insertResult.DEAL_ATRB_SID == dealType.DEAL_ATRB_SID
                && insertResult.TEMPLT_DEAL_SID == dealType.TEMPLT_DEAL_SID
                && insertResult.TEMPLT_DEAL_NBR == dealType.TEMPLT_DEAL_NBR
                && insertResult.TRKR_NBR_DT_LTR == dealType.TRKR_NBR_DT_LTR
                //&& insertResult.PERFORM_CTST == dealType.PERFORM_CTST
                && insertResult.ACTV_IND == dealType.ACTV_IND
                );

            //UPDATE
            testString = "UNIT TEST - UpdateAdminDealTypes";
            insertResult.DEAL_TYPE_DESC = testString;

            AdminDealType updateResult = new SecurityAttributesLib().ManageAdminDealType(insertResult, CrudModes.Update);

            Assert.IsTrue(
                updateResult.DEAL_TYPE_CD == insertResult.DEAL_TYPE_CD
                && updateResult.DEAL_TYPE_DESC == insertResult.DEAL_TYPE_DESC
                && updateResult.DEAL_TYPE_SID == insertResult.DEAL_TYPE_SID
                && updateResult.DEAL_ATRB_SID == insertResult.DEAL_ATRB_SID
                && updateResult.TEMPLT_DEAL_SID == insertResult.TEMPLT_DEAL_SID
                && updateResult.TEMPLT_DEAL_NBR == insertResult.TEMPLT_DEAL_NBR
                && updateResult.TRKR_NBR_DT_LTR == insertResult.TRKR_NBR_DT_LTR
                //&& updateResult.PERFORM_CTST == insertResult.PERFORM_CTST
                && updateResult.ACTV_IND == insertResult.ACTV_IND
                );

            //DELETE
            bool deleteResult = new SecurityAttributesLib().DeleteAdminDealType(updateResult.DEAL_TYPE_SID);
            Assert.IsTrue(deleteResult);
        }

        #endregion

        #region RoleTypes

        [TestMethod]
        public void AdminRoleTypesGet()
        {
            IEnumerable<AdminRoleType> results = new SecurityAttributesLib().GetAdminRoleTypes();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void AdminRoleTypesManage()
        {
            //INSERT
            string testString = "UNIT TEST - InsertAdminRoleTypes";
            string testStringShort = "TEST";

            AdminRoleType roleType = new AdminRoleType
            {
                ROLE_TYPE_SID = 0,
                ROLE_TYPE_CD = testStringShort,
                ROLE_TYPE_DSPLY_CD = testStringShort,
                ROLE_TYPE_DESC = testString,
                ROLE_TIER_CD = testStringShort,
                IS_SNGL_SLCT = false,
                ACTV_IND = false,
                APP_SID = 1
                //TODO: Need to generate and ensure existance of a TEST APP due to APP_SID FK Constraint. Right now, app with SID=1 not guaranteed to exist.
            };
            AdminRoleType insertResult = new SecurityAttributesLib().ManageAdminRoleType(roleType, CrudModes.Insert);

            Assert.IsTrue(
                insertResult.ROLE_TYPE_CD == roleType.ROLE_TYPE_CD
                && insertResult.ROLE_TYPE_DSPLY_CD == roleType.ROLE_TYPE_DSPLY_CD
                && insertResult.ROLE_TYPE_SID != 0
                && insertResult.ROLE_TYPE_DESC == roleType.ROLE_TYPE_DESC
                && insertResult.ROLE_TIER_CD == roleType.ROLE_TIER_CD
                && insertResult.IS_SNGL_SLCT == roleType.IS_SNGL_SLCT
                && insertResult.ACTV_IND == roleType.ACTV_IND
                && insertResult.APP_SID == roleType.APP_SID
                );

            //UPDATE
            testString = "UNIT TEST - UpdateAdminRoleTypes";
            insertResult.ROLE_TYPE_DESC = testString;

            AdminRoleType updateResult = new SecurityAttributesLib().ManageAdminRoleType(insertResult, CrudModes.Update);

            Assert.IsTrue(
                updateResult.ROLE_TYPE_CD == insertResult.ROLE_TYPE_CD
                && updateResult.ROLE_TYPE_DSPLY_CD == insertResult.ROLE_TYPE_DSPLY_CD
                && updateResult.ROLE_TYPE_SID == insertResult.ROLE_TYPE_SID
                && updateResult.ROLE_TYPE_DESC == insertResult.ROLE_TYPE_DESC
                && updateResult.ROLE_TIER_CD == insertResult.ROLE_TIER_CD
                && updateResult.IS_SNGL_SLCT == insertResult.IS_SNGL_SLCT
                && updateResult.ACTV_IND == insertResult.ACTV_IND
                && updateResult.APP_SID == insertResult.APP_SID
                );

            //DELETE
            bool deleteResult = new SecurityAttributesLib().DeleteAdminRoleType(updateResult.ROLE_TYPE_SID);
            Assert.IsTrue(deleteResult);
        }

        #endregion
    }
}
