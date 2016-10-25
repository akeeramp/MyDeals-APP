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

        /// <summary>
        /// Get the authenticated user's Key into the User Stack
        /// </summary>
        /// <returns>User's key</returns>
        private static string GetMyKey()
        {
            string key = Utils.ThreadUser;
            if (key.Contains("/"))
            {
                key = key.Split('/').Last();
            }
            return key.ToUpper();
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
        public static OpUserToken MyOpUserToken => MySettings.UserToken;

        /// <summary>
        /// Emulate the Unit Tester account
        /// </summary>
        public static void EmulateUnitTester()
        {
            string unitTestName = "UnitTestUser";

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
                        WWID = 123456,
                        Idsid = unitTestName                        
                    }
                }
            };
        }
    }
}
