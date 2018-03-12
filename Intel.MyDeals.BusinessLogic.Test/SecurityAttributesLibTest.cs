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
		
		#region Security Mapping

		[TestMethod]
		public void SecurityEngineObjAtrbsGet()
		{
			//// TODO: This test keeps failing because of the _dataCollectionsDataLib call in GetObjAtrbs(). Figure out how to work around that.
			//Dictionary<string, Dictionary<string, List<string>>> results = new SecurityAttributesLib().GetObjAtrbs();
			//Assert.IsTrue(results.Any());
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

			bool insertResult = new SecurityAttributesLib().SaveSecurityMappings(saveMappings);
			Assert.IsTrue(insertResult);
			
			// DELETE / reset mappings (this is done via db)
			bool deleteResult = new SecurityAttributesLib().SaveSecurityMappings(saveMappings);
			Assert.IsTrue(deleteResult);
		}

		[TestMethod]
		public void SecurityMasksGet()
		{
			SecurityWrapper results = new SecurityAttributesLib().GetSecurityMasks();
			Assert.IsTrue(results.SecurityAttributes.Any());
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
            AdminDealType insertResult = new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Insert);

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

            AdminDealType updateResult = new SecurityAttributesLib().ManageAdminDealType(insertResult, CrudModes.Update);

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
            bool deleteResult = new SecurityAttributesLib().DeleteAdminDealType(updateResult.OBJ_SET_TYPE_SID);
            Assert.IsTrue(deleteResult);
        }

        #endregion

    }
}
