using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using System;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class DropdownDataLibTest
	{
		[OneTimeSetUp]
		public void SetupUserAndDatabase()
		{
			Console.WriteLine("Started Dropdown Data Library tests");
			OpUserStack.EmulateUnitTester();
			UnitTestHelpers.SetDbConnection();
		}		
		
		[TestCase]
		public void DropdownGetAll()
		{
            // ARRANGE / ACT
            List<Dropdown> results = new DropdownDataLib().GetDropdowns();

			// ASSERT
			Assert.IsTrue(results.Any());
		}

        [TestCase]
        public void BasicDropdownGetAll()
        {
            // ARRANGE / ACT
            List<BasicDropdown> results = new DropdownDataLib().GetBasicDropdowns();

            // ASSERT
            Assert.IsTrue(results.Any());
        }

        //TODO: unit tests for insert/update/delete of basic dropdown

	}
}
