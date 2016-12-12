using System.Collections.Generic;

namespace Intel.MyDeals.DataLibrary
{
    public static class DataLibrary
    {
        public static void InitializeDataAccessLib(string connectionString, string environment, Dictionary<string, string> envConfigs)
        {
            DataAccessLib.DataAccess.ConnectionString = connectionString;
            DataAccessLib.DataAccess.Environment = environment;
            DataAccessLib.DataAccess.EnvConfigs = new Dictionary<string, string>();
            DataAccessLib.DataAccess.EnvConfigs["jmsServer"] = envConfigs.ContainsKey("jmsServer") ? envConfigs["jmsServer"] : "";
            DataAccessLib.DataAccess.EnvConfigs["jmsQueue"] = envConfigs.ContainsKey("jmsQueue") ? envConfigs["jmsQueue"] : "";
            DataAccessLib.DataAccess.EnvConfigs["jmsUID"] = envConfigs.ContainsKey("jmsUID") ? envConfigs["jmsUID"] : "";
            DataAccessLib.DataAccess.EnvConfigs["jmsPWD"] = envConfigs.ContainsKey("jmsPWD") ? envConfigs["jmsPWD"] : "";
            DataAccessLib.DataAccess.EnvConfigs["jmsResponseDir"] = envConfigs.ContainsKey("jmsResponseDir") ? envConfigs["jmsResponseDir"] : "";
        }

        public static string GetConnectionString()
        {
            return DataAccessLib.DataAccess.ConnectionString;
        }

        public static string GetEnvironment()
        {
            return DataAccessLib.DataAccess.Environment;
        }

        public static Dictionary<string, string> GetEnvConfigs()
        {
            return DataAccessLib.DataAccess.EnvConfigs;
        }

    }
}
