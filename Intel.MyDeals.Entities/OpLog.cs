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

        public static void Log(string msg)
        {
            if (EN.GLOBAL.DEBUG >= 1) OpLogPerf.Log(msg);
        }
        public static void Log(string msg, int cnt)
        {
            if (EN.GLOBAL.DEBUG >= 1) OpLogPerf.Log(msg, cnt);
        }
    }
}
