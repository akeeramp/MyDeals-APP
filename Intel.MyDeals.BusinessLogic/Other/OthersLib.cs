using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    public class OthersLib
    {
        public Dictionary<string, string> PingDbDetails(OpUserToken opUserToken)
        {
            return new OtherDataLib().PingDbDetails();
        }
    }
}
