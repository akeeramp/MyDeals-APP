using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Authentication;
using System.Net;
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
            get
            {
                return OpUserStack.UserSettings ?? (OpUserStack.UserSettings = new Dictionary<string, UserSetting>());
            }
            set { OpUserStack.UserSettings = value; }
        }

        public static OpUserToken InitAvm(OpCore op, bool forceLoad = false)
        {
            // TODO: Some day - call this in a more clean fashion
            if (forceLoad)
            {
                AVM = null;
                OpUserStack.Clear();
                UserSettings[OpUserStack.GetMyKey()] = null;

                // Clear user cache of current user not all the users who are already authenticated
                op.ClearUserCache("MyDeals", GetEnvironment());
            }

#if DEBUG
            // PERFORMANCE LOGGING - REMEMBER TO SET THIS BACK TO 0 - Find output in VS output window
            // 1 is basic logging
            // 4 is EXTREME VERSBOITY
            EN.GLOBAL.DEBUG = 2;
#endif

            OpUserToken user = null;
            try
            {
                string env = GetEnvironment();
                bool isTesting = env == "Perf" && string.IsNullOrEmpty(op.Authentication.ContextUserName);
                user = isTesting ? OpUserStack.EmulateTestHarnessUser() : op.Authenticate("MyDeals", env);
            }
            catch (Exception ex)
            {
                throw new AuthenticationException(ex.Message, ex);
            }

            new AccountsLib().SetUserAccessLevel(user);

            if (AVM != null && !forceLoad)
            {
                PopulateUserSettings(user);
                return user;
            }

            OpLog.Log("Initializing AVM");

            AVM = new ApplicationViewModel
            {
                AppName = "MyDeals",
                AppDescShort = "My Deals Solutions tool for managing rebate deals",
                AppDesc = "My Deals is the interface to help monitor and control the workflow for creating, maintaining and monitoring rebate deals through Contracts, Dashboards and Individual Deals.",
                AppCopy = "© 2016 DEAL COMPLIANCE SOLUTIONS",
                AppCopyShort = "© 2016 My Deals"
            };

            SetEnvName();
            SetVersion();

            OpLog.Log("Found User" + user.Usr.FullName);
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

        public static MyCustomerDetailsWrapper GetMyCustomers(OpUserToken opUserToken)
        {
            string idsid = opUserToken.Usr.Idsid.ToUpper();
            if (!UserSettings.ContainsKey(idsid))
            {
                PopulateUserSettings(opUserToken);
            }
            if (UserSettings[idsid].AllMyCustomers.CustomerInfo == null)
            {
                UserSettings[idsid].AllMyCustomers = new CustomerLib().GetMyCustomers();
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
            // If user WWID is "0", get user details from database
            if (UserSettings.ContainsKey(opUserToken.Usr.Idsid.ToUpper()) &&
                UserSettings[opUserToken.Usr.Idsid.ToUpper()] != null && opUserToken.Usr.WWID != 0) return;

            UserSetting settings = new EmployeesLib().GetUserSettings(opUserToken);

            UserSettings[opUserToken.Usr.Idsid.ToUpper()] = settings;
            UserSettings[opUserToken.Usr.Idsid.ToUpper()].UserToken = opUserToken;
            if (opUserToken.Usr.WWID != 0)// No need to look for customer and user preferences values as user doesn't exist in Mydeals
            {
                UserSettings[opUserToken.Usr.Idsid.ToUpper()].AllMyCustomers = GetMyCustomers(opUserToken);
                UserSettings[opUserToken.Usr.Idsid.ToUpper()].UserPreferences = GetUserPreferences(opUserToken);
            }
        }

        // Added Get_My_Cust returns ehre to over-ride CustomerLib.cs calls
        public static List<MyCustomersInformation> GetMyCustomerNames()
        {
            //return UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()].AllMyCustomers.CustomerInfo.Where(c => c.cust_lvl_id == 2002).ToList();
            //var fullList = UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()].AllMyCustomers.CustomerInfo;
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            string key = OpUserStack.GetMyKey().ToUpper();
            if (!UserSettings.ContainsKey(key))
            {
                PopulateUserSettings(opUserToken);
            }
            var fullList = UserSettings[key].AllMyCustomers.CustomerInfo;

            //var cdmsCustIds = fullList.Select(c => c.cdms_cust_id).Distinct();

            List<MyCustomersInformation> customersOnly = (from cust in fullList
                                                          select new MyCustomersInformation
                                                          {
                                                              CUST_NM = cust.CUST_NM,
                                                              CUST_LVL_SID = cust.CUST_LVL_SID,
                                                              CUST_CHNL = cust.CUST_CHNL,
                                                              CUST_SID = cust.CUST_SID,
                                                              ACCESS_TYPE = cust.ACCESS_TYPE,
                                                              ACTV_IND = cust.ACTV_IND,
                                                              DEAL_FLG = cust.DEAL_FLG,
                                                              HOST_GEO = cust.HOST_GEO
                                                          }).Distinct().ToList();

            return customersOnly.GroupBy(x => x.CUST_SID).Select(x => x.First()).ToList();
        }

        public static List<MyCustomersInformation> GetMyCustomerDivsByCustNmSid(int custNmSid)
        {
            return UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()] == null
                ? new List<MyCustomersInformation>()
                : UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()].AllMyCustomers.CustomerInfo.Where(c => c.CUST_SID == custNmSid).ToList();
        }

        public static List<MyCustomersInformation> GetMyCustomersInfo()
        {
            return UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()] == null
                ? new List<MyCustomersInformation>()
                : UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()].AllMyCustomers.CustomerInfo;
        }

        //public static List<MyCustomersSoldTo> GetMyCustomersSoldTo()
        //{
        //    return UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()] == null
        //        ? new List<MyCustomersSoldTo>()
        //        : UserSettings[OpUserStack.MyOpUserToken.Usr.Idsid.ToUpper()].AllMyCustomers.CustomerSoldTo;
        //}
    }
}