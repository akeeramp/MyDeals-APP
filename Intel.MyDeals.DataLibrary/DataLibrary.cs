namespace Intel.MyDeals.DataLibrary
{
    public static class DataLibrary
    {
        public static void InitializeDataAccessLib(string connectionString, string environment)
        {
            DataAccessLib.DataAccess.ConnectionString = connectionString;
            DataAccessLib.DataAccess.Environment = environment;
        }

        public static string GetConnectionString()
        {
            return DataAccessLib.DataAccess.ConnectionString;
        }

        public static string GetEnvironment()
        {
            return DataAccessLib.DataAccess.Environment;
        }
    }
}
