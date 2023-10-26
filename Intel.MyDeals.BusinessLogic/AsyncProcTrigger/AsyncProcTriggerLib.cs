using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogic
{
    public class AsyncProcTriggerLib : IAsyncProcTriggerLib
    {
        private readonly IAsyncProcTriggerDataLib _asyncProcTriggerDataLib;

        public AsyncProcTriggerLib()
        {
            _asyncProcTriggerDataLib = new AsyncProcTriggerDataLib();
        }

        List<AsyncProcTrigger> IAsyncProcTriggerLib.GetAsyncProcTriggers()
        {
            return _asyncProcTriggerDataLib.GetAsyncProcTriggers();
        }

        List<AsyncProcTrigger> IAsyncProcTriggerLib.SaveAsyncProcTrigger(CreateAsyncProcTriggerData data)
        {
            return _asyncProcTriggerDataLib.SaveAsyncProcTrigger(data.PROC_NAME, data.PROC_DATA);
        }
    }
}
