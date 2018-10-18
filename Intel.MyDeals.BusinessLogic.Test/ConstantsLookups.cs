using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class ConstantsLookupsLibTests
    {
        public ConstantsLookupsLibTests()
        {
            Console.WriteLine("Started Constants Lookups Lib tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestMethod]
        public void CnstLib_GetToolConstants()
        {
            AdminConstant results = new ConstantsLookupsLib().GetConstantsByName("ENV");
            Assert.IsTrue(results.CNST_NM == "ENV");

            results = new ConstantsLookupsLib().GetConstantsByName("ENV", true);
            Assert.IsTrue(results.CNST_NM == "ENV");

            // Check existing constant value returns as expected
            string resultsValue = new ConstantsLookupsLib().GetToolConstantValue("ENV");
            Assert.IsFalse(string.IsNullOrEmpty(resultsValue));

            // Check that non-existant constant value returns gracefully
            resultsValue = new ConstantsLookupsLib().GetToolConstantValue("GARBAGE");
            Assert.IsTrue(string.IsNullOrEmpty(resultsValue));
        }

        [TestMethod]
        public void CnstLib_GetLookups()
        {
            // Check all lookup returns as expected
            List<LookupItem> results = new ConstantsLookupsLib().GetLookups();
            Assert.IsTrue(results.Count() > 0);

            // Check existing lookup returns as expected
            IEnumerable<LookupItem> results2 = new ConstantsLookupsLib().GetLookups("NUM_TIERS");
            Assert.IsTrue(results2.Count() == 9); // We have 9 tiers

            // Check existing lookup returns as expected
            results2 = new ConstantsLookupsLib().GetLookups("NUM_TIERS,DROPDOWN");
            Assert.IsTrue(results2.Count() > 9); // We have 9 tiers and unknown dropdowns

            // Check non-existant lookup returns gracefully
            results2 = new ConstantsLookupsLib().GetLookups("NUM_JUNK");
            Assert.IsTrue(results2.Count() == 0); // Garbage Request

            // Check existing lookup returns as expected
            results = new ConstantsLookupsLib().GetLookups("ALL DEALS", "NUM_TIERS");
            Assert.IsTrue(results.Count() == 9); // We have 9 tiers for all deals

            // Check existing lookup returns as expected (Deal Type Where clause)
            results = new ConstantsLookupsLib().GetLookups("ALL", "NUM_TIERS");
            Assert.IsTrue(results.Count() == 9); // We have 9 tiers for all deals

            // Check for non-existant lookup returns gracefully
            results = new ConstantsLookupsLib().GetLookups("ALL_JUNK", "NUM_JUNK");
            Assert.IsTrue(results.Count() == 0); // Garbage Request
        }

        [TestMethod]
        public void CnstLib_ConstantsAdmin()
        {
            // Check that we can pull constants and that testing value is not there
            List<AdminConstant> results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Count() > 0);
            if (results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() > 0) // Clean up old data if need be
            {
                AdminConstant removeOldTestData = results.FirstOrDefault(c => c.CNST_NM == "ToBeRemovedConstantTest");
                new ConstantsLookupsLib().DeleteAdminConstant(removeOldTestData);
            }

            results = new ConstantsLookupsLib().GetAdminConstants(true);
            Assert.IsTrue(results.Count() > 0);
            Assert.IsFalse(results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() > 0); // Check that next test value isn't already in DB

            results = new ConstantsLookupsLib().GetAdminConstants(false);
            Assert.IsTrue(results.Count() > 0);
            Assert.IsFalse(results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() > 0); // Check that next test value isn't already in DB


            // Check adding a new constant
            AdminConstant testCnst = new AdminConstant()
            {
                CNST_DESC = "Some Test Constant",
                CNST_NM = "ToBeRemovedConstantTest",
                CNST_SID = 0,
                CNST_VAL_TXT = "ToBeRemovedConstantData",
                UI_UPD_FLG = true
            };

            AdminConstant newCnstResults = new ConstantsLookupsLib().CreateAdminConstant(testCnst);
            Assert.IsNotNull(newCnstResults);
            newCnstResults = new ConstantsLookupsLib().CreateAdminConstant(null);
            Assert.IsNull(newCnstResults);

            results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() == 1); // New constant found
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "ToBeRemovedConstantData").Count() == 1); // New constant value is correct

            int newCnstSid = results.FirstOrDefault(c => c.CNST_NM == "ToBeRemovedConstantTest").CNST_SID;
            testCnst.CNST_SID = newCnstSid;


            // Check updating existing constant value
            testCnst.CNST_VAL_TXT = "UpdatedValueForToBeRemovedConstantData";
            AdminConstant updCnstResults = new ConstantsLookupsLib().UpdateAdminConstant(testCnst);
            results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() == 1); // Updated constant found
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "ToBeRemovedConstantData").Count() == 0); // Old value is gone now
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "UpdatedValueForToBeRemovedConstantData").Count() == 1); // Updated constant value is correct


            // Check setting VERBOSE_LOG_TO_DB flag updates logging immediately
            AdminConstant loggerConstant = results.FirstOrDefault(c => c.CNST_NM == "VERBOSE_LOG_TO_DB");
            if (loggerConstant.CNST_VAL_TXT.ToLower() == "false")
            {
                Assert.IsTrue(EN.GLOBAL.VERBOSE_LOG_TO_DB.ToString().ToLower() == "false");
                loggerConstant.CNST_VAL_TXT = "true";
                updCnstResults = new ConstantsLookupsLib().UpdateAdminConstant(loggerConstant);
                Assert.IsTrue(EN.GLOBAL.VERBOSE_LOG_TO_DB.ToString().ToLower() == "true");
            }
            loggerConstant.CNST_VAL_TXT = "false";
            updCnstResults = new ConstantsLookupsLib().UpdateAdminConstant(loggerConstant);
            Assert.IsTrue(EN.GLOBAL.VERBOSE_LOG_TO_DB.ToString().ToLower() == "false");


            // Check recycling of cache constants (NOTE: Not sure about this test, but, coverage.)
            new ConstantsLookupsLib().UpdateRecycleCacheConstants("ToBeRemovedConstantData", "false");
            results = new ConstantsLookupsLib().GetAdminConstants(true);
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "UpdatedValueForToBeRemovedConstantData").Count() == 1); // Updated constant value is correct


            // Check deleting existing constant value
            new ConstantsLookupsLib().DeleteAdminConstant(testCnst);
            results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "ToBeRemovedConstantData").Count() == 0); // Value is gone now

            new ConstantsLookupsLib().DeleteAdminConstant(null); // doesn't die hard
        }

    }
}