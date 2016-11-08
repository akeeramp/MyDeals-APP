using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.BusinesssLogic
{
    public class LogConfigLib
    {
        public LogConfig GetLogConfig()
        {
            return new LogConfigDataLib().GetLogConfig();
        }
    }
}
