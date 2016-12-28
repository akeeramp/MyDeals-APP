using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using Intel.MyDeals.Entities.Logging;
using Intel.Opaque;

namespace Intel.MyDeals.Entities
{
    public static class OpLog
    {
        public static OpAppToken OpAppToken { get; set; }

		public static LogConfig LogConfig { get; set; }
		
		public static string GetEnv()
		{
			// Get the tools environment
			return OpAppToken?.OpEnvironment?.EnvLoc == null ? "UNKNOWN" : OpAppToken.OpEnvironment.EnvLoc.Location;
		}
		
		/// <summary>
		/// Ensures the OpUserToken contains values.
		/// </summary>
		/// <param name="opUserToken"></param>
		/// <returns></returns>
		public static OpUserToken EnsurePopulated(this OpUserToken opUserToken)
		{
			if (opUserToken == null) opUserToken = new OpUserToken();

			if (opUserToken.Usr == null)
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
