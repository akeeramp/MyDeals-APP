using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{

    public interface IPushDealstoVistexLib
    {
        List<PushDealstoVistexResults> DealsPushtoVistex(PushDealIdstoVistex dealIds);
    }
    
}
