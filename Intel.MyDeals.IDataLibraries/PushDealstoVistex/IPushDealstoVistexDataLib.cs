using System.Collections.Generic;
using Intel.MyDeals.Entities;


namespace Intel.MyDeals.IDataLibrary
{
    public interface IPushDealstoVistexDataLib
    {
        List<PushDealstoVistexResults> DealsPushtoVistex(PushDealIdstoVistex DealIds);
    }
}
