using System;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestClass]
    public class CustomerLibTests
    {
        private OpUserToken PersonalizedOpUserToken { get; set; }

        public CustomerLibTests()
        {
            Console.WriteLine("Started Customer Lib tests");
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();

            PersonalizedOpUserToken = new OpUserToken
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
            };
        }

        #region Get Customers

        [TestMethod]
        public void CustLib_GetCustomers()
        {
            // Check GetCustomerDivisions returns as expected
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisions();
            Assert.IsTrue(customersList.Any());

            //customersList = new CustomerLib().GetCustomerDivisions(true); // Caching loop test
            //Assert.IsTrue(customersList.Any());

            customersList = new CustomerLib().GetCustomerDivisions(false);
            Assert.IsTrue(customersList.Any());


            // Check GetCustomerDivisionsActive returns only active customers only as expected
            customersList = new CustomerLib().GetCustomerDivisionsActive();
            Assert.IsTrue(customersList.Any());
            Assert.IsFalse(customersList.Where(c => c.ACTV_IND == false).Any());


            // Check GetCustomerDivision by sid returns a single customer as expected
            int sid = 504; //504 = Lenovo first division level ID
            CustomerDivision singleCustomer = new CustomerLib().GetCustomerDivision(sid);
            Assert.IsTrue(singleCustomer != null && singleCustomer.CUST_MBR_SID == sid);


            // Check GetCustomerDivisionsByCustNmId 4 test cases
            // GetCustomerDivisionsByCustNmId returns all items, no active check
            sid = 2; // 2 = Acer (Single Division)
            customersList = new CustomerLib().GetCustomerDivisionsByCustNmId(sid);
            Assert.IsTrue(customersList != null && customersList.Count() == 1 && customersList.FirstOrDefault(c => c.CUST_NM_SID == sid).CUST_NM == "Acer");

            sid = 503; //503 = Lenovo(Multi Division)
            customersList = new CustomerLib().GetCustomerDivisionsByCustNmId(sid);
            Assert.IsTrue(customersList != null && customersList.Count() > 1 && customersList.FirstOrDefault(c => c.CUST_NM_SID == sid).CUST_NM == "Lenovo");

            // GetCustomerDivisionsByCustNmSid returns only active items
            sid = 2; // 2 = Acer (Single Active Division)
            customersList = new CustomerLib().GetCustomerDivisionsByCustNmSid(sid);
            Assert.IsTrue(customersList != null && customersList.FirstOrDefault(c => c.CUST_NM_SID == sid).CUST_NM == "Acer");

            sid = 694; // 694 = IT Test Harness Quote Letter (Single Inactive Division)
            customersList = new CustomerLib().GetCustomerDivisionsByCustNmSid(sid);
            Assert.IsTrue(customersList != null && customersList.Count() == 0);


            // Check GetCustomerDivisionsByHostedGeo returns list of only one geo as expected
            string geo = "APAC"; //TODO: replace with test data value
            customersList = new CustomerLib().GetCustomerDivisionsByHostedGeo(geo);
            Assert.IsTrue(customersList.Any() && customersList.Count(r => r.HOSTED_GEO == geo) == customersList.Count());
            Assert.IsFalse(customersList.Any() && customersList.Where(r => r.HOSTED_GEO != geo).Any());
        }

        #endregion

        #region Get My Customers

        [TestMethod]
        public void CustLib_GetMyCustomers()
        {
            // Check GetMyCustomers normal call
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            MyCustomerDetailsWrapper results = new CustomerLib().GetMyCustomers();
            Assert.IsTrue(results.CustomerInfo.Any());


            // Check GetMyCustomers names
            List<MyCustomersInformation> myCustomersList = new CustomerLib().GetMyCustomerNames();
            Assert.IsTrue(myCustomersList.Count() > 0);


            // Check GetMyCustomers by sid single division
            int sid = 2; // 2 = Acer (Single Division)
            myCustomersList = new CustomerLib().GetMyCustomerDivsByCustNmSid(sid);
            Assert.IsTrue(myCustomersList.Count() > 0);


            // Check GetMyCustomersInfo various modes
            IEnumerable<MyCustomersInformation> myCustomersEnum = new CustomerLib().GetMyCustomersInfo();
            Assert.IsTrue(myCustomersEnum.Any());

            sid = 2; // 2 = Acer (Single Division)
            MyCustomersInformation singleCustomerInfo = new CustomerLib().GetMyCustomersInfo(sid);
            Assert.IsNotNull(singleCustomerInfo);

            sid = 98694; // 98694 = Garbage (Single Division)
            singleCustomerInfo = new CustomerLib().GetMyCustomersInfo(sid);
            Assert.IsNull(singleCustomerInfo);
        }

        //[TestMethod]
        //public void CustomersGetMySoldTo()
        //{
        //    IEnumerable<MyCustomersSoldTo> results = new CustomerLib().GetMyCustomersSoldTo();
        //    Assert.IsTrue(results.Any());
        //}

        #endregion

    }
}
