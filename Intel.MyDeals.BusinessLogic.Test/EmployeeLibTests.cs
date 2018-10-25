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
            int j = 1;
            OpMsg userUpdates = new EmployeesLib().SetOpUserToken(newSettings);
            Assert.IsTrue(userUpdates.Message == "Role has been set");
            //Assert.IsTrue(userProfiles != null && userProfiles.Count() > 0);
        }


    }
}
