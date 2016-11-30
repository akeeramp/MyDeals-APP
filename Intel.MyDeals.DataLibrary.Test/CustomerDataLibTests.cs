using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

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
            MyCustomerDetailsWrapper results = new CustomerDataLib().GetMyCustomers();
            Assert.IsTrue(results.CustomerInfo.Any());
            Assert.IsTrue(results.CustomerLineupAttributes.Any());
            Assert.IsTrue(results.CustomerSoldTo.Any());
        }
    }
}
