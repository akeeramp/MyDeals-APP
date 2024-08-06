using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinessLogic.MuleService
{
    internal class MuleServiceLib : IMuleServiceLib
    {
        private readonly IMuleServiceLib _muleServiceLib;
        
        public MuleServiceLib(IMuleServiceLib muleServiceLib)
        {
            _muleServiceLib = muleServiceLib;
        }
    }
}
