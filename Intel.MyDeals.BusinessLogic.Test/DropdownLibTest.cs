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




    }
}
