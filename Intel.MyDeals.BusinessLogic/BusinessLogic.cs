using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public static class BusinessLogic
    {
        public static void InitializeDataLibrary(string connectionString, string environment, Dictionary<string, string> envConfigs)
        {
            DataLibrary.DataLibrary.InitializeDataAccessLib(connectionString, environment, envConfigs);
        }

        public static string GetConnectionString()
        {
            return DataLibrary.DataLibrary.GetConnectionString();
        }

        public static string GetEnvironment()
        {
            return DataLibrary.DataLibrary.GetEnvironment();
        }

        public static Dictionary<string, string> GetEnvConfigs()
        {
            return DataLibrary.DataLibrary.GetEnvConfigs();
        }

    }
}
