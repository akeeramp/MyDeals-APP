using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using Intel.Opaque;
using Intel.Opaque.DBAccess;

namespace Intel.MyDeals.Entities
{
    public static class OpUserStack
    {
        public static Dictionary<string, UserSetting> UserSettings = new Dictionary<string, UserSetting>();
        public static bool IsTestMode = false;

        /// <summary>
        /// Get the authenticated user's Key into the User Stack
        /// </summary>
        /// <returns>User's key</returns>
        public static string GetMyKey()
        {
            string key = IsTestMode ? "SJPATIL" : Utils.ThreadUser;
            if (key.Contains("/"))
            {
                key = key.Split('/').Last();
            }
            return key.ToUpper();
        }

        /// <summary>
        /// Get the authenticated user's Key into the User Stack
        /// </summary>
        /// <returns>User's key</returns>
        public static void Clear()
        {
            string key = GetMyKey();
            if (UserSettings.ContainsKey(key))
            {
                UserSettings.Remove(key);
            }
            UserSettings[key] = new UserSetting {UserToken = new OpUserToken {Usr = new OpUser {Idsid = key} } };
        }


        /// <summary>
        /// Get the authenticated user's UserSettings
        /// </summary>
        public static UserSetting MySettings {
            get
            {
                string key = GetMyKey();
                return UserSettings.ContainsKey(key)
                    ? UserSettings[key]
                    : new UserSetting();
            }
        }

        /// <summary>
        /// Get the authenticated user's OpUserToken
        /// </summary>
        public static OpUserToken MyOpUserToken => MySettings.UserToken ?? new OpUserToken().EnsurePopulated();

        /// <summary>
        /// Emulate the Unit Tester account
        /// </summary>
        public static void EmulateUnitTester()
        {
            string unitTestName = "TestUser"; //idsid length limit 8, also need to make sure test user exists in db before using

            IList<Claim> claimCollection = new List<Claim>
            {
                new Claim(ClaimTypes.Name, unitTestName)
            };
            Thread.CurrentPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claimCollection, "MyDeals Unit Test"));

            string key = GetMyKey();
            if (UserSettings.ContainsKey(key)) return;

            UserSettings[key] = new UserSetting
            {
                UserToken = new OpUserToken
                {
                    Role = new OpRoleType
                    {
                        RoleTypeCd = "SA"
                    },
                    Usr = new OpUser
                    {
                        FirstName = "Unit",
                        LastName = "Tester",
                        WWID = 10548414,
                        Idsid = unitTestName                        
                    }
                }
            };
        }

        public static OpUserToken EmulateTestHarnessUser()
        {

            OpUserStack.IsTestMode = true;
            string idsid = GetMyKey();

            IList<Claim> claimCollection = new List<Claim>
            {
                new Claim(ClaimTypes.Name, idsid)
            };
            Thread.CurrentPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claimCollection, "MyDeals Test Harness"));

            if (UserSettings.ContainsKey(idsid)) return UserSettings[idsid].UserToken;

            UserSettings[idsid] = new UserSetting
            {
                UserToken = new OpUserToken
                {
                    Role = new OpRoleType
                    {
                        RoleTypeCd = "SA"
                    },
                    Usr = new OpUser
                    {
                        FirstName = "Test",
                        LastName = "Harness",
                        WWID = 88888888,
                        Idsid = idsid
                    }
                }
            };

            MySettings.UserToken = UserSettings[idsid].UserToken;
            return MyOpUserToken;
        }

        /// <summary>
        /// Ensures the OpUserToken contains values.
        /// </summary>
        /// <param name="opUserToken"></param>
        /// <returns></returns>
        public static OpUserToken EnsurePopulated(this OpUserToken opUserToken)
        {
            if (opUserToken == null) opUserToken = new OpUserToken();

            if (opUserToken.Usr?.Idsid == null)
            {
                opUserToken.Usr = new OpUser
                {
                    Idsid = "UNKNOWN",
                    WWID = 00000000,
                    FirstName = "UNKNOWN",
                    LastName = "UNKNOWN"
                };
            }

            if (opUserToken.Role == null)
                opUserToken.Role = new OpRoleType
                {
                    RoleTypeCd = "UNKNOWN",
                    RoleTypeDisplayName = "UNKNOWN"
                };

            return opUserToken;
        }

    }
}
