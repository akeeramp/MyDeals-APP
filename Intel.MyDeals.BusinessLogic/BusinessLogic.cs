using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogic
{
    public static class BusinessLogic
    {
        public static void InitializeDataLibrary(string connectionString, string environment)
        {
            DataLibrary.DataLibrary.InitializeDataAccessLib(connectionString, environment);
        }

        public static string GetConnectionString()
        {
            return DataLibrary.DataLibrary.GetConnectionString();
        }

        public static string GetEnvironment()
        {
            return DataLibrary.DataLibrary.GetEnvironment();
        }
    }
}
