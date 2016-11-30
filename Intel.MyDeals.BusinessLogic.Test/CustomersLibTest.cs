using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class CustomerLibTests
    {
        public CustomerLibTests()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        #region Get Customers

        [TestMethod]
        public void CustomersGet()
        {
            IEnumerable<CustomerDivision> results = new CustomerLib().GetCustomerDivisions();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void CustomersGetActive()
        {
            IEnumerable<CustomerDivision> results = new CustomerLib().GetCustomerDivisionsActive();
            Assert.IsTrue(results.Any());
        }

        //TODO: The below have tentatively hardcoded sid/cat/type/geo values that the tests search for.  We need to inject our own test data that is guaranteed to be in the db every time the test is run.

        [TestMethod]
        public void CustomersGetSpecific()
        {
            int sid = 3; //TODO: replace with test data value
            CustomerDivision results = new CustomerLib().GetCustomerDivision(sid);
            Assert.IsTrue(results != null && results.CUST_MBR_SID == sid);
        }

        [TestMethod]
        public void CustomersGetByCategory()
        {
            string cat = "Quote Letter"; //TODO: replace with test data value
            IEnumerable<CustomerDivision> results = new CustomerLib().GetCustomerDivisionsByCategory(cat);
            Assert.IsTrue(results.Any() && results.Where(r => r.CUST_CAT == cat).Count() == results.Count());
        }

        [TestMethod]
        public void CustomersGetByGeo()
        {
            string geo = "APAC"; //TODO: replace with test data value
            IEnumerable<CustomerDivision> results = new CustomerLib().GetCustomerDivisionsByHostedGeo(geo);
            Assert.IsTrue(results.Any() && results.Where(r => r.HOSTED_GEO == geo).Count() == results.Count());
        }

        [TestMethod]
        public void CustomersGetByType()
        {
            string type = "LOEM"; //TODO: replace with test data value
            IEnumerable<CustomerDivision> results = new CustomerLib().GetCustomerDivisionsByType(type);
            Assert.IsTrue(results.Any() && results.Where(r => r.CUST_TYPE == type).Count() == results.Count());
        }

        #endregion

        #region Get My Customers

        [TestMethod]
        public void CustomersGetMy()
        {
            MyCustomerDetailsWrapper results = new CustomerLib().GetMyCustomers();
            Assert.IsTrue(results.CustomerInfo.Any());
            Assert.IsTrue(results.CustomerSoldTo.Any());
        }

        [TestMethod]
        public void CustomersGetMyCustomerInfo()
        {
            IEnumerable<MyCustomersInformation> results = new CustomerLib().GetMyCustomersInfo();
            Assert.IsTrue(results.Any());
        }

        [TestMethod]
        public void CustomersGetMySoldTo()
        {
            IEnumerable<MyCustomersSoldTo> results = new CustomerLib().GetMyCustomersSoldTo();
            Assert.IsTrue(results.Any());
        }

        #endregion

    }
}
