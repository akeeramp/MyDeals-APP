using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibraries;
using System.Collections.Generic;

namespace Intel.MyDeals.BusinessLogic
{
    public class ExpireYcs2Lib : IExpireYcs2Lib
    {
        private readonly IExpireYcs2DataLib _expireYcs2DataLib;        
        public ExpireYcs2Lib()
        {
            _expireYcs2DataLib = new ExpireYcs2DataLib();
        }

        public ExpireYcs2Lib(IExpireYcs2DataLib expireYcs2DataLib)
        {
            _expireYcs2DataLib = expireYcs2DataLib;
        }

        public List<DownloadExpireYcs2Data> ExpireYcs2(string dealId)
        {
            return _expireYcs2DataLib.ExpireYcs2(dealId);
        }
    }
}