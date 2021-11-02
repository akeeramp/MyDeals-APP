using System.Collections.Generic;

namespace Intel.MyDeals.DataLibrary
{
    public static class DataLibrary
    {
        public static void InitializeDataAccessLib(string connectionString, string environment, Dictionary<string, string> envConfigs)
        {
            DataAccessLib.DataAccess.ConnectionString = connectionString;
            DataAccessLib.DataAccess.Environment = environment;
            DataAccessLib.DataAccess.EnvConfigs = new Dictionary<string, string>
            {
                ["jmsServer"] = envConfigs.ContainsKey("jmsServer") ? envConfigs["jmsServer"] : "",
                ["jmsQueue"] = envConfigs.ContainsKey("jmsQueue") ? envConfigs["jmsQueue"] : "",
                ["jmsUID"] = envConfigs.ContainsKey("jmsUID") ? envConfigs["jmsUID"] : "",
                ["jmsPWD"] = envConfigs.ContainsKey("jmsPWD") ? envConfigs["jmsPWD"] : "",
                ["jmsResponseDir"] = envConfigs.ContainsKey("jmsResponseDir") ? envConfigs["jmsResponseDir"] : "",

                ["vistexBaseURL"] = envConfigs.ContainsKey("vistexBaseURL") ? envConfigs["vistexBaseURL"] : "",
                ["vistexUID"] = envConfigs.ContainsKey("vistexUID") ? envConfigs["vistexUID"] : "",
                ["vistexPWD"] = envConfigs.ContainsKey("vistexPWD") ? envConfigs["vistexPWD"] : "",

                ["tendersResponseURL"] = envConfigs.ContainsKey("tendersResponseURL") ? envConfigs["tendersResponseURL"] : "",
                ["apiGeeResponseURL"] = envConfigs.ContainsKey("apiGeeResponseURL") ? envConfigs["apiGeeResponseURL"] : "",
                ["apiGeeConsumerKey"] = envConfigs.ContainsKey("apiGeeConsumerKey") ? envConfigs["apiGeeConsumerKey"] : "",
                ["apiGeeconsumerSecret"] = envConfigs.ContainsKey("apiGeeconsumerSecret") ? envConfigs["apiGeeconsumerSecret"] : "",
                ["apiGeeTokenUrl"] = envConfigs.ContainsKey("apiGeeTokenUrl") ? envConfigs["apiGeeTokenUrl"] : "",
                ["apiUCDRequestURL"] = envConfigs.ContainsKey("apiUCDRequestURL") ? envConfigs["apiUCDRequestURL"] : ""
            };
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
