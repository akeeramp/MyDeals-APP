using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IAsyncProcTriggerLib
    {
        List<AsyncProcTrigger> GetAsyncProcTriggers();

        List<AsyncProcTrigger> SaveAsyncProcTrigger(CreateAsyncProcTriggerData data);
    }
}
