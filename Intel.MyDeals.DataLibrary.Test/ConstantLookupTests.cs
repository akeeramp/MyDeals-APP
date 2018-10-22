using System;
using NUnit.Framework;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class ConstantLookupTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Constant Lookup Data Library Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Constant Lookup Data Library Tests.");
        }


        [TestCase]
        public void CnstLkupLib_GetToolContants()
        {
            List<AdminConstant> constants = new ConstantLookupDataLib().GetAdminConstants();
            Assert.IsTrue(constants.Count > 0);
        }

        [Test, 
            TestCase("DB_LOGGING", true),
            TestCase("THIS_DOES_NOT_EXIST", false)
            ]
        public void CnstLkupLib_GetToolContant(string testString, bool expectedResult)
        {
            string value = new ConstantLookupDataLib().GetAdminToolConst(testString);
            Assert.IsTrue(string.IsNullOrEmpty(value) != expectedResult);
        }

        [Test,
            TestCase("EXPIRE_CUTOFF_DAYS", true),
            TestCase("THIS_DOES_NOT_EXIST", false)
            ]
        public void CnstLkupLib_GetToolConstInt(string testString, bool expectedResult)
        {
            int intValue = new ConstantLookupDataLib().GetAdminToolConstInt(testString);
            Assert.IsTrue((intValue > 0) == expectedResult);
        }

    }
}