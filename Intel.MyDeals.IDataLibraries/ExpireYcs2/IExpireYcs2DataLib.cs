using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibraries
{
    public interface IExpireYcs2DataLib
    {
        List<DownloadExpireYcs2Data> ExpireYcs2(string dealId);
    }
}
