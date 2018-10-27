using System;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class EmployeeLibTests
    {
        private readonly OpUserToken _opUserToken = null;
        private OpUserToken PersonalizedOpUserToken { get; set; }

        [OneTimeSetUp]
        public void SetupUserAndDatabase()
        {
            Console.WriteLine("Started Employee Lib tests.");
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

            // EmulateUnitTester = Tester
            // EmulateUnitTester(Token) = emulate
            // EmulateTestHarnessUser = self
            OpUserStack.EmulateUnitTester(PersonalizedOpUserToken); //EmulateTestHarnessUser //EmulateUnitTester
        }

        [OneTimeTearDown]
        public void AfterTheCurrentTextFixture()
        {
            Console.WriteLine("Completed Employee Lib tests.");
        }

        [TestCase]
        public void EmpLib_GetUserSettings()
        {
            UserSetting userSettings = new EmployeesLib().GetUserSettings(PersonalizedOpUserToken);
            Assert.IsNotNull(userSettings);
        }

        [TestCase]
        public void EmpLib_GetUsrProfileRole()
        {
            List<UsrProfileRole> userProfiles = new EmployeesLib().GetUsrProfileRole();
            Assert.IsTrue(userProfiles != null && userProfiles.Count() > 0);
        }

        [TestCase]
        public void EmpLib_SetOpUserToken()
        {
            var blaha = PersonalizedOpUserToken;
            int newIsDeveloper = PersonalizedOpUserToken.IsDeveloper() ? 0 : 1;
            OpUserTokenParameters newSettings = new OpUserTokenParameters()
            {
                roleTypeId = PersonalizedOpUserToken.Role.RoleTypeId,
                isDeveloper = PersonalizedOpUserToken.IsDeveloper() ? 0 : 1,
                isSuper = PersonalizedOpUserToken.IsSuper() ? 0 : 1,
                isTester = PersonalizedOpUserToken.IsTester() ? 0 : 1
            };
            OpMsg userUpdates = new EmployeesLib().SetOpUserToken(newSettings);
            Assert.IsTrue(userUpdates.Message == "Role has been set");

            List<UsrProfileRole> userProfiles = new EmployeesLib().GetUsrProfileRole();
            Assert.IsTrue(userProfiles != null && userProfiles.Count() > 0);
            UsrProfileRole checkUser = userProfiles.FirstOrDefault(u => u.EMP_WWID == PersonalizedOpUserToken.Usr.WWID);

            // Pull DB record and see if it actually saved values...
            List<ManageUsersInfo> userInfo = new EmployeesLib().GetManageUserData(PersonalizedOpUserToken.Usr.WWID);
            Assert.IsTrue(userInfo != null && userInfo.Count() > 0
                && (userInfo[0].IS_DEVELOPER == true ? 1 : 0) == newSettings.isDeveloper
                && (userInfo[0].IS_SUPER == true ? 1 : 0) == newSettings.isSuper
                && (userInfo[0].IS_TESTER == true ? 1 : 0) == newSettings.isTester);
        }

        [TestCase]
        public void EmpLib_GetManageUserData()
        {
            List<ManageUsersInfo> userInfo = new EmployeesLib().GetManageUserData(PersonalizedOpUserToken.Usr.WWID);
            Assert.IsTrue(userInfo != null && userInfo.Count() > 0 
                && userInfo[0].EMP_WWID == PersonalizedOpUserToken.Usr.WWID);
        } 

        [TestCase]
        public void EmpLib_GetManageUserDataGetCustomers()
        {
            // This is get all customers for a user.
            List<CustomerDivision> userCustomers = new EmployeesLib().GetManageUserDataGetCustomers();
            Assert.IsTrue(userCustomers != null && userCustomers.Count() > 0);
        }

        [TestCase("")]
        [TestCase("APAC")]
        [TestCase("APAC,ASMO")]
        public void EmpLib_GetManageUserDataGetCustomers(string geos)
        {
            List<CustomerDivision> userCustomers = new EmployeesLib().GetManageUserDataGetCustomers(geos);
            // Results set also contains "All Customers" which has no geo, so we need to append a "" hosted Geo to account for that
            if (geos != "") geos = geos + ","; 
            string[] geosList = geos.Split(',');
            bool countCheck = userCustomers != null && userCustomers.Where(r => geosList.Contains(r.HOSTED_GEO)).Count() == userCustomers.Count();
            Assert.IsTrue(userCustomers != null && countCheck);
        }

        [TestCase("2,27", "Acer,Apple")] // Acer, Apple
        [TestCase("1", "All Customers")] // All customers
        public void EmpLib_SetManageUserData(string custString, string custNames)
        {
            List<int> custList = custString.Split(',').Select(Int32.Parse).ToList();

            //public int empWWID { get; set; }
            //public List<int> custIds { get; set; }
            //public List<int> vertIds { get; set; }
            EmployeeCustomers newCustList = new EmployeeCustomers()
            {
                empWWID = PersonalizedOpUserToken.Usr.WWID,
                custIds = custList,
                vertIds = null
            };
            OpMsg userUpdates = new EmployeesLib().SetManageUserData(newCustList);
            Assert.IsTrue(userUpdates.Message == "Customers have been saved");

            // Now check
            List<ManageUsersInfo> userInfo = new EmployeesLib().GetManageUserData(PersonalizedOpUserToken.Usr.WWID);
            List<string> custNamesList = custNames.Split(',').ToList();
            List<string> resultsCustNamesList = Array.ConvertAll(userInfo[0].USR_CUST.Split(','), p => p.Trim()).ToList();
            Assert.IsTrue(custNamesList.SequenceEqual(resultsCustNamesList));
        }

        [TestCase("2,27", "Acer,Apple")] // Acer, Apple
        [TestCase("1", "All Customers")] // All customers
        public void EmpLib_ApplyForCustomers(string custString, string custNames)
        {
            List<int> custList = custString.Split(',').Select(Int32.Parse).ToList();

            //public int empWWID { get; set; }
            //public List<int> custIds { get; set; }
            //public List<int> vertIds { get; set; }
            EmployeeEmailCustomers newCustList = new EmployeeEmailCustomers()
            {
                EmailBody = "Testing e-mail body",
                CustIds = custList,
                VertIds = null
            };
            OpMsg userUpdates = new EmployeesLib().ApplyForCustomers(newCustList);
            Assert.IsTrue(userUpdates.Message == "Customers have been saved");

            // Now check
            List<ManageUsersInfo> userInfo = new EmployeesLib().GetManageUserData(PersonalizedOpUserToken.Usr.WWID);
            List<string> custNamesList = custNames.Split(',').ToList();
            List<string> resultsCustNamesList = Array.ConvertAll(userInfo[0].USR_CUST.Split(','), p => p.Trim()).ToList();
            Assert.IsTrue(custNamesList.SequenceEqual(resultsCustNamesList));
        }

        //SetEmployeeVerticalData
        [TestCase("9,10", "DT,Mb")] // DT, Mb
        [TestCase("1", "All Products")] // All Products
        public void EmpLib_SetEmployeeVerticalData(string vertString, string vertNames)
        {
            List<int> vertList = vertString.Split(',').Select(Int32.Parse).ToList();

            //public int empWWID { get; set; }
            //public List<int> custIds { get; set; }
            //public List<int> vertIds { get; set; }
            EmployeeCustomers newVertList = new EmployeeCustomers()
            {
                empWWID = PersonalizedOpUserToken.Usr.WWID,
                custIds = null,
                vertIds = vertList
            };
            OpMsg userVerticals = new EmployeesLib().SetEmployeeVerticalData(newVertList);
            Assert.IsTrue(userVerticals.Message == "Verticals have been saved");

            // Now check
            List<ManageUsersInfo> userInfo = new EmployeesLib().GetManageUserData(PersonalizedOpUserToken.Usr.WWID);
            List<string> vertNamesList = vertNames.Split(',').ToList();
            List<string> resultsVertNamesList = Array.ConvertAll(userInfo[0].USR_VERTS.Split(','), p => p.Trim()).ToList();
            Assert.IsTrue(vertNamesList.SequenceEqual(resultsVertNamesList));
        }

    }
}
