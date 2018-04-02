using System;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals
{
    public static class OpAppConfig
    {
        static OpAppConfig()
        {
            try
            {
                // Logging
                OpLog.LogConfig = new LoggingLib().GetLogConfig();
                OpLogPerf.Enabled = OpLog.LogConfig.IsActive;

                // Entities' web API
                MyDealsWebApiUrl.ROOT_URL = OpCurrentConfig.CurrentURL;
                // TODO josiTODO: remove after localhost test is done
                if (MyDealsWebApiUrl.ROOT_URL == "localhost")
                {
                    MyDealsWebApiUrl.ROOT_URL = "http://" + MyDealsWebApiUrl.ROOT_URL + ":55490";
                }
                else
                {
                    MyDealsWebApiUrl.ROOT_URL = "https://" + MyDealsWebApiUrl.ROOT_URL;
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        public static OpCore Init()
        {
            try
            {
                // Check if OpCore has already been created
                if (OpCore.Instance != null) return OpCore.Instance;

                // Instantiate an Instance
                OpCore opCore = OpCore.Instance = new OpCore(false);

                // Since we are NOT using OPAQUE for environment switching, we need to manually set the apptoken
                opCore.AppToken = new OpAppToken
                {
                    AppCd = "MyDeals",
                    OpEnvironment = new OpEnvironment
                    {
                        App = new OpApp { AppName = "MyDeals" },
                        EnvLoc = new OpEnvLocation { Location = AppLib.GetEnvironment() }
                    },
                };
                OpLog.OpAppToken = opCore.AppToken;

                // Congfig Authentication
                opCore.Authentication = new OpAuthentication
                {
                    Enabled = true,
                    OpAuthenticationType = OpAuthenticationType.Negotiate,
                    AppCustomAuthenticationFunc = CustomAuthentication
                };

                return OpCore.Instance;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        public static OpUserToken CustomAuthentication(string idsid, string env)
        {
            // Loading user token from IDSID, to test out non-existant user, just append something to below ({Idsid = "A" + idsod}};)
            idsid = idsid.Trim();
            OpUserToken opUserToken = new OpUserToken { Usr = { Idsid = idsid } };

            AppLib.PopulateUserSettings(opUserToken);

            return opUserToken.Usr.WWID == 0 ? null : AppLib.UserSettings[idsid.ToUpper()].UserToken;
        }
    }
}