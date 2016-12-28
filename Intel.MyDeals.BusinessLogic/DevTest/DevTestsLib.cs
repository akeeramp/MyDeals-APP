using System;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.Opaque;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public class DevTestsLib
    {
        public Dictionary<string, string> PingDbDetails(OpUserToken opUserToken)
        {
            return new DevTestDataLib().PingDbDetails();
        }

        public string CSharpException()
        {
            try
            {
                Exception x1 = new Exception("Example Uncaught Detailed Exception");
                throw x1;
            }
            catch (Exception ex)
            {
				OpLogPerf.Log(ex);
				Exception x2 = new Exception("Example Uncaught Detailed Exception");
                throw x2;
            }
            //this will never get returned because of exception
            return "string";
        }

        public string ExampleSQLException()
        {
            return new DevTestDataLib().ExampleSQLException();
        }
    }
}
