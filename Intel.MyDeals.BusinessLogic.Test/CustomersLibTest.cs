using System;
using NUnit.Framework;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class CustomerLibTests
    {
        private OpUserToken PersonalizedOpUserToken { get; set; }

        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Customer Lib tests.");
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

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Customer Lib tests.");
        }


        #region Get Customers

        [TestCase]
        public void CustLib_GetCustomerDivisions()
        {
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisions();
            Assert.IsTrue(customersList.Any());

            //customersList = new CustomerLib().GetCustomerDivisions(true); // Caching loop test
            //Assert.IsTrue(customersList.Any());

            customersList = new CustomerLib().GetCustomerDivisions(false);
            Assert.IsTrue(customersList.Any());
        }

        [TestCase]
        public void CustLib_GetCustomerDivisionsActive()
        {
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisionsActive();
            Assert.IsTrue(customersList.Where(c => c.ACTV_IND == true).Count() == customersList.Count());
        }

        [TestCase(504)] //504 = Lenovo first division level ID
        public void CustLib_GetCustomerDivision(int sid)
        {
            CustomerDivision singleCustomer = new CustomerLib().GetCustomerDivision(sid);
            Assert.IsTrue(singleCustomer != null && singleCustomer.CUST_MBR_SID == sid);
        }

        [TestCase(2, "=", "Acer")] // 2 = Acer (Single Division)
        [TestCase(503, ">", "Lenovo")] //503 = Lenovo(Multi Division)
        public void CustLib_GetCustomerDivisionsByCustNmId(int sid, string op, string custNm)
        {
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisionsByCustNmId(sid);
            Assert.IsTrue(customersList != null 
                && (op == ">"? customersList.Count() > 1: customersList.Count() == 1) 
                && customersList.FirstOrDefault(c => c.CUST_NM_SID == sid).CUST_NM == custNm);
        }

        [TestCase(2, "Acer")] // 2 = Acer (Single Division)
        [TestCase(694, null)] // 694 = IT Test Harness Quote Letter (Single Inactive Division)
        public void CustLib_GetCustomerDivisionsByCustNmSid(int sid, string custNm)
        {
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisionsByCustNmSid(sid);
            if (custNm == null)
            {
                Assert.IsTrue(customersList != null && customersList.Count() == 0);
            }
            else
            {
                Assert.IsTrue(customersList != null && customersList.FirstOrDefault(c => c.CUST_NM_SID == sid).CUST_NM == custNm);
            }
        }

        [TestCase("APAC")] 
        public void CustLib_GetCustomerDivisionsByCustNmSid(string geo)
        {
            IEnumerable<CustomerDivision> customersList = new CustomerLib().GetCustomerDivisionsByHostedGeo(geo);
            Assert.IsTrue(customersList.Any() && customersList.Count(r => r.HOSTED_GEO == geo) == customersList.Count());
        }

        #endregion

        #region Get My Customers

        [TestCase]
        public void CustLib_GetMyCustomers()
        {
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            MyCustomerDetailsWrapper results = new CustomerLib().GetMyCustomers();
            Assert.IsTrue(results.CustomerInfo.Any());
        }

        [TestCase]
        public void CustLib_GetMyCustomerNames()
        {
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            List<MyCustomersInformation> myCustomersList = new CustomerLib().GetMyCustomerNames();
            Assert.IsTrue(myCustomersList.Count() > 0);
        }

        [TestCase(2)]
        public void CustLib_GetMyCustomerDivsByCustNmSid(int sid)
        {
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            List<MyCustomersInformation> myCustomersList = new CustomerLib().GetMyCustomerDivsByCustNmSid(sid);
            Assert.IsTrue(myCustomersList.Count() > 0);
        }

        [TestCase(null, true)] // General list
        [TestCase(2, true)] // 2 = Acer (Single Division)
        [TestCase(98694, false)] // 98694 = Garbage (Single Division)
        public void CustLib_GetMyCustomersInfo(int? sid, bool expectedResult)
        {
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken);
            if (sid == null)
            {
                List<MyCustomersInformation> myCustomers = new CustomerLib().GetMyCustomersInfo();
                Assert.IsTrue((myCustomers != null) == expectedResult);
            }
            else
            {
                MyCustomersInformation myCustomers = new CustomerLib().GetMyCustomersInfo((int)sid);
                Assert.IsTrue((myCustomers != null) == expectedResult);
            }
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
