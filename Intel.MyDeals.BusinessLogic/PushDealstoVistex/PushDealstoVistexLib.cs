using System.Collections.Generic;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.DataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class PushDealstoVistexLib : IPushDealstoVistexLib
    {
        private readonly IPushDealstoVistexDataLib _pushDealstoVistexDataLib;

        public PushDealstoVistexLib(IPushDealstoVistexDataLib pushDealstoVistexDataLib)
        {
            _pushDealstoVistexDataLib = pushDealstoVistexDataLib;
        }

        public List<PushDealstoVistexResults> DealsPushtoVistex(PushDealIdstoVistex dealIds)
        {
            List<PushDealstoVistexResults> results = _pushDealstoVistexDataLib.DealsPushtoVistex(dealIds);
            return results;
        }
    }
}
