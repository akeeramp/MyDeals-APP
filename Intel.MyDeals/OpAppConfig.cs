using System;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals
{
    public static class OpAppConfig
    {
		static OpAppConfig(){
			// Logging 
			OpLog.LogConfig = new LoggingLib().GetLogConfig();
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
                        App = new OpApp {AppName = "MyDeals"},
                        EnvLoc = new OpEnvLocation {Location = AppLib.GetEnvironment()}
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

				// Load Role Types
				////opCore.SetRoleType(new SecurityAttributesLib().GetOpRoleTypes());

				return OpCore.Instance;
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw;
            }
        }

        public static OpUserToken CustomAuthentication(string idsid, string env)
        {
            idsid = idsid.Trim();
            OpUserToken opUserToken = new OpUserToken {Usr = {Idsid = idsid}};

            // ALL MASTER DATA WAS REMOVED AND WE CAN NOT AUTHENTICATE UNNTIL IT IS RETURNED... HARD CODE FOR NOW
            opUserToken.Usr.Idsid = idsid;
            opUserToken.Usr.WWID = 123456;
            opUserToken.Usr.FirstName = idsid;
            opUserToken.Usr.LastName = idsid;
            opUserToken.Usr.UserID = 123;

            AppLib.PopulateUserSettings(opUserToken);

            return AppLib.UserSettings[idsid.ToUpper()].UserToken;
        }

    }


}