using System;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class ConstantsLookupsLibTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Constants Lookups Lib tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Constants Lookups Lib tests.");
        }

        [Test,
    TestCase("ENV", true),
    TestCase("GARBAGE", false)
    ]
        public void CnstLib_GetToolConstants(string testString, bool expectedResult)
        {
            AdminConstant results = new ConstantsLookupsLib().GetConstantsByName(testString);
            string value = results != null ? results.CNST_NM : "";
            Assert.IsTrue((value == testString) == expectedResult);

            string resultsValue = new ConstantsLookupsLib().GetToolConstantValue(testString);
            Assert.IsFalse(string.IsNullOrEmpty(resultsValue) == expectedResult);
        }

        [Test,
            TestCase("ENV", null, true),
            TestCase("ENV", true, true),
            TestCase("GARBAGE", null, false)
            ]
        public void CnstLib_GetToolConstantsCached(string testString, bool nonCachedData, bool expectedResult)
        {
            AdminConstant results = new ConstantsLookupsLib().GetConstantsByName(testString, nonCachedData);
            string value = results != null ? results.CNST_NM : "";
            Assert.IsTrue((value == testString) == expectedResult);

            string resultsValue = new ConstantsLookupsLib().GetToolConstantValue(testString);
            Assert.IsFalse(string.IsNullOrEmpty(resultsValue) == expectedResult);
        }

        [Test,
            TestCase(null, null, ">", 0),
            TestCase("NUM_TIERS", null, "=", 9), // We have 9 tiers
            TestCase("NUM_TIERS,DROPDOWN", null, ">", 9), // We have 9 tiers and unknown dropdowns
            TestCase("NUM_JUNK", null, "=", 0), // Garbage Request
            TestCase("ALL DEALS", "NUM_TIERS", "=", 9), // We have 9 tiers for all deals
            TestCase("ALL", "NUM_TIERS", "=", 9), // We have 9 tiers for all deals
            TestCase("ALL_JUNK", "NUM_JUNK", "=", 0) // Garbage Request
            ]
        public void CnstLib_GetLookups(string testString1, string testString2, string opCheck, int value)
        {
            List<LookupItem> results;
            if (testString2 == null) // single test string/no test string passed
            {
                if (testString1 == null) // no test string passed
                {
                    results = new ConstantsLookupsLib().GetLookups();
                }
                else // single test string passed
                {
                    results = new ConstantsLookupsLib().GetLookups(testString1).ToList();
                }
            }
            else // 2 test strings passed
            {
                results = new ConstantsLookupsLib().GetLookups(testString1, testString2);
            }

            Assert.IsTrue(opCheck == ">" ? results.Count() > value : results.Count() == value);
        }

        [TestCase]
        public void CnstLib_GetAdminConstants()
        {
            List<AdminConstant> results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Count() > 0);

            results = new ConstantsLookupsLib().GetAdminConstants(true); // Get cached results = true
            Assert.IsTrue(results.Count() > 0);

            results = new ConstantsLookupsLib().GetAdminConstants(false); // Get cached results = false
            Assert.IsTrue(results.Count() > 0);
        }

        [TestCase]
        public void CnstLib_ConstantsAdminOperations()
        {
            // Check that we can pull constants and that testing value is not there
            List<AdminConstant> results = new ConstantsLookupsLib().GetAdminConstants();
            if (results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() > 0) // Clean up old data if need be
            {
                AdminConstant removeOldTestData = results.FirstOrDefault(c => c.CNST_NM == "ToBeRemovedConstantTest");
                new ConstantsLookupsLib().DeleteAdminConstant(removeOldTestData);
            }

            // Check adding a new constant
            AdminConstant testCnst = new AdminConstant()
            {
                CNST_DESC = "Some Test Constant",
                CNST_NM = "ToBeRemovedConstantTest",
                CNST_SID = 0,
                CNST_VAL_TXT = "ToBeRemovedConstantData",
                UI_UPD_FLG = true
            };

            // Create a new constant
            AdminConstant newCnstResults = new ConstantsLookupsLib().CreateAdminConstant(testCnst);
            Assert.IsNotNull(newCnstResults);

            // Verify that creating a null is graceful
            newCnstResults = new ConstantsLookupsLib().CreateAdminConstant(null);
            Assert.IsNull(newCnstResults);

            results = new ConstantsLookupsLib().GetAdminConstants();
            Assert.IsTrue(results.Where(c => c.CNST_NM == "ToBeRemovedConstantTest").Count() == 1); // New constant found
            Assert.IsTrue(results.Where(c => c.CNST_VAL_TXT == "ToBeRemovedConstantData").Count() == 1); // New constant value is correct

            int newCnstSid = results.FirstOrDefault(c => c.CNST_NM == "ToBeRemovedConstantTest").CNST_SID;
            testCnst.CNST_SID = newCnstSid;


            // Update the new constant
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

            // Verify that deleting a null is graceful
            new ConstantsLookupsLib().DeleteAdminConstant(null); 
        }

    }
}