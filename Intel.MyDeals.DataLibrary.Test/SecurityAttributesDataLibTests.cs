using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

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

        #region DealTypes

        [TestMethod]
        public void AdminDealTypesGet()
        {
            IEnumerable<AdminDealType> results = new SecurityAttributesDataLib().GetAdminDealTypes();
            Assert.IsTrue(results.Any());
        }

        #endregion

    }
}
