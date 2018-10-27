using System;
using NUnit.Framework;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestFixture]
    public class CustomerDataLibTests
    {
        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Starting CustomerDataLibTests Tests.");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed CustomerDataLibTests Tests.");
        }


        [TestCase]
        public void CustomersGet()
        {
            IEnumerable<CustomerDivision> results = new CustomerDataLib().GetCustomerDivisions();
            Assert.IsTrue(results.Any());
        }

        [TestCase]
        public void CustomersGetMy()
        {
            OpUserStack.EmulateUnitTester(new OpUserToken
            {
                Role = new OpRoleType
                {
                    RoleTypeCd = "GA"
                },
                Usr = new OpUser
                {
                    FirstName = "Philip",
                    LastName = "Eckenroth",
                    WWID = 10505693,
                    Idsid = "Pweckenr"
                }
            });
            MyCustomerDetailsWrapper results = DataCollections.GetMyCustomers();
            Assert.IsTrue(results.CustomerInfo.Any());
            //Assert.IsTrue(results.CustomerSoldTo.Any());
        }

    }
}
