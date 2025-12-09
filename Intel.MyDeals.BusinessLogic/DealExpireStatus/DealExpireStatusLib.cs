using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibraries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.BusinessLogic
{
    public class DealExpireStatusLib : IDealExpireStatusLib
    {
        private readonly IDealExpireStatusDataLib _dealExpireStatusDataLib;
        public DealExpireStatusLib(IDealExpireStatusDataLib dealExpireStatusDataLib) {
            _dealExpireStatusDataLib = dealExpireStatusDataLib;
        }
        public List<InActvDeals> GetDealExpireStatus(int contractId)
        {
            return _dealExpireStatusDataLib.GetDealExpireStatus(contractId);
        }
    }
}
