using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IAsyncProcTriggerDataLib
    {
        List<AsyncProcTrigger> GetAsyncProcTriggers();

        List<AsyncProcTrigger> SaveAsyncProcTrigger(string procName, string procData);
    }
}
