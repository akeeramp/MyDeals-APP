using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.DataLibrary.Test
{
    public static class UnitTestHelpers
    {
        public static void SetDbConnection()
        {
            DataLibrary.InitializeDataAccessLib("Server=EG1RDMDBDEV01.amr.corp.intel.com\\DEALSDEV,3180;Database=MyDeals;integrated security=SSPI;MultipleActiveResultSets=true;", "DEV");
        }

    }
}
