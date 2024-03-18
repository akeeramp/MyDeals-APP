using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IExpireYcs2Lib
    {
        List<DownloadExpireYcs2Data> ExpireYcs2(string dealId);
    }
}