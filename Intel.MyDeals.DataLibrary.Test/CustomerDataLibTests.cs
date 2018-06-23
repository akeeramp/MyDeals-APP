using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary.Test
{
    [TestClass]
    public class CustomerDataLibTests
    {
        public CustomerDataLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }
        
        [TestMethod]
        public void CustomersGet()
        {
            IEnumerable<CustomerDivision> results = new CustomerDataLib().GetCustomerDivisions();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
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
