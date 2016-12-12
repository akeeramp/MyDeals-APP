using System.Collections.Generic;

namespace Intel.MyDeals.DataLibrary.Test
{
    public static class UnitTestHelpers
    {
        public static void SetDbConnection()
        {
            Dictionary<string, string> jmsConnectionInformation = new Dictionary<string, string>();
            jmsConnectionInformation["jmsServer"] = "tcp://consems1.intel.com:7222"; // Sap Cons Pipe
            jmsConnectionInformation["jmsQueue"] = "JMS_Pricing1_Sender"; // Sap Cons Queue
            jmsConnectionInformation["jmsUID"] = "sys_pricing"; // Sap Cons User
            jmsConnectionInformation["jmsPWD"] = "pr1cing!"; // Sap Cons Pass
            jmsConnectionInformation["jmsResponseDir"] = "\\\\sapfc0fd.fm.intel.com\\fd\\510\\pri\\bu"; // Sap Cons Response Path '\\sapfc0fd.fm.intel.com\fd\510\pri\bu'

            DataLibrary.InitializeDataAccessLib("Server=EG1RDMDBDEV01.amr.corp.intel.com\\DEALSDEV,3180;Database=MyDeals;integrated security=SSPI;MultipleActiveResultSets=true;", "DEV", jmsConnectionInformation);
        }

    }
}
