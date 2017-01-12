using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.App
{
    public static class AppLib
    {
        public static ApplicationViewModel AVM;
		
		public static Dictionary<string, UserSetting> UserSettings
        {
            get { return OpUserStack.UserSettings ?? (OpUserStack.UserSettings = new Dictionary<string, UserSetting>()); }
            set { OpUserStack.UserSettings = value; }

            //get { return _userSettings ?? (_userSettings = new Dictionary<string, UserSetting>()); }
            //set { _userSettings = value; }
        }
        //private static Dictionary<string, UserSetting> _userSettings;

        public static OpUserToken InitAVM(OpCore op, bool forceLoad = false)
        {
            OpUserToken user = op.Authenticate("MyDeals", GetEnvironment());

            if (AVM != null && !forceLoad)
            {
                PopulateUserSettings(user);
                return user;
            }
			
			OpLogPerf.Log("Initializing AVM");

            AVM = new ApplicationViewModel
            {
                AppName = "MyDeals",
                AppDescShort = "My Deals Solutions tool for managing rebate deals",
                AppDesc = "My Deals is the interface to help monitor and control the workflow for creating, maintaining and monitoring rebate deals through Workbooks, Dashboards and Individual Deals.",
                AppCopy = "© 2016 DEAL COMPLIANCE SOLUTIONS",
                AppCopyShort = "© 2016 My Deals"
            };

            PopulateUserSettings(user);

            SetEnvName();
            SetVersion();

            OpLogPerf.Log("Found User" + user.Usr.FullName);
            return user;
        }

        public static string GetConnectionString()
        {
            return BusinessLogic.BusinessLogic.GetConnectionString();
        }

        public static string GetEnvironment()
        {
            return BusinessLogic.BusinessLogic.GetEnvironment();
		}

		public static void SetEnvName()
        {
            AVM.AppEnv = (OpLog.OpAppToken == null || OpLog.OpAppToken.OpEnvironment == null ||
                          OpLog.OpAppToken.OpEnvironment.EnvLoc == null)
                ? "UNKNOWN"
                : OpLog.OpAppToken.OpEnvironment.EnvLoc.Location;
        }

        public static void SetVersion()
        {
            AVM.AppVer = Assembly.GetExecutingAssembly().GetName().Version.ToString();
        }

        public static List<CustomerItem> GetMyCustomers(OpUserToken opUserToken)
        {
            string idsid = opUserToken.Usr.Idsid.ToUpper();
            if (!UserSettings.ContainsKey(idsid))
            {
                PopulateUserSettings(opUserToken);
            }
            if (!UserSettings[idsid].AllMyCustomers.Any())
            {
                ////PE////UserSettings[idsid].AllMyCustomers = new CustomerLib().GetMyCustomers(opUserToken, true);
            }
            return UserSettings[idsid].AllMyCustomers;
        }

        public static List<UserPreference> GetUserPreferences(OpUserToken opUserToken)
        {
            string idsid = opUserToken.Usr.Idsid.ToUpper();
            if (!UserSettings.ContainsKey(idsid))
            {
                PopulateUserSettings(opUserToken);
            }
            if (!UserSettings[idsid].UserPreferences.Any())
            {
                ////UserSettings[idsid].UserPreferences = DataServices.ReadUserPreferences(opUserToken.Usr.Idsid).ToList();
            }
            return (UserSettings[idsid].UserPreferences).ToList();
        }

        public static UserSetting GetUserSetting(OpUserToken opUserToken)
        {
            string key = opUserToken.Usr.Idsid.ToUpper();
            if (!UserSettings.ContainsKey(key))
            {
                PopulateUserSettings(opUserToken);
            }
            return UserSettings[key];
        }

        public static void PopulateUserSettings(OpUserToken opUserToken)
        {
            if (UserSettings.ContainsKey(opUserToken.Usr.Idsid.ToUpper()) && UserSettings[opUserToken.Usr.Idsid.ToUpper()] != null) return;

            UserSetting settings = new EmployeesLib().GetUserSettings();

            UserSettings[opUserToken.Usr.Idsid.ToUpper()] = settings;
            UserSettings[opUserToken.Usr.Idsid.ToUpper()].UserToken = opUserToken;
            UserSettings[opUserToken.Usr.Idsid.ToUpper()].AllMyCustomers = GetMyCustomers(opUserToken);
            UserSettings[opUserToken.Usr.Idsid.ToUpper()].UserPreferences = GetUserPreferences(opUserToken);
        }
		
		

		public static void ClearCache()
        {
            OpAuthenticationExtensions.ClearCache();
            UserSettings?.Clear();
        }



    }
}
