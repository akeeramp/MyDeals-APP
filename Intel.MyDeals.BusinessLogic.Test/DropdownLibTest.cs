using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.IDataLibrary;
using Moq;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class DropdownLibTest
    {
		[OneTimeSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Started Dropdown Library Tests.");
			OpUserStack.EmulateUnitTester();
			UnitTestHelpers.SetDbConnection();
		}

		[OneTimeTearDown]
		public void AfterTheCurrentTestFixture()
		{
			Console.WriteLine("Completed Dropdown Library Tests.");
		}
		
		[TestCase]
        public void DropdownsGetAll()
		{
			// Arrange, ACT
			IEnumerable<Dropdown> results = new DropdownLib().GetDropdowns();
			
			// Assert
			Assert.IsTrue(results.Any());
		}

        [TestCase]
        public void DropdownsGetDealTypes()
        {
            // Arrange, ACT
            IEnumerable<Dropdown> results = new DropdownLib().GetDealTypesDropdown();

            // Assert
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void DropdownsGetGroups()
        {
            // Arrange, ACT
            IEnumerable<Dropdown> results = new DropdownLib().GetDropdownGroups();

            // Assert
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void BasicDropdownsGetAll()
        {
            // Arrange, ACT
            IEnumerable<BasicDropdown> results = new DropdownLib().GetBasicDropdowns();

            // Assert
            Assert.IsTrue(results.Any());
        }

        [TestCase] 
		public void BasicDropdownsUpdate()
		{
            // ARRANGE
            BasicDropdown dd = new BasicDropdown();
            dd.OBJ_SET_TYPE_SID = 1; //hardcoded "All Deals" id
            dd.ATRB_SID = 18; //hardcoded "Program ECAP Type" id
            dd.DROP_DOWN = "TEST";
            dd.ACTV_IND = false;

            // ACT
            BasicDropdown results = new DropdownLib().ManageBasicDropdowns(dd, CrudModes.Insert);

			// ASSERT
			Assert.IsTrue(results.ATRB_LKUP_SID > -1);
        }

        //TODO: unit tests for insert/delete and more specific update cases
		
    }
}
